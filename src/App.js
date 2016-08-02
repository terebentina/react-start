import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

class App extends Component {

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    return <p>All good</p>;
  }
}

export default App;
