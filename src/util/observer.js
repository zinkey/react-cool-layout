import ResizeObserver from 'resize-observer-polyfill';
import 'mutationobserver-shim';

const get = (dom) => {
  const obj = getComputedStyle(dom);
  return {
    width: parseFloat(obj.width) || 0,
    height: parseFloat(obj.height) || 0,
    left: parseFloat(obj.left) || 0,
    top: parseFloat(obj.top) || 0,
  };
};

const observer = (dom, cb) => {
  const resizeObserver = new ResizeObserver(() => cb(get(dom)));
  resizeObserver.observe(dom);
  const mutationObserver = new MutationObserver(() => cb(get(dom)));
  mutationObserver.observe(dom, { attributes: true, childList: false, characterData: false });
  return () => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
  };
};

export default observer;
