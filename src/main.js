/* eslint-disable */
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import SplitType from 'split-type'
import Swiper from 'swiper'

import {
  Navigation,
  Pagination,
  EffectFade,
  Autoplay,
  Thumbs,
  Mousewheel,
  Keyboard,
  Parallax,
} from 'swiper/modules'
// import Swiper and modules styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
Swiper.use([
  Navigation,
  Pagination,
  EffectFade,
  Autoplay,
  Thumbs,
  Mousewheel,
  Keyboard,
  Parallax,
])

gsap.registerPlugin(ScrollTrigger, Flip)

//LENIS
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
})
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)
//

let heroTitle
let splitText
let heroSub
let typeSplit

//word masks description section
function createAnimation() {
  const allMasks = Array.from(document.querySelectorAll('.word .line-mask'))
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.description_split-word',
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 1,
    },
  })

  tl.to(allMasks, {
    width: '0%',
    duration: 1,
    stagger: 1,
  })
}

function runSplit() {
  heroTitle = new SplitType('.hero_heading-wrap', { types: 'chars' })
  splitText = new SplitType('[stagger-link]', {
    types: 'words, chars',
  })
  heroSub = new SplitType('.hero_subtext', {
    types: 'words, chars',
  })

  typeSplit = new SplitType('.description_split-word', {
    types: 'lines, words',
  })
  document.querySelectorAll('.word').forEach((word) => {
    const lineMask = document.createElement('div')
    lineMask.classList.add('line-mask')
    word.appendChild(lineMask)
  })
  createAnimation()
}
runSplit()

//TIMELINE STARTS HERE
let preloaderTL = gsap.timeline()
preloaderTL
  .to('.preloader > *', {
    yPercent: -100,
    stagger: {
      amount: 0.4,
      from: 'random',
    },
    delay: 3,
    duration: 0.85,
    ease: 'power4.inOut',
  })
  .from(
    heroTitle.chars,
    {
      opacity: 0,
      filter: 'blur(60px)',
      y: 50,
      duration: 0.75,
      stagger: 0.075,
      ease: 'sine.out',
    },
    '<1.25'
  )
  .from(heroSub.chars, {
    opacity: 0,
    duration: 0.000003,
    stagger: {
      each: 0.06,
      from: 'start',
    },
  })
//TIMELINE ENDS HERE

//on window resize remove split and re split
let resizeTimer
let windowWidth = window.innerWidth
window.addEventListener('resize', () => {
  if (windowWidth !== window.innerWidth) {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      location.reload()
    }, 250)
    windowWidth = window.innerWidth
    heroTitle.revert()
    splitText.revert()
    heroSub.revert()
    runSplit()
  }
})

const hoverTarget = document.querySelectorAll('[hoverTarget]')
hoverTarget.forEach((target) => {
  target.addEventListener('mouseover', () => {
    target.style.border = '1px solid #e6e6e6'
    target.style.boxShadow =
      '0px 1.245px 2.214px 0px rgba(255, 255, 255, 0.02), 0px 2.993px 5.32px 0px rgba(255, 255, 255, 0.03), 0px 5.635px 10.017px 0px rgba(255, 255, 255, 0.04), 0px 10.051px 17.869px 0px rgba(255, 255, 255, 0.04), 0px 18.8px 33.422px 0px rgba(255, 255, 255, 0.05), 0px 45px 80px 0px rgba(255, 255, 255, 0.07)'
  })

  target.addEventListener('mouseout', () => {
    target.style.border = ''
    target.style.boxShadow = ''
  })
})

//select the links to add hover event listener
const links = document.querySelectorAll('[stagger-link-item]')
links.forEach((link) => {
  //select the letters to add stagger
  //!select the letters in the current link not the document
  const letters = link.querySelectorAll('[stagger-link-text] .char')
  //add event lintener to all links
  link.addEventListener('mouseenter', () => {
    gsap.to(letters, {
      yPercent: -100,
      duration: 0.5,
      ease: 'power4.inOut',
      stagger: { each: 0.01 },
      //overwrite does is it interrupts the mouseleave animate if we mouseenter back in and plays the mouseenter animation
      overwrite: true,
    })
  })
  link.addEventListener('mouseleave', () => {
    gsap.to(letters, {
      yPercent: 0,
      duration: 0.5,
      ease: 'power4.inOut',
      stagger: { each: 0.01, from: 'end' },
      overwrite: true,
    })
  })
})

