# H5P Integration Documentation

## Files in public/h5p/

### Required Files:
- `libraries/` - Real H5P libraries downloaded with H5P CLI (REQUIRED)
- `sample-content/h5p.json` - H5P content metadata (REQUIRED)
- `sample-content/content.json` - H5P content parameters (REQUIRED)

### Downloaded Libraries:
- `h5p-multi-choice` - Multiple Choice questions
- `h5p-blanks` - Fill in the Blanks
- `h5p-true-false` - True/False questions
- `h5p-drag-question` - Drag and Drop
- `h5p-mark-the-words` - Mark the Words
- Plus all dependencies (font-awesome, h5p-joubel-ui, etc.)

### How it works:
1. The `h5p-standalone` npm package handles all H5P functionality
2. Real H5P libraries are downloaded using `h5p get <library-name>`
3. The sample-content folder contains a real H5P Multiple Choice question
4. Libraries path is configured in H5PPlayer.vue

### Usage:
```vue
<H5PPlayer content="/h5p/sample-content/h5p.json" />
```

### To add more libraries:
```bash
cd public/h5p/libraries
h5p get <library-name>
```

### To add real H5P content:
1. Download .h5p files from h5p.org
2. Extract them to public/h5p/your-content/
3. Use the path to h5p.json in the H5PPlayer component
