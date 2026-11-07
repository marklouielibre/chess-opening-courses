import { Check, ChevronRight, Circle, Clock3 } from 'lucide-react'
import type { Opening, SRSData, Variation } from '../types/chess'

interface Props {
  openings: Opening[]
  srsData: Record<string, SRSData>
  today: string
  onSelectVariation: (variation: Variation) => void
  selectedVariationId?: string
}

function OpeningList({ openings, srsData, today, onSelectVariation, selectedVariationId }: Props) {
  return (
    <div className="opening-list">
      {openings.map((opening) => (
        <section className="opening-group" key={opening.id}>
          <div className="opening-group-heading">
            <span className={`category-dot ${opening.category === 'Open game' ? 'dot-green' : opening.category === 'Semi-open' ? 'dot-blue' : 'dot-amber'}`} />
            <span>{opening.name}</span>
            <span className="opening-category">{opening.category}</span>
          </div>
          {opening.variations.map((variation) => {
            const review = srsData[variation.id]
            const due = !review || review.nextReviewDate <= today
            const active = selectedVariationId === variation.id

            return (
              <button
                type="button"
                key={variation.id}
                className={`variation-row${active ? ' selected' : ''}`}
                onClick={() => onSelectVariation(variation)}
                aria-pressed={active}
                title={opening.description}
              >
                <span className={`variation-state${review && !due ? ' mastered' : ''}`}>
                  {review && !due ? <Check size={12} /> : due ? <Clock3 size={12} /> : <Circle size={10} />}
                </span>
                <span className="variation-copy">
                  <strong>{variation.name}</strong>
                  <small>Play as {variation.side === 'white' ? 'White' : 'Black'}</small>
                </span>
                <span className="variation-arrow"><ChevronRight size={15} /></span>
              </button>
            )
          })}
        </section>
      ))}
    </div>
  )
}

export default OpeningList
