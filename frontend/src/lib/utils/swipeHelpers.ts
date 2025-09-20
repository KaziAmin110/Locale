export interface SwipeGestureOptions {
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    threshold?: number;
  }
  
  export class SwipeGestureHandler {
    private element: HTMLElement;
    private onSwipeLeft: () => void;
    private onSwipeRight: () => void;
    private threshold: number;
    
    private startX = 0;
    private startY = 0;
    private currentX = 0;
    private currentY = 0;
    private isDragging = false;
  
    constructor(element: HTMLElement, options: SwipeGestureOptions) {
      this.element = element;
      this.onSwipeLeft = options.onSwipeLeft;
      this.onSwipeRight = options.onSwipeRight;
      this.threshold = options.threshold || 100;
      
      this.bindEvents();
    }
  
    private bindEvents(): void {
      // Mouse events
      this.element.addEventListener('mousedown', this.handleStart);
      this.element.addEventListener('mousemove', this.handleMove);
      this.element.addEventListener('mouseup', this.handleEnd);
      this.element.addEventListener('mouseleave', this.handleEnd);
  
      // Touch events
      this.element.addEventListener('touchstart', this.handleStart, { passive: false });
      this.element.addEventListener('touchmove', this.handleMove, { passive: false });
      this.element.addEventListener('touchend', this.handleEnd);
    }
  
    private getEventX = (event: MouseEvent | TouchEvent): number => {
      return 'touches' in event ? event.touches[0].clientX : event.clientX;
    };
  
    private getEventY = (event: MouseEvent | TouchEvent): number => {
      return 'touches' in event ? event.touches[0].clientY : event.clientY;
    };
  
    private handleStart = (event: MouseEvent | TouchEvent): void => {
      this.isDragging = true;
      this.startX = this.getEventX(event);
      this.startY = this.getEventY(event);
      this.element.style.transition = 'none';
    };
  
    private handleMove = (event: MouseEvent | TouchEvent): void => {
      if (!this.isDragging) return;
  
      event.preventDefault();
      this.currentX = this.getEventX(event);
      this.currentY = this.getEventY(event);
  
      const deltaX = this.currentX - this.startX;
      const deltaY = this.currentY - this.startY;
  
      // Apply transform
      const rotation = deltaX * 0.1;
      this.element.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${rotation}deg)`;
  
      // Visual feedback
      const opacity = Math.max(0.5, 1 - Math.abs(deltaX) / 300);
      this.element.style.opacity = opacity.toString();
  
      // Add swipe indicators
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.element.classList.add('swiping-right');
          this.element.classList.remove('swiping-left');
        } else {
          this.element.classList.add('swiping-left');
          this.element.classList.remove('swiping-right');
        }
      } else {
        this.element.classList.remove('swiping-left', 'swiping-right');
      }
    };
  
    private handleEnd = (): void => {
      if (!this.isDragging) return;
  
      this.isDragging = false;
      const deltaX = this.currentX - this.startX;
      
      this.element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      this.element.classList.remove('swiping-left', 'swiping-right');
  
      // Determine swipe action
      if (Math.abs(deltaX) > this.threshold) {
        if (deltaX > 0) {
          this.animateSwipeRight();
        } else {
          this.animateSwipeLeft();
        }
      } else {
        // Snap back
        this.element.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
        this.element.style.opacity = '1';
      }
    };
  
    private animateSwipeRight(): void {
      this.element.style.transform = 'translateX(100vw) rotate(30deg)';
      this.element.style.opacity = '0';
      setTimeout(() => {
        this.onSwipeRight();
      }, 300);
    }
  
    private animateSwipeLeft(): void {
      this.element.style.transform = 'translateX(-100vw) rotate(-30deg)';
      this.element.style.opacity = '0';
      setTimeout(() => {
        this.onSwipeLeft();
      }, 300);
    }
  
    public destroy(): void {
      this.element.removeEventListener('mousedown', this.handleStart);
      this.element.removeEventListener('mousemove', this.handleMove);
      this.element.removeEventListener('mouseup', this.handleEnd);
      this.element.removeEventListener('mouseleave', this.handleEnd);
      this.element.removeEventListener('touchstart', this.handleStart);
      this.element.removeEventListener('touchmove', this.handleMove);
      this.element.removeEventListener('touchend', this.handleEnd);
    }
  }