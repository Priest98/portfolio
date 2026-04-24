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

// Global Reveal Animations
const revealElements = document.querySelectorAll('.reveal')
const revealTexts = document.querySelectorAll('.reveal-text')
const revealSubs = document.querySelectorAll('.reveal-sub')

revealElements.forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      toggleActions: 'play none none none',
      once: true
    },
    opacity: 0,
    y: 30,
    duration: 1.2,
    ease: 'expo.out'
  })
})

// Specific text reveal for headers (staggered)
revealTexts.forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      once: true
    },
    opacity: 0,
    y: 40,
    duration: 1.5,
    stagger: 0.2,
    ease: 'power4.out'
  })
})

// Image reveals with subtle scale
const revealImgs = document.querySelectorAll('.reveal-img, .project-visual img, .hero-img')
revealImgs.forEach((img) => {
  gsap.from(img, {
    scrollTrigger: {
      trigger: img,
      start: 'top 90%',
      once: true
    },
    opacity: 0,
    scale: 1.05,
    duration: 1.8,
    ease: 'expo.out'
  })
})

// Parallax for Hero Image
const heroImg = document.querySelector('.hero-img')
if (heroImg) {
  gsap.to(heroImg, {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 50,
    scale: 1.05,
    ease: 'none'
  })
}

// Smooth Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const targetId = this.getAttribute('href')
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
    if (window.scrollY >= (sectionTop - 200)) {
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
