import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header/index.jsx';
import Content from './components/Content/index.jsx';

const Index = () => {

    return (
        <div className="container">
            <Header />
            <Content />
        </div>
    );
};

ReactDOM.render(<Index />, document.getElementById('root'));
