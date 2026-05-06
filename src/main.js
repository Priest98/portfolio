import { createClient } from '@supabase/supabase-js'
import './style.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Initialize Lucide Icons
lucide.createIcons()

// Initialize Smooth Scrolling (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// Initial hidden state for reveals to prevent flash
gsap.set('.reveal, .reveal-text, .reveal-sub', { autoAlpha: 0 })

// 1. GLOBAL SETUP & SCROLL PROGRESS
if (document.querySelector('.scroll-progress')) {
  gsap.to('.scroll-progress', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    }
  })
}

// 2. HERO SECTION ENHANCEMENT
window.addEventListener('load', () => {
  const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } })

  // Ensure elements are prepared for animation
  const heroElements = ['.hero-layout', '.reveal-text', '.hero-text p', '.hero-btns .btn-underline', '.hero-image-wrap', '.reveal']
  gsap.set(heroElements, { autoAlpha: 1, visibility: 'visible' })

  heroTl.from('.reveal-text', {
    y: 80,
    opacity: 0,
    duration: 1.8,
    stagger: 0.2,
  }, 0.2)

  heroTl.from('.hero-text p', {
    y: 40,
    opacity: 0,
    duration: 1.5,
  }, '-=1.2')

  heroTl.from('.hero-btns .btn-underline', {
    scale: 0.8,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
  }, '-=1')

  heroTl.from('.hero-image-wrap', {
    x: 50,
    opacity: 0,
    duration: 2.2,
  }, 0.5)

  // Hero Image Parallax
  const heroImg = document.querySelector('.hero-img')
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    })
  }

  // 4. FEATURED WORK / GALLERY SECTION (PINNED HORIZONTAL)
  const projectsGrid = document.querySelector('.projects-grid')
  const projectsSection = document.querySelector('#projects')

  if (projectsGrid && projectsSection && window.innerWidth > 1024) {
    projectsGrid.classList.add('horizontal')
    
    const horizontalTween = gsap.to(projectsGrid, {
      x: () => -(projectsGrid.scrollWidth - window.innerWidth + 100),
      ease: 'none',
      scrollTrigger: {
        trigger: projectsSection,
        pin: true,
        scrub: 1,
        start: 'top 5%',
        end: () => `+=${projectsGrid.scrollWidth}`,
        invalidateOnRefresh: true,
      }
    })
    
    ScrollTrigger.refresh()

    // Animate each project's info as it enters the view
    const projectInfos = projectsGrid.querySelectorAll('.project-info')
    projectInfos.forEach((info) => {
      gsap.from(info, {
        x: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: info,
          containerAnimation: horizontalTween,
          start: 'left 80%',
          toggleActions: 'play none none none',
        }
      })
    })
  }
})

// 3. SECTION-BASED SCROLL ANIMATIONS
const revealSections = document.querySelectorAll('section:not(#hero)')
revealSections.forEach((section) => {
  const reveals = section.querySelectorAll('.reveal, .reveal-text, .reveal-sub')
  
  if (reveals.length > 0) {
    gsap.set(reveals, { autoAlpha: 1, visibility: 'visible' })
    
    gsap.from(reveals, {
      y: 60,
      opacity: 0,
      duration: 1.4,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    })
  }
})

// 7. CTA / CONTACT SECTION
const contactSection = document.querySelector('.contact-adam')
if (contactSection) {
  const contactReveals = contactSection.querySelectorAll('.label, .contact-quote, .main-cta, .sub-cta, .contact-links, .contact-form')
  gsap.set(contactReveals, { autoAlpha: 1, visibility: 'visible' })
  // E. Global Polish (Cursor & Progress)
  const cursor = document.querySelector('.custom-cursor')
  const progressBar = document.querySelector('.scroll-progress')

  if (cursor) {
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      })
    })

    const hoverables = document.querySelectorAll('a, button, .project-card, .lookbook-item')
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => cursor.classList.add('active'))
      item.addEventListener('mouseleave', () => cursor.classList.remove('active'))
    })
  }

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = (window.scrollY / totalHeight) * 100
    if (progressBar) progressBar.style.width = `${progress}%`
  })

    // F. Instagram Disruption Sticky Animation
    gsap.to('.mockup-reveal', {
      scrollTrigger: {
        trigger: '.disruption-section',
        start: 'center center',
        end: 'bottom center',
        scrub: true
      },
      opacity: 1,
      scale: 1,
      pointerEvents: 'auto'
    })

    gsap.to('.chaos-stack', {
      scrollTrigger: {
        trigger: '.disruption-section',
        start: 'center center',
        end: 'bottom center',
        scrub: true
      },
      opacity: 0,
      y: -100
    })

    // G. Portfolio Background Morph
    const lookbookItems = document.querySelectorAll('.lookbook-item')
    const lookbookSection = document.querySelector('.lookbook-section')

    lookbookItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const bg = item.getAttribute('data-bg')
        if (bg && lookbookSection) {
          lookbookSection.style.setProperty('--lookbook-bg', `url(${bg})`)
          lookbookSection.classList.add('morphed')
        }
      })
      item.addEventListener('mouseleave', () => {
        if (lookbookSection) lookbookSection.classList.remove('morphed')
      })
    })
  
  gsap.from(contactReveals, {
    y: 50,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: contactSection,
      start: 'top 70%',
      once: true
    }
  })
}

