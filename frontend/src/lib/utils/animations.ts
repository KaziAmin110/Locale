export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.2 }
}

export const swipeAnimation = {
  left: {
    x: -100,
    rotate: -10,
    opacity: 0,
    transition: { duration: 0.3 }
  },
  right: {
    x: 100,
    rotate: 10,
    opacity: 0,
    transition: { duration: 0.3 }
  },
  center: {
    x: 0,
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  }
}