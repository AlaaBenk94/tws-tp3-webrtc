import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './composants/Home';

const Index = () => (
  <Home />
);

ReactDOM.render(<Index />, document.getElementById('root'));
