const { DataSource } = require("apollo-datasource");
const { InMemoryLRUCache } = require("apollo-server-caching");
const DataLoader = require("dataloader");
const { musicAccessories } = require("./musicData");

class BrandAccessoryDataSource extends DataSource {
  constructor() {
    super();
    this.loader = new DataLoader((ids) => {
      return new Promise((resolve, reject) => {
        if (!ids.length) {
          resolve(musicAccessories);
        }
        setTimeout(
          () =>
            resolve(
              musicAccessories.filter((accessory) => ids.includes(accessory.id))
            ),
          5000
        );
      });
    });
  }

  initialize({ context, cache } = {}) {
    this.context = context;
    this.cache = cache || new InMemoryLRUCache();
  }

  didEncounterError(error) {
    throw new Error(`There was an error loading data: ${error}`);
  }

  cacheKey(id) {
    return `music-acc-${id}`;
  }

  cacheBrandKey(id) {
    return `brand-acc-${id}`;
  }

  async get(id) {
    const cacheDoc = await this.cache.get(this.cacheKey(id));
    if (cacheDoc) {
      return JSON.parse(cacheDoc);
    }
    const doc = await this.loader.load(id);
    this.cache.set(this.cacheKey(id), JSON.stringify(doc), { ttl: 15 });
    return doc;
  }

  async getByBrand(brand) {
    const cacheDoc = await this.cache.get(this.cacheBrandKey(brand.id));
    if (cacheDoc) {
      return JSON.parse(cacheDoc);
    }

    const musicBrandAccessories = await new Promise((resolve, reject) => {
      setTimeout(
        () =>
          resolve(
            musicAccessories.filter(
              (accessory) => accessory.brandId === brand.id
            )
          ),
        5000
      );
    });

    this.cache.set(
      this.cacheBrandKey(brand.id),
      JSON.stringify(musicBrandAccessories),
      { ttl: 15 }
    );

    return musicBrandAccessories;
  }
}

module.exports = { BrandAccessoryDataSource };
