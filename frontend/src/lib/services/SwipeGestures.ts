export class SwipeGestureHandler {
    private element: HTMLElement
    private onSwipeLeft: () => void
    private onSwipeRight: () => void
    
    private startX = 0
    private startY = 0
    private currentX = 0
    private currentY = 0
    private isDragging = false
    private threshold = 100
  
    constructor(
      element: HTMLElement,
      onSwipeLeft: () => void,
      onSwipeRight: () => void
    ) {
      this.element = element
      this.onSwipeLeft = onSwipeLeft
      this.onSwipeRight = onSwipeRight
      
      this.bindEvents()
    }
  
    private bindEvents() {
      // Mouse events
      this.element.addEventListener('mousedown', this.handleStart)
      document.addEventListener('mousemove', this.handleMove)
      document.addEventListener('mouseup', this.handleEnd)
  
      // Touch events
      this.element.addEventListener('touchstart', this.handleStart, { passive: false })
      document.addEventListener('touchmove', this.handleMove, { passive: false })
      document.addEventListener('touchend', this.handleEnd)
    }
  
    private getEventX = (event: MouseEvent | TouchEvent): number => {
      return 'touches' in event ? event.touches[0].clientX : event.clientX
    }
  
    private getEventY = (event: MouseEvent | TouchEvent): number => {
      return 'touches' in event ? event.touches[0].clientY : event.clientY
    }
  
    private handleStart = (event: MouseEvent | TouchEvent) => {
      this.isDragging = true
      this.startX = this.getEventX(event)
      this.startY = this.getEventY(event)
      this.element.style.transition = 'none'
      this.element.style.cursor = 'grabbing'
    }
  
    private handleMove = (event: MouseEvent | TouchEvent) => {
      if (!this.isDragging) return
  
      event.preventDefault()
      this.currentX = this.getEventX(event)
      this.currentY = this.getEventY(event)
  
      const deltaX = this.currentX - this.startX
      const deltaY = this.currentY - this.startY
      const rotation = deltaX * 0.1
  
      // Apply transform
      this.element.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${rotation}deg)`
      
      // Apply opacity based on distance
      const opacity = Math.max(0.3, 1 - Math.abs(deltaX) / 300)
      this.element.style.opacity = opacity.toString()
  
      // Add visual feedback
      this.element.classList.remove('swipe-left', 'swipe-right')
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.element.classList.add('swipe-right')
        } else {
          this.element.classList.add('swipe-left')
        }
      }
    }
  
    private handleEnd = () => {
      if (!this.isDragging) return
  
      this.isDragging = false
      const deltaX = this.currentX - this.startX
      
      this.element.style.cursor = 'grab'
      this.element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      this.element.classList.remove('swipe-left', 'swipe-right')
  
      if (Math.abs(deltaX) > this.threshold) {
        // Swipe detected
        if (deltaX > 0) {
          this.animateSwipeRight()
        } else {
          this.animateSwipeLeft()
        }
      } else {
        // Snap back
        this.element.style.transform = 'translateX(0) translateY(0) rotate(0deg)'
        this.element.style.opacity = '1'
      }
    }
  
    private animateSwipeRight() {
      this.element.style.transform = 'translateX(100vw) rotate(30deg)'
      this.element.style.opacity = '0'
      setTimeout(() => {
        this.onSwipeRight()
      }, 300)
    }
  
    private animateSwipeLeft() {
      this.element.style.transform = 'translateX(-100vw) rotate(-30deg)'
      this.element.style.opacity = '0'
      setTimeout(() => {
        this.onSwipeLeft()
      }, 300)
    }
  
    public destroy() {
      this.element.removeEventListener('mousedown', this.handleStart)
      document.removeEventListener('mousemove', this.handleMove)
      document.removeEventListener('mouseup', this.handleEnd)
      this.element.removeEventListener('touchstart', this.handleStart)
      document.removeEventListener('touchmove', this.handleMove)
      document.removeEventListener('touchend', this.handleEnd)
    }
  }