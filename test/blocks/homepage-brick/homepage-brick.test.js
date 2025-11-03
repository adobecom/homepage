import { readFile, sendMouse } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setLibs } from '../../../homepage/scripts/utils.js';

setLibs('/libs');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../homepage/blocks/homepage-brick/homepage-brick.js');

function getMiddleOfElement(element) {
  const { x, y, width, height } = element.getBoundingClientRect();

  return {
    x: Math.floor(x + window.pageXOffset + width / 2),
    y: Math.floor(y + window.pageYOffset + height / 2),
  };
}

describe('homepage-brick block', () => {
  const blocks = document.querySelectorAll('.homepage-brick');
  
  describe('click variant', () => {
    it('click variation', async () => {
      const block = blocks[0];
      await init(block);
      expect(block.className).to.equal('homepage-brick click');
      const directChildren = block.querySelectorAll(':scope > *');
      expect(directChildren.length).to.equal(3);
      expect(directChildren[0].className).to.equal('background first-background');
      expect(directChildren[1].className).to.equal('background');
      expect(directChildren[2].className).to.equal('foreground');
      expect(directChildren[2].getAttribute('target')).to.equal('_blank');
      const h2 = block.querySelector('h2');
      expect(h2).to.be.exist;
      expect(directChildren[2].className).to.equal('foreground');
    });
  });
  describe('news variant', () => {
    it('news variation', async () => {
      const block = blocks[1];
      await init(block);
      const highlightRow = block.querySelector('div.highlight-row');
      expect(highlightRow).to.be.exist;
    });
  });
  describe('link variant', () => {
    it('click variation', async () => {
      const block = blocks[2];
      await init(block);
      const directChildren = block.querySelectorAll(':scope > div');
      expect(directChildren.length).to.equal(3);
      expect(directChildren[0].className).to.equal('highlight-row');
      expect(directChildren[1].className).to.equal('background first-background');
      expect(directChildren[2].classList.contains('foreground')).to.be.true;
    });
  });
  describe('link variant with split background', () => {
    it('click variation', async () => {
      const block = blocks[3];
      await init(block);
      const directChildren = block.querySelectorAll(':scope > div');
      expect(directChildren.length).to.equal(2);
      expect(directChildren[0].className).to.equal('background first-background');
      expect(directChildren[1].classList.contains('foreground')).to.be.true;
    });
  });
  describe('miscellaneous', () => {
    it('masonry padding fix', () => {
      const section = document.querySelector('.section');
      expect(section.className).to.equal('section masonry');
    });
    init(blocks[4]);
    init(blocks[5]);
    init(blocks[6]);
    init(blocks[7]);
  });
});