// 8. INTELLIGENT SYSTEMS (NEW)
const intelligentSystems = () => {
  // A. Dynamic Scarcity Engine
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const now = new Date()
  const currentMonth = months[now.getMonth()]
  const nextMonth = months[(now.getMonth() + 1) % 12]
  
  document.querySelectorAll('.current-month').forEach(el => el.textContent = currentMonth)
  document.querySelectorAll('.next-month').forEach(el => el.textContent = nextMonth)



  // C. Interactive Builder
  const aestheticBtns = document.querySelectorAll('.aesthetic-btn')
  const focusBtns = document.querySelectorAll('.focus-btn')
  const previewCanvas = document.getElementById('preview-canvas')

  aestheticBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      aestheticBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      
      const style = btn.dataset.style
      // Update only the aesthetic class, preserve focus class
      const currentFocus = previewCanvas.className.match(/focus-\w+/)?.[0] || ''
      previewCanvas.className = `preview-${style} ${currentFocus}`
      
      gsap.from('#preview-canvas > *', {
        opacity: 0,
        y: 10,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      })
    })
  })

  focusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      focusBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      
      const focus = btn.dataset.focus
      // Update only the focus class, preserve aesthetic class
      const currentStyle = previewCanvas.className.match(/preview-\w+/)?.[0] || ''
      previewCanvas.className = `${currentStyle} focus-${focus}`
      
      gsap.from('.preview-cta, .preview-text-block', {
        scale: 0.8,
        opacity: 0,
        duration: 0.4
      })
    })
  })

  // D. Smart Floating CTA
  const smartCta = document.getElementById('smart-cta')
  const pillText = smartCta?.querySelector('.pill-text')
  
  if (smartCta) {
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top -400',
      onEnter: () => smartCta.classList.add('active'),
      onLeaveBack: () => smartCta.classList.remove('active')
    })

    // Context-aware messaging
    const updatePill = (text) => {
      if (pillText.textContent === text) return
      gsap.to(pillText, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
          pillText.textContent = text
          gsap.to(pillText, { opacity: 1, y: 0, duration: 0.3 })
        }
      })
    }

    ScrollTrigger.create({
      trigger: '#projects',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => updatePill('Want results like these?'),
      onLeaveBack: () => updatePill("Let's build yours"),
      onLeave: () => updatePill('Secure your slot')
    })
  }
}

intelligentSystems()

// Smooth Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const targetId = this.getAttribute('href')
    if (targetId === '#') return
    const target = document.querySelector(targetId)
    if (target) {
      lenis.scrollTo(target, { offset: -80 })
    }
  })
})

// Active Link Highlight
const navLinks = document.querySelectorAll('.nav-links a')
const sections = document.querySelectorAll('section')

window.addEventListener('scroll', () => {
  let current = ''
  sections.forEach(section => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (window.scrollY >= (sectionTop - 250)) {
      current = section.getAttribute('id')
    }
  })

  navLinks.forEach(link => {
    link.classList.remove('active')
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active')
    }
  })
})

// Hamburger Menu Logic
const menuToggle = document.getElementById('menu-toggle')
const menuClose = document.getElementById('menu-close')
const mobileMenu = document.getElementById('mobile-menu')
const mobileLinks = document.querySelectorAll('.mobile-nav-links a')

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active')
    document.body.style.overflow = 'hidden'
  })

  const closeMenu = () => {
    mobileMenu.classList.remove('active')
    document.body.style.overflow = ''
  }

  menuClose.addEventListener('click', closeMenu)
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu))
}

