import { Component } from '../component';
import { favoritesService } from '../../services/favorites.service';
import html from './favorites.tpl.html';
import { sendEvent } from '../../../src/utils/helpers';

import { ProductList } from '../productList/productList';

class Catalog extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.favorites);
  }

  async render() {
    this.productList.update(await favoritesService.get());

    sendEvent({
      type: 'route',
      payload: { url: window.location.href },
      timestamp: Date.now().toString()
    });
  }
}

export const favoritesComp = new Catalog(html);
