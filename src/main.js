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

// Sticky Header Hide on Scroll
let lastScroll = 0
const navbar = document.getElementById('navbar')

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset
  if (currentScroll <= 0) {
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

// Interactive Form Logic
const interactiveForm = document.getElementById('interactive-form')
if (interactiveForm) {
  const steps = interactiveForm.querySelectorAll('.form-step')
  const nextBtns = interactiveForm.querySelectorAll('.next-step-btn')
  const assistantText = document.getElementById('assistant-text')
  const typeCards = interactiveForm.querySelectorAll('.type-card')
  const projectTypeInput = document.getElementById('project-type')
  const budgetOptions = interactiveForm.querySelectorAll('.budget-option')
  const budgetInput = document.getElementById('project-budget')
  
  let currentStep = 1
  
  const assistantMessages = {
    1: "Let’s talk. Tell me what you’re building.",
    2: "Nice to meet you! Now, what's the best email to reach you?",
    3: "Got it. What kind of project are we looking at?",
    4: "Helpful. What's the planned investment for this?",
    5: "Almost there. Any specific details you want to share?",
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
    
    gsap.to('.assistant-avatar', {
      scale: 1.15,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
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
    
    tl.fromTo(nextEl, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    
    currentStep = nextStep
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentInput = steps[currentStep-1].querySelector('input, textarea')
      if (currentInput && !currentInput.checkValidity()) {
        currentInput.reportValidity()
        return
      }
      
      if (currentStep < steps.length) {
        goToStep(currentStep + 1)
      }
    })
  })

  interactiveForm.querySelectorAll('input:not([type="hidden"])').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const nextBtn = input.closest('.form-step').querySelector('.next-step-btn')
        if (nextBtn && !nextBtn.disabled) nextBtn.click()
      }
    })
  })

  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('selected'))
      card.classList.add('selected')
      projectTypeInput.value = card.dataset.value
      
      const nextBtn = card.closest('.form-step').querySelector('.next-step-btn')
      if (nextBtn) nextBtn.disabled = false
      
      gsap.from(card, { scale: 0.95, duration: 0.3, ease: 'back.out(2)' })
      setTimeout(() => { if (currentStep === 3) goToStep(4) }, 600)
    })
  })

  budgetOptions.forEach(option => {
    option.addEventListener('click', () => {
      budgetOptions.forEach(o => o.classList.remove('selected'))
      option.classList.add('selected')
      budgetInput.value = option.dataset.value
      
      const nextBtn = option.closest('.form-step').querySelector('.next-step-btn')
      if (nextBtn) nextBtn.disabled = false
      
      gsap.from(option, { scale: 0.98, duration: 0.2 })
      setTimeout(() => { if (currentStep === 4) goToStep(5) }, 600)
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
      message: document.getElementById('message').value
    }

    const waMessage = `Hello Adam, my name is ${formData.name}.
I'm interested in a ${formData.project_type} project.
Target Investment: ${formData.budget}
Email: ${formData.email}
Details: ${formData.message}`
    
    const waUrl = `https://wa.me/2349136599914?text=${encodeURIComponent(waMessage)}`

    updateAssistant('success')
    gsap.to(interactiveForm, {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      onComplete: () => {
        interactiveForm.innerHTML = `
          <div class="success-message" style="padding: 2rem 0;">
            <h3 style="font-size: 2rem; margin-bottom: 1rem;">Thank You.</h3>
            <p style="margin-bottom: 3rem;">Your inquiry has been recorded. Redirecting you to WhatsApp to finalize the details...</p>
            <a href="${waUrl}" target="_blank" class="btn-underline">Open WhatsApp Manually <i data-lucide="arrow-right" style="width: 14px;"></i></a>
          </div>
        `
        lucide.createIcons()
        gsap.from('.success-message', { opacity: 0, y: 20, duration: 0.6 })
        
        setTimeout(() => {
          window.open(waUrl, '_blank')
        }, 1200)
      }
    })

    try {
      if (supabase) {
        const { error } = await supabase.from('inquiries').insert([{
          name: formData.name,
          email: formData.email,
          message: `[Project: ${formData.project_type}] [Budget: ${formData.budget}] ${formData.message}`
        }])
        if (error) console.warn('Supabase Insert Error:', error.message)
      }
    } catch (err) {
      console.warn('Supabase Error:', err.message)
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
      
      gsap.from(popup.querySelector('.exit-popup-content'), {
        scale: 0.95,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      })
    }
  }

  if (popup) {
    // 1. Time-based trigger (25 seconds)
    setTimeout(showPopup, 25000)

    // 2. Scroll-based trigger (50%)
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > 50) showPopup()
    })

    // 3. Exit Intent trigger
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 0) showPopup()
    })

    // Close logic
    closeBtn?.addEventListener('click', () => popup.classList.remove('show'))
    popup.addEventListener('click', (e) => {
      if (e.target === popup) popup.classList.remove('show')
    })
    
    // CTA clicks
    if (primaryBtn) primaryBtn.addEventListener('click', () => popup.classList.remove('show'))
    if (secondaryBtn) secondaryBtn.addEventListener('click', () => popup.classList.remove('show'))
  }

  // Returning Visitor Logic
  const hasVisited = localStorage.getItem('adam_portfolio_visited')
  if (hasVisited) {
    const heroPara = document.querySelector('.hero-text p')
    if (heroPara) {
      heroPara.textContent = "Welcome back. Ready to elevate your brand perception today? Let's pick up where we left off."
    }
  }
  localStorage.setItem('adam_portfolio_visited', 'true')
}

conversionSystem()
