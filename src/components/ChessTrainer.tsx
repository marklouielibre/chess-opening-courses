import { useCallback, useEffect, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { Check, Lightbulb, RotateCcw, Sparkles, X } from 'lucide-react'
import type { GameStatus, Variation } from '../types/chess'
import { saveSRSData } from '../utils/srsEngine'

interface Props {
  variation: Variation
  onComplete: () => void
}

function ChessTrainer({ variation, onComplete }: Props) {
  const [game, setGame] = useState(() => {
    const initialGame = new Chess()
    if (variation.side === 'black') initialGame.move(variation.moves[0])
    return initialGame
  })
  const [moveIndex, setMoveIndex] = useState(variation.side === 'black' ? 1 : 0)
  const [status, setStatus] = useState<GameStatus>('playing')
  const [hintActive, setHintActive] = useState(false)
  const [history, setHistory] = useState<string[]>(() => variation.side === 'black' ? [variation.moves[0]] : [])
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [moveFeedback, setMoveFeedback] = useState<{ square: string; correct: boolean } | null>(null)
  const engineTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const userColor = variation.side === 'white' ? 'w' : 'b'
  const expectedMove = variation.moves[moveIndex]
  const nextBoardMove = status === 'playing' && game.turn() === userColor
    ? game.moves({ verbose: true }).find((move) => move.san === expectedMove)
    : undefined
  const selectedMoves = selectedSquare
    ? game.moves({ verbose: true }).filter((move) => move.from === selectedSquare)
    : []
  const squareStyles = selectedSquare
    ? Object.fromEntries([
      [selectedSquare, { boxShadow: 'inset 0 0 0 3px rgba(60, 101, 63, 0.72)' }],
      ...selectedMoves
        .filter((move) => move.to !== selectedSquare)
        .map((move) => [
          move.to,
          game.get(move.to)
            ? { boxShadow: 'inset 0 0 0 3px rgba(172, 91, 67, 0.72)' }
            : { backgroundImage: 'radial-gradient(circle, rgba(56, 85, 56, 0.48) 0 22%, transparent 25%)' },
        ]),
    ])
    : {}
  const pieceNames: Record<string, string> = {
    p: 'pawn',
    n: 'knight',
    b: 'bishop',
    r: 'rook',
    q: 'queen',
    k: 'king',
  }
  const moveInstruction = nextBoardMove
    ? nextBoardMove.isKingsideCastle()
      ? `Castle kingside with your king, from ${nextBoardMove.from} to ${nextBoardMove.to}.`
      : nextBoardMove.isQueensideCastle()
        ? `Castle queenside with your king, from ${nextBoardMove.from} to ${nextBoardMove.to}.`
        : nextBoardMove.isCapture()
          ? `Capture on ${nextBoardMove.to} with your ${pieceNames[nextBoardMove.piece]} from ${nextBoardMove.from}${nextBoardMove.promotion ? ` and promote to a ${pieceNames[nextBoardMove.promotion]}` : ''}.`
          : `Move your ${pieceNames[nextBoardMove.piece]} from ${nextBoardMove.from} to ${nextBoardMove.to}${nextBoardMove.promotion ? ` and promote to a ${pieceNames[nextBoardMove.promotion]}` : ''}.`
    : ''

  const completeLine = useCallback(() => {
    setStatus('completed')
    saveSRSData(variation.id, 5)
    completionTimeoutRef.current = setTimeout(onComplete, 1000)
  }, [onComplete, variation.id])

  const makeEngineMove = useCallback((currentGame: Chess, index: number) => {
    if (index >= variation.moves.length) {
      completeLine()
      return
    }

    engineTimeoutRef.current = setTimeout(() => {
      const move = variation.moves[index]
      const nextGame = new Chess(currentGame.fen())

      try {
        nextGame.move(move)
      } catch (error) {
        console.error(`Invalid move "${move}" in opening line "${variation.name}"`, error)
        setStatus('mistake')
        return
      }

      setGame(nextGame)
      setMoveIndex(index + 1)
      setHistory((previous) => [...previous, move])
      if (index + 1 >= variation.moves.length) completeLine()
    }, 420)
  }, [completeLine, variation.moves, variation.name])

  const resetGame = useCallback(() => {
    if (engineTimeoutRef.current) clearTimeout(engineTimeoutRef.current)
    if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current)
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    const newGame = new Chess()
    setGame(newGame)
    setMoveIndex(0)
    setStatus('playing')
    setHistory([])
    setHintActive(false)
    setSelectedSquare(null)
    setMoveFeedback(null)

    if (variation.side === 'black') makeEngineMove(newGame, 0)
  }, [makeEngineMove, variation.side])

  useEffect(() => {
    return () => {
      if (engineTimeoutRef.current) clearTimeout(engineTimeoutRef.current)
      if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current)
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    }
  }, [])

  const showMoveFeedback = (square: string, correct: boolean) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    setMoveFeedback({ square, correct })

    if (correct) {
      feedbackTimeoutRef.current = setTimeout(() => {
        setMoveFeedback(null)
        feedbackTimeoutRef.current = null
      }, 1200)
    }
  }

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (status !== 'playing' || game.turn() !== userColor || moveIndex >= variation.moves.length) return false

    setSelectedSquare(null)
    const nextGame = new Chess(game.fen())
    let playedMove

    try {
      playedMove = nextGame.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
    } catch {
      showMoveFeedback(sourceSquare, false)
      setStatus('mistake')
      saveSRSData(variation.id, 0)
      engineTimeoutRef.current = setTimeout(resetGame, 1400)
      return false
    }

    if (playedMove.san !== expectedMove) {
      showMoveFeedback(sourceSquare, false)
      setStatus('mistake')
      saveSRSData(variation.id, 0)
      engineTimeoutRef.current = setTimeout(resetGame, 1400)
      return false
    }

    setGame(nextGame)
    showMoveFeedback(targetSquare, true)
    setMoveIndex(moveIndex + 1)
    setHistory((previous) => [...previous, playedMove.san])
    setHintActive(false)

    if (moveIndex + 1 >= variation.moves.length) completeLine()
    else makeEngineMove(nextGame, moveIndex + 1)

    return true
  }

  const onSquareClick = ({ square }: { square: string }) => {
    if (status !== 'playing' || game.turn() !== userColor) return

    if (selectedSquare === square) {
      setSelectedSquare(null)
      return
    }

    const legalMoves = game.moves({ verbose: true })
    if (legalMoves.some((move) => move.from === square)) {
      setSelectedSquare(square)
      return
    }

    if (selectedSquare && selectedMoves.some((move) => move.to === square)) {
      onDrop(selectedSquare, square)
    }
  }

  const moveNumbers = history.map((move, index) => (
    index % 2 === 0
      ? <span className="move-pair" key={`${index}-${move}`}><span className="move-number">{Math.floor(index / 2) + 1}.</span><strong className={index === history.length - 1 ? 'current-move' : ''}>{move}</strong>{history[index + 1] && <span className={index + 1 === history.length - 1 ? 'current-move' : ''}>{history[index + 1]}</span>}</span>
      : null
  ))

  return (
    <div className="trainer-card">
      <div className="board-column">
        <div className="board-topline">
          <div className="player-tag"><span className="player-piece">♔</span> You <span className="player-color">{variation.side}</span></div>
          <span className="board-turn">
            {status === 'completed' ? <><Check size={13} /> LINE COMPLETE</> : status === 'mistake' ? 'TRY AGAIN' : 'YOUR TURN'}
          </span>
          <div className="player-tag opponent-tag"><span className="opponent-color">{variation.side === 'white' ? 'black' : 'white'}</span> Opening line <span className="opponent-piece">♚</span></div>
        </div>
        <div className={`move-instruction${nextBoardMove?.isCapture() ? ' capture-instruction' : ''}`} aria-live="polite">
          <span className="instruction-icon">{status === 'completed' ? <Check size={15} /> : <Sparkles size={14} />}</span>
          <div>
            <strong>{status === 'completed' ? 'Line complete' : nextBoardMove ? `Your move · ${expectedMove}` : status === 'mistake' ? 'Try that line again' : 'Follow the line'}</strong>
            <p>{status === 'completed' ? 'Great work — you reached the end of this line.' : nextBoardMove ? moveInstruction : status === 'mistake' ? 'The board will reset in a moment.' : 'Watch the board while the other side plays.'}</p>
          </div>
        </div>
        <div className="board-wrap">
          <Chessboard
            options={{
              position: game.fen(),
              onPieceDrop: ({ sourceSquare, targetSquare }) =>
                sourceSquare && targetSquare ? onDrop(sourceSquare, targetSquare) : false,
              onSquareClick,
              boardOrientation: variation.side,
              allowDragging: status === 'playing' && game.turn() === userColor,
              boardStyle: { borderRadius: '5px', boxShadow: '0 4px 14px rgba(27, 38, 29, 0.1)' },
              draggingPieceStyle: { transform: 'scale(1)' },
              squareStyles,
              darkSquareStyle: { backgroundColor: '#769656' },
              lightSquareStyle: { backgroundColor: '#eeeed2' },
              squareRenderer: ({ square, piece, children }) => (
                <div className="feedback-square">
                  {children}
                  {moveFeedback?.square === square && piece?.pieceType[0] === userColor && (
                    <span
                      className={`move-feedback ${moveFeedback.correct ? 'feedback-correct' : 'feedback-wrong'}`}
                      role="img"
                      aria-label={moveFeedback.correct ? 'Correct move' : 'Incorrect move'}
                    >
                      {moveFeedback.correct ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />}
                    </span>
                  )}
                </div>
              ),
            }}
          />
          {status === 'completed' && <div className="board-overlay success"><span><Check size={17} /> Line complete. Nicely played.</span></div>}
        </div>
        <div className="board-caption"><span><span className="board-status-dot" /> {status === 'playing' ? selectedSquare ? `Selected ${selectedSquare} · click a highlighted square` : 'Click a piece, then its destination — or drag' : status === 'completed' ? 'A new line is just one click away' : 'Resetting the line...'}</span><span>{moveIndex} / {variation.moves.length} moves</span></div>
      </div>

      <div className="trainer-details">
        <div className="lesson-callout">
          <span className="callout-icon"><Sparkles size={16} /></span>
          <div><strong>Learn by playing</strong><p>Find the moves from memory. The other side will follow the line.</p></div>
        </div>

        <div className="move-section">
          <div className="moves-heading"><strong>MOVE SEQUENCE</strong><span>{Math.ceil(variation.moves.length / 2)} moves</span></div>
          <div className="move-list" aria-live="polite">
            {history.length === 0
              ? <span className="move-placeholder">Your moves will appear here</span>
              : moveNumbers}
            {hintActive && variation.moves[moveIndex] && <span className="hint-chip"><Lightbulb size={13} /> Try {variation.moves[moveIndex]}</span>}
          </div>
        </div>

        <div className="trainer-status">
          <span className={`status-mark ${status === 'completed' ? 'is-complete' : ''}`}>{status === 'completed' ? <Check size={14} /> : <span />}</span>
          <div><strong>{status === 'completed' ? 'Repertoire updated' : status === 'mistake' ? 'That move is not in this line' : 'Take your time'}</strong><p>{status === 'completed' ? 'This line is saved to your review progress.' : status === 'mistake' ? 'Watch the board — the position will reset.' : 'There is no clock. Focus on the idea.'}</p></div>
        </div>

        <div className="trainer-actions">
          <button type="button" className="trainer-button reset-button" onClick={resetGame}><RotateCcw size={15} /> Start over</button>
          <button type="button" className="trainer-button hint-button" onClick={() => setHintActive(true)} disabled={status !== 'playing' || moveIndex >= variation.moves.length}><Lightbulb size={15} /> Show hint</button>
        </div>
        <p className="training-footnote">One line at a time. Your progress is saved on this device.</p>
      </div>
    </div>
  )
}

export default ChessTrainer
