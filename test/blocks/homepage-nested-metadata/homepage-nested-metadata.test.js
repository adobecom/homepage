import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setLibs } from '../../../homepage/scripts/utils.js';

setLibs('/libs');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../homepage/blocks/homepage-nested-metadata/homepage-nested-metadata.js');

describe('homepage-link-bar block', () => {
  describe('homepage-nested-metadata', () => {
    it('should move 2 blocks into a new section', async () => {
      const block = document.querySelector('.homepage-nested-metadata');
      await init(block);
      const sectionChildren = document.querySelectorAll('body > .section > div');
      expect(sectionChildren.length).to.equal(3);
      expect(sectionChildren[1].className).to.equal('section masonry masonry-up');
      const subSectionChildren = document.querySelectorAll('.section.masonry > div');
      expect(subSectionChildren.length).to.equal(2);
    });
  });
});
