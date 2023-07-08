export class BiomeJSONCache {
  private static instance: BiomeJSONCache;
  private cache: Record<string, any> = {};

  public static getInstance(): BiomeJSONCache {
    if (!BiomeJSONCache.instance) {
      BiomeJSONCache.instance = new BiomeJSONCache();
    }
    return BiomeJSONCache.instance;
  }

  public set(key: string, data: any): void {
    this.cache[key] = data;
  }

  public get(key: string): any {
    return this.cache[key];
  }
}

const biomeJSONCache = BiomeJSONCache.getInstance();

export default biomeJSONCache;
