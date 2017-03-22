import React from 'react';
import DataStore from '../DataStore.js';

class Damage extends React.Component {

    constructor() {
        super();
        console.log(new DataStore().time);
    }

    render() {
        return (
            <h1 className="page-header">伤害统计</h1>
        );
    }

}

export default Damage;