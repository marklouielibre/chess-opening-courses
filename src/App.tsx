import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  Crown,
  GraduationCap,
  LayoutDashboard,
  Search,
  Settings2,
  Sparkles,
  Swords,
} from 'lucide-react'
import ChessTrainer from './components/ChessTrainer'
import OpeningList from './components/OpeningList'
import { openings } from './data/openings'
import type { Opening, SRSData, Variation } from './types/chess'
import { getAllSRSData } from './utils/srsEngine'
import './App.css'

function App() {
  const [srsData, setSrsData] = useState<Record<string, SRSData>>(() => getAllSRSData())
  const [selectedVariation, setSelectedVariation] = useState<Variation>(openings[0].variations[0])
  const [search, setSearch] = useState('')
  const [today] = useState(() => new Date().toISOString().slice(0, 10))
  const [category, setCategory] = useState<Opening['category'] | 'All courses'>('All courses')

  const allVariations = openings.flatMap((opening) => opening.variations)
  const dueCount = allVariations.filter((variation) => {
    const review = srsData[variation.id]
    return !review || review.nextReviewDate <= today
  }).length
  const learnedCount = Object.values(srsData).filter((review) => review.repetitions > 0).length
  const completion = Math.round((learnedCount / allVariations.length) * 100)

  const filteredOpenings = useMemo(() => {
    const query = search.trim().toLowerCase()
    return openings
      .map((opening) => ({
        ...opening,
        variations: opening.variations.filter((variation) =>
          (category === 'All courses' || opening.category === category) &&
          `${opening.name} ${opening.category} ${variation.name} ${variation.side}`.toLowerCase().includes(query),
        ),
      }))
      .filter((opening) => opening.variations.length > 0)
  }, [category, search])

  const selectedOpening = openings.find((opening) =>
    opening.variations.some((variation) => variation.id === selectedVariation.id),
  )

  const refreshProgress = () => setSrsData(getAllSRSData())

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Opening Lab home">
          <span className="brand-mark"><Crown size={19} strokeWidth={2.2} /></span>
          <span>opening<span className="brand-light">lab</span></span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          <a className="nav-item active" href="#courses"><LayoutDashboard size={18} /> Overview</a>
          <a className="nav-item" href="#courses"><BookOpen size={18} /> My courses <span className="nav-count">{openings.length}</span></a>
          <a className="nav-item" href="#practice"><GraduationCap size={18} /> Practice</a>
        </nav>

        <div className="sidebar-label library-label">YOUR LIBRARY</div>
        <nav className="library-nav" aria-label="Opening categories">
          <button type="button" className={category === 'Open game' ? 'active' : ''} onClick={() => setCategory('Open game')}><span className="category-dot dot-green" /> Open games <span>02</span></button>
          <button type="button" className={category === 'Semi-open' ? 'active' : ''} onClick={() => setCategory('Semi-open')}><span className="category-dot dot-blue" /> Semi-open <span>03</span></button>
          <button type="button" className={category === 'Closed game' ? 'active' : ''} onClick={() => setCategory('Closed game')}><span className="category-dot dot-amber" /> Closed games <span>03</span></button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon"><Sparkles size={16} /></span>
            <strong>Small steps, sharp play.</strong>
            <p>A few minutes of focused review makes every game a little easier.</p>
            <a href="#practice">Start a session <ArrowUpRight size={14} /></a>
          </div>
          <button type="button" className="profile-button">
            <span className="avatar">♘</span>
            <span className="profile-copy"><strong>Chess student</strong><small>Free plan</small></span>
            <Settings2 size={17} className="profile-settings" />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>Overview</strong></div>
          <div className="topbar-actions">
            <span className="today-label"><span className="online-dot" /> Your study space</span>
            <button type="button" className="icon-button" aria-label="Help"><CircleHelp size={18} /></button>
            <span className="top-avatar">♘</span>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> YOUR OPENING WORKSPACE</div>
              <h1>Play the opening.<br /><span>Own the game.</span></h1>
              <p className="welcome-copy">Build a repertoire you understand, one memorable line at a time.</p>
            </div>
            <div className="welcome-actions">
              <button type="button" className="button button-outline" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
                <BookOpen size={16} /> Explore courses
              </button>
              <button type="button" className="button button-dark" onClick={() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' })}>
                <Swords size={16} /> Practice now <ArrowUpRight size={15} />
              </button>
            </div>
          </section>

          <section className="stats-grid" aria-label="Learning progress">
            <article className="stat-card">
              <div className="stat-icon mint"><BookOpen size={18} /></div>
              <div className="stat-label">OPENING COURSES</div>
              <div className="stat-value">{openings.length}<span> courses</span></div>
              <div className="stat-foot"><span className="stat-dot green" /> {allVariations.length} playable lines in your library</div>
            </article>
            <article className="stat-card">
              <div className="stat-icon peach"><Clock3 size={18} /></div>
              <div className="stat-label">READY TO REVIEW</div>
              <div className="stat-value">{dueCount}<span> lines</span></div>
              <div className="stat-foot"><span className="stat-dot orange" /> Spaced repetition keeps lines fresh</div>
            </article>
            <article className="stat-card progress-stat">
              <div className="stat-icon lilac"><GraduationCap size={18} /></div>
              <div className="stat-label">LINES LEARNED</div>
              <div className="stat-value">{learnedCount}<span> / {allVariations.length}</span></div>
              <div className="progress-track"><span style={{ width: `${completion}%` }} /></div>
              <div className="stat-foot">{completion}% of your repertoire reviewed</div>
            </article>
          </section>

          <section className="learning-section" id="courses">
            <div className="section-heading">
              <div>
                <div className="section-kicker">THE LIBRARY</div>
                <h2>Your opening courses</h2>
                <p>Pick a line to study or jump back into your repertoire.</p>
              </div>
              <label className="search-box">
                <Search size={16} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search openings..." aria-label="Search openings" />
                <span className="search-shortcut"><Command size={11} /> K</span>
              </label>
            </div>

            <div className="study-layout">
              <div className="course-panel">
                <div className="panel-heading">
                  <div><strong>Course catalog</strong><span>{filteredOpenings.length} openings</span></div>
                  <label className="filter-select">
                    <span className="filter-indicator" />
                    <select aria-label="Filter courses by category" value={category} onChange={(event) => {
                      const value = event.currentTarget.value
                      if (value === 'All courses' || value === 'Open game' || value === 'Semi-open' || value === 'Closed game') setCategory(value)
                    }}>
                      <option>All courses</option>
                      <option>Open game</option>
                      <option>Semi-open</option>
                      <option>Closed game</option>
                    </select>
                    <ChevronDown size={14} />
                  </label>
                </div>
                <OpeningList
                  openings={filteredOpenings}
                  srsData={srsData}
                  today={today}
                  onSelectVariation={setSelectedVariation}
                  selectedVariationId={selectedVariation.id}
                />
                {filteredOpenings.length === 0 && <p className="empty-search">No openings match “{search}”. Try another name.</p>}
                <div className="catalog-note"><Sparkles size={14} /> New lines are added as the library grows.</div>
              </div>

              <div className="lesson-column" id="practice">
                <div className="lesson-heading">
                  <div>
                    <div className="section-kicker">UP NEXT · {selectedOpening?.name.toUpperCase()}</div>
                    <h2>{selectedVariation.name}</h2>
                    <p>{selectedVariation.side === 'white' ? 'Train the line as White' : 'Train the line as Black'} <span className="heading-separator">·</span> {selectedVariation.moves.length} half-moves</p>
                  </div>
                  <span className="level-pill"><span /> INTERACTIVE</span>
                </div>
                <ChessTrainer key={selectedVariation.id} variation={selectedVariation} onComplete={refreshProgress} />
              </div>
            </div>
          </section>

          <footer className="page-footer">
            <span>Made for curious players, at every level.</span>
            <span><span className="footer-piece">♞</span> Keep learning. Keep playing.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
