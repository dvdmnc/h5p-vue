/**
 * H5P Utility functions for integration with Vue.js
 */

// Map of content types to their H5P content paths
export const H5P_CONTENT_PATHS = {
  'multiple-choice': '/h5p/content/demo-multichoice',
  'fill-in-blanks': '/h5p/content/demo-blanks',
  'drag-drop': '/h5p/content/demo-dragquestion',
  'matching': '/h5p/content/demo-multichoice', // Fallback
  'sorting': '/h5p/content/demo-multichoice',  // Fallback
}

// Map of content types to their H5P CDN URLs
export const H5P_CDN_URLS = {
  'multiple-choice': 'https://h5p.org/h5p/embed/712', // Multi Choice example
  'fill-in-blanks': 'https://h5p.org/h5p/embed/611',   // Fill in blanks example
  'drag-drop': 'https://h5p.org/h5p/embed/63697',        // Drag and drop example
  'matching': 'https://h5p.org/h5p/embed/61671',        // Matching game example
  'sorting': 'https://h5p.org/h5p/embed/1205723',         // Sorting example
}

// Custom CSS styles to match Vue.js design
export const CUSTOM_H5P_STYLES = `
/* Match your Vue.js theme colors and design */
.h5p-content {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Button styling to match Tailwind design */
.h5p-joubelui-button,
.h5p-question-check-answer,
.h5p-question-try-again,
.h5p-question-show-solution {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s ease;
  text-transform: none;
  font-size: 14px;
}

.h5p-joubelui-button:hover,
.h5p-question-check-answer:hover,
.h5p-question-try-again:hover,
.h5p-question-show-solution:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
}

/* Question text styling */
.h5p-question .h5p-question-introduction,
.h5p-question .h5p-question-text {
  color: #1f2937;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: 16px;
}

/* Answer feedback styling */
.h5p-question .h5p-question-feedback {
  background: #f8fafc;
  border-left: 4px solid #10b981;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 14px;
}

/* Multiple choice styling */
.h5p-multichoice .h5p-answer {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.h5p-multichoice .h5p-answer:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.h5p-multichoice .h5p-answer.h5p-selected {
  border-color: #667eea;
  background: #eef2ff;
}

/* Fill in blanks styling */
.h5p-blanks .h5p-text-input {
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.h5p-blanks .h5p-text-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Drag and drop styling */
.h5p-dragquestion .h5p-draggable {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: grab;
  transition: all 0.3s ease;
}

.h5p-dragquestion .h5p-draggable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Progress bar styling */
.h5p-question-progress-bar {
  background: #e5e7eb;
  border-radius: 8px;
  height: 8px;
  overflow: hidden;
}

.h5p-question-progress-bar .h5p-question-progress {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s ease;
}

/* Responsive design */
@media (max-width: 768px) {
  .h5p-content {
    border-radius: 8px;
  }
  
  .h5p-joubelui-button,
  .h5p-question-check-answer,
  .h5p-question-try-again,
  .h5p-question-show-solution {
    padding: 10px 20px;
    font-size: 13px;
  }
}
`

