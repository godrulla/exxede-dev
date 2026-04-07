// ============================================
// EXXEDE.DEV — Dynamic Engine
// Shooting stars, 3D tilt, letter nav, life
// ============================================

// ---- SHOOTING STARS ----
class ShootingStars {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.stars = []
    this.particles = []
    this.mouse = { x: 0, y: 0 }
    this.resize()
    window.addEventListener('resize', () => this.resize())
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })
    this.spawnInterval = setInterval(() => this.spawnStar(), 1500)
    this.animate()
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  spawnStar() {
    if (this.stars.length > 4) return
    // Stars only travel horizontally from right to left (or slight diagonal)
    const x = this.canvas.width + 10
    const y = Math.random() * this.canvas.height * 0.7
    // Angle: mostly leftward with slight downward drift
    const angle = Math.PI + (Math.random() * 0.3 - 0.15) // ~180 degrees ± small variation
    const speed = 1.5 + Math.random() * 2.5 // slower
    this.stars.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      tail: [],
      tailLength: 15 + Math.floor(Math.random() * 10),
      life: 1,
      decay: 0.002 + Math.random() * 0.003,
      size: 0.3 + Math.random() * 0.4, // tiny only
      hue: Math.random() > 0.5 ? 174 : 210, // teal or dark blue (no purple)
    })
  }

  update() {
    // Stars
    for (let i = this.stars.length - 1; i >= 0; i--) {
      const s = this.stars[i]
      s.tail.unshift({ x: s.x, y: s.y })
      if (s.tail.length > s.tailLength) s.tail.pop()
      s.x += s.vx
      s.y += s.vy
      s.life -= s.decay
      if (s.life <= 0 || s.x < -100 || s.x > this.canvas.width + 100 || s.y > this.canvas.height + 100) {
        // Burst particles on death
        if (s.life <= 0) {
          for (let j = 0; j < 4; j++) {
            const a = (Math.PI * 2 / 4) * j + Math.random() * 0.5
            this.particles.push({
              x: s.x, y: s.y,
              vx: Math.cos(a) * (0.5 + Math.random() * 1),
              vy: Math.sin(a) * (0.5 + Math.random() * 1),
              life: 1,
              decay: 0.03 + Math.random() * 0.04,
              hue: s.hue,
            })
          }
        }
        this.stars.splice(i, 1)
      }
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.97
      p.vy *= 0.97
      p.life -= p.decay
      if (p.life <= 0) this.particles.splice(i, 1)
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw ambient floating dots
    const t = Date.now() * 0.001
    for (let i = 0; i < 40; i++) {
      const x = (Math.sin(t * 0.3 + i * 1.7) * 0.5 + 0.5) * this.canvas.width
      const y = (Math.cos(t * 0.2 + i * 2.3) * 0.5 + 0.5) * this.canvas.height
      const alpha = 0.08 + Math.sin(t + i) * 0.04
      this.ctx.beginPath()
      this.ctx.arc(x, y, 1.2, 0, Math.PI * 2)
      this.ctx.fillStyle = `rgba(79, 209, 197, ${alpha})`
      this.ctx.fill()
    }

    // Draw shooting stars
    for (const s of this.stars) {
      for (let i = 0; i < s.tail.length; i++) {
        const t = s.tail[i]
        const alpha = (1 - i / s.tail.length) * s.life * 0.6
        const size = s.size * (1 - i / s.tail.length)
        this.ctx.beginPath()
        this.ctx.arc(t.x, t.y, size, 0, Math.PI * 2)
        this.ctx.fillStyle = `hsla(${s.hue}, 80%, 75%, ${alpha})`
        this.ctx.fill()
      }
      // Tiny head glow
      this.ctx.beginPath()
      this.ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2)
      const grd = this.ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2.5)
      grd.addColorStop(0, `hsla(${s.hue}, 80%, 80%, ${s.life * 0.35})`)
      grd.addColorStop(1, `hsla(${s.hue}, 70%, 70%, 0)`)
      this.ctx.fillStyle = grd
      this.ctx.fill()
    }

    // Draw burst particles (tiny)
    for (const p of this.particles) {
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, 0.8 * p.life, 0, Math.PI * 2)
      this.ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, ${p.life * 0.4})`
      this.ctx.fill()
    }
  }

  animate() {
    this.update()
    this.draw()
    requestAnimationFrame(() => this.animate())
  }
}

// ---- LETTER-BY-LETTER NAV ----
function initLetterNav() {
  document.querySelectorAll('.nav-letter-link').forEach(link => {
    const text = link.textContent.trim()
    link.textContent = ''
    ;[...text].forEach((char, i) => {
      const span = document.createElement('span')
      span.className = 'letter'
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.setProperty('--letter-delay', `${i * 0.03}s`)
      link.appendChild(span)
    })
  })
}

// ---- 3D TILT CARDS ----
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -6
      const rotateY = ((x - centerX) / centerX) * 6

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`

      // Update shine position
      const shine = card.querySelector('.service-card__shine, .portfolio-card__shine')
      if (shine) {
        shine.style.setProperty('--mouse-x', `${x}px`)
        shine.style.setProperty('--mouse-y', `${y}px`)
      }
    })

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
    })
  })
}

