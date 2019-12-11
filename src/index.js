import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import {Videochat} from "./composants/Videochat";

const Index = () => {

    return (
        <Videochat />
    );
};

ReactDOM.render(<Index/>, document.getElementById('root'));
