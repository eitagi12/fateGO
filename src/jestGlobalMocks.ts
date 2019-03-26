// global['CSS'] = null;

const mock = () => {
  let storage = {};
  return {
    getItem: key => key in storage ? storage[key] : null,
    setItem: (key, value) => storage[key] = value || '',
    removeItem: key => delete storage[key],
    clear: () => storage = {},
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    };
  }
});
/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

//
// Mock Canvas / Context2D calls
//
const mockCanvas = (window) => {
  window.HTMLCanvasElement.prototype.getContext = () => {
    return {
      fillRect: () => { },
      clearRect: () => { },
      getImageData: (x, y, w, h) => {
        return {
          data: new Array(w * h * 4)
        };
      },
      putImageData: () => { },
      createImageData: () => {
        return [];
      },
      setTransform: () => { },
      drawImage: () => { },
      save: () => { },
      fillText: () => { },
      restore: () => { },
      beginPath: () => { },
      moveTo: () => { },
      lineTo: () => { },
      closePath: () => { },
      stroke: () => { },
      translate: () => { },
      scale: () => { },
      rotate: () => { },
      arc: () => { },
      fill: () => { },
      measureText: () => {
        return { width: 0 };
      },
      transform: () => { },
      rect: () => { },
      clip: () => { },
    };
  };

  window.HTMLCanvasElement.prototype.toDataURL = () => {
    return '';
  };
};
mockCanvas(window);
