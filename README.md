# Opening Lab

Opening Lab is a React + Vite chess-opening study app with a bold, readable interface. Choose a repertoire line, play it on the board as White or Black by dragging pieces or clicking a piece and its highlighted destination, follow prompts that name the piece and squares for each move, and get clear on-board check/X feedback for your own moves. Incorrect legal moves briefly appear on the board with an X before returning to their starting square; move recommendations stay visible while a piece is selected or dragged. Use hints when needed and revisit lines with local spaced-repetition progress. Dragged pieces stay at their normal board size.

The dark interface uses the `#2c2b29` near-black background and `#4b4847` charcoal borders. The chessboard uses classic green-and-white squares (`#769656` and `#eeeed2`); interface accents use the supplied green palette.

## Get started

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run Oxlint
- `npm run preview` — preview the production build

## Opening library

The starter library includes representative lines for the Italian Game, Ruy Lopez, Sicilian Defense, Caro-Kann Defense, French Defense, Queen’s Gambit, King’s Indian Defense, and London System. Each variation stores its full practice sequence as standard algebraic notation (SAN) in `src/data/openings.ts`.

Add a variation by supplying a unique `id`, a display `name`, the repertoire `side` to train, and a legal sequence of SAN `moves`. The trainer automatically plays the opposing moves from that sequence. Opening and review progress is saved in the browser’s local storage; no account or server is required.

The included catalog is a starting repertoire rather than an exhaustive database of every opening and playable variation. It can be expanded by adding and validating more lines in `src/data/openings.ts`.