// ---- MAGNETIC BUTTONS ----
function initMagneticButtons() {
  document.querySelectorAll('.btn--magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`
    })
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = ''
    })
  })
}

// ---- TYPEWRITER HERO TEXT ----
function initRotatingText() {
  const container = document.getElementById('rotatingText')
  if (!container) return

  const words = ['Apps', 'Platforms', 'Products', 'Experiences', 'The Future']
  let wordIdx = 0
  let charIdx = 0
  let isDeleting = false
  let pauseTimer = null

  // Clear the HTML spans, use a single text node + cursor
  container.innerHTML = '<span class="hero__typewriter-text"></span><span class="hero__typewriter-cursor">|</span>'
  const textEl = container.querySelector('.hero__typewriter-text')

  function tick() {
    const currentWord = words[wordIdx]

    if (!isDeleting) {
      // Typing forward
      charIdx++
      textEl.textContent = currentWord.slice(0, charIdx)

      if (charIdx === currentWord.length) {
        // Done typing — pause then start deleting
        pauseTimer = setTimeout(() => {
          isDeleting = true
          tick()
        }, 1800)
        return
      }
      setTimeout(tick, 80 + Math.random() * 40)
    } else {
      // Deleting backward
      charIdx--
      textEl.textContent = currentWord.slice(0, charIdx)

      if (charIdx === 0) {
        // Done deleting — move to next word
        isDeleting = false
        wordIdx = (wordIdx + 1) % words.length
        setTimeout(tick, 400)
        return
      }
      setTimeout(tick, 40 + Math.random() * 20)
    }
  }

  // Start after a brief initial delay
  textEl.textContent = words[0]
  charIdx = words[0].length
  setTimeout(() => {
    isDeleting = true
    tick()
  }, 2500)
}

// ---- COUNTER ANIMATION ----
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const stat = entry.target.closest('.stat')
      const el = entry.target
      if (el.dataset.counted) return
      el.dataset.counted = 'true'

      const target = parseFloat(stat.dataset.count)
      const suffix = stat.dataset.suffix || ''
      const decimal = parseInt(stat.dataset.decimal || '0')
      const duration = 1500
      const start = performance.now()

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
        const current = target * eased
        el.textContent = current.toFixed(decimal) + suffix
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
  }, { threshold: 0.5 })

  document.querySelectorAll('.counter').forEach(el => observer.observe(el))
}

