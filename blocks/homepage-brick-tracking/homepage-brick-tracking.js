export default async function init(el) {
  const section = el.closest('.section');
  if (section) {
    section.querySelectorAll(':scope > div:not(.section-metadata):not(.homepage-brick-tracking)')
      .forEach((brick, i) => {
        const daaLh = brick.getAttribute('daa-lh');
        if (daaLh) {
          brick.setAttribute('daa-lh', `${daaLh}|brick-${i}`);
        } else {
          brick.setAttribute('daa-lh', `brick-${i}`);
        }
      });
  }
}
