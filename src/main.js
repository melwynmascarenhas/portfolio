/* eslint-disable */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)
const preloaderTL = gsap.timeline()

let heroTitle
let splitText
let heroSub

function runSplit() {
  heroTitle = new SplitType('.hero__heading', { types: 'chars' })
  splitText = new SplitType('[stagger-link]', {
    types: 'words, chars',
  })
  heroSub = new SplitType('.sub-text', {
    types: 'words, chars',
  })
}
runSplit()
//on window resize remove split and re split
let windowWidth = window.innerWidth
window.addEventListener('resize', () => {
  if (windowWidth !== window.innerWidth) {
    windowWidth = window.innerWidth
    heroTitle.revert()
    splitText.revert()
    heroSub.revert()
    runSplit()
  }
})

//select the links to add hover event listener
const links = document.querySelectorAll('.gallery__item')
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

//NAV LINKS FLIP code…
let navLinks = document.querySelectorAll('.nav-link')
let navCorners = document.querySelector('.nav-corners')
let sectionEls = document.querySelectorAll('.section')

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
    const activeLink = document.querySelector('.nav-link.is--active')
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

const sectionHeadings = document.querySelectorAll('.h1')
sectionHeadings.forEach((heading) => {
  gsap.set(heading, { autoAlpha: 0, filter: 'blur(40px)' })
  gsap.to(heading, {
    autoAlpha: 1,
    filter: 'blur(0px)',
    scrollTrigger: {
      trigger: heading,
      start: 'top 90%',
      end: 'bottom 70%',
      scrub: true,
    },
  })
})

const words = [
  'Building 3D…',
  'Loading 3D…',
  'Adding custom code…',
  'Adding new Webflow logo…',
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