// ---- CODE TYPING ANIMATION ----
function initCodeTyping() {
  const codeEl = document.querySelector('#codeTyping code')
  if (!codeEl) return

  const lines = [
    { text: 'export default {', cls: 'kw' },
    { text: '  name: "Exxede.dev",', key: 'name', val: '"Exxede.dev"' },
    { text: '  mission: "Ship fast, ship right",', key: 'mission', val: '"Ship fast, ship right"' },
    { text: '  stack: ["TypeScript", "React", "Node"],', key: 'stack', val: '["TypeScript", "React", "Node"]' },
    { text: '  ai: true,', key: 'ai', val: 'true', valCls: 'bool' },
    { text: '  location: "Punta Cana, DR",', key: 'location', val: '"Punta Cana, DR"' },
    { text: '  available: true,', key: 'available', val: 'true', valCls: 'bool' },
    { text: '}', cls: 'kw' },
  ]

  let lineIdx = 0
  let charIdx = 0
  let typed = false

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !typed) {
      typed = true
      typeNext()
    }
  }, { threshold: 0.3 })

  observer.observe(codeEl.closest('.code-block'))

  function typeNext() {
    if (lineIdx >= lines.length) {
      // Add blinking cursor at end
      const cursor = document.createElement('span')
      cursor.className = 'typed-cursor'
      codeEl.appendChild(cursor)
      return
    }

    const line = lines[lineIdx]
    const text = line.text

    if (charIdx < text.length) {
      // Type one character at a time
      if (charIdx === 0 && lineIdx > 0) codeEl.appendChild(document.createTextNode('\n'))

      const char = text[charIdx]
      const span = document.createTextNode(char)
      codeEl.appendChild(span)
      charIdx++
      setTimeout(typeNext, 20 + Math.random() * 30)
    } else {
      lineIdx++
      charIdx = 0
      setTimeout(typeNext, 100)
    }
  }
}

