import { useState, useEffect, useRef } from 'react'
import { Router, Route, Switch, Redirect, useLocation } from 'wouter'
import { md5 } from './utils/md5'
import knowYourselfImg from './assets/know_yourself.png'
import locateYourselfImg from './assets/locate_yourself.png'
import organizeYourselfImg from './assets/organize_yourself.png'
import emotionsImg from './assets/emotions_grid.png'
import respiratoryImg from './assets/respiratory_original.png'
import perceptionImg from './assets/perception_colored.png'
import energyImg from './assets/energy.png'
import shivaLogo from './assets/Shiva.png'
import './App.css'

/* ─────────────────────────── AUTH ─────────────────────────── */
// MD5 of the access password — computed once at module load.
// Never store the plaintext password in source; callers compare hashes.
const EXPECTED_HASH = 'f25edd5f49b13cc7f1b134f01c3a12b5'


function isAuthenticated(): boolean {
  return sessionStorage.getItem('ls_auth') === EXPECTED_HASH
}

/* ─────────────────────────── DATA ─────────────────────────── */
const sections = [
  {
    id: 'know',
    title: 'Know Yourself',
    subtitle: 'Begin within',
    description: 'An attempt to increase awareness about yourself, your body, your mind, your emotions and your energy',
    image: knowYourselfImg,
    color: '#C8956C',
    bg: '#FDF6EE',
    accent: '#E8C4A0',
    pillars: [
      { icon: '🫀', label: 'Body' },
      { icon: '🧠', label: 'Mind' },
      { icon: '🌊', label: 'Emotions' },
      { icon: '⚡', label: 'Energy' },
    ],
  },
  {
    id: 'locate',
    title: 'Locate Yourself',
    subtitle: 'Find your ground',
    description:
      'Understand where you stand — in your relationships, career, society, and the world. Clarity of context is the compass that points you forward.',
    image: locateYourselfImg,
    color: '#3A7CA5',
    bg: '#EEF5FB',
    accent: '#A8C8E0',
    pillars: [
      { icon: '🌐', label: 'Geographic' },
      { icon: '💼', label: 'Professional' },
      { icon: '🫂', label: 'Personal' },
      { icon: '⏳', label: 'Times we live in' },
    ],
  },
  {
    id: 'organize',
    title: 'Organize Yourself',
    subtitle: 'Design your life',
    description:
      'Organize yourself for the activity you want to do. ',
    image: organizeYourselfImg,
    color: '#4A7C59',
    bg: '#EEF6F1',
    accent: '#A8D0B8',
    pillars: [
      { icon: '📅', label: 'Systems' },
      { icon: '⚡', label: 'Energy' },
      { icon: '🎯', label: 'Goals' },
      { icon: '🔄', label: 'Habits' },
    ],
  },
]

/* ─────────────────────────── PROTECTED ROUTE ─────────────────────────── */
function ProtectedRoute({
  children,
  redirectTo = '/login',
}: {
  children: React.ReactNode
  redirectTo?: string
}) {
  if (!isAuthenticated()) return <Redirect to={redirectTo} />
  return <>{children}</>
}

/* ─────────────────────────── LOGIN PAGE ─────────────────────────── */
function LoginPage({ navigate }: { navigate: (path: string) => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Already authenticated → go home
  if (isAuthenticated()) return <Redirect to="/" />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (md5(password) === EXPECTED_HASH) {
      sessionStorage.setItem('ls_auth', EXPECTED_HASH)
      navigate('/')
    } else {
      setError(true)
      setShaking(true)
      setPassword('')
      setTimeout(() => setShaking(false), 600)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand mark */}
        <div className="login-brand">
          <span className="login-brand__mark">✦</span>
          <span className="login-brand__name">Life Sense</span>
        </div>

        <div className="login-icon">🔒</div>
        <h1 className="login-title">Members Area</h1>
        <p className="login-subtitle">
          This content is curated for members.<br />
          Enter your access code to continue.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className={`login-input-wrap ${shaking ? 'login-input-wrap--shake' : ''} ${error ? 'login-input-wrap--error' : ''}`}>
            <input
              id="login-password"
              ref={inputRef}
              type={revealing ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false) }}
              placeholder="Enter access code"
              className="login-input"
              autoComplete="off"
              autoFocus
            />
            <button
              type="button"
              className="login-reveal-btn"
              onClick={() => setRevealing(r => !r)}
              aria-label={revealing ? 'Hide password' : 'Show password'}
            >
              {revealing ? '🙈' : '👁️'}
            </button>
          </div>

          {error && (
            <p className="login-error" role="alert">
              Incorrect access code. Please try again.
            </p>
          )}

          <button
            id="login-submit"
            type="submit"
            className="login-submit-btn"
            disabled={!password}
          >
            Unlock →
          </button>
        </form>

        <p className="login-footer">
          Return to{' '}
          <button className="login-home-link" onClick={() => navigate('/')}>
            Home
          </button>
        </p>
      </div>

      {/* Decorative blobs */}
      <div className="login-blob login-blob--1" />
      <div className="login-blob login-blob--2" />
      <div className="login-blob login-blob--3" />
    </div>
  )
}

