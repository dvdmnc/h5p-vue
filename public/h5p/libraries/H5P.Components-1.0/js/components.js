/**
 * H5P Components - Minimal implementation for button functionality
 */
var H5P = H5P || {};

H5P.Components = H5P.Components || {};

/**
 * Button component
 */
H5P.Components.Button = function(options) {
  var button = document.createElement('button');
  
  // Set button properties
  if (options.label) {
    button.textContent = options.label;
  }
  
  if (options.class) {
    button.className = options.class;
  }
  
  if (options.styleType) {
    button.classList.add('h5p-' + options.styleType);
  }
  
  if (options.icon) {
    var icon = document.createElement('span');
    icon.className = options.icon;
    button.appendChild(icon);
  }
  
  // Add click handler
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  // Handle href for anchor behavior
  if (options.href) {
    button.onclick = function(e) {
      if (options.onClick) {
        options.onClick(e);
      }
      if (!e.defaultPrevented) {
        window.location.href = options.href;
      }
    };
  }
  
  return button;
};