// ---- SERVICE MODALS ----
const SERVICE_DATA = {
  'web-apps': {
    title: 'Web Applications',
    desc: 'We design and build custom web applications from the ground up — SaaS products, admin dashboards, client portals, internal tools, and data-driven platforms. Every app is built with performance, scalability, and real users in mind. We handle everything from database architecture to pixel-perfect UI.',
    features: [
      'Custom SaaS platforms with multi-tenant architecture',
      'Real-time dashboards with live data visualization',
      'Admin panels and internal business tools',
      'Client portals with role-based access control',
      'Full authentication — SSO, OAuth, magic links, 2FA',
      'Database design — PostgreSQL, Firebase, Redis caching',
      'Responsive design that works on every device',
      'SEO optimization and Core Web Vitals performance',
    ],
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Firebase', 'Vercel', 'Prisma'],
    example: { title: 'Example: ReppingDR', text: 'A full-stack bilingual platform with AI-powered content, Mapbox maps, Stripe payments, and PDF generation — built with Next.js 16 and Firebase.' },
  },
  'pwa': {
    title: 'Mobile-First PWAs',
    desc: 'Progressive Web Apps give your users a native app experience without the app store. We build PWAs that install on any device, work offline, send push notifications, and load instantly. For most use cases, a well-built PWA outperforms a rushed native app at a fraction of the cost.',
    features: [
      'Installable on iOS, Android, and desktop — no app store needed',
      'Offline-first architecture with service workers',
      'Push notifications for engagement and retention',
      'App shell architecture for instant load times',
      'Background sync for data consistency',
      'Camera, GPS, and device API access',
      'Automatic updates — users always get the latest version',
      'Lighthouse scores 95+ across all metrics',
    ],
    tech: ['Next.js', 'Workbox', 'Service Workers', 'IndexedDB', 'Web Push API', 'Tailwind CSS', 'Vercel'],
    example: { title: 'Example: RDR Tours', text: 'A tour booking PWA with offline tour browsing, calendar picker, local Azul payment processing, and PDF voucher generation — works seamlessly on mobile in areas with spotty Caribbean WiFi.' },
  },
  'api': {
    title: 'API & Backend Development',
    desc: 'We build the engine behind your product — fast, secure, and built to handle scale. Whether you need a REST API, GraphQL endpoint, real-time WebSocket service, or a full microservices architecture, we design backends that your frontend (and your users) can rely on.',
    features: [
      'RESTful APIs with OpenAPI/Swagger documentation',
      'GraphQL APIs with optimized resolvers and caching',
      'Real-time data with WebSockets and Server-Sent Events',
      'Microservices architecture with message queues',
      'Database design — relational, document, time-series, vector',
      'Authentication and authorization middleware',
      'Rate limiting, caching, and CDN integration',
      'Automated testing — unit, integration, and load tests',
    ],
    tech: ['Node.js', 'Bun', 'Python', 'FastAPI', 'GraphQL', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
    example: { title: 'Example: TradAI', text: 'A multi-agent trading backend with FastAPI, Kafka message queues, Redis caching, InfluxDB time-series storage, and shared-memory IPC for microsecond-latency communication between five autonomous AI agents.' },
  },
  'ai': {
    title: 'AI Integration',
    desc: 'We embed artificial intelligence into your product — not as a gimmick, but as a core capability that makes your application smarter. From conversational chatbots to autonomous multi-agent workflows, we integrate the right AI model for your use case and budget.',
    features: [
      'Chatbots and conversational AI with context memory',
      'Intelligent search with semantic understanding',
      'Content generation — articles, summaries, descriptions',
      'Document analysis and automated data extraction',
      'Multi-agent workflows for complex automation',
      'Text-to-speech and speech-to-text integration',
      'Custom fine-tuning and prompt engineering',
      'Local AI with Ollama for privacy-sensitive workloads',
    ],
    tech: ['OpenAI', 'Anthropic Claude', 'LangChain', 'Ollama', 'Groq', 'Pinecone', 'Piper TTS', 'FinBERT'],
    example: { title: 'Example: LaMelaZa.do', text: 'A fully autonomous news platform that uses local Ollama models to research, write, fact-check, and publish bilingual articles hourly — with Piper TTS narration in English and Spanish. Zero human input, zero cloud AI costs.' },
  },
  'ecommerce': {
    title: 'E-Commerce Solutions',
    desc: 'We build custom online stores and B2B commerce platforms tailored to how your business actually sells. Not a WordPress template — a real commerce engine with your exact checkout flow, payment gateways, inventory logic, and customer experience.',
    features: [
      'Custom storefronts with branded checkout flows',
      'Multi-vendor / marketplace architectures',
      'Payment integration — Stripe, Azul, PayPal, Mercado Pago',
      'Inventory management with real-time stock tracking',
      'B2B quote request and procurement portals',
      'Product configurators with live previews',
      'Order management, invoicing, and PDF generation',
      'Analytics dashboards with conversion tracking',
    ],
    tech: ['Next.js', 'Stripe', 'Azul', 'Shopify API', 'Prisma', 'PostgreSQL', 'Zustand', 'Framer Motion'],
    example: { title: 'Example: Nice Patio Furniture', text: 'A luxury B2B e-commerce platform with 400+ products across 30+ collections, hotel procurement portal, fabric/color customization, and bilingual support — built for a Dominican Republic outdoor furniture manufacturer.' },
  },
  'devops': {
    title: 'Performance & DevOps',
    desc: 'We set up the infrastructure that keeps your app fast, secure, and deployed without drama. From CI/CD pipelines to monitoring and alerting, we build the systems that let you ship confidently and sleep peacefully. Performance optimization is baked into every project.',
    features: [
      'CI/CD pipelines with GitHub Actions or GitLab CI',
      'Containerization with Docker and orchestration',
      'Cloud infrastructure on AWS, Vercel, or Firebase',
      'Automated testing — unit, E2E with Playwright',
      'Performance monitoring and alerting',
      'CDN configuration and edge caching',
      'SSL, security headers, and vulnerability scanning',
      'Load testing with k6 before every launch',
    ],
    tech: ['Docker', 'GitHub Actions', 'Vercel', 'AWS', 'Firebase', 'Cloudflare', 'Playwright', 'k6'],
    example: { title: 'Our Standard', text: 'Every project we ship includes a CI/CD pipeline, automated tests, performance monitoring, and load testing. We never deploy without testing — it is a core principle of how we work.' },
  },
}

function initServiceModals() {
  const overlay = document.getElementById('serviceModal')
  const titleEl = document.getElementById('modalTitle')
  const descEl = document.getElementById('modalDesc')
  const featuresEl = document.getElementById('modalFeatures')
  const techEl = document.getElementById('modalTech')
  const examplesEl = document.getElementById('modalExamples')
  const iconEl = document.getElementById('modalIcon')

  function openModal(serviceId) {
    const data = SERVICE_DATA[serviceId]
    if (!data) return

    // Copy icon from the card
    const card = document.querySelector(`[data-service="${serviceId}"]`)
    const iconSvg = card.querySelector('.service-card__icon').innerHTML
    iconEl.innerHTML = iconSvg

    titleEl.textContent = data.title
    descEl.textContent = data.desc
    featuresEl.innerHTML = data.features.map(f => `<li>${f}</li>`).join('')
    techEl.innerHTML = data.tech.map(t => `<span>${t}</span>`).join('')
    examplesEl.innerHTML = `<h4>${data.example.title}</h4><p>${data.example.text}</p>`

    overlay.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    overlay.classList.remove('open')
    document.body.style.overflow = ''
  }

  // Open on card click or Learn More click
  document.querySelectorAll('[data-service]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't interfere with tilt on mousemove — only on click/tap
      if (e.target.closest('.service-card__cta') || e.type === 'click') {
        openModal(card.dataset.service)
      }
    })
  })

  // Close
  document.getElementById('modalClose').addEventListener('click', closeModal)
  document.querySelector('.modal__close-btn').addEventListener('click', closeModal)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })

  // Close modal on CTA click (navigates to #contact)
  document.querySelector('.modal__cta-btn').addEventListener('click', closeModal)
}

