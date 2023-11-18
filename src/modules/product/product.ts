import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import { formatPrice, isElementInViewport, sendEvent } from '../../utils/helpers';
import html from './product.tpl.html';
import { ProductData } from 'types';

type ProductComponentParams = { [key: string]: any };

export class Product {
  view: View;
  product: ProductData;
  params: ProductComponentParams;
  isViewed: boolean;

  constructor(product: ProductData, params: ProductComponentParams = {}) {
    this.product = product;
    this.params = params;
    this.isViewed = false;
    this.view = new ViewTemplate(html).cloneView();
    document.addEventListener('scroll', this.hasEnteredViewport);
    window.addEventListener('close', () => {
      document.removeEventListener('scroll', this.hasEnteredViewport);
    });
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);

    if (this.params.isHorizontal) this.view.root.classList.add('is__horizontal');
  }

  hasEnteredViewport = async () => {
    if (this.isViewed || !['/', '/catalog'].includes(window.location.pathname)) {
      return;
    }
    if (isElementInViewport(this.view.root)) {
      this.isViewed = true;
      const secretKey = await fetch(`/api/getProductSecretKey?id=${this.product.id}`)
        .then((res) => res.json())
        .then((secretKey) => secretKey);
      sendEvent({
        type: this.product.log ? 'viewCardPromo' : 'viewCard',
        payload: {
          product: this.product,
          secretKey
        },
        timestamp: Date.now().toString()
      });
    }
  };
}
