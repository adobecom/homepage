import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setLibs } from '../../../homepage/scripts/utils.js';

setLibs('/libs');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../homepage/blocks/homepage-link-bar/homepage-link-bar.js');

describe('homepage-link-bar block', () => {
  const blocks = document.querySelectorAll('.homepage-link-bar');
  describe('homepage-link-bar', () => {
    it('modifies all needed elements', async () => {
      const block = blocks[0];
      await init(block);
      expect(block.className).to.equal('homepage-link-bar justified custom-bg button-count-5');
      const directChildren = block.querySelectorAll(':scope > *');
      expect(directChildren.length).to.equal(2);
      expect(directChildren[0].classList.contains('header')).to.be.true;
      expect(directChildren[1].tagName).to.equal('UL');
      expect(directChildren[1].classList.contains('reset-list')).to.be.true;
      const listItems = block.querySelectorAll('ul.reset-list > li');
      expect(listItems.length).to.equal(5);
      expect(listItems[0].classList.contains('button-index-1')).to.be.true;
      const span = block.querySelector('span.icon.icon-edit-videos.margin-right');
      expect(span).to.be.exist;
      await init(blocks[1]);
    });
  });
});