// ---- PROJECT PREVIEW POPUP ----
function initProjectPreviews() {
  const overlay = document.getElementById('previewOverlay')
  const frame = document.getElementById('previewFrame')
  const titleEl = document.getElementById('previewTitle')
  const externalLink = document.getElementById('previewExternal')
  const loader = document.getElementById('previewLoader')

  // Sites that block iframes — open directly in new tab
  const blockedSites = ['vilzai.web.app', 'oceanparadise.do', 'exxede-28e8f.web.app']

  function isBlocked(url) {
    return blockedSites.some(s => url.includes(s))
  }

  function openPreview(url, name) {
    // If site blocks iframes, open in new tab directly
    if (isBlocked(url)) {
      window.open(url, '_blank', 'noopener')
      return
    }

    titleEl.textContent = name
    externalLink.href = url
    loader.classList.remove('hidden')
    frame.classList.remove('frame-error')
    frame.src = ''

    overlay.classList.add('open')
    document.body.style.overflow = 'hidden'

    // Set iframe src after overlay opens for smooth animation
    requestAnimationFrame(() => {
      frame.src = url
    })

    // Timeout fallback — if iframe hasn't loaded in 8s, show error
    clearTimeout(frame._timeout)
    frame._timeout = setTimeout(() => {
      if (!loader.classList.contains('hidden')) {
        loader.innerHTML = `
          <p style="color: var(--text-secondary); text-align: center; line-height: 1.6;">
            This site can't be previewed inline.<br/>
            <a href="${url}" target="_blank" rel="noopener" class="btn btn--primary" style="margin-top: 1rem;">
              <span>Open ${name} in New Tab</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </p>`
      }
    }, 8000)
  }

  function closePreview() {
    overlay.classList.remove('open')
    document.body.style.overflow = ''
    clearTimeout(frame._timeout)
    // Restore loader for next use
    setTimeout(() => {
      frame.src = ''
      loader.innerHTML = '<div class="preview-popup__spinner"></div><span>Loading preview...</span>'
      loader.classList.remove('hidden')
    }, 400)
  }

  // Hide loader when iframe loads
  frame.addEventListener('load', () => {
    if (frame.src) {
      clearTimeout(frame._timeout)
      loader.classList.add('hidden')
    }
  })

  // Click handlers on portfolio cards
  document.querySelectorAll('[data-preview]').forEach(card => {
    card.style.cursor = 'pointer'
    card.addEventListener('click', () => {
      openPreview(card.dataset.preview, card.dataset.projectName)
    })
  })

  // Close handlers
  document.getElementById('previewClose').addEventListener('click', closePreview)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePreview()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closePreview()
  })
}

