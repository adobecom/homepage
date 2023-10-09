import { getLibs } from '../../scripts/utils.js';

export default async function init(el) {
  const section = el.parentNode;
  const nestedMetadata = el.parentNode.querySelectorAll(':scope > div.homepage-nested-metadata');
  if (nestedMetadata.length >= 2 && el === nestedMetadata[0]) {
    const children = section.children;
    var childArray = Array.prototype.slice.call(children);
    const beginIdx = childArray.indexOf(nestedMetadata[0]);
    const endIdx = childArray.indexOf(nestedMetadata[1]);
      const miloLibs = getLibs();
      const { createTag } = await import(`${miloLibs}/utils/utils.js`);
      const nestedSection = createTag('div', { class: `section masonry masonry-up` }, false);
      for (let i = beginIdx + 1; i < endIdx; i++) nestedSection.appendChild(childArray[i]);
      section.insertBefore(nestedSection, nestedMetadata[0]);
      nestedMetadata[0].remove();
      nestedMetadata[1].remove();
  }
}
