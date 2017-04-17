import React from 'react';
import DataStore from '../DataStore.js';

class Damage extends React.Component {

    constructor() {
        super();
        this.badPractiseIsMounted = 0;
        this.dataStore = new DataStore();

        this.state = {
            "activeLog": this.dataStore.activeLog
        };

        this.parseData = this.parseData.bind(this);
        this.updateDamage = this.updateDamage.bind(this);

        this.dataStore.registerUpdateDamage(this.updateDamage);
    }

    updateDamage() {
        if (this.badPractiseIsMounted === 1) {
            this.setState({
                "activeLog": this.dataStore.activeLog
            });
        }
    }

    componentDidMount() {
        let raw = this.dataStore.fetchLog("damage");
        this.badPractiseIsMounted = 1;
    }

    componentWillUnmount() {
        this.badPractiseIsMounted = 0;
    }

    parseData() {
        return (
            <div>{this.state.activeLog}</div>
        );
    }

    render() {
        return (
            <div>
                <h1 className="page-header">伤害统计</h1>
                {this.parseData()}
            </div>
        );
    }

}

export default Damage;