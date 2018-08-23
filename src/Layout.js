import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Map from './util/map';
import observer from './util/observer';
import resize from './util/resize';

const setStyle = (dom, type, val) => {
  let px;
  if (typeof val === 'string' && val.indexOf('%') > 0) {
    // percentage type
    px = val;
  } else {
    px = `${parseFloat(val)}px`;
  }
  if (dom.style[`__${type}`] === px) {
    return;
  }
  dom.style[`__${type}`] = px;
  dom.style[type] = px;
};

class ReactCoolLayout extends Component {

  constructor(props) {
    super(props);
    this.map = new Map()
    this.pageList = []
  }
  getChildContext() {
    return {
      env: {
        init: this.init.bind(this),
        dispose: this.dispose.bind(this),
      },
    };
  }



  init(instance) {
    this.map.set(instance, {
      effectComponent: [],
      listenPage: {},
      listen: {},
      cache: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      dispose: [],
    });
  }

  dispose(instance) {
    const value = this.map.get(instance);
    if (!value) {
      return;
    }
    value.dispose.forEach(dispose => dispose());
    this.map.delete(instance);
  }

  componentDidMount() {
    this.map.list.forEach(({ key, value }) => {
      const { defaultLeft, defaultTop, defaultWidth, defaultHeight } = key.props;
      ['width', 'height', 'left', 'top'].forEach((type) => {
        if (typeof key.props[type] !== 'undefined') {
          if (typeof key.props[type] === 'function') {
            const val = key.props[type]({
              get: (targetId) => {
                const target = this.map.list.find(item => item.key.props.id === targetId);
                if (target && target.value.effectComponent.indexOf(key) < 0) {
                  target.value.effectComponent.push(key);
                }

                if (target) {
                  const { defaultLeft, defaultTop, defaultWidth, defaultHeight } = target.key.props;
                  return {
                    width: defaultWidth,
                    height: defaultHeight,
                    left: defaultLeft,
                    top: defaultTop,
                  };
                }

                return {
                  width: 0,
                  height: 0,
                  left: 0,
                  top: 0,
                };
              },
              page: () => {
                if (!value.listenPage[type]) {
                  value.listenPage[type] = key.props[type];
                }
                return {
                  viewWidth: document.documentElement.clientWidth,
                  viewHeight: document.documentElement.clientHeight,
                  width: document.documentElement.scrollWidth,
                  height: document.documentElement.scrollHeight,
                };
              },
            });
            value.listen[type] = key.props[type];
            setStyle(key.dom, type, val);
          } else {
            setStyle(key.dom, type, key.props[type]);
          }
          this.props.onChange();
        }
      });
    });

    this.map.list.forEach(({ key, value }) => {
      for (const type in value.listenPage) {
        value.dispose.push(resize(() => {
          const val = value.listenPage[type]({
            get: (targetId) => {
              const target = this.map.list.find(item => item.key.props.id === targetId);
              if (!target) {
                return {
                  width: 0,
                  height: 0,
                  left: 0,
                  top: 0,
                };
              }
              return target.value.cache;
            },
            page: () => {
              return {
                viewWidth: document.documentElement.clientWidth,
                viewHeight: document.documentElement.clientHeight,
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight,
              };
            },
          });
          setStyle(key.dom, type, val);
          this.props.onChange();
        }));
      }


      if (value.effectComponent.length > 0) {
        value.dispose.push(observer(key.dom, (obj) => {
          value.cache = obj;
          value.effectComponent.forEach((item) => {
            const listen = this.map.get(item).listen;
            for (const type in listen) {
              const value = listen[type]({
                get: (targetId) => {
                  const target = this.map.list.find(item => item.key.props.id === targetId);
                  if (!target) {
                    return {
                      width: 0,
                      height: 0,
                      left: 0,
                      top: 0,
                    };
                  }
                  return target.value.cache;
                },
                page: () => {
                  return {
                    viewWidth: document.documentElement.clientWidth,
                    viewHeight: document.documentElement.clientHeight,
                    width: document.documentElement.scrollWidth,
                    height: document.documentElement.scrollHeight,
                  };
                },
              });
              setStyle(item.dom, type, value);
              this.props.onChange();
            }
          });
        }));
      }
    });
  }

  render() {
    const style = Object.assign({}, this.props.style, {
      position: 'relative'
    });
    return (<div
      style={style}
      ref={(dom) => { this.dom = dom; }}
    >
      {this.props.children}
    </div>);
  }
}

ReactCoolLayout.propTypes = {
  // callback function that will be invoked when layout changes
  onChange: PropTypes.func,
};

ReactCoolLayout.defaultProps = {
  onChange: () => { },
}

ReactCoolLayout.childContextTypes = {
  env: PropTypes.object,
};

export default ReactCoolLayout;
