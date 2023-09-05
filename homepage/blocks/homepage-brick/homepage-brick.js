import { getLibs } from '../../scripts/utils.js';

// size: [heading, body, ...detail]
// blockTypeSizes array order: heading, body, detail, button, link
const blockTypeSizes = {
  small: ['m', 's', 's', 'l', 's'],
  medium: ['l', 'm', 'm', 'l', 'm'],
  large: ['xl', 'm', 'l', 'l', 'm'],
  xlarge: ['xxl', 'l', 'xl', 'l', 'l'],
  'link': ['m', 'xs', 'm', 's', 'xs'],
  'news': ['s', 'm', 'm', 's', 'xs'],
  'full-desktop': ['xl', 'l', 'm', 'l', 'm'],
  default: ['m', 'm', 'l', 's', 'xs'],
};

function goToDataHref() {
  if (this.dataset.target === '_blank') {
    window.open(this.dataset.href, '_blank');
  } else {
    window.location.href = this.dataset.href;
  }
}

function getBlockSize(el) {
  const sizes = Object.keys(blockTypeSizes);
  return sizes.find((size) => el.classList.contains(size)) || sizes[7];
}

function decorateLinks(el, size) {
  const links = el.querySelectorAll('a:not(.con-button)');
  if (links.length === 0) return;
  links.forEach((link) => {
    if (
      link.closest('.section')
      && link.closest('.section').querySelector('.quick-tools-bar')
    ) {
      // link.setAttribute('class', 'con-button outline button-s');
      if (
        link.querySelector('img')
        && link.querySelector('img').getAttribute('alt')
      ) {
        link.insertAdjacentHTML(
          'beforeEnd',
          `<span class="spectrum-Button-label">${link
            .querySelector('img')
            .getAttribute('alt')}</span>`,
        );
      }

      // link.outerHTML = `<strong>${link.outerHTML}</strong>`;
    }
    const parent = link.closest('p, div');
    parent.setAttribute('class', `body-${size}`);
  });
}

function decorateBlockBg(block, node) {
  node.classList.add('background');
  if (!node.querySelector('img')) {
    node.style.background = node.textContent.trim();
    [...node.children].forEach((e) => {
      e.remove();
    });
  } else {
    node.classList.add('background');
    if (node.childElementCount > 1) {
      const viewports = ['mobileOnly', 'tabletOnly', 'desktopOnly'];
      if (node.childElementCount === 2) {
        node.children[0].classList.add(viewports[0], viewports[1]);
        node.children[1].classList.add(viewports[2]);
      } else {
        [...node.children].forEach((e, i) => {
          e.classList.add(viewports[i]);
        });
      }
    }

    [...node.children].forEach((e) => {
      const image = e.querySelector('img');
      if (image) {
        const text = e.textContent.trim();
        if (text !== '') {
          //const points = text?.slice(text.indexOf(':') + 1).split(',');
          const [x, y = '', s = ''] = text.split(',');
          image.style.objectPosition = `${x.trim().toLowerCase()} ${y.trim().toLowerCase()}`;
          if (s !== '') image.style.objectFit = s.trim().toLowerCase();
          const picture = e.querySelector('picture');
          e.innerHTML = picture.outerHTML;
        }
      }
    });
  }
}

function enforceHeaderLevel(node, level) {
  const clone = document.createElement(`H${level}`);
  for (const attr of node.attributes) {
    clone.setAttribute(attr.name, attr.value);
  }
  clone.innerText = node.innerText;
  node.replaceWith(clone);
}

export default async function init(el) {
  el.classList.forEach((className) => {
    if (className.includes('-grid')) {
      el.closest('.fragment')?.parentNode.classList.add(className);
    }
  });

  if (document.querySelector('.homepage-link-bar:not(.custom-bg)')) {
    document.querySelector('.section.masonry')?.classList.add('small-top-padding');
  }
  
  const { decorateButtons, decorateBlockText } = await import(`${getLibs()}/utils/decorate.js`);
  const { decorateDefaultLinkAnalytics, createTag } = await import(`${getLibs()}/utils/utils.js`);

  const blockSize = getBlockSize(el);
  decorateButtons(el, `button-${blockTypeSizes[blockSize][3]}`);
  decorateLinks(el, blockTypeSizes[blockSize][4]);
  let rows = el.querySelectorAll(':scope > div');

  await decorateDefaultLinkAnalytics(el);

  if (el.classList.contains('link')) {
    const background = createTag('div', { class: 'background first-background' }, false);
    el.prepend(background);
    if (rows.length === 2) {
      const [left, right] = rows;
      const rightColumn = right.querySelector(':scope > div');
      left.appendChild(rightColumn);
      right.remove();
    }
    if (!el.classList.contains('split-background')) {
      const highlight = createTag('div', { class: 'highlight-row' }, false);
      el.prepend(highlight);
    } 
  } else if (el.classList.contains('news') && rows.length > 1) {
    const [highlight, ...tail] = rows;
    highlight.classList.add('highlight-row');
    rows = tail;
  } else {
    let [head, ...tail] = rows;
    const classList = el.className.split(' ');
    classList.splice(1, 0, 'click');
    el.className = classList.join(' ');
    if (rows.length > 1) {
      decorateBlockBg(el, head);
      head.classList.add('first-background');
      rows = tail;
      if (rows.length > 1) {
        [head, ...tail] = rows;
        decorateBlockBg(el, head);
        rows = tail;
      }
    }
  }

  const headers = el.querySelectorAll('h1, h2, h3, h4, h5, h6, .highlight-row > *');
  headers.forEach((header, counter) => {
    if (!counter) {
      enforceHeaderLevel(header, 3);
    } else {
      enforceHeaderLevel(header, 4);
    }
  });
  const config = blockTypeSizes[blockSize];
  const overrides = ['-heading', '-body', '-detail'];
  overrides.forEach((override, index) => {
    const hasClass = [...el.classList].filter((listItem) => listItem.includes(override));
    if (hasClass.length) config[index] = hasClass[0].split('-').shift().toLowerCase();
  });
  decorateBlockText(el, config);
  rows.forEach((row) => { row.classList.add('foreground'); });

  if (el.classList.contains('click')) {
    const link = el.querySelector('a');
    const foreground = el.querySelector('.foreground');
    if (link && foreground) {
      foreground.dataset.href = link.href;
      if (link.hasAttribute('target')) {
        foreground.dataset.target = link.getAttribute('target');
      }
      foreground.setAttribute('daa-ll', link.getAttribute('daa-ll'));
      const div = createTag('div', { class: 'click-link' }, link.innerText);
      link.insertAdjacentElement('beforebegin', div);
      link.remove();

      foreground.addEventListener('click', goToDataHref);
    }
  }
}
