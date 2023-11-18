import localforage from 'localforage';
import { ProductData } from 'types';

const DB = '__wb-favorites';

class FavoriteService {
  init() {
    this._updCounters();
  }

  async addFavorite(favorite: ProductData) {
    const isInFavorites = await this.isInFavorites(favorite);
    if (isInFavorites) {
      return;
    }
    const favorites = await this.get();
    await this.set([...favorites, favorite]);
  }

  async removeFavorite(favorite: ProductData) {
    const favorites = await this.get();
    await this.set(favorites.filter(({ id }) => id !== favorite.id));
  }

  async clear() {
    await localforage.removeItem(DB);
    this._updCounters();
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(DB)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(DB, data);
    this._updCounters();
  }

  async isInFavorites(favorite: ProductData) {
    const favorites = await this.get();
    return favorites.some(({ id }) => id === favorite.id);
  }

  private async _updCounters() {
    const favorites = await this.get();
    const count = favorites.length;
    if (count > 0) {
      document.querySelector('.js__favorites')?.classList.remove('hidden');
    }
  }
}

export const favoritesService = new FavoriteService();
