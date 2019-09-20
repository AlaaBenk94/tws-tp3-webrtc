import React from 'react';

import imgReact from './../../img/react.jpg';
import imgJS from './../../img/js.png';
import imgNode from './../../img/node.png';

const Content  = () => {
    return (
        <div className="row justify-content-center">
            <div className="col-3 d-flex justify-content-center">
                <img src={imgReact} alt="React" width="100%"/>
            </div>
            <div className="col-3 d-flex justify-content-center">
                <img src={imgJS} alt="Js" width="100%"/>
            </div>
            <div className="col-3 d-flex justify-content-center">
                <img src={imgNode} alt="Node" width="100%"/>
            </div>
        </div>
    );
};

export default Content;
