/* H5P Object Verification Script */
console.log('🔍 H5P Verify Objects Script loaded');

// Check if critical H5P objects are available
function verifyH5PObjects() {
  const checks = {
    'window.H5P': !!window.H5P,
    'window.H5P.EventDispatcher': !!window.H5P?.EventDispatcher,
    'window.H5P.EventDispatcher.prototype': !!window.H5P?.EventDispatcher?.prototype,
    'window.H5P.jQuery': !!window.H5P?.jQuery,
    'window.$': !!window.$,
    'typeof window.$': typeof window.$,
    'window.H5PIntegration': !!window.H5PIntegration
  };
  
  console.log('🔍 H5P Object Verification:', checks);
  
  // Test EventDispatcher instantiation
  if (window.H5P?.EventDispatcher) {
    try {
      const testDispatcher = new window.H5P.EventDispatcher();
      console.log('✅ EventDispatcher instantiation test successful');
    } catch (e) {
      console.error('❌ EventDispatcher instantiation failed:', e);
    }
  }
  
  // Test prototype access (this is what was failing)
  if (window.H5P?.EventDispatcher?.prototype) {
    try {
      const testPrototype = Object.create(window.H5P.EventDispatcher.prototype);
      console.log('✅ EventDispatcher.prototype access test successful');
    } catch (e) {
      console.error('❌ EventDispatcher.prototype access failed:', e);
    }
  }
  
  return checks;
}

// Run verification immediately
verifyH5PObjects();

// Also run verification after a short delay to catch late initialization
setTimeout(() => {
  console.log('🔍 H5P Object Verification (delayed):');
  verifyH5PObjects();
}, 1000);

// Monitor for script loading (to catch when library scripts are loaded)
const originalAppendChild = document.head.appendChild;
document.head.appendChild = function(element) {
  if (element.tagName === 'SCRIPT' && element.src) {
    console.log('📜 Script loading:', element.src);
    if (element.src.includes('h5p') || element.src.includes('joubel')) {
      console.log('🔍 H5P library script detected, verifying objects...');
      verifyH5PObjects();
    }
  }
  return originalAppendChild.call(this, element);
};
