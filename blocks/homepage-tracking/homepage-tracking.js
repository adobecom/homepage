export function decorateBlockAnalytics(el) {
  let blockNumber = 'unknown';
  if (el.closest('header')) {
    blockNumber = 'header';
  } else if (el.closest('footer')) {
    blockNumber = 'footer';
  } else {
    const blocks = Array.prototype.slice.call(document.querySelectorAll('main .section > div[class]:not(.section-metadata)'));
    blockNumber = `b${blocks.indexOf(el) + 1}`;
  }
  const manifestId = el.dataset.manifestId ? el.dataset.manifestId: 'default';
  el.setAttribute('daa-im', 'true');
  el.setAttribute('daa-lh', `${blockNumber}|${manifestId}|${[...el.classList].slice(0, 2).join('--')}`);
}

export function decorateLinkAnalytics(el) {
  let header = '';
  let linkCount = 1;
  el.querySelectorAll('h1, h2, h3, h4, h5, h6, a, button').forEach((item) => {
    if (item.nodeName === 'A' || item.nodeName === 'BUTTON') {
      item.setAttribute('daa-ll', `${item.textContent?.slice(0, 20)}-${linkCount}|${header?.slice(0, 30)}`);
      linkCount++;
    } else {
      header = item.textContent;
    }
  });
}

export default async function init(el) {
  const marquee = document.querySelector('.marquee');
  if (marquee) {
    decorateBlockAnalytics(marquee);
    decorateLinkAnalytics(marquee);
  } else {
    setTimeout(function () {
      init();
    }, 500);
  }
}
