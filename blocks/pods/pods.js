import { decorateButtons, decorateBlockText } from '../../utils/decorate.js';
import { decorateBlockAnalytics, decorateLinkAnalytics } from '../../martech/attributes.js';

// size: [heading, body, ...detail]
// blockTypeSizes array order: heading, body, detail, button, link
const blockTypeSizes = {
  small: ['m', 's', 's', 'l', 's'],
  medium: ['l', 'm', 'm', 'l', 'm'],
  large: ['xl', 'm', 'l', 'l', 'm'],
  xlarge: ['xxl', 'l', 'xl', 'l', 'l'],

  /* TODO: add this to CSS */
  podFullSizePodDesktop: ['xl', 'm', 'l', 'm'],

  'link-pod': ['m', 'xs', 'm', 's', 'xs'],
  'news-pod': ['s', 'm', 'm', 's', 'xs'],
  'quick-tools-bar': ['l', 'l', 'm', 's', 'xs'],
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
  const sizes = ['small', 'medium', 'large', 'xlarge', 'link-pod', 'news-pod', 'quick-tools-bar', 'default'];
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

function getBlockSegmentBackground(el) {
  const image = el.querySelector('img');
  const text = el.textContent.trim();
  let background = false;
  if (image) {
    background = `url(${image.getAttribute('src')})`;
  } if (text !== '') {
    background = text;
  }
  el.remove();
  return background;
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
      const p = e.querySelectorAll('p');
      if (image && p.length > 1) {
        const text = p[1].textContent.trim();
        if (text !== '') {
          const points = text?.slice(text.indexOf(':') + 1).split(',');
          const [x, y = '', s = ''] = points;
          image.style.objectPosition = `${x.trim().toLowerCase()} ${y.trim().toLowerCase()}`;
          if (s !== '') image.style.objectFit = s.trim().toLowerCase();
          const picture = e.querySelector('picture');
          e.insertBefore(picture, p[0]);
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

export default function init(el) {
  const blockSize = getBlockSize(el);
  decorateButtons(el, `button-${blockTypeSizes[blockSize][3]}`);
  decorateLinks(el, blockTypeSizes[blockSize][4]);
  let rows = el.querySelectorAll(':scope > div');

  let [head, ...tail] = rows;
  if (rows.length > 1) {
    decorateBlockBg(el, head);
    rows = tail;
    if (rows.length > 1 && el.classList.contains('two-backgrounds')) {
      [head, ...tail] = rows;
      decorateBlockBg(el, head);
      rows = tail;
    }
  }

  const backgrounds = {};
  if (el.classList.contains('highlight-background')) {
    [head, ...tail] = rows;
    if (tail.length) backgrounds.highlight = getBlockSegmentBackground(head);
    rows = tail;
  }

  if (el.classList.contains('link-pod') && el.classList.contains('split-background')) {
    [head, ...tail] = rows;
    const split = head.querySelectorAll(':scope > div');
    if (split.length > 1) {
      const part1 = el.querySelector(':scope > div:last-child > div:first-child');
      backgrounds.part1 = getBlockSegmentBackground(split[0]);
      if (part1 && backgrounds.part1) part1.style.background = backgrounds.part1;
      const part2 = el.querySelectorAll(':scope > div:last-child > div:last-child');
      backgrounds.part2 = getBlockSegmentBackground(split[1]);
      if (part2 && backgrounds.part2) part2.style.background = backgrounds.part2;
    }
    rows = tail;
  }

  if (el.classList.contains('highlight')) {
    [head, ...tail] = rows;
    head.classList.add('highlight-row');
    if (head.textContent.trim() === '') {
      head.classList.add('highlight-empty');
    }
    if (backgrounds.highlight) head.style.background = backgrounds.highlight;
    rows = tail;
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

  decorateBlockAnalytics(el);
  const heading = el.querySelector('h3, h4');
  const text = heading.closest('.foreground') || heading.closest('.highlight-row');
  decorateLinkAnalytics(text, headers);

  if (el.classList.contains('link-pod') || el.classList.contains('click-pod') || el.classList.contains('news-pod')) {
    const links = el.querySelectorAll('a');
    if (el.classList.contains('click-pod') && links.length) {
      const link = links[0];
      el.dataset.href = link.href;
      if (link.hasAttribute('target')) {
        el.dataset.target = link.getAttribute('target');
      }
      if (link.hasAttribute('daa-ll')) {
        el.setAttribute('id', `${el.getAttribute('daa-lh')}|${text.getAttribute('daa-lh')}|${link.getAttribute('daa-ll')}`);
        el.setAttribute('daa-ll', `${el.getAttribute('daa-lh')}|${text.getAttribute('daa-lh')}|${link.getAttribute('daa-ll')}`);
        el.removeAttribute('daa-lh');
        text.removeAttribute('daa-lh');
        link.removeAttribute('daa-ll');
      }
      el.addEventListener('click', goToDataHref);
    }
  }
}
