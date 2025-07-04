/**
 * H5P Utility functions for integration with Vue.js
 */

// Map of content types to their H5P content paths
export const H5P_CONTENT_PATHS = {
  'multiple-choice': '/h5p/content/demo-multichoice',
  'fill-in-blanks': '/h5p/content/demo-blanks',
  'drag-drop': '/h5p/content/demo-dragquestion',
  'matching': '/h5p/content/demo-hotspots',
  'sorting': '/h5p/content/demo-dragtext',
}

// Map of content types to their H5P CDN URLs
export const H5P_CDN_URLS = {
  'multiple-choice': 'https://h5p.org/h5p/embed/712', // Multi Choice example
  'fill-in-blanks': 'https://h5p.org/h5p/embed/611',   // Fill in blanks example
  'drag-drop': 'https://h5p.org/h5p/embed/63697',        // Drag and drop example
  'matching': 'https://h5p.org/h5p/embed/61671',        // Matching game example
  'sorting': 'https://h5p.org/h5p/embed/1205723',         // Sorting example
}

// Get the base URL for the current environment
const getBaseUrl = () => {
  return window.location.origin
}

// H5P Standalone configuration
export const H5P_STANDALONE_CONFIG = {
  frameJs: '/h5p/h5p-standalone/dist/frame.bundle.js',
  frameCss: '/h5p/frame.css', // Fixed CSS path to match actual location
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
  processXAPIStatement
}