// Magnetic Micro-physics for CTAs
const magneticElements = document.querySelectorAll('.primary-cta-btn')
magneticElements.forEach(el => {
  let bounds
  const rotate = gsap.quickSetter(el, "rotation", "deg")
  const scale = gsap.quickSetter(el, "scale")
  
  el.addEventListener('mouseenter', () => {
    bounds = el.getBoundingClientRect()
  })
  
  el.addEventListener('mousemove', (e) => {
    if (!bounds) return
    const x = e.clientX - bounds.left - bounds.width / 2
    const y = e.clientY - bounds.top - bounds.height / 2
    const dist = Math.sqrt(x * x + y * y)
    const maxDist = 100
    if (dist < maxDist) {
      const strength = (maxDist - dist) / maxDist
      rotate(-x * 0.2 * strength)
      scale(1 + strength * 0.05)
    }
  })
  
  el.addEventListener('mouseleave', () => {
    rotate(0)
    scale(1)
    bounds = null
  })
})
let lastScroll = 0
const navbar = document.getElementById('navbar')

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset
  if (currentScroll <= 0 || mobileMenu?.classList.contains('active')) {
    navbar.classList.remove('hidden')
    return
  }

  if (currentScroll > lastScroll && currentScroll > 200 && !navbar.classList.contains('hidden')) {
    navbar.classList.add('hidden')
  } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
    navbar.classList.remove('hidden')
  }
  lastScroll = currentScroll
})


// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

// Interactive Form Logic (Updated for 6 steps)
const interactiveForm = document.getElementById('interactive-form')
if (interactiveForm) {
  const steps = interactiveForm.querySelectorAll('.form-step')
  const nextBtns = interactiveForm.querySelectorAll('.next-step-btn')
  const assistantText = document.getElementById('assistant-text')
  const typeCards = interactiveForm.querySelectorAll('.type-card')
  const projectTypeInput = document.getElementById('project-type')
  const budgetOptions = interactiveForm.querySelectorAll('.budget-option')
  const budgetInput = document.getElementById('project-budget')
  const timelineOptions = interactiveForm.querySelectorAll('.timeline-option')
  const timelineInput = document.getElementById('project-timeline')
  
  let currentStep = 1
  
  const assistantMessages = {
    1: "Let’s talk. Tell me what you’re building.",
    2: "Nice to meet you! Now, what's the best email to reach you?",
    3: "Got it. What kind of project are we looking at?",
    4: "Helpful. What's the planned investment for this?",
    5: "Speed matters in fashion. What's the timeline?",
    6: "Almost there. Any specific details you want to share?",
    success: "Message received. Let’s build something great."
  }

  const updateAssistant = (step) => {
    gsap.to(assistantText, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      onComplete: () => {
        assistantText.textContent = assistantMessages[step] || assistantMessages[1]
        gsap.to(assistantText, { opacity: 1, y: 0, duration: 0.3 })
      }
    })
  }

  const goToStep = (nextStep) => {
    const currentEl = interactiveForm.querySelector(`.form-step[data-step="${currentStep}"]`)
    const nextEl = interactiveForm.querySelector(`.form-step[data-step="${nextStep}"]`)
    
    if (!nextEl) return

    const tl = gsap.timeline()
    tl.to(currentEl, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      onComplete: () => {
        currentEl.classList.remove('active')
        nextEl.classList.add('active')
        updateAssistant(nextStep)
        const nextInput = nextEl.querySelector('input, textarea')
        if (nextInput) nextInput.focus()
      }
    })
    tl.fromTo(nextEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 })
    currentStep = nextStep
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length) goToStep(currentStep + 1)
    })
  })

  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('selected'))
      card.classList.add('selected')
      projectTypeInput.value = card.dataset.value
      goToStep(4)
    })
  })

  budgetOptions.forEach(option => {
    if (option.classList.contains('timeline-option')) return
    option.addEventListener('click', () => {
      budgetOptions.forEach(o => o.classList.remove('selected'))
      option.classList.add('selected')
      budgetInput.value = option.dataset.value
      goToStep(5)
    })
  })

  timelineOptions.forEach(option => {
    option.addEventListener('click', () => {
      timelineOptions.forEach(o => o.classList.remove('selected'))
      option.classList.add('selected')
      timelineInput.value = option.dataset.value
      goToStep(6)
    })
  })

  interactiveForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const submitBtn = interactiveForm.querySelector('button[type="submit"]')
    submitBtn.innerHTML = 'Sending...'
    submitBtn.disabled = true

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      project_type: document.getElementById('project-type').value,
      budget: document.getElementById('project-budget').value,
      timeline: document.getElementById('project-timeline').value,
      message: document.getElementById('message').value
    }

    const waMessage = `Hello Adam, my name is ${formData.name}.
I'm interested in a ${formData.project_type} project starting ${formData.timeline}.
Target Investment: ${formData.budget}
Email: ${formData.email}
Details: ${formData.message}`
    
    const waUrl = `https://wa.me/2349136599914?text=${encodeURIComponent(waMessage)}`

    updateAssistant('success')
    gsap.to(interactiveForm, {
      opacity: 0,
      onComplete: () => {
        interactiveForm.innerHTML = `<div class="success-message"><h3>Inquiry Received.</h3><p>Redirecting to WhatsApp...</p></div>`
        setTimeout(() => window.open(waUrl, '_blank'), 1000)
      }
    })

    if (supabase) {
      await supabase.from('inquiries').insert([{
        name: formData.name,
        email: formData.email,
        message: `[Type: ${formData.project_type}] [Budget: ${formData.budget}] [Timeline: ${formData.timeline}] ${formData.message}`
      }])
    }
  })
}

