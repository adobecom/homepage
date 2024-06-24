import { getLibs } from '../../../utils.js';

// size: [heading, body, ...detail]
// blockTypeSizes array order: heading, body, detail, button, link
const blockTypeSizes = {
  small: ['m', 's', 's', 'l', 's'],
  medium: ['l', 'm', 'm', 'l', 'm'],
  large: ['xl', 'm', 'l', 'l', 'm'],
  xlarge: ['xxl', 'l', 'xl', 'l', 'l'],
  'link': ['m', 'xs', 'm', 's', 'xs'],
  'prioritized-placement&news': ['xs', 'xs', 'xxl', 'l', 'm'], // ace0861 additional scheme order: news item heading, news item body, detail, button, link - [2] is headline
  'news': ['xs', 's', 'm', 's', 'xs'], 
  'prioritized-placement&above-pods': ['xxl', 'l', 'l', 'l', 'm'], // ace0861 additional scheme
  'prioritized-placement&includes-pods': ['xxl', 'm', 'l', 'l', 'm'], // ace0861 additional scheme
  'above-pods': ['xxl', 'm', 'l', 'xl', 'm'],
  'full-desktop': ['xl', 'l', 'm', 'l', 'm'],
  default: ['m', 'm', 'l', 'l', 'xs'],
};

function getBlockSize(el) {
  const sizes = Object.keys(blockTypeSizes); 
  return sizes.find((size) => {
    const sizeList = size.split('&');
    if (el.classList.contains(sizeList[0])
      && (sizeList.length === 1 || el.classList.contains(sizeList[1]))) {
      return size; 
    }
  }) || sizes[sizes.length - 1];
}

function decorateBlockBg(node) {
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

function decorateFillButtons(actionArea) {
  if (!actionArea) return;
  const btns = actionArea.querySelectorAll('a.con-button.blue');
  btns.forEach((b) => {
    b.classList.remove('blue');
    b.classList.add('fill');
  });
}

export default async function init(el) {
  el.classList.forEach((className) => {
    if (className.includes('-grid')) {
      el.closest('.fragment')?.parentNode.classList.add(className);
    }
  });

  const linkParentNode = el.querySelector('a').parentNode;
  const linkParentNodeName = linkParentNode.nodeName === 'CHECKOUT-LINK' ? linkParentNode.parentNode.nodeName : linkParentNode.nodeName;
  const miloLibs = getLibs();
  const { decorateButtons, decorateBlockText } = await import(`${miloLibs}/utils/decorate.js`);
  const { createTag } = await import(`${miloLibs}/utils/utils.js`);
  const blockSize = getBlockSize(el);
  //ace0861
  const [headingSize, bodySize, detailSize, buttonSize, linkSize] = blockTypeSizes[blockSize]; 
  decorateButtons(el, `button-${buttonSize}`);
  let rows = el.querySelectorAll(':scope > div');
  const headers = el.querySelectorAll('h1, h2, h3, h4, h5, h6, .highlight-row > *');

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
    let blockImage = tail[0].querySelector('picture');
    if (blockImage) {
      const column = createTag('DIV');
      column.appendChild(blockImage);
      const row = createTag('DIV');
      row.appendChild(column);
      decorateBlockBg(row);

      const newImageBlock = createTag('DIV', {class: 'homepage-brick news-block-image two-thirds-grid'});
      newImageBlock.appendChild(row);
      const section = createTag('DIV', {class: 'section masonry masonry-up news-section'});
      el.closest('.section').appendChild(section);
      section.appendChild(el);
      section.appendChild(newImageBlock);
    }
    el.querySelectorAll('a').forEach((a) => a.classList.add('body-xs'));
    rows = tail;
  } else if (el.classList.contains('above-pods')) {
    headers.forEach((header) => enforceHeaderLevel(header, 1));
    el.querySelectorAll('a.con-button').forEach((button) => button.classList.add('button-justified-mobile'));
  } else {
    if (rows.length > 1) {
      let [head, ...tail] = rows;
      decorateBlockBg(head);
      head.classList.add('first-background');
      rows = tail;
      if (rows.length > 1) {
        [head, ...tail] = rows;
        decorateBlockBg(head);
        rows = tail;
      }
      const links = el.querySelectorAll('a');
      if (links.length === 1) {
        el.classList.add('click');
      } else {
        el.classList.add('multi-link');
        const actionAreaSize = el.classList.contains('static-links') ? 'body-m': 'body-xs';
        links.forEach((a) => a.parentNode.className = `action-area ${actionAreaSize}`);
        if (el.classList.contains('icon-in-header')) {
          const header = el.querySelector('h1, h2, h3, h4, h5, h6');
          const icon = el.querySelector('picture');
          if (header && icon) {
            header.prepend(icon);
          }
        }
      }
    }
  }

  if (!el.classList.contains('above-pods')) {
    headers.forEach((header, counter) => {
      if (!counter && !el.classList.contains('news')) {
        enforceHeaderLevel(header, 3);
      } else if (!counter && el.classList.contains('news') && header.closest('.highlight-row')) {
        // ace0861
        enforceHeaderLevel(header, 2); 
      } else enforceHeaderLevel(header, 4);
    });
  }
  const config = blockTypeSizes[blockSize];
  const overrides = ['-heading', '-body', '-detail'];
  overrides.forEach((override, index) => {
    const hasClass = [...el.classList].filter((listItem) => listItem.includes(override));
    if (hasClass.length) config[index] = hasClass[0].split('-').shift().toLowerCase();
  });
  decorateBlockText(el, config);
  // ace0861
  if (el.classList.contains('news') && el.classList.contains('prioritized-placement')) {
    el.querySelector('.highlight-row h2').className = `heading-${detailSize}`;
  }
  if (el.classList.contains('button-fill')) decorateFillButtons(el.querySelector('.action-area'));
  rows.forEach((row) => { row.classList.add('foreground'); });

  if (el.classList.contains('click')) {
    const { decorateDefaultLinkAnalytics } = await import(`${miloLibs}/martech/attributes.js`);
    await decorateDefaultLinkAnalytics(el);
    const link = el.querySelector('a');
    const foreground = el.querySelector('.foreground');
    if (link && foreground) {
      let href = link.href;
      let modalLink = false;
      if (link.dataset.modalPath && link.dataset.modalHash) {
        modalLink = true;
        href = `${window.location.origin}${link.dataset.modalPath}${link.dataset.modalHash}`;
      }
      const attributes = {
        class: 'foreground',
        href: href,
        'daa-ll': link.getAttribute('daa-ll')
      };
      if (link.hasAttribute('target')) attributes.target = link.getAttribute('target')
      const divLinkClass = linkParentNodeName === 'P' ? 'click-link body-xs' : link.className;
      const divLink = createTag('div', { class: divLinkClass }, link.innerText);
      link.insertAdjacentElement('beforebegin', divLink);
      foreground.insertAdjacentElement('beforebegin', link);
      link.innerHTML = '';
      link.classList.add('foreground');
      link.classList.remove('con-button', 'button-l', 'blue');
      link.append(...foreground.childNodes);
      foreground.remove();
    }
  }

  const detail = el.querySelector('p[class*="detail"]');
  if (detail) {
    const icon = detail.querySelector('img');
    if (icon) detail.classList.add('icon-detail');
  }
}
