import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Map from './util/map';
import observer from './util/observer';
import resize from './util/resize';


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
    });
  }

  componentDidMount() {
    this.map.list.forEach(({ key, value }) => {
      ['width', 'height', 'left', 'top'].forEach((type) => {
        if (typeof key.props[type] !== 'undefined') {
          if (typeof key.props[type] === 'function') {
            const val = key.props[type]({
              get: (targetId) => {
                const target = this.map.list.find(item => item.key.props.id === targetId);
                if (target.value.effectComponent.indexOf(key) < 0) {
                  target.value.effectComponent.push(key);
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
            key.dom.style[type] = `${val}px`;
          } else {
            key.dom.style[type] = `${parseFloat(key.props[type])}px`;
          }
        }
      });
    });

    this.map.list.forEach(({ key, value }) => {
      for (const type in value.listenPage) {
        resize(() => {
          const val = value.listenPage[type]({
            get: (targetId) => {
              const target = this.map.list.find(item => item.key.props.id === targetId);
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
          key.dom.style[type] = `${val}px`;
        });
      }


      if (value.effectComponent.length > 0) {
        observer(key.dom, (obj) => {
          value.cache = obj;
          value.effectComponent.forEach((item) => {
            const listen = this.map.get(item).listen;
            for (const type in listen) {
              const value = listen[type]({
                get: (targetId) => {
                  const target = this.map.list.find(item => item.key.props.id === targetId);
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
              item.dom.style[type] = `${value}px`;
            }
          });
        });
      }
    });
  }

  render() {
    return (<div
      style={{ position: 'relative' }}
      ref={(dom) => { this.dom = dom; }}
    >
      {this.props.children}
    </div>);
  }
}

ReactCoolLayout.childContextTypes = {
  env: PropTypes.object,
};

export default ReactCoolLayout;
