# Check Compétences - Vue.js + H5P Integration

## Project Overview
This is a Vue.js application with TypeScript integration for H5P interactive content types to create skills assessment tools.

## Key Technologies
- Vue.js 3 with Composition API
- TypeScript
- H5P Standalone for interactive questions
- Tailwind CSS for styling
- Vue Router for navigation
- Pinia for state management

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser at the URL displayed in the terminal

## Features
- Interactive H5P content integration
- Three different rendering modes:
  - CDN mode (embed from H5P.org)
  - Local mode (H5P Standalone)
  - Vue.js Enhanced mode (custom Vue components)
- Multiple question types:
  - Multiple Choice
  - Fill in Blanks
  - Drag and Drop
  - Matching
  - Sorting
- Customizable styling
- Accessibility-focused design
- Responsive UI

## Development Guidelines
- Use TypeScript for all new components
- Follow Vue 3 Composition API patterns
- Integrate H5P content types for interactive questions
- Create reusable components for assessment UI
- Implement adaptive questioning logic
- Focus on accessibility and user experience
- Use Tailwind CSS for consistent styling
- Follow French accessibility standards (RGAA)

## H5P Integration
The application demonstrates three approaches to H5P integration:
1. **CDN Mode**: Embed content from H5P.org using iframes
2. **Local Mode**: Use H5P Standalone library to render content locally
3. **Vue Enhanced**: Custom Vue.js components for maximum control

## Project Structure
- `/src/components/H5P`: H5P integration components
- `/src/components/Assessment`: Assessment UI components
- `/src/views`: Page components
- `/src/router`: Vue Router configuration
- `/src/stores`: Pinia stores
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions
- `/public/h5p`: H5P content and libraries
