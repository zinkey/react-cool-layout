import ResizeObserver from 'resize-observer-polyfill';
import 'mutationobserver-shim';

const get = (dom) => {
  const obj = getComputedStyle(dom);
  return {
    width: parseFloat(obj.width),
    height: parseFloat(obj.height),
    left: parseFloat(obj.left),
    top: parseFloat(obj.top),
  };
};

const observer = (dom, cb) => {
  new ResizeObserver(() => cb(get(dom))).observe(dom);
  const observer = new MutationObserver(() => cb(get(dom)));
  const config = { attributes: true, childList: false, characterData: false };
  observer.observe(dom, config);
};

export default observer;
