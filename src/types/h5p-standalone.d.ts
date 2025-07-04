// Module declaration for h5p-standalone ES6 import usage
declare module 'h5p-standalone' {
  interface H5PStandaloneOptions {
    id?: string;
    h5pJsonPath: string;          // Path to folder containing h5p.json
    frameJs: string;              // Path to frame.bundle.js
    frameCss: string;             // Path to h5p.css
    librariesPath?: string;       // Path to H5P libraries folder
    contentJsonPath?: string;     // Path to content.json
    frame?: boolean;              // Show H5P frame (default: false)
    copyright?: boolean;          // Show copyright button (default: false)
    export?: boolean;             // Show export button (default: false)
    embed?: boolean;              // Show embed button (default: false)
    icon?: boolean;               // Show H5P icon (default: true)
    fullScreen?: boolean;         // Enable fullscreen (default: false)
    downloadUrl?: string;         // URL for download
    embedCode?: string;           // Embed code
    customCss?: string | string[]; // Custom CSS files
    customJs?: string | string[];  // Custom JS files
    reportingIsEnabled?: boolean;  // Enable reporting/submit button
    // User state & data
    contentUserData?: any[];      // Previous user state
    saveFreq?: number | false;    // Save frequency in seconds
    postUserStatistics?: boolean; // Post statistics on finish
    ajax?: {
      setFinishedUrl?: string;
      contentUserDataUrl?: string;
    };
    user?: {
      name: string;
      mail: string;
    };
  }

  class H5PStandaloneInstance {
    on(event: string, callback: (data?: any) => void): void;
    off(event: string, callback?: (data?: any) => void): void;
    trigger(event: string, data?: any): void;
    getInstance(): any;
    getContent(): any;
    getCurrentState(): any;
    setCurrentState(state: any): void;
  }

  // ES6 export
  export class H5P {
    constructor(element: HTMLElement, options: H5PStandaloneOptions);
    on(event: string, callback: (data?: any) => void): void;
    off(event: string, callback?: (data?: any) => void): void;
    trigger(event: string, data?: any): void;
    getInstance(): any;
    getContent(): any;
    getCurrentState(): any;
    setCurrentState(state: any): void;
  }

  // Default export (for compatibility)
  export default H5P;
}

// Global window extensions (if needed for mixed usage)
declare global {
  interface Window {
    H5P?: {
      externalDispatcher?: {
        on(event: string, callback: (data?: any) => void): void;
        off(event: string, callback?: (data?: any) => void): void;
        trigger(event: string, data?: any): void;
      };
    };
  }
}

export {};
