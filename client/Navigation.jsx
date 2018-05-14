import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataStore from "./DataStore.js";

class NavigationCategory extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            requesting: false
        };
    }

    handleClick() {
        this.setState({ requesting: "disabled" });
        axios({
            url: "/api/getdata",
            method: "get",
        }).then((response) => {
            this.setState({ requesting: false });
            console.log(response.data);
            
            // DataStore.initialize(response.data);
        }).catch((error) => {
            this.setState({ requesting: false });
            console.log(error.response);
        });
    }

    render() {
        return (
            <div>
                <button type="button" disabled={this.state.requesting} onClick={this.handleClick}>Reload Data</button>
                <h3>Categories</h3>
                <ul>
                    <li><Link to='/'>Damage</Link></li>
                    <li><Link to='/heal'>Healing</Link></li>
                    <li><Link to='/cast'>Cast</Link></li>
                    <li><Link to='/damageTaken'>Damage Taken</Link></li>
                    <li><Link to='/mana'>Mana</Link></li>
                </ul>
            </div>
        );
    }

}

class CombatSelector extends React.Component {

    constructor() {
        super();
        this.updateCombatList = this.updateCombatList.bind(this);
        this.renderCombatList = this.renderCombatList.bind(this);

        this.state = {
            "combatList": [],
            "activeLog": -1
        };

        this.dataStore = new DataStore();
        this.dataStore.registerUpdateCombatList(this.updateCombatList);
    }

    updateCombatList() {
        this.setState({combatList: this.dataStore.combatList});
    }

    selectCombat(id) {
        this.dataStore.setActiveLog(id);
        this.setState({activeLog: id});
    }

    renderCombatList(combatList) {
        const entries = combatList.map((item, index) => (
            <li key={index}>
                <a href={window.location.href} className={this.state.activeLog === item.id ? "active" : ""} onClick={() => this.selectCombat(item.id)}>{`${item.start}-${item.end>=9999?"end":item.end}`}</a>
            </li>
        ));
        return entries;
    }

    render() {
        return (
            <div>
                <h3>战斗列表</h3>
                <ul className="nav nav-sidebar">
                    {this.renderCombatList(this.state.combatList)}
                </ul>
            </div>
        );
    }

}

class Navigation extends React.Component {

    render() {
        return (
            <div>
                <NavigationCategory />
                {/* <CombatSelector /> */}
            </div>
        );
    }

}

export default Navigation;