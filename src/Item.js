import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ReactCoolLayoutItem extends Component {

  constructor(props, context) {
    super(props);
    context.env.init(this);
  }

  render() {
    return (<div
      style={{
        position: 'absolute',
      }}
      ref={(dom) => { this.dom = dom; }}
      id={this.props.id}
    >
      {this.props.children}
    </div>);
  }
}

ReactCoolLayoutItem.contextTypes = {
  env: PropTypes.object,
};


export default ReactCoolLayoutItem;