/* ─────────────────────────── APP SHELL ─────────────────────────── */
function AppShell() {
  const [location, setLocation] = useLocation()
  const [animating, setAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Navigates with a fade-out/fade-in transition
  const navigate = (path: string) => {
    if (path === location || animating) return
    setAnimating(true)
    setTimeout(() => {
      setLocation(path)
      setAnimating(false)
    }, 320)
  }

  // Scroll to top on route change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  const isLoginPage = location === '/login'

  return (
    <div className="lifesense-root">
      {/* ── Top Nav Bar (hidden on login page) ── */}
      {!isLoginPage && (
        <header className="top-nav">
          <div className="sankara-branding" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginRight: '40px' }}>
            <img 
              src={shivaLogo} 
              alt="Sankara Vivekam Logo" 
              style={{ height: '38px', width: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1.5px solid #C8956C', paddingBottom: '3px' }}>
               <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: '#1c1a18', lineHeight: 1 }}>Sankaravivekam</span>
               <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#7a7168', marginTop: '4px', fontWeight: 700 }}>Intelligence of wellbeing</span>
            </div>
          </div>

          <button
            id="nav-logo"
            className="brand"
            style={{ margin: '0 auto 0 0' }}
            onClick={() => navigate('/')}
            aria-label="Go to home"
          >
            <span className="brand-mark">✦</span>
            <span className="brand-name">Life Sense</span>
          </button>

          <nav className="nav-links" aria-label="Main navigation">
            {sections.map((s) => (
              <button
                key={s.id}
                id={`nav-${s.id}`}
                className={`nav-btn ${location === `/${s.id}` ? 'nav-btn--active' : ''}`}
                style={
                  location === `/${s.id}`
                    ? ({
                      '--btn-color': s.color,
                      '--btn-bg': s.accent + '55',
                    } as React.CSSProperties)
                    : {}
                }
                onClick={() => navigate(`/${s.id}`)}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </header>
      )}

      {/* ── Main Content ── */}
      <main
        ref={contentRef}
        className={`main-content ${animating ? 'fade-out' : 'fade-in'}`}
      >
        <Switch>
          {/* 1. Public Login Route */}
          <Route path="/login">
            <LoginPage navigate={navigate} />
          </Route>

          {/* 2. Protected Section Routes */}
          <Route path="/know">
            <ProtectedRoute>
              <SectionPage
                section={sections.find((s) => s.id === 'know')!}
                navigate={navigate}
              />
            </ProtectedRoute>
          </Route>

          <Route path="/locate">
            <ProtectedRoute>
              <SectionPage
                section={sections.find((s) => s.id === 'locate')!}
                navigate={navigate}
              />
            </ProtectedRoute>
          </Route>

          <Route path="/organize">
            <ProtectedRoute>
              <SectionPage
                section={sections.find((s) => s.id === 'organize')!}
                navigate={navigate}
              />
            </ProtectedRoute>
          </Route>

          {/* 3. Homepage (Public) - Moved to bottom to avoid prefix matching issues */}
          <Route path="/">
            <HomePage navigate={navigate} />
          </Route>

          {/* 4. Catch-all: Redirect to home */}
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </main>
    </div>
  )
}

/* ─────────────────────────── APP ROOT ─────────────────────────── */
function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  )
}

/* ─────────────────────────── HOME PAGE ─────────────────────────── */
function HomePage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__badge">A Journey Inward &amp; Outward</div>
        <h1 className="home-hero__title">
          Life <em>Sense</em>
        </h1>
        <p className="home-hero__tagline">
          Navigate your inner world. Understand your place. Design your path.
        </p>
        <p className="home-hero__sub">
          Three interconnected explorations — each one a doorway to a more
          conscious, intentional life.
        </p>
      </section>

      {/* Three Cards — non-linear: choose your own entry */}
      <section className="home-cards" aria-label="Choose your path">
        {sections.map((s, i) => (
          <button
            key={s.id}
            id={`card-${s.id}`}
            className="section-card"
            style={
              {
                '--card-color': s.color,
                '--card-bg': s.bg,
                '--card-accent': s.accent,
                animationDelay: `${i * 0.12}s`,
              } as React.CSSProperties
            }
            onClick={() => navigate(`/${s.id}`)}
          >
            <div className="section-card__img-wrap">
              <img
                src={s.image}
                alt={s.title}
                className="section-card__img"
                loading="lazy"
              />
            </div>
            <div className="section-card__body">
              <p className="section-card__subtitle">{s.subtitle}</p>
              <h2 className="section-card__title">{s.title}</h2>
              <p className="section-card__desc">{s.description}</p>
              <div className="section-card__pillars">
                {s.pillars.map((p) => (
                  <span key={p.label} className="pillar-chip">
                    {p.icon} {p.label}
                  </span>
                ))}
              </div>
              <span className="section-card__cta">Explore →</span>
            </div>
          </button>
        ))}
      </section>

      {/* Path hint */}
      <section className="home-footer-hint">
        <p>
          There is no fixed order. Each path is a circle. Start anywhere — the
          rest will follow.
        </p>
      </section>
    </div>
  )
}

