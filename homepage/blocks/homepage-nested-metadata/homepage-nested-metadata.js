import { getLibs } from '../../scripts/utils.js';

export default async function init(el) {
  if (el.classList.contains('begin')) {
    const section = el.parentNode;
    const end = el.parentNode.querySelector(':scope > div.homepage-nested-metadata.end');
    if (end) {
      const children = section.children;
      var childArray = Array.prototype.slice.call(children);
      const beginIdx = childArray.indexOf(el);
      const endIdx = childArray.indexOf(end);
      if (endIdx > beginIdx) {
        const miloLibs = getLibs();
        const style = el.classList.contains('masonry') ? ' masonry masonry-up' : '';
        const key = el.querySelector(':scope > div:nth-child(1) > div:nth-child(1)')?.textContent;
        const { createTag } = await import(`${miloLibs}/utils/utils.js`);
        const nested = createTag('div', { class: `section${style}` }, false);
        for (let i = beginIdx + 1; i < endIdx; i++) nested.appendChild(childArray[i]);
        section.insertBefore(nested, el);
        end.remove();
        el.remove();
      }
    }
  }
}
