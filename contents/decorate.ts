import "data-text:./decorate.css"
import $ from "jquery"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["*://github.com/*"]
}

class Decorator {
  owner: string;
  repo: string;

  constructor() {
    const author = document.querySelector('.author');
    if (author) {
      this.owner = author.textContent.trim();
      this.repo = author.nextElementSibling.nextElementSibling.textContent.trim();
    }
  }

  isPublic(): boolean {
    const isPublic = document.querySelector('.entry-title');
    return isPublic && isPublic.classList.contains('public');
  }

  img(src: string, alt: string, className?: string): string {
    return `<img src="${src}" alt="${alt}" class="${className || ''}" />`;
  }

  row(data: any): string {
    const tmpl = `<a class="select-menu-item js-navigation-item" title="${data.name}" role="menuitem" tabindex="0" href="${data.url}">
      ${this.img(data.icon, '', 'octicon select-menu-item-icon')}
      <div class="select-menu-item-text">
        <span class="select-menu-item-heading">
          ${data.badge ? this.img(data.badge, data.name) : data.name}
        </span>
      </div>
    </a>`;
    return tmpl.replace(/:owner/g, this.owner).replace(/:repo/g, this.repo);
  }

  addTab(items: any[]): void {
    const target = document.querySelector('.reponav');
    if (!target || document.querySelector('.reponav .omnibox-badges')) return; // Already exists

    const element = document.createElement('span');
    element.className = 'select-menu js-menu-container js-select-menu dropdown omnibox-badges';
    const tab = `
      <a class="reponav-item select-menu-button" href="#">
        <svg height="16" width="12" class="octicon octicon-server">...</svg> Badges
      </a>
      <div class="select-menu-modal-holder">
        <div class="select-menu-modal js-menu-content omnibox">
          <div class="select-menu-header">
            <span class="select-menu-title">Github Omnibox</span>
          </div>
          <div class="select-menu-list js-navigation-container" role="menu">
            ${items.map(item => this.row(item)).join('')}
          </div>
        </div>
      </div>`;
    element.innerHTML = tab;
    target.appendChild(element);

    // Event handling for dropdown
  }

  addUrl(): void {
    // Logic from original addUrl method
  }
}

const menu = [
    { name: 'Gitter Chat', icon: '...', badge: '...', url: '...' },
    // ... other menu items
];

function runDecorator() {
    const page = new Decorator();
    if (page.isPublic()) {
        page.addUrl();
        chrome.storage.sync.get({ menu: menu }, (data) => {
            page.addTab(data.menu);
        });
    }
}

// Run on initial load
runDecorator();

// Run on GitHub's PJAX navigation
$(document).on('pjax:complete', runDecorator);