//NAV LINKS FLIP code…
let navLinks = document.querySelectorAll('.nav_link')
let navCorners = document.querySelector('.nav_corners')
let sectionEls = document.querySelectorAll('[dest]')

//removing active form all nav links and add to the actual active
function updateActiveNavLink(targetId) {
  navLinks.forEach((navLinkEl) => {
    navLinkEl.classList.remove('is--active')
    if (navLinkEl.href.includes(targetId)) {
      navLinkEl.classList.add('is--active')
    }
  })
}
///scroll on the nav starts here
function scrollNav() {
  let activeSection = null
  sectionEls.forEach((sectionEl) => {
    if (window.scrollY >= sectionEl.offsetTop - sectionEl.clientHeight / 10) {
      activeSection = sectionEl.id
    }
  })
  //for the cover section the id will be null
  if (activeSection !== null) {
    updateActiveNavLink(activeSection)
    navCorners.style.visibility = 'visible'
    const state = Flip.getState(navCorners)
    const activeLink = document.querySelector('.nav_link.is--active')
    activeLink.appendChild(navCorners)
    Flip.from(state, {
      duration: 0.1,
      ease: 'none',
    })
  } else {
    navLinks.forEach((navLinkEl) => {
      navLinkEl.classList.remove('is--active')
      navCorners.style.visibility = 'hidden'
    })
  }
}
window.addEventListener('scroll', scrollNav)
///scroll on the nav ends here

//for loop to add event listener
navLinks.forEach(function (link) {
  navCorners.style.visibility = 'hidden'
  //click event listener
  link.addEventListener('click', function (e) {
    //first remove active class from the current link
    //no need to check all the links where the active class is applied ...using loop remove all
    navLinks.forEach(function (link) {
      link.classList.remove('is--active')
    })
    //add active class to current link
    this.classList.add('is--active')
  })
})

gsap.matchMedia().add('(min-width: 992px)', () => {
  const sectionHeadings = document.querySelectorAll('.section-heading')
  sectionHeadings.forEach((heading) => {
    gsap.set(heading, { autoAlpha: 0, filter: 'blur(40px)' })
    gsap.to(heading, {
      autoAlpha: 1,
      filter: 'blur(0px)',
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        end: 'bottom 70%',
        scrub: true,
      },
    })
  })
})

const words = [
  'Constructing 3D assets…',
  'Rendering immersive scenes…',
  'Integrating custom scripts…',
  'Finalizing Webflow elements',
]
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

function displayShuffledWords() {
  shuffleArray(words)
  const wordDisplay = document.querySelector('.preloader__text')
  let currentIndex = 0
  const interval = setInterval(() => {
    wordDisplay.textContent = words[currentIndex]
    currentIndex++
    if (currentIndex === words.length) {
      clearInterval(interval)
    }
  }, 600)
}
displayShuffledWords()

// Cursor Hover
const cursor = document.querySelector('.cursor')
const cursorInner = document.querySelector('.cursor-inner')
const allLinks = document.querySelectorAll('a')

allLinks.forEach((link) => {
  link.addEventListener('mouseenter', () => {
    cursorInner.style.fill = '#5739fb'
  })

  link.addEventListener('mouseleave', () => {
    cursorInner.style.fill = ''
  })
})

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.pageX + 'px'
  cursor.style.top = e.pageY + 'px'
})

//PROJ IMAGES PARALLAX
const imagewrappers = document.querySelectorAll('.project_img-wrap')
imagewrappers.forEach((item) => {
  let image = item.querySelector('.project_image')
  gsap.to(image, {
    bottom: '-10%',
    ease: 'none',
    scrollTrigger: {
      trigger: item,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      // markers: true,
    },
  })
})

//// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

// Initialize Swiper with autoplay conditionally based on prefers-reduced-motion
const swiper = new Swiper('.swiper-marquee', {
  slidesPerView: 'auto',
  spaceBetween: 120,
  loop: true,
  speed: 4000,
  allowTouchMove: false,
  autoplay: prefersReducedMotion
    ? false
    : {
        delay: 1,
        disableOnInteraction: false,
      },
})