/* ─────────────────────────── KNOW DATA ─────────────────────────── */
const knowPillars = [
  {
    id: 'body',
    title: 'Body',
    icon: '🫀',
    content: (
      <>
        The physical foundation of your existence. A marvel of biological
        engineering and natural intelligence. Understanding how this 'palace'
        functions is the first step toward self-awareness.
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: '#FDF6EE', border: '1px solid #E8C4A0', fontSize: '13px' }}>
            <strong style={{ color: '#C8956C', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span>🍎</span> Digestive
            </strong>
            Transformation of energy
          </div>
          <div style={{ padding: '10px', borderRadius: '12px', background: '#EEF6F1', border: '1px solid #A8D0B8', fontSize: '13px' }}>
            <strong style={{ color: '#4A7C59', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span>⚡</span> Nervous
            </strong>
            Information & Control
          </div>
          <div style={{ padding: '10px', borderRadius: '12px', background: '#EEF5FB', border: '1px solid #A8C8E0', fontSize: '13px' }}>
            <strong style={{ color: '#3A7CA5', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span>🦴</span> Skeletal
            </strong>
            Structure & Support
          </div>
          <div style={{ padding: '10px', borderRadius: '12px', background: '#F8F4FF', border: '1px solid #D1C4E9', fontSize: '13px' }}>
            <strong style={{ color: '#7E57C2', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span>🫁</span> Respiratory
            </strong>
            The bellows of life
          </div>
        </div>

        <div style={{ marginTop: '20px', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #E8E4DE', background: 'white', padding: '10px' }}>
          <img 
            src={respiratoryImg} 
            alt="Respiratory System" 
            style={{ width: '100%', maxWidth: '280px', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </div>

        <div style={{ marginTop: '24px', borderTop: '1.5px solid #E8E4DE', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a7168', letterSpacing: '1px', marginBottom: '12px', fontWeight: 700 }}>Perception</h4>
          <div style={{ padding: '16px', borderRadius: '12px', background: '#F9F7F5', border: '1.5px solid #E8E4DE' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, 120px) 1fr', gap: '20px', alignItems: 'center' }}>
               <img src={perceptionImg} alt="Sense Perception" style={{ width: '100%', borderRadius: '8px', border: '1px solid #E8E4DE' }} />
               <p style={{ fontSize: '13px', color: '#1c1a18', lineHeight: 1.6, margin: 0 }}>
                 <strong>Sense perception:</strong> The five senses (Seeing, smelling, tasting, touching and hearing) are all essentially <strong>outward bound</strong>. 
                 They capture the input and supply it to the brain for processing, like a keyboard and mouse do for a computer. 
                 While an ant crawling on the skin is sensed immediately, the vast amount of activity happening <em>inside</em> remains unsensed.
               </p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <a
            href="http://www.industriepalast.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#C8956C',
              fontWeight: 600,
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            Explore: Man as Industrial Palace →
          </a>
        </div>

        <div style={{ marginTop: '24px', borderTop: '1.5px solid #E8E4DE', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a7168', letterSpacing: '1px', marginBottom: '12px', fontWeight: 700 }}>The Root of Health</h4>
          <div style={{ padding: '16px', borderRadius: '12px', background: '#F9F7F5', border: '1.5px solid #E8E4DE' }}>
            <p style={{ fontSize: '14px', color: '#1c1a18', marginBottom: '12px', lineHeight: 1.6 }}>
              The word health traces back to the concept of <strong>wholeness</strong>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#7a7168' }}>
              <div>
                <strong style={{ color: '#C8956C' }}>hāl</strong> (Old English)<br />
                Whole, entire, uninjured
              </div>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li><strong>Heal</strong>: To make whole again</li>
                <li><strong>Holy</strong>: Originally "whole"</li>
                <li><strong>Hale</strong>: Robust/Healthy</li>
              </ul>
            </div>
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#7a7168', fontStyle: 'italic', borderTop: '1px solid #E8E4DE', paddingTop: '8px' }}>
              Even <strong>"Hello"</strong> and <strong>"Hail"</strong> are etymologically wishing wholeness upon someone.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '24px', borderTop: '1.5px solid #E8E4DE', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a7168', letterSpacing: '1px', marginBottom: '12px', fontWeight: 700 }}>Understanding Ailments</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: '#FDF6EE', border: '1.5px solid #E8C4A0' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#C8956C', marginBottom: '8px' }}>
                <span>🦠</span> Infection Based
              </strong>
              <p style={{ fontSize: '12px', color: '#7a7168', lineHeight: 1.5, margin: 0 }}>
                Ailments caused by <strong>external</strong> invaders like bacteria or viruses. These are typically acute and can be fought off by the immune system or treated with medication.
              </p>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', background: '#EEF5FB', border: '1.5px solid #A8C8E0' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#3A7CA5', marginBottom: '8px' }}>
                <span>🧬</span> Chronic
              </strong>
              <p style={{ fontSize: '12px', color: '#7a7168', lineHeight: 1.5, margin: 0 }}>
                Ailments created from <strong>within</strong>, often due to lifestyle or systemic imbalances. These require long-term management and fundamental internal change.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'mind',
    title: 'Mind',
    icon: '🧠',
    content: (
      <>
        <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(58, 124, 165, 0.05)', borderLeft: '3px solid #3A7CA5' }}>
          <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#1c1a18', lineHeight: 1.6, margin: 0 }}>
            "The ability to observe without evaluating is the highest form of intelligence."
          </p>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#3A7CA5', marginTop: '8px', textAlign: 'right', margin: 0 }}>
            — J Krishnamurti
          </p>
        </div>
        The landscape of your thoughts, logic, and cognitive maps. It is the
        processor that interprets the world and generates your personal
        narrative.
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#FDF6EE', border: '1px solid #E8C4A0' }}>
            <strong style={{ color: '#C8956C', display: 'block', marginBottom: '4px' }}>Reptilian Brain</strong>
            <p style={{ fontSize: '13px', margin: 0 }}>Brainstem + basal ganglia. Responsible for survival instincts, ritualistic behaviors, and fight-or-flight responses.</p>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#EEF5FB', border: '1px solid #A8C8E0' }}>
            <strong style={{ color: '#3A7CA5', display: 'block', marginBottom: '4px' }}>Neocortex</strong>
            <p style={{ fontSize: '13px', margin: 0 }}>The seat of high-level functions: language, abstract thought, imagination, and conscious decision-making.</p>
          </div>
        </div>

        <div style={{ marginTop: '24px', borderTop: '1.5px solid #E8E4DE', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a7168', letterSpacing: '1px', marginBottom: '12px', fontWeight: 700 }}>Four Parts of the Mind</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', border: '1.5px solid #E8E4DE', background: '#F9F7F5' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1c1a18', marginBottom: '4px' }}>
                <span>📚</span> Manas
              </strong>
              <p style={{ fontSize: '12px', margin: 0, color: '#7a7168', lineHeight: 1.4 }}>Large silo of memory</p>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', border: '1.5px solid #E8E4DE', background: '#F9F7F5' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1c1a18', marginBottom: '4px' }}>
                <span>💡</span> Budhi
              </strong>
              <p style={{ fontSize: '12px', margin: 0, color: '#7a7168', lineHeight: 1.4 }}>The Intellect</p>
            </div>
            <div className="dimension-card--hover" style={{ padding: '12px', borderRadius: '12px', border: '1.5px solid #E8E4DE', background: '#F9F7F5' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1c1a18', marginBottom: '4px' }}>
                <span>👤</span> Ahankara
              </strong>
              <p style={{ fontSize: '12px', margin: 0, color: '#7a7168', lineHeight: 1.4 }}>Sense of Identity</p>
              
              <div className="dimension-popup">
                <div className="dimension-popup__content">
                   <p>
                    The analytical mind divides things into categories based on certain criteria. These criteria depend entirely on the <strong>Identity</strong> one takes. If someone takes an identity of a particular nation, the analytical mind retrieves that specific memory and uses all reasoning to protect it. It is amazing to see how people take on various identities, and how their entire life then revolves around protecting that identification.
                  </p>
                  

                  <div className="dimension-poem">
                    Search for a similar face<br />
                    or search for a similar language<br />
                    may be for a similar skin<br />
                    at least similar place<br /><br />

                    none match, let us try similar habits<br />
                    even that does not work, try likes<br />
                    or may be dislikes or disorders<br />
                    hmmm, no, may be similar difficulties<br /><br />

                    i wonder why search for similarity<br />
                    what makes similar better <br />
                    than the unfamiliar<br />
                    why this thirst for similarity? <br /><br />

                    may be deep inside we know <br />
                    that something connects everything<br />
                    may be this search is to find it<br />
                    is that the ONE that is everywhere?
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', border: '1.5px solid #E8E4DE', background: '#F9F7F5' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1c1a18', marginBottom: '4px' }}>
                <span>🌌</span> Chitta
              </strong>
              <p style={{ fontSize: '12px', margin: 0, color: '#7a7168', lineHeight: 1.4 }}>Stateless intelligence</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', borderTop: '1.5px solid #E8E4DE', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a7168', letterSpacing: '1px', marginBottom: '12px', fontWeight: 700 }}>Cognitive Powers</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div className="dimension-card--hover" style={{ padding: '12px', borderRadius: '12px', border: '1.5px solid #E8E4DE', background: '#F9F7F5' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1c1a18', marginBottom: '4px' }}>
                <span>💾</span> Memory
              </strong>
              <p style={{ fontSize: '12px', margin: 0, color: '#7a7168', lineHeight: 1.4 }}>Storage and retrieval of experiences</p>
              <div className="dimension-popup">
                <div className="dimension-popup__content">
                  <p style={{ marginBottom: 0 }}>
                    Memory is of the past. How accurate is it? We do not know. 
                    For devices, we validate and verify the memory accuracy. 
                    For what we remember, we have no clue how accurate is our memory.
                  </p>
                </div>
              </div>
            </div>
            <div className="dimension-card--hover" style={{ padding: '12px', borderRadius: '12px', border: '1.5px solid #E8E4DE', background: '#F9F7F5' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1c1a18', marginBottom: '4px' }}>
                <span>🌈</span> Imagination
              </strong>
              <p style={{ fontSize: '12px', margin: 0, color: '#7a7168', lineHeight: 1.4 }}>Creative projection of possibilities</p>
              <div className="dimension-popup">
                <div className="dimension-popup__content">
                  <p style={{ marginBottom: 0 }}>
                    Imagination is virtual reality. The most interesting thing about imagination is physical laws are not enforced.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(200, 149, 108, 0.05)', borderLeft: '3px solid #C8956C' }}>
            <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#1c1a18', lineHeight: 1.6, margin: 0 }}>
              "When we see a thing, the particles of the brain fall into a certain position like the mosaics of a kaleidoscope. Memory consists in getting back this combination and the same setting of the particles of the brain"
            </p>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#C8956C', marginTop: '8px', textAlign: 'right', margin: 0 }}>
              — Swami Vivekananda
            </p>
          </div>

          <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(200, 149, 108, 0.03)', border: '1px solid rgba(200, 149, 108, 0.1)' }}>
            <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#C8956C', letterSpacing: '0.8px', marginBottom: '8px', fontWeight: 700 }}>A Thought Experiment on Identity</h5>
            <p style={{ fontSize: '13px', color: '#7a7168', lineHeight: 1.6, margin: 0 }}>
              Imagine a car identical to yours is parked right beside yours in a parking space. One morning, you notice deep scratches on one of them. 
              Initially, you think it is <em>yours</em> and feel deeply disturbed. Later, you realize it is the other person's, and you suddenly feel better (or vice-versa). 
              The scratches remain the same, but your emotional state shifts instantly based on what you are <strong>identified with</strong>.
            </p>
          </div>

          <p style={{ marginTop: '20px', fontSize: '14px', color: '#1c1a18', fontStyle: 'italic', textAlign: 'center', maxWidth: '90%', margin: '20px auto 0', lineHeight: 1.6 }}>
            "Holding a universal identity as a default and temporary identities as needed for the situation—as we hold <strong>loose clothing</strong>—is one way to navigate through life."
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'emotions',
    title: 'Emotions',
    icon: '🌊',
    content: (
      <>
        The flowing field of your feelings and reactions. Emotions are not just internal states but energetic signals that connect your inner world to your outer actions.
        <div style={{ marginTop: '20px', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #E8E4DE', background: '#F9F7F5' }}>
          <img 
            src={emotionsImg} 
            alt="Spectrum of Emotions" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        <div style={{ marginTop: '24px', borderTop: '1.5px solid #E8E4DE', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a7168', letterSpacing: '1px', marginBottom: '12px', fontWeight: 700 }}>Nava Rasas & Chemistry</h4>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(58, 124, 165, 0.03)', border: '1.5px solid rgba(58, 124, 165, 0.1)' }}>
            <p style={{ fontSize: '15px', color: '#1c1a18', marginBottom: '16px', lineHeight: 1.6 }}>
              Human experience is traditionally categorized into <strong>nine core emotions</strong> known as the <em>Nava Rasas</em>. 
              The word <strong>Rasa</strong> literally points to a chemical composition or "essence."
            </p>
            
            <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #E8E4DE', marginBottom: '16px', borderLeft: '4px solid #3A7CA5' }}>
              <p style={{ fontSize: '13px', color: '#7a7168', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                "While thinking is neurological (electricity-based), emotion has a <strong>chemical basis</strong>. This creates a certain lag between the way we think and the way we feel."
              </p>
            </div>

            <p style={{ fontSize: '14px', color: '#7a7168', lineHeight: 1.6, margin: 0 }}>
              These chemical shifts occur not just in reality, but even in simulated scenarios (like stories or movies). 
              Because chemistry takes longer to circulate and dissipate than electrical signals, our feelings often trail behind our rapid thoughts.
            </p>
        </div>
      </div>

        <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', border: '1px solid #E8E4DE', background: '#fff' }}>
          <h5 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a7168', letterSpacing: '0.8px', marginBottom: '8px', fontWeight: 700 }}>Emotional Complexity</h5>
          <p style={{ fontSize: '13px', color: '#7a7168', lineHeight: 1.5, margin: 0 }}>
            Emotions rarely exist in isolation. Many life situations trigger <strong>overlapping states</strong>—like the bittersweet mix of joy and sorrow during a significant transition, or the simultaneous presence of fear and courage. These dualities form the intricate, multidimensional texture of our internal lives.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'energy',
    title: 'Energy',
    icon: '⚡',
    content: (
      <>
        <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(200, 149, 108, 0.05)', borderLeft: '3px solid #C8956C' }}>
          <p style={{ fontSize: '14px', color: '#1c1a18', lineHeight: 1.6, margin: 0 }}>
            Of the four components we have looked at in the human system, the other three are in some way in our experience, so they are kind of easy to understand.
          </p>
          <p style={{ fontSize: '14px', color: '#1c1a18', lineHeight: 1.6, marginTop: '12px', margin: 0 }}>
            This aspect is probably best grasped by <strong>inference</strong>. Because this system is functioning the way it is functioning, we can infer that there is some <strong>energy infrastructure</strong> inside that is powering the components.
          </p>
        </div>
        The subtle vitality that sustains you. It is the fuel behind your intent, the rhythm of your breath, and the spark that drives all movement.
        <div style={{ marginTop: '20px', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #E8E4DE', background: 'white', padding: '24px' }}>
          <img 
            src={energyImg} 
            alt="Subtle Vitality" 
            style={{ width: '100%', maxWidth: '240px', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </div>

        <div style={{ marginTop: '24px', borderTop: '1.5px solid #E8E4DE', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a7168', letterSpacing: '1px', marginBottom: '12px', fontWeight: 700 }}>Pancha Pranas</h4>
          <p style={{ fontSize: '14px', color: '#1c1a18', lineHeight: 1.6, margin: 0 }}>
            The energy system is traditionally understood through five primary dimensions known as the <strong>Pancha Pranas</strong>. These are five distinct manifestations of life energy that together take care of various physiological aspects of running the human life—from digestion and circulation to the subtle sparks of intelligence.
          </p>
        </div>
      </>
    ),
  },
]

/* ─────────────────────────── LOCATE DATA ─────────────────────────── */
const locateRows = [
  {
    existential:
      'That which is there in the existence. It is naturally there. Like the sun, moon, seasons, full moon, new moon and so on.',
    social:
      'A certain organization that humans have done. Many other creatures have also organized themselves or tend to organize themselves, however, it is largely driven towards basic survival.',
  },
  {
    existential:
      'Does not change very easily, has been there for a pretty long period of time, probably will go on like this for a much longer period.',
    social:
      'The Social organization realities keep changing depending on the kind of layers of tools we figure out to make and use.',
  },
  {
    existential: 'This is the one that probably really matters in the larger scheme of things.',
    social:
      'This one matters in the immediate reality because this impacts us almost on a daily basis if not hourly basis.',
  },
  {
    existential:
      'Physical health, mental health, experience of life, largely depend on the existential plane.',
    social:
      'Wealth, power, ability to get a group of people to do something, sell something or buy something, comfort and convenience happen on the social plane.',
  },
  {
    existential:
      'In terms of existence, we are just a speck. One more creature in the vast cosmos. However, the way we are created, humans have the ability to merge and become one with the vast cosmos.',
    social:
      'In terms of the social structure, we may be considered big in some parts, looked upto in some parts, looked down in some parts, not understood in some parts and so on.',
  },
  {
    existential: 'The value of something is not measured by what people think.',
    social:
      'The value of something is largely based on how people look at something. What is valued as great in one part of the society may not be valued at all in another part.',
  },
]

/* ─────────────────────────── ORGANIZE DATA ─────────────────────────── */
const organizeActivity = [
  { icon: '⚡', label: 'Immediate Use', desc: 'Can be applied or used right away, without any additional steps.' },
  { icon: '🧱', label: 'Build First', desc: 'Needs a layer on top to be built before it can be applied or used.' },
  { icon: '🔄', label: 'New Way of Doing', desc: 'Requires a different approach or a fundamental skill to be developed.' },
  { icon: '🗂️', label: 'Layered Planning', desc: 'Complex enough that it needs multiple layers of planning to execute.' },
]

const organizeContext = [
  { icon: '🙋', label: 'Need exists', desc: 'People actually have the need to perform the activity.' },
  { icon: '📖', label: 'Knowledge ready', desc: 'People are knowledgeable enough to understand what is being said.' },
  { icon: '🛠️', label: 'Tools available', desc: 'People have all the tools necessary to use or perform the activity.' },
]

const organizeAwareness = [
  {
    level: '01',
    icon: '🚀',
    label: 'Being Informed',
    depth: 'Surface',
    desc: 'Initial curiosity to know a little about a topic. Like a rocket — unless we have more access to such places, we would only have some basic information.',
    color: '#3A7CA5',
    bg: '#EEF5FB',
  },
  {
    level: '02',
    icon: '🎮',
    label: 'Using Something',
    depth: 'Operational',
    desc: 'Like a gaming console — we want to know more about it: controls, how to start/stop, settings. We read the user manual and learn how to use it well.',
    color: '#4A7C59',
    bg: '#EEF6F1',
  },
  {
    level: '03',
    icon: '✏️',
    label: 'Creating Something',
    depth: 'Deep',
    desc: (
      <>
        Like a pencil — so familiar, but is it really easy to make one? The depth needed to create something is far greater than what is needed to merely use it. Let us watch this{' '}
        <a href="https://www.youtube.com/watch?v=IYO3tAqgV84" target="_blank" rel="noopener noreferrer" style={{ color: '#C8956C', textDecoration: 'underline' }}>
          video
        </a>.
      </>
    ),
    color: '#C8956C',
    bg: '#FDF6EE',
  },
]

const organizeReflections = [
  'Look at yourself — what level of awareness are you currently at?',
  'Look at the kind of activity you are doing or expecting others to do.',
  'Look at the level of awareness needed by the others involved.',
  'Look at the infrastructure needed to bring others to that level of awareness.',
]

const OrganizeExtraNote = () => (
  <p className="org-awareness-note">
    In most fields, people operate at the <em>expert user</em> level.
    Some make the leap to <em>creating</em> — for example{' '}
    <a href="https://torvin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4A7C59', fontWeight: 600, textDecoration: 'underline' }}>
      Torvin Speakers
    </a>.
    Where are you?
  </p>
)

/* ─────────────────────────── SECTION PAGE ─────────────────────────── */
function SectionPage({
  section,
  navigate,
}: {
  section: (typeof sections)[0]
  navigate: (path: string) => void
}) {
  const others = sections.filter((s) => s.id !== section.id)

  return (
    <div className="section-page">
      {/* Hero banner */}
      <div
        className="section-hero"
        style={
          {
            '--s-color': section.color,
            '--s-bg': section.bg,
            '--s-accent': section.accent,
          } as React.CSSProperties
        }
      >
        <div className="section-hero__text">
          <p className="section-hero__subtitle">{section.subtitle}</p>
          <h1 className="section-hero__title">{section.title}</h1>
          <p className="section-hero__desc">{section.description}</p>
          <div className="section-hero__pillars">
            {section.pillars.map((p) => (
              <div key={p.label} className="pillar-badge">
                <span className="pillar-badge__icon">{p.icon}</span>
                <span className="pillar-badge__label">{p.label}</span>
              </div>
            ))}
          </div>
          <button
            id={`cta-${section.id}`}
            className="section-hero__btn"
            style={{ backgroundColor: section.color }}
          >
            Start Exploring
          </button>
        </div>
        <div className="section-hero__img-wrap">
          <img
            src={section.image}
            alt={section.title}
            className="section-hero__img"
          />
        </div>
      </div>

      {/* Section-specific content */}
      {section.id === 'know' ? (
        <div className="know-content">
          <p className="know-intro">
            To know yourself is to peel back the layers of your existence. It's
            an exploration of the four interconnected dimensions that make you
            who you are.
          </p>

          <div className="know-grid">
            {knowPillars.map((p) => (
              <div
                key={p.id}
                className="know-card"
                style={
                  {
                    '--p-color': section.color,
                    '--p-bg': section.bg,
                    '--p-accent': section.accent,
                  } as React.CSSProperties
                }
              >
                <div className="know-card__head">
                  <span className="know-card__icon">{p.icon}</span>
                  <h2 className="know-card__title">{p.title}</h2>
                </div>
                <div className="know-card__body">{p.content}</div>
              </div>
            ))}
          </div>

          <div
            className="content-panel content-panel--highlight"
            style={{ borderLeftColor: section.color, marginTop: '48px' }}
          >
            <h3>Initial Contemplation</h3>
            <p>
              "Take a moment to simply observe. Which of these four houses —
              Body, Mind, Emotion, or Energy — do you inhabit the most during
              your waking hours?"
            </p>
          </div>
        </div>
      ) : section.id === 'locate' ? (
        <div className="locate-content">
          {/* Dimension Bar */}
          <div style={{ marginBottom: '48px', padding: '40px', borderRadius: '24px', background: '#F9F7F5', border: '1.5px solid #E8E4DE', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#7a7168', letterSpacing: '1.5px', marginBottom: '45px', textAlign: 'center', fontWeight: 700 }}>Locating the Human Scale</h4>
            
            <div style={{ position: 'relative', height: '240px', width: '100%', display: 'flex', alignItems: 'center', padding: '0 20px', overflow: 'hidden', background: '#fff', borderRadius: '16px', border: '1.5px solid #E8E4DE' }}>
              {/* Connecting line */}
              <div style={{ position: 'absolute', left: '10%', right: '10%', height: '1px', background: '#E8E4DE', zIndex: 1 }} />
              
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                {/* Nano */}
                <div style={{ textAlign: 'center', width: '50px' }}>
                   <div style={{ width: '1px', height: '1px', background: '#3A7CA5', borderRadius: '50%', margin: '0 auto 24px' }} />
                   <p style={{ fontSize: '8px', color: '#7a7168', fontWeight: 800, margin: 0 }}>NANO</p>
                </div>

                {/* Atom */}
                <div style={{ textAlign: 'center', width: '50px' }}>
                   <div style={{ width: '3px', height: '3px', background: '#b0a898', borderRadius: '50%', margin: '0 auto 22px' }} />
                   <p style={{ fontSize: '8px', color: '#b0a898', margin: 0 }}>ATOM</p>
                </div>

                {/* Cell */}
                <div style={{ textAlign: 'center', width: '50px' }}>
                   <div style={{ width: '8px', height: '8px', background: '#A8C8E0', borderRadius: '50%', margin: '0 auto 16px', border: '1px solid #fff' }} />
                   <p style={{ fontSize: '8px', color: '#7a7168', margin: 0 }}>CELL</p>
                </div>

                {/* HUMAN */}
                <div style={{ textAlign: 'center', width: '80px' }}>
                   <div style={{ 
                     width: '24px', height: '24px', 
                     background: '#3A7CA5', 
                     borderRadius: '50%', 
                     margin: '0 auto 12px', 
                     border: '2.5px solid #fff', 
                     boxShadow: '0 4px 12px rgba(58, 124, 165, 0.4)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center'
                   }}>
                     <span style={{ color: '#fff', fontSize: '6px', fontWeight: 900 }}>YOU</span>
                   </div>
                   <p style={{ fontSize: '11px', fontWeight: 800, color: '#3A7CA5', margin: 0, letterSpacing: '0.5px' }}>HUMAN</p>
                </div>

                {/* Planet */}
                <div style={{ textAlign: 'center', width: '140px' }}>
                   <div style={{ width: '120px', height: '120px', background: '#EEF5FB', borderRadius: '50%', margin: '0 auto -30px', border: '1.5px solid #A8C8E0', boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 30% 30%, #fff 0%, transparent 60%)', opacity: 0.6 }} />
                   </div>
                   <p style={{ fontSize: '9px', fontWeight: 700, color: '#7a7168', position: 'relative', zIndex: 3 }}>PLANET</p>
                </div>

                {/* Solar System */}
                <div style={{ textAlign: 'center', width: '220px', position: 'relative' }}>
                   <div style={{ 
                     width: '280px', height: '280px', 
                     background: 'radial-gradient(circle, rgba(232, 196, 160, 0.15) 0%, transparent 75%)', 
                     borderRadius: '50%', 
                     margin: '-80px auto -100px', 
                     border: '1px dashed rgba(200, 149, 108, 0.3)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     position: 'relative'
                    }}>
                      <div style={{ width: '14px', height: '14px', background: '#C8956C', borderRadius: '50%', boxShadow: '0 0 15px rgba(200, 149, 108, 0.5)' }} />
                   </div>
                   <p style={{ fontSize: '9px', fontWeight: 800, color: '#1c1a18', position: 'relative', zIndex: 3 }}>SOLAR SYSTEM</p>
                </div>

                {/* Galaxy */}
                <div style={{ textAlign: 'center', width: '250px', position: 'relative' }}>
                   <div style={{ 
                     width: '500px', height: '500px', 
                     background: 'radial-gradient(circle, rgba(58, 124, 165, 0.1) 0%, transparent 80%)', 
                     borderRadius: '50%', 
                     position: 'absolute', 
                     top: '-200px', 
                     left: '-100px', 
                     zIndex: -1, 
                     filter: 'blur(30px)' 
                    }} />
                   <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px', filter: 'drop-shadow(0 0 10px rgba(58, 124, 165, 0.2))' }}>🌌</span>
                   <p style={{ fontSize: '10px', color: '#1c1a18', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>GALAXY</p>
                </div>
              </div>
            </div>
            
            <p style={{ fontSize: '15px', color: '#7a7168', textAlign: 'center', marginTop: '32px', maxWidth: '640px', margin: '40px auto 0', lineHeight: 1.7, fontStyle: 'italic' }}>
              "To locate yourself correctly, you must first recognize your specific point in the vast dimensions of existence—positioned at the delicate intersection of the infinitesimal and the infinite."
            </p>
          </div>

          <div className="locate-intro">
            <p>
              To locate yourself is to understand the two planes of reality you
              inhabit simultaneously — what simply <em>is</em>, and what humans
              have <em>agreed</em> to be.
            </p>
          </div>
          <div className="locate-table">
            {/* Header */}
            <div className="locate-table__header">
              <div
                className="locate-table__col-head locate-table__col-head--existential"
                style={{ borderBottomColor: section.color }}
              >
                <span className="col-head-icon">🌌</span>
                <span>Existential</span>
              </div>
              <div
                className="locate-table__col-head locate-table__col-head--social"
                style={{ borderBottomColor: '#9B59B6' }}
              >
                <span className="col-head-icon">🏛️</span>
                <span>Social / Psychological</span>
              </div>
            </div>
            {/* Rows */}
            {locateRows.map((row, i) => (
              <div key={i} className="locate-table__row">
                <div
                  className="locate-table__cell locate-table__cell--existential"
                  style={{
                    borderLeftColor: section.color,
                    background: i % 2 === 0 ? section.bg : '#fff',
                  }}
                >
                  {row.existential}
                </div>
                <div
                  className="locate-table__cell locate-table__cell--social"
                  style={{
                    borderLeftColor: '#9B59B6',
                    background: i % 2 === 0 ? '#F5EEF8' : '#fff',
                  }}
                >
                  {row.social}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : section.id === 'organize' ? (
        <div className="organize-content">
          <p className="organize-intro">
            Organizing yourself begins with honestly assessing the situation —
            understanding the variables at play, and then intentionally arranging
            yourself for the activity ahead.
          </p>

          {/* ── Dimension 1: Kind of Activity ── */}
          <div className="org-block">
            <div className="org-block__head" style={{ color: section.color }}>
              <span className="org-block__icon">🎯</span>
              <h2 className="org-block__title">The Kind of Activity</h2>
            </div>
            <div className="org-activity-grid">
              {organizeActivity.map((a) => (
                <div key={a.label} className="org-activity-card">
                  <span className="org-activity-card__icon">{a.icon}</span>
                  <strong>{a.label}</strong>
                  <p>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Dimension 2: Kind of Context ── */}
          <div className="org-block">
            <div className="org-block__head" style={{ color: section.color }}>
              <span className="org-block__icon">🌍</span>
              <h2 className="org-block__title">The Kind of Context Needed</h2>
            </div>
            <div className="org-context-list">
              {organizeContext.map((c) => (
                <div key={c.label} className="org-context-item" style={{ borderLeftColor: section.color }}>
                  <span className="org-context-item__icon">{c.icon}</span>
                  <div>
                    <strong>{c.label}</strong>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Dimension 3: Layers of Awareness ── */}
          <div className="org-block">
            <div className="org-block__head" style={{ color: section.color }}>
              <span className="org-block__icon">🔍</span>
              <h2 className="org-block__title">Layers of Awareness</h2>
            </div>
            <OrganizeExtraNote />
            <div className="org-awareness-stack">
              {organizeAwareness.map((a) => (
                <div
                  key={a.label}
                  className="org-awareness-card"
                  style={{ borderLeftColor: a.color, background: a.bg }}
                >
                  <div className="org-awareness-card__left">
                    <span className="org-awareness-card__level" style={{ color: a.color }}>{a.level}</span>
                    <span className="org-awareness-card__icon">{a.icon}</span>
                  </div>
                  <div className="org-awareness-card__body">
                    <div className="org-awareness-card__meta">
                      <strong>{a.label}</strong>
                      <span className="org-awareness-card__depth" style={{ color: a.color }}>{a.depth}</span>
                    </div>
                    <p>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Reflection Steps ── */}
          <div className="org-reflection" style={{ borderColor: section.accent }}>
            <p className="org-reflection__label">Reflect on this</p>
            <ol className="org-reflection__list">
              {organizeReflections.map((r, i) => (
                <li key={i} style={{ '--r-color': section.color } as React.CSSProperties}>{r}</li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <div className="section-content">
          <div className="content-panel">
            <h2>Your Journey with {section.title.split(' ')[0]}</h2>
            <p>
              This section is an ever-growing space for reflection, tools, and
              guided exercises. Content and interactive modules are coming soon.
            </p>
          </div>
          <div
            className="content-panel content-panel--highlight"
            style={{ borderLeftColor: section.color }}
          >
            <h3>Reflection Prompt</h3>
            <p>
              {section.id === 'know' &&
                '"What is one belief you hold about yourself that you have never truly questioned?"'}
            </p>
          </div>
        </div>
      )}

      {/* Cross-navigation to other sections */}
      <div className="cross-nav">
        <p className="cross-nav__label">Continue your journey</p>
        <div className="cross-nav__cards">
          {others.map((s) => (
            <button
              key={s.id}
              id={`cross-${s.id}`}
              className="cross-card"
              style={
                {
                  '--c-color': s.color,
                  '--c-bg': s.bg,
                } as React.CSSProperties
              }
              onClick={() => navigate(`/${s.id}`)}
            >
              <img src={s.image} alt={s.title} className="cross-card__img" />
              <div className="cross-card__body">
                <p className="cross-card__sub">{s.subtitle}</p>
                <h3 className="cross-card__title">{s.title}</h3>
                <span className="cross-card__arrow">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
