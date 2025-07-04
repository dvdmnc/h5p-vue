/**
 * Custom H5P JavaScript to enhance behavior and match Vue.js design
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    enableAnimations: true,
    enableSoundEffects: false,
    enableProgressTracking: true,
    enableCustomEvents: true,
    debug: false
  };

  // Debug logging
  function debug(...args) {
    if (CONFIG.debug) {
      console.log('[H5P Custom]', ...args);
    }
  }

  // Wait for H5P to be ready
  function initCustomH5P() {
    if (typeof H5P !== 'undefined' && H5P.externalDispatcher) {
      debug('H5P is ready, initializing customizations...');
      
      // Listen to xAPI events for progress tracking
      if (CONFIG.enableProgressTracking) {
        H5P.externalDispatcher.on('xAPI', handleXAPIEvent);
      }
      
      // Listen to content ready events
      H5P.externalDispatcher.on('domChanged', handleDOMChanged);
      
      // Listen to resize events
      if (typeof H5P.trigger === 'function') {
        H5P.on('resize', handleResize);
      }
      
      // Initial customization
      setTimeout(() => {
        customizeH5PAppearance();
        addCustomInteractions();
      }, 1000);
      
    } else {
      debug('H5P not ready yet, retrying...');
      setTimeout(initCustomH5P, 500);
    }
  }

  // Handle xAPI events from H5P
  function handleXAPIEvent(event) {
    debug('xAPI Event received:', event);
    
    try {
      const eventData = {
        type: event.getVerb(),
        score: event.getScore(),
        maxScore: event.getMaxScore(),
        completed: event.getResult() && event.getResult().completion,
        success: event.getResult() && event.getResult().success,
        timestamp: new Date().toISOString()
      };
      
      // Dispatch custom Vue events
      if (CONFIG.enableCustomEvents) {
        const customEvent = new CustomEvent('h5p-progress', {
          detail: eventData,
          bubbles: true
        });
        document.dispatchEvent(customEvent);
      }
      
      // Handle specific event types
      switch (eventData.type) {
        case 'answered':
          handleAnsweredEvent(eventData);
          break;
        case 'completed':
          handleCompletedEvent(eventData);
          break;
        case 'interacted':
          handleInteractedEvent(eventData);
          break;
      }
      
    } catch (error) {
      console.error('Error handling xAPI event:', error);
    }
  }

  // Handle DOM changes
  function handleDOMChanged() {
    debug('DOM changed, re-applying customizations...');
    setTimeout(() => {
      customizeH5PAppearance();
      addCustomInteractions();
    }, 100);
  }

  // Handle resize events
  function handleResize() {
    debug('H5P content resized');
    // Ensure responsive design is maintained
    adjustResponsiveElements();
  }

  // Customize H5P appearance
  function customizeH5PAppearance() {
    debug('Customizing H5P appearance...');
    
    // Add custom classes for better styling
    const h5pContents = document.querySelectorAll('.h5p-content');
    h5pContents.forEach(content => {
      content.classList.add('vue-h5p-customized');
      
      // Add theme class based on data attribute or user preference
      const theme = content.getAttribute('data-theme') || 
                   (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      content.setAttribute('data-theme', theme);
    });
    
    // Enhance buttons with custom attributes and events
    const buttons = document.querySelectorAll('.h5p-joubelui-button, .h5p-question-check-answer, .h5p-question-try-again, .h5p-question-show-solution');
    buttons.forEach(button => {
      button.setAttribute('data-enhanced', 'true');
      
      // Add click animation
      if (CONFIG.enableAnimations) {
        button.addEventListener('click', handleButtonClick);
      }
    });
    
    // Add loading states to iframes
    const iframes = document.querySelectorAll('.h5p-iframe-wrapper iframe');
    iframes.forEach(iframe => {
      iframe.style.transition = 'opacity 0.3s ease';
      iframe.addEventListener('load', function() {
        this.style.opacity = '1';
        this.parentElement.classList.add('h5p-loaded');
      });
    });
    
    // Customize form elements
    customizeFormElements();
    
    // Add progress indicators
    addProgressIndicators();
  }

  // Add custom interactions
  function addCustomInteractions() {
    debug('Adding custom interactions...');
    
    // Add keyboard navigation improvements
    addKeyboardNavigation();
    
    // Add accessibility improvements
    addAccessibilityEnhancements();
    
    // Add custom tooltips
    addCustomTooltips();
  }

  // Handle button clicks with animations
  function handleButtonClick(event) {
    const button = event.target;
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
    
    // Add ripple effect
    if (CONFIG.enableAnimations) {
      createRippleEffect(button, event);
    }
  }

  // Create ripple effect on button click
  function createRippleEffect(button, event) {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'h5p-ripple';
    ripple.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
      animation: h5p-ripple-animation 0.6s ease-out;
      left: ${x - 10}px;
      top: ${y - 10}px;
    `;
    
    // Add ripple animation CSS if not already present
    if (!document.querySelector('#h5p-ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'h5p-ripple-styles';
      style.textContent = `
        @keyframes h5p-ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .h5p-joubelui-button, .h5p-question-check-answer, .h5p-question-try-again, .h5p-question-show-solution {
          position: relative;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }
    
    button.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Customize form elements
  function customizeFormElements() {
    // Add custom styling to input fields
    const inputs = document.querySelectorAll('.h5p-text-input, .h5p-textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.classList.add('h5p-focused');
      });
      
      input.addEventListener('blur', function() {
        this.classList.remove('h5p-focused');
      });
    });
    
    // Add custom styling to checkboxes and radio buttons
    const checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        if (CONFIG.enableAnimations) {
          this.parentElement.classList.add('h5p-scale-up');
          setTimeout(() => {
            this.parentElement.classList.remove('h5p-scale-up');
          }, 300);
        }
      });
    });
  }

  // Add progress indicators
  function addProgressIndicators() {
    const progressBars = document.querySelectorAll('.h5p-question-progress-bar');
    progressBars.forEach(bar => {
      const progress = bar.querySelector('.h5p-question-progress');
      if (progress) {
        // Add percentage text
        const percentage = Math.round((parseInt(progress.style.width) || 0));
        const percentageText = document.createElement('span');
        percentageText.className = 'h5p-progress-text';
        percentageText.textContent = `${percentage}%`;
        percentageText.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 10px;
          font-weight: bold;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        `;
        bar.style.position = 'relative';
        bar.appendChild(percentageText);
      }
    });
  }

  // Add keyboard navigation
  function addKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
      // Tab navigation improvements
      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll('.h5p-joubelui-button, .h5p-text-input, .h5p-answer, [tabindex]:not([tabindex="-1"])');
        const focused = document.activeElement;
        const focusedIndex = Array.from(focusable).indexOf(focused);
        
        if (event.shiftKey && focusedIndex === 0) {
          event.preventDefault();
          focusable[focusable.length - 1].focus();
        } else if (!event.shiftKey && focusedIndex === focusable.length - 1) {
          event.preventDefault();
          focusable[0].focus();
        }
      }
      
      // Enter key for buttons
      if (event.key === 'Enter' || event.key === ' ') {
        const focused = document.activeElement;
        if (focused.classList.contains('h5p-joubelui-button') || 
            focused.classList.contains('h5p-answer')) {
          event.preventDefault();
          focused.click();
        }
      }
    });
  }

  // Add accessibility enhancements
  function addAccessibilityEnhancements() {
    // Add ARIA labels where missing
    const buttons = document.querySelectorAll('.h5p-joubelui-button');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-label') && button.textContent.trim()) {
        button.setAttribute('aria-label', button.textContent.trim());
      }
    });
    
    // Add role attributes
    const answers = document.querySelectorAll('.h5p-answer');
    answers.forEach(answer => {
      answer.setAttribute('role', 'option');
      answer.setAttribute('tabindex', '0');
    });
    
    // Add live regions for feedback
    const feedbacks = document.querySelectorAll('.h5p-question-feedback');
    feedbacks.forEach(feedback => {
      feedback.setAttribute('aria-live', 'polite');
      feedback.setAttribute('aria-atomic', 'true');
    });
  }

  // Add custom tooltips
  function addCustomTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[title]');
    elementsWithTooltips.forEach(element => {
      const title = element.getAttribute('title');
      element.removeAttribute('title');
      
      element.addEventListener('mouseenter', function(e) {
        showTooltip(e.target, title);
      });
      
      element.addEventListener('mouseleave', function() {
        hideTooltip();
      });
    });
  }

  // Show tooltip
  function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'h5p-custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
      pointer-events: none;
      white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
  }

  // Hide tooltip
  function hideTooltip() {
    const tooltip = document.querySelector('.h5p-custom-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  // Adjust responsive elements
  function adjustResponsiveElements() {
    const isMobile = window.innerWidth < 768;
    const h5pContents = document.querySelectorAll('.h5p-content');
    
    h5pContents.forEach(content => {
      if (isMobile) {
        content.classList.add('h5p-mobile');
      } else {
        content.classList.remove('h5p-mobile');
      }
    });
  }

  // Event handlers
  function handleAnsweredEvent(eventData) {
    debug('Question answered:', eventData);
    
    // Add visual feedback
    if (CONFIG.enableAnimations) {
      const answers = document.querySelectorAll('.h5p-answer');
      answers.forEach(answer => {
        answer.classList.add('h5p-fade-in');
      });
    }
    
    // Dispatch custom event
    const customEvent = new CustomEvent('h5p-answered', {
      detail: eventData,
      bubbles: true
    });
    document.dispatchEvent(customEvent);
  }

  function handleCompletedEvent(eventData) {
    debug('Content completed:', eventData);
    
    // Add completion animation
    if (CONFIG.enableAnimations) {
      const content = document.querySelector('.h5p-content');
      if (content) {
        content.classList.add('h5p-completed');
      }
    }
    
    // Dispatch custom event
    const customEvent = new CustomEvent('h5p-completed', {
      detail: eventData,
      bubbles: true
    });
    document.dispatchEvent(customEvent);
  }

  function handleInteractedEvent(eventData) {
    debug('User interacted:', eventData);
    
    // Track interaction for analytics
    const customEvent = new CustomEvent('h5p-interacted', {
      detail: eventData,
      bubbles: true
    });
    document.dispatchEvent(customEvent);
  }

  // Initialize when DOM is ready
  function init() {
    debug('Initializing H5P customizations...');
    
    // Add initial responsive handling
    adjustResponsiveElements();
    window.addEventListener('resize', adjustResponsiveElements);
    
    // Initialize H5P customizations
    initCustomH5P();
    
    // Add global styles
    if (!document.querySelector('#h5p-custom-global-styles')) {
      const style = document.createElement('style');
      style.id = 'h5p-custom-global-styles';
      style.textContent = `
        .h5p-content.h5p-completed {
          animation: h5p-completion-pulse 1s ease-in-out;
        }
        
        @keyframes h5p-completion-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .h5p-content.h5p-mobile {
          font-size: 14px;
        }
        
        .h5p-content.h5p-mobile .h5p-joubelui-button {
          min-height: 44px;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export functions for external use
  window.H5PCustom = {
    init: init,
    customizeH5PAppearance: customizeH5PAppearance,
    addCustomInteractions: addCustomInteractions,
    config: CONFIG
  };

})();
