/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Global types for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// H5P types
declare module 'h5p-standalone' {
  export interface H5PConfig {
    id?: string;
    title?: string;
    frameCss: string;
    frameJs: string;
    h5pJsonPath?: string;
    librariesPath?: string;
    contentJsonPath?: string;
    frame?: boolean;
    copyright?: boolean;
    export?: boolean;
    icon?: boolean;
    fullScreen?: boolean;
    embed?: boolean;
    copy?: boolean;
    embedCode?: string;
    resizeCode?: string;
    downloadUrl?: string;
    customCss?: string[];
    customJs?: string[];
    xAPIObjectIRI?: string;
    preventH5PInit?: boolean;
    embedType?: 'div' | 'iframe';
  }

  export class H5PStandalone {
    constructor(element: HTMLElement, config: H5PConfig);
    librariesPath: string;
    contentId: string;
    
    // Event methods
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    trigger(event: string, data?: any): void;
    
    // Content methods
    getScore(): number;
    getMaxScore(): number;
    getAnswerGiven(): boolean;
    getCurrentState(): any;
    resize?(): void;
  }

  export default H5PStandalone;
}

declare module 'h5p-standalone';

export {}