// Custom JavaScript for H5P behavior modification
export const CUSTOM_H5P_SCRIPTS = `
// Wait for H5P to be ready
(function() {
  function initCustomH5P() {
    if (typeof H5P !== 'undefined' && H5P.externalDispatcher) {
      // Listen to xAPI events for progress tracking
      H5P.externalDispatcher.on('xAPI', function(event) {
        console.log('H5P xAPI Event:', event);
        
        // Dispatch custom Vue events
        const customEvent = new CustomEvent('h5p-progress', {
          detail: {
            type: event.getVerb(),
            score: event.getScore(),
            maxScore: event.getMaxScore(),
            completed: event.getResult() && event.getResult().completion,
            success: event.getResult() && event.getResult().success
          }
        });
        
        document.dispatchEvent(customEvent);
      });
      
      // Customize H5P instances when they're ready
      H5P.externalDispatcher.on('domChanged', function() {
        customizeH5PAppearance();
      });
      
      // Initial customization
      setTimeout(customizeH5PAppearance, 1000);
    } else {
      // Retry if H5P is not ready yet
      setTimeout(initCustomH5P, 500);
    }
  }
  
  function customizeH5PAppearance() {
    // Add custom classes for better styling
    const h5pContent = document.querySelector('.h5p-content');
    if (h5pContent) {
      h5pContent.classList.add('vue-h5p-customized');
    }
    
    // Enhance buttons with custom attributes
    const buttons = document.querySelectorAll('.h5p-joubelui-button');
    buttons.forEach(button => {
      button.setAttribute('data-enhanced', 'true');
    });
    
    // Add loading states
    const iframe = document.querySelector('.h5p-iframe-wrapper iframe');
    if (iframe) {
      iframe.style.transition = 'opacity 0.3s ease';
      iframe.addEventListener('load', function() {
        this.style.opacity = '1';
      });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomH5P);
  } else {
    initCustomH5P();
  }
})();
`

// Get the base URL for the current environment
const getBaseUrl = () => {
  return window.location.origin
}

// H5P Standalone configuration
export const H5P_STANDALONE_CONFIG = {
  frameJs: '/h5p/h5p-standalone/dist/frame.bundle.js',
  frameCss: '/h5p/h5p-standalone/dist/styles/h5p.css',
  librariesPath: '/h5p/libraries'
}

// Get absolute URLs for H5P assets
export const getAbsoluteH5PConfig = () => {
  const baseUrl = getBaseUrl()
  return {
    frameJs: baseUrl + H5P_STANDALONE_CONFIG.frameJs,
    frameCss: baseUrl + H5P_STANDALONE_CONFIG.frameCss,
    librariesPath: baseUrl + H5P_STANDALONE_CONFIG.librariesPath
  }
}

// Map of H5P event names to standardized event names
export const H5P_EVENT_MAPPING = {
  'xAPI': 'progress',
  'getQuestionSetResults': 'completed',
  'getResult': 'completed',
  'answered': 'progress',
  'finishedQuestion': 'progress',
  'resize': 'resize',
  'initialized': 'ready',
}

/**
 * Process xAPI statements from H5P
 * @param statement xAPI statement from H5P
 * @returns Standardized event data object
 */
export const processXAPIStatement = (statement: any) => {
  const result = {
    type: 'unknown',
    score: 0,
    maxScore: 0,
    completed: false,
    success: false,
    raw: statement
  }

  try {
    // Extract basic information
    if (statement && statement.result) {
      if (statement.result.score) {
        result.score = statement.result.score.raw || 0
        result.maxScore = statement.result.score.max || 0
      }
      
      result.completed = statement.result.completion === true
      result.success = statement.result.success === true
    }

    // Extract question type
    if (statement && statement.object && statement.object.definition) {
      result.type = statement.object.definition.type || 'unknown'
    }
  } catch (error) {
    console.error('Error processing xAPI statement:', error)
  }

  return result
}

/**
 * Get content path for a question type
 * @param questionType Type of question
 * @returns Path to H5P content folder
 */
export const getContentPath = (questionType: string): string => {
  return H5P_CONTENT_PATHS[questionType as keyof typeof H5P_CONTENT_PATHS] || H5P_CONTENT_PATHS['multiple-choice']
}

/**
 * Get CDN URL for a question type
 * @param questionType Type of question
 * @returns H5P CDN embed URL
 */
export const getCdnUrl = (questionType: string): string => {
  return H5P_CDN_URLS[questionType as keyof typeof H5P_CDN_URLS] || H5P_CDN_URLS['multiple-choice']
}

export default {
  getContentPath,
  getCdnUrl,
  H5P_CONTENT_PATHS,
  H5P_CDN_URLS,
  H5P_STANDALONE_CONFIG,
  H5P_EVENT_MAPPING,
  processXAPIStatement,
  getAbsoluteH5PConfig,
  CUSTOM_H5P_STYLES,
  CUSTOM_H5P_SCRIPTS
}
