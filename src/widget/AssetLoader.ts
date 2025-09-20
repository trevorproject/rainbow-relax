export interface AssetManifest {
  audio: {
    [key: string]: string;
  };
  images: {
    [key: string]: string;
  };
}

export class WidgetAssetLoader {
  private static instance: WidgetAssetLoader;
  private loadedAssets: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();
  
  private cdnBase = this.getDefaultCdnBase();
  
  private fallbackCdns = [
    'http://localhost:5173/src/assets', // Dev server
    './src/assets', // Local relative
    'https://raw.githubusercontent.com/trevorproject/rainbow-relax/main/src/assets', // GitHub
  ];

  private getDefaultCdnBase(): string {
    if (typeof window === 'undefined') return './src/assets';
    
    const currentUrl = window.location.href;
    
    if (currentUrl.includes('localhost:')) {
      const port = window.location.port;
      return `http://localhost:${port}/src/assets`;
    }
    
    if (currentUrl.startsWith('http://') || currentUrl.startsWith('https://')) {
      return './src/assets';
    }
    
    if (currentUrl.startsWith('file://')) {
      return '';
    }
    
    return './src/assets';
  }
  
  private manifest: AssetManifest = {
    audio: {
      'background': '/sounds/Background.mp3',
      'cycle-en': '/sounds/cycle-en.mp3',
      'cycle-es': '/sounds/cycle-es.mp3',
      'intro-en': '/sounds/intro-en.mp3',
      'intro-es': '/sounds/intro-es.mp3',
    },
    images: {
      'usa-flag': '/usa-flag.png',
      'mexico-flag': '/mexico-flag.png',
      'trevor-logo-en': '/TrevorLogo-en.svg',
      'trevor-logo-es': '/TrevorLogo-es.svg',
    }
  };

  public static getInstance(): WidgetAssetLoader {
    if (!WidgetAssetLoader.instance) {
      WidgetAssetLoader.instance = new WidgetAssetLoader();
    }
    return WidgetAssetLoader.instance;
  }

  public setCDNBase(url: string): void {
    this.cdnBase = url.replace(/\/$/, '');
  }

  public async preloadCriticalAssets(): Promise<void> {
    const criticalAssets = [
      this.loadAudio('background'),
      this.loadAudio('cycle-en'),
      this.loadAudio('cycle-es'),
      this.loadImage('usa-flag'),
      this.loadImage('mexico-flag'),
    ];

    try {
      await Promise.allSettled(criticalAssets);
    } catch {
      // Silently ignore preload failures
    }
  }

  public async loadAudio(key: string): Promise<string> {
    if (this.loadedAssets.has(`audio-${key}`)) {
      return this.loadedAssets.get(`audio-${key}`);
    }

    if (this.loadingPromises.has(`audio-${key}`)) {
      return this.loadingPromises.get(`audio-${key}`)!;
    }

    const promise = this.fetchAudioAsBlob(key);
    this.loadingPromises.set(`audio-${key}`, promise);

    try {
      const audioUrl = await promise;
      this.loadedAssets.set(`audio-${key}`, audioUrl);
      this.loadingPromises.delete(`audio-${key}`);
      return audioUrl;
    } catch (error) {
      this.loadingPromises.delete(`audio-${key}`);
      throw error;
    }
  }

  public async loadImage(key: string): Promise<string> {
    if (this.loadedAssets.has(`image-${key}`)) {
      return this.loadedAssets.get(`image-${key}`);
    }

    if (this.loadingPromises.has(`image-${key}`)) {
      return this.loadingPromises.get(`image-${key}`)!;
    }

    const promise = this.fetchImageAsBlob(key);
    this.loadingPromises.set(`image-${key}`, promise);

    try {
      const imageUrl = await promise;
      this.loadedAssets.set(`image-${key}`, imageUrl);
      this.loadingPromises.delete(`image-${key}`);
      return imageUrl;
    } catch (error) {
      this.loadingPromises.delete(`image-${key}`);
      throw error;
    }
  }

  public async getAudioUrl(key: string): Promise<string> {
    try {
      return await this.loadAudio(key);
    } catch (error) {
      console.warn(`Failed to load audio: ${key}`, error);
      return 'data:audio/mp3;base64,';
    }
  }

  public async getImageUrl(key: string): Promise<string> {
    try {
      return await this.loadImage(key);
    } catch (error) {
      console.warn(`Failed to load image: ${key}`, error);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    }
  }

  public isLoaded(type: 'audio' | 'image', key: string): boolean {
    return this.loadedAssets.has(`${type}-${key}`);
  }

  public getLoadingProgress(): number {
    const totalAssets = Object.keys(this.manifest.audio).length + Object.keys(this.manifest.images).length;
    const loadedAssets = this.loadedAssets.size;
    return Math.min(loadedAssets / totalAssets, 1);
  }

  public clearAssets(): void {
    for (const [, url] of this.loadedAssets) {
      if (typeof url === 'string' && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    }
    this.loadedAssets.clear();
    this.loadingPromises.clear();
  }

  private async fetchAudioAsBlob(key: string): Promise<string> {
    const audioPath = this.manifest.audio[key];
    if (!audioPath) {
      throw new Error(`Audio asset not found: ${key}`);
    }

    if (!this.cdnBase) {
      return 'data:audio/mp3;base64,';
    }

    const cdnsToTry = [this.cdnBase, ...this.fallbackCdns.filter(cdn => cdn)];
    
    for (let i = 0; i < cdnsToTry.length; i++) {
      const cdnBase = cdnsToTry[i];
      const url = `${cdnBase}${audioPath}`;
      
      if (url.startsWith('file://')) {
        continue;
      }
      
      try {
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }
      } catch {
        // Continue to next CDN
      }
    }
    
    return 'data:audio/mp3;base64,';
  }

  private async fetchImageAsBlob(key: string): Promise<string> {
    const imagePath = this.manifest.images[key];
    if (!imagePath) {
      throw new Error(`Image asset not found: ${key}`);
    }

    const url = `${this.cdnBase}${imagePath}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch {
      return url;
    }
  }
}

export const assetLoader = WidgetAssetLoader.getInstance();
