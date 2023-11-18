import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';

import { ProductList } from '../productList/productList';
import { SearchHints } from '../searchHints/searchHints';

class Homepage extends Component {
  popularProducts: ProductList;
  searchHints: SearchHints;

  constructor(props: any) {
    super(props);

    this.popularProducts = new ProductList();
    this.popularProducts.attach(this.view.popular);
    this.searchHints = new SearchHints(['чехол iphone 13 pro', 'коляски agex', 'яндекс станция 2']);
    this.searchHints.attach(this.view.searchHints);
  }

  render() {
    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.popularProducts.update(products);
      });

    const isSuccessOrder = new URLSearchParams(window.location.search).get('isSuccessOrder');
    if (isSuccessOrder != null) {
      const $notify = addElement(this.view.notifies, 'div', { className: 'notify' });
      addElement($notify, 'p', {
        innerText:
          'Заказ оформлен. Деньги спишутся с вашей карты, менеджер может позвонить, чтобы уточнить детали доставки'
      });
    }
    this.searchHints.render();
  }
}

export const homepageComp = new Homepage(html);