// ---- SCROLL ANIMATIONS ----
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  )

  document.querySelectorAll(
    '.anim-reveal, .anim-slide-up, .anim-scale-in, .anim-pop, .service-card, .portfolio-card, .tech-category, .faq-item'
  ).forEach(el => {
    if (!el.classList.contains('anim-reveal') &&
        !el.classList.contains('anim-slide-up') &&
        !el.classList.contains('anim-scale-in') &&
        !el.classList.contains('anim-pop')) {
      el.classList.add('anim-reveal')
    }
    observer.observe(el)
  })
}

// ---- PARALLAX ON SCROLL ----
function initParallax() {
  const hero = document.querySelector('.hero__content')
  const glow1 = document.querySelector('.hero__glow--1')
  const glow2 = document.querySelector('.hero__glow--2')

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY
    const rate = scrollY * 0.3

    if (hero && scrollY < window.innerHeight) {
      hero.style.transform = `translateY(${rate * 0.4}px)`
      hero.style.opacity = 1 - scrollY / (window.innerHeight * 0.8)
    }

    if (glow1) glow1.style.transform = `translate(${Math.sin(scrollY * 0.002) * 20}px, ${scrollY * -0.15}px)`
    if (glow2) glow2.style.transform = `translate(${Math.cos(scrollY * 0.002) * 15}px, ${scrollY * -0.1}px)`
  })
}

// ---- NAV SCROLL EFFECT + LOGO SPIN ----
function initNavScroll() {
  const nav = document.getElementById('nav')
  const logoImg = document.querySelector('.nav__logo img')
  let rotation = 0

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50)
  })

  let lastScrollY = window.scrollY
  let scrollTimer = null

  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastScrollY
    rotation += delta * 0.5
    logoImg.style.transition = 'none'
    logoImg.style.transform = `rotate(${rotation}deg)`
    lastScrollY = window.scrollY

    // When scrolling stops, snap to nearest 360°
    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      const nearest = Math.round(rotation / 360) * 360
      rotation = nearest
      logoImg.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      logoImg.style.transform = `rotate(${rotation}deg)`
    }, 150)
  }, { passive: true })
}

// ---- MOBILE MENU ----
function initMobileMenu() {
  const toggle = document.getElementById('navToggle')
  const links = document.getElementById('navLinks')

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open')
    links.classList.toggle('open')
  })

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open')
      links.classList.remove('open')
    })
  })
}

// ---- SMOOTH SECTION ZOOM ON SCROLL ----
function initSectionZoom() {
  const sections = document.querySelectorAll('.section')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const ratio = entry.intersectionRatio
      const scale = 0.95 + ratio * 0.05
      entry.target.style.transform = `scale(${scale})`
      entry.target.style.opacity = 0.5 + ratio * 0.5
    })
  }, {
    threshold: Array.from({ length: 20 }, (_, i) => i / 20),
  })

  sections.forEach(s => {
    s.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out'
    observer.observe(s)
  })
}

// ---- CONTACT FORM ----
function initContactForm() {
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('button[type="submit"]')
    const original = btn.innerHTML
    btn.innerHTML = '<span>Message Sent!</span>'
    btn.style.background = 'linear-gradient(135deg, #28c840, #20a535)'
    setTimeout(() => {
      btn.innerHTML = original
      btn.style.background = ''
      e.target.reset()
    }, 3000)
  })
}

// ---- ACTIVE NAV HIGHLIGHT ----
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.nav-letter-link')

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const id = section.id
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`
          link.querySelectorAll('.letter').forEach(l => {
            l.style.color = isActive ? 'var(--accent)' : ''
          })
        })
      }
    })
  })
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  new ShootingStars(document.getElementById('starsCanvas'))
  initLetterNav()
  initTiltCards()
  initMagneticButtons()
  initRotatingText()
  initCounters()
  initCodeTyping()
  initScrollAnimations()
  initParallax()
  initNavScroll()
  initMobileMenu()
  initSectionZoom()
  initServiceModals()
  initProjectPreviews()
  initContactForm()
  initActiveNav()
})
