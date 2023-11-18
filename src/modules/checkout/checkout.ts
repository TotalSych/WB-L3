import { Component } from '../component';
import { Product } from '../product/product';
import html from './checkout.tpl.html';
import { formatPrice, sendEvent } from '../../utils/helpers';
import { cartService } from '../../services/cart.service';
import { ProductData } from 'types';

class Checkout extends Component {
  products!: ProductData[];

  constructor(props: any) {
    super(props);
  }

  async render() {
    this.products = await cartService.get();

    if (this.products.length < 1) {
      this.view.root.classList.add('is__empty');
      return;
    }

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: true });
      productComp.render();
      productComp.attach(this.view.cart);
    });

    const totalPrice = this.products.reduce((acc, product) => (acc += product.salePriceU), 0);
    this.view.price.innerText = formatPrice(totalPrice);

    this.view.btnOrder.onclick = this._makeOrder.bind(this);

    sendEvent({
      type: 'route',
      payload: { url: window.location.href },
      timestamp: Date.now().toString()
    });
  }

  private async _makeOrder() {
    await cartService.clear();
    fetch('/api/makeOrder', {
      method: 'POST',
      body: JSON.stringify(this.products)
    });
    let totalPrice = 0;
    const productIds: number[] = [];
    this.products.forEach((product) => {
      totalPrice += product.price;
      productIds.push(product.id);
    });
    window.location.href = '/?isSuccessOrder';
    sendEvent({
      type: 'purchase',
      payload: {
        orderId: '123',
        totalPrice,
        productIds
      },
      timestamp: Date.now().toString()
    });
  }
}

export const checkoutComp = new Checkout(html);
