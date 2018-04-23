const callbacks = [];
let running = false;

const resize = () => {
  if (!running) {
    running = true;
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(runCallbacks);
    } else {
      setTimeout(runCallbacks, 66);
    }
  }
};

const runCallbacks = () => {
  callbacks.forEach(cb => cb());
  running = false;
};

export default (cb) => {
  if (callbacks.length === 0) {
    window.addEventListener('resize', resize);
  }
  callbacks.push(cb);
  return () => {
    const index = callbacks.indexOf(cb);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
    if (callbacks.length === 0) {
      window.removeEventListener('resize', resize);
    }
  };
};
