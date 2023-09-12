import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../homepage/blocks/homepage-brick/homepage-brick.js');

describe('homepage-brick block', () => {
  const blocks = document.querySelectorAll('.homepage-brick');
  blocks.forEach((block) => {
    init(block);
  });
  describe('click', () => {
    it('has 2 backgrounds', () => {
      console.log(blocks[0]);
      const directChildren = blocks[0].querySelectorAll(':scope > div');
      expect(directChildren.length).to.equal(3);
      expect(directChildren[0].className).to.equal('background first-background');
      expect(directChildren[1].className).to.equal('background');
      expect(directChildren[2].className).to.equal('foreground');
    });
  });
});