// Conversion Popup Logic
const conversionSystem = () => {
  const popup = document.getElementById('conversion-popup')
  const closeBtn = popup?.querySelector('.exit-close')
  const primaryBtn = document.getElementById('popup-primary')
  const secondaryBtn = document.getElementById('popup-secondary')
  
  let popupTriggered = false
  const isFormSubmitted = sessionStorage.getItem('form_submitted')

  const showPopup = () => {
    if (popupTriggered || isFormSubmitted || sessionStorage.getItem('conversion_popup_shown')) return
    if (popup) {
      popup.classList.add('show')
      popupTriggered = true
      sessionStorage.setItem('conversion_popup_shown', 'true')
      gsap.from(popup.querySelector('.exit-popup-content'), { scale: 0.95, opacity: 0, duration: 0.6 })
    }
  }

  if (popup) {
    setTimeout(showPopup, 25000)
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > 50) showPopup()
    })
    document.addEventListener('mouseleave', (e) => { if (e.clientY < 0) showPopup() })
    closeBtn?.addEventListener('click', () => popup.classList.remove('show'))
    if (primaryBtn) primaryBtn.addEventListener('click', () => popup.classList.remove('show'))
    if (secondaryBtn) secondaryBtn.addEventListener('click', () => popup.classList.remove('show'))
  }
}

// 9. TRANSFORMATION ANIMATIONS (NEW)
const transformationAnimations = () => {
  // A. Comparison Slider (Drag/Move)
  const slider = document.querySelector('.comparison-slider')
  if (slider) {
    const afterLayer = slider.querySelector('.comparison-after')
    const handle = slider.querySelector('.slider-handle')
    
    const updateSlider = (e) => {
      const rect = slider.getBoundingClientRect()
      const x = (e.pageX || e.touches?.[0].pageX) - rect.left
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
      
      gsap.to(afterLayer, { clipPath: `inset(0 0 0 ${percent}%)`, duration: 0.1 })
      gsap.to(handle, { left: `${percent}%`, duration: 0.1 })
    }

    slider.addEventListener('mousemove', updateSlider)
    slider.addEventListener('touchmove', (e) => {
      e.preventDefault()
      updateSlider(e)
    }, { passive: false })
  }



  // C. Text Morph (Value Transformation)
  const morphTrigger = document.querySelector('.morph-trigger')
  if (morphTrigger) {
    const phrases = ['Fashion Labels', 'Creative Founders', 'Boutique Labels', 'Designer Brands']
    let i = 0
    
    const morphTimeline = () => {
      gsap.to(morphTrigger, {
        opacity: 0,
        y: -10,
        duration: 0.8,
        onComplete: () => {
          i = (i + 1) % phrases.length
          morphTrigger.textContent = phrases[i]
          gsap.fromTo(morphTrigger, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 })
        }
      })
    }
    
    setInterval(morphTimeline, 4000)
  }




}

// 10. MOBILE EDITORIAL ENHANCEMENTS
const mobileEditorialEnhancements = () => {
  if (window.innerWidth > 1024) return

  // A. Parallax Hero Portrait
  gsap.to('.hero-img', {
    y: '15%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-adam',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  // B. Staggered Chat Sequence with Growth
  const bubbles = document.querySelectorAll('.dm-bubble')
  if (bubbles.length > 0) {
    gsap.to(bubbles, {
      opacity: 1,
      y: 0,
      stagger: 0.3,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.disruption-section',
        start: 'top 40%',
        toggleActions: 'play none none none'
      }
    })

    // Specialized growth for brand bubbles
    const brandBubbles = document.querySelectorAll('.brand-bubble')
    brandBubbles.forEach(b => {
      gsap.to(b, {
        scale: 1.1,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: b,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })
    })
  }

  // C. Interactive Service Drawer (Click-based)
  const serviceCards = document.querySelectorAll('.insight-card.glass-accordion')
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active')
      serviceCards.forEach(c => c.classList.remove('active'))
      if (!isActive) card.classList.add('active')
    })
  })

  // D. Sticky FAB Visibility (After 'The Reality' Section)
  const smartCta = document.getElementById('smart-cta')
  if (smartCta) {
    ScrollTrigger.create({
      trigger: '#disruption',
      start: 'bottom center',
      onEnter: () => smartCta.classList.add('active'),
      onLeaveBack: () => smartCta.classList.remove('active')
    })
  }
}

mobileEditorialEnhancements()


transformationAnimations()

conversionSystem()

