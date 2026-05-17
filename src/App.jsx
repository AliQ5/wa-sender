import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { FaWhatsapp, FaBars, FaTimes, FaDownload, FaDesktop, FaApple, FaWindows, FaArrowRight, FaCheckCircle, FaUserCircle } from 'react-icons/fa'
import { TbFileSpreadsheet, TbTemplate, TbEye, TbSend, TbReport, TbDeviceDesktop } from 'react-icons/tb'

gsap.registerPlugin(ScrollTrigger)

const DOWNLOAD_URL_WINDOWS = "https://github.com/AliQ5/wa-sender-app/releases/latest/download/WA-SENDER.Setup.1.0.0.exe"
const DOWNLOAD_URL_MAC = "https://github.com/AliQ5/wa-sender-app/releases/latest/download/WA-SENDER-1.0.0-arm64.dmg"

// ─── CUSTOM CURSOR ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const [hovering, setHovering] = useState(false)
  const dotRef = useRef(null)
  const circleRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let mouseX = 0, mouseY = 0
    let circleX = 0, circleY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`
        dotRef.current.style.top = `${mouseY}px`
      }
    }

    const onMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('button') || e.target.closest('a')) {
        setHovering(true)
      } else {
        setHovering(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)

    const tick = () => {
      circleX += (mouseX - circleX) * 0.15
      circleY += (mouseY - circleY) * 0.15
      if (circleRef.current) {
        circleRef.current.style.left = `${circleX}px`
        circleRef.current.style.top = `${circleY}px`
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={circleRef} className={`custom-cursor-circle ${hovering ? 'hovering' : ''}`} />
    </>
  )
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrolled(latest > 60)
    })
  }, [scrollY])

  const handleNavClick = (e, target) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const el = document.querySelector(target)
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav 
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: 14 }}>
            <FaWhatsapp size={20} color="#25D366" /> WA-SENDER
          </div>

          <div className="nav-links">
            <a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="nav-link">Features</a>
            <a href="#how" onClick={(e) => handleNavClick(e, '#how')} className="nav-link">How it works</a>
            <a href="#releases" onClick={(e) => handleNavClick(e, '#releases')} className="nav-link">Releases</a>
            <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="nav-link">About</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <motion.a 
              href={DOWNLOAD_URL_WINDOWS}
              download
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: 13, display: 'none' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Download Free
            </motion.a>
            <button className="btn btn-outline mobile-menu-btn" style={{ padding: 8 }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ position: 'fixed', top: 56, left: 0, right: 0, background: 'white', zIndex: 99, borderBottom: '0.5px solid var(--border)', overflow: 'hidden' }}
          >
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <a href="#features" onClick={(e) => handleNavClick(e, '#features')}>Features</a>
              <a href="#how" onClick={(e) => handleNavClick(e, '#how')}>How it works</a>
              <a href="#releases" onClick={(e) => handleNavClick(e, '#releases')}>Releases</a>
              <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const text = "Bulk WhatsApp Messaging, without the API fees."
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.2 * i }
    })
  }

  const child = {
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 20 }
  }

  const mockupRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.fromTo(mockupRef.current,
      { opacity: 0, scale: 0.96, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1, delay: 0.9, ease: 'power3.out' }
    )

    gsap.fromTo(barRef.current,
      { width: '0%' },
      { width: '68%', duration: 1.5, delay: 1.4, ease: 'power2.out' }
    )
  }, [])

  return (
    <section className="hero">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <motion.div 
          className="badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <FaCheckCircle size={14} /> Free & Open to use
        </motion.div>

        <motion.h1 variants={container} initial="hidden" animate="visible">
          {words.map((word, index) => (
            <motion.span variants={child} key={index} className="word">
              {word === "API" ? <span style={{ color: 'var(--accent)' }}>{word}</span> : word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          WA-SENDER is a true native desktop application that automates highly personalized WhatsApp notifications directly from your Excel files.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: 'spring', damping: 12 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.a 
            href={DOWNLOAD_URL_WINDOWS} download
            className="btn btn-primary"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <motion.div whileHover={{ y: 3 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaWindows size={16} /> Windows Download
            </motion.div>
          </motion.a>
          <motion.a 
            href={DOWNLOAD_URL_MAC} download
            className="btn btn-outline"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <motion.div whileHover={{ y: 3 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaApple size={16} /> Mac OS
            </motion.div>
          </motion.a>
        </motion.div>

        <motion.div 
          ref={mockupRef} 
          className="mockup"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
        >
          <div className="mockup-inner">
            <div className="mockup-header">
              <div className="dot" style={{ background: '#FF5F56' }} />
              <div className="dot" style={{ background: '#FFBD2E' }} />
              <div className="dot" style={{ background: '#27C93F' }} />
            </div>
            <div style={{ padding: 32, background: 'white' }}>
              <div style={{ display: 'flex', gap: 24, height: 200 }}>
                <div style={{ flex: 1, border: '0.5px solid var(--border)', borderRadius: 8, padding: 16 }}>
                  <div style={{ width: '40%', height: 12, background: 'var(--border)', borderRadius: 4, marginBottom: 16 }} />
                  <div style={{ width: '100%', height: 8, background: 'var(--bg-secondary)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ width: '100%', height: 8, background: 'var(--bg-secondary)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ width: '80%', height: 8, background: 'var(--bg-secondary)', borderRadius: 4 }} />
                </div>
                <div style={{ flex: 2, border: '0.5px solid var(--border)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '30%', height: 12, background: 'var(--border)', borderRadius: 4, marginBottom: 24 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span>Sending Progress</span>
                    <span>1,432 / 2,100</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                    <div ref={barRef} style={{ width: '0%', height: '100%', background: 'var(--accent)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── FEATURES ──────────────────────────────────────────────────────────────────
function Features() {
  const containerRef = useRef(null)
  
  const features = [
    { title: 'Excel & CSV Import', desc: 'Seamlessly upload large datasets. The app automatically detects phone numbers and variables.', icon: TbFileSpreadsheet },
    { title: 'Custom Templates', desc: 'Create unique message templates for different categories. Support for dynamic variables.', icon: TbTemplate },
    { title: 'Live Preview', desc: 'See exactly what your messages will look like for each recipient before sending.', icon: TbEye },
    { title: 'Bulk Sending', desc: 'Automate sending with intelligent delays to prevent spam detection and blocks.', icon: TbSend },
    { title: 'Delivery Logs', desc: 'Track real-time progress. See exactly which messages were sent and which failed.', icon: TbReport },
    { title: 'True Desktop App', desc: 'Runs locally on your machine. Your data stays private and never touches our servers.', icon: TbDeviceDesktop }
  ]

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const cards = containerRef.current.querySelectorAll('.feature-card')
    gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      { 
        opacity: 1, y: 0, 
        duration: 0.7, 
        stagger: 0.08, 
        ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
      }
    )
  }, [])

  return (
    <section id="features" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ color: 'var(--accent)', fontWeight: 500, fontSize: 14 }}>Features</span>
          <h2 style={{ fontSize: 32, marginTop: 8, marginBottom: 16 }}>Everything you need to broadcast</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>WA-Sender combines simplicity with powerful automation tools designed for small businesses and schools.</p>
        </div>

        <div className="grid-3" ref={containerRef}>
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              className="card feature-card"
              whileHover={{ scale: 1.02, borderColor: '#25D366' }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <f.icon size={24} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HOW TO USE ────────────────────────────────────────────────────────────────
function HowToUse() {
  const containerRef = useRef(null)
  
  const steps = [
    { title: 'Connect Accounts', desc: 'Scan the QR code once using WhatsApp Linked Devices. Connect multiple numbers.' },
    { title: 'Upload & Map Data', desc: 'Drag your Excel file. We automatically organize your contacts into logical categories.' },
    { title: 'Review & Broadcast', desc: 'Check the live previews, set your safety delay, and click Start Broadcast.' }
  ]

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const items = containerRef.current.querySelectorAll('.step-item-card')
    gsap.fromTo(items,
      { opacity: 0, y: 40 },
      { 
        opacity: 1, y: 0, 
        duration: 0.7, 
        stagger: 0.12, 
        ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%' }
      }
    )
  }, [])

  return (
    <section id="how">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, marginBottom: 16 }}>How it works</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Get started in under 2 minutes.</p>
        </div>

        <div className="grid-3" ref={containerRef}>
          {steps.map((s, i) => (
            <div key={i} className="card step-item-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 48, fontWeight: 500, color: 'var(--border)', lineHeight: 1, marginBottom: 24 }}>0{i+1}</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── RELEASES ──────────────────────────────────────────────────────────────────
function Releases() {
  const tableRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const rows = tableRef.current.querySelectorAll('tbody tr')
    gsap.fromTo(rows,
      { opacity: 0, x: -20 },
      { 
        opacity: 1, x: 0, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: 'power2.out',
        scrollTrigger: { trigger: tableRef.current, start: 'top 85%' }
      }
    )
  }, [])

  return (
    <section id="releases" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, marginBottom: 8 }}>Releases</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Download the latest version for your operating system.</p>
        </div>

        <div className="table-wrapper" ref={tableRef}>
          <table style={{ background: 'white' }}>
            <thead>
              <tr>
                <th>Version</th>
                <th>Release Date</th>
                <th>OS</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    v1.0.0 
                    <motion.span 
                      style={{ background: 'rgba(37, 211, 102, 0.1)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Latest
                    </motion.span>
                  </div>
                </td>
                <td>May 16, 2026</td>
                <td>Windows (x64)</td>
                <td>
                  <motion.a href={DOWNLOAD_URL_WINDOWS} download style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text)', fontWeight: 500 }}>
                    <motion.div whileHover={{ y: 3 }}><FaDownload size={14} /></motion.div> Download .exe
                  </motion.a>
                </td>
              </tr>
              <tr>
                <td>v1.0.0</td>
                <td>May 16, 2026</td>
                <td>MacOS (Apple Silicon)</td>
                <td>
                  <motion.a href={DOWNLOAD_URL_MAC} download style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text)', fontWeight: 500 }}>
                    <motion.div whileHover={{ y: 3 }}><FaApple size={14} /></motion.div> Download .dmg
                  </motion.a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ─── WHY WA-SENDER ─────────────────────────────────────────────────────────────
function WhyWaSender() {
  const containerRef = useRef(null)
  
  const reasons = [
    { title: 'Zero API Fees', desc: 'Stop paying per-message costs to Meta or enterprise tools. WA-Sender operates locally and costs absolutely nothing to use.' },
    { title: 'Privacy First', desc: 'Since it runs entirely on your desktop, your sensitive Excel contacts and broadcast data never get sent to third-party servers.' },
    { title: 'Smart Delaying', desc: 'Built-in humanized pacing delays between messages ensure your WhatsApp account remains safe from automated spam blocks.' },
    { title: 'Multi-Account', desc: 'Seamlessly link multiple WhatsApp accounts (Personal, Business) to the same app and switch between them instantly.' }
  ]

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const cards = containerRef.current.querySelectorAll('.why-card')
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, y: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
      }
    )
  }, [])

  return (
    <section>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, marginBottom: 16 }}>Why WA-SENDER?</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Built specifically for cost-effective, high-scale communication.</p>
        </div>

        <div className="grid-2" ref={containerRef}>
          {reasons.map((r, i) => (
            <div key={i} className="card why-card" style={{ display: 'flex', gap: 16 }}>
              <motion.div whileHover={{ y: [0, -5, 0] }} transition={{ duration: 0.4 }} style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FaCheckCircle color="var(--accent)" />
              </motion.div>
              <div>
                <h3 style={{ fontSize: 16, marginBottom: 4 }}>{r.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  const ref = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.fromTo(ref.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: ref.current, start: 'top 85%' } }
    )
  }, [])

  return (
    <section id="about" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="card" ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 64 }}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '1px solid var(--border)' }}
          >
            <FaUserCircle size={40} color="var(--text-secondary)" />
          </motion.div>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Ali Qureshi</h2>
          <p style={{ color: 'var(--accent)', fontWeight: 500, marginBottom: 24 }}>Creator & Developer</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            WA-Sender was built to solve a simple problem: small organizations needed a reliable, free way to broadcast personalized updates without paying exorbitant API fees or subscribing to complex enterprise CRM tools. Built with React and Electron.
          </p>
          <div style={{ marginTop: 32 }}>
            <a href="mailto:aliaqureshi73@gmail.com" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  const ref = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const els = ref.current.children
    gsap.fromTo(els,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, scrollTrigger: { trigger: ref.current, start: 'top 80%' } }
    )
  }, [])

  return (
    <motion.section 
      animate={{ backgroundColor: ['#F7F8FA', '#F0FDF4', '#F7F8FA'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      style={{ padding: '120px 0', textAlign: 'center' }}
    >
      <div className="container" ref={ref}>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 24 }}>Ready to automate your messages?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 40 }}>Download WA-Sender today for free.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.a href={DOWNLOAD_URL_WINDOWS} download className="btn btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Download for Windows
          </motion.a>
          <motion.a href={DOWNLOAD_URL_MAC} download className="btn btn-outline" style={{ background: 'white' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Download for MacOS
          </motion.a>
        </div>
      </div>
    </motion.section>
  )
}

// ─── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: '48px 0', borderTop: '0.5px solid var(--border)', background: 'white' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
          <FaWhatsapp size={20} color="#25D366" /> WA-SENDER
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: 14 }}>
          <a href="#features" className="footer-link">Features</a>
          <a href="#how" className="footer-link">How to use</a>
          <a href="#releases" className="footer-link">Releases</a>
          <a href="#about" className="footer-link">About</a>
        </div>
        <div style={{ color: 'var(--text-hint)', fontSize: 13, marginTop: 24 }}>
          &copy; {new Date().getFullYear()} Ali Qureshi. All rights reserved. Not affiliated with WhatsApp Inc.
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis
    
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })

      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    }

    return () => {
      if (lenis) {
        lenis.destroy()
        gsap.ticker.remove(lenis.raf)
      }
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowToUse />
        <Releases />
        <WhyWaSender />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
