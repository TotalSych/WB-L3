import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import html from './searchHints.tpl.html';

export class SearchHints {
  view: View;
  hints: Array<string>;

  constructor(hints: Array<string>) {
    this.hints = hints;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  render() {
    const hintsLastCommaIndex = this.hints.length - 2;
    this.view.root.innerHTML = `<span>Например,</span>`;
    this.hints.forEach((hint, index) => {
      this.view.root.insertAdjacentHTML(
        'beforeend',
        `<div class="search-hints__item"><span class="search-hints__item-text">${hint}</span></div>`
      );
      if (index < hintsLastCommaIndex) {
        this.view.root.insertAdjacentHTML('beforeend', `<span class="search-hints__comma">,</span>`);
      } else if (index === hintsLastCommaIndex) {
        this.view.root.insertAdjacentHTML('beforeend', `<span>или</span>`);
      }
    });
  }
}
