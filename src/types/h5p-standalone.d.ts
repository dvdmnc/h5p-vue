declare module 'h5p-standalone' {
  interface H5PStandaloneOptions {
    id?: string;
    h5pJsonPath: string;  // Should point to folder containing h5p.json, not the file itself
    frameJs: string;      // Path to frame.bundle.js
    frameCss: string;     // Path to h5p.css
    librariesPath?: string; // Path to H5P libraries folder
    frame?: boolean;      // Show H5P frame (default: true)
    copyright?: boolean;  // Show copyright button (default: true)
    export?: boolean;     // Show export button (default: false)
    embed?: boolean;      // Show embed button (default: false)
    icon?: boolean;       // Show H5P icon (default: true)
    fullScreen?: boolean; // Enable fullscreen (default: true)
    copy?: boolean;       // Enable copy functionality (default: false)
    resize?: boolean;     // Enable resize functionality (default: true)
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

  // Support for both default and named export
  export default class H5PStandalone {
    constructor(element: HTMLElement, options: H5PStandaloneOptions);
    on(event: string, callback: (data?: any) => void): void;
    off(event: string, callback?: (data?: any) => void): void;
    trigger(event: string, data?: any): void;
    getInstance(): any;
    getContent(): any;
    getCurrentState(): any;
    setCurrentState(state: any): void;
  }
}
