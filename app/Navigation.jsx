import React from 'react';
import { IndexLink, Link } from "react-router";
import DataStore from './DataStore.js';

class NavigationCategory extends React.Component {

    render() {
        const categories = [
            {
                "text": "新建分析",
                "to": "/"
            }, {
                "text": "伤害统计",
                "to": "damage"
            }, {
                "text": "治疗统计",
                "to": "heal"
            }, {
                "text": "施法统计",
                "to": "cast"
            }, {
                "text": "承受伤害统计",
                "to": "damageTaken"
            }, {
                "text": "法力曲线",
                "to": "mana"}
        ].map((item, index) => {
            if (item.to == "/") {
                return (
                    <li key={index}>
                        <IndexLink to={item.to} activeClassName="active">{item.text}</IndexLink>
                    </li>
                );
            } else {
                return (
                    <li key={index}>
                        <Link to={item.to} activeClassName="active">{item.text}</Link>
                    </li>
                );
            }
        });
        return (
            <div>
                <h3>快速导航</h3>
                <ul className="nav nav-sidebar">
                    {categories}
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

        this.state = {combatList: []};

        this.dataStore = new DataStore();
        this.dataStore.registerUpdateCombatList(this.updateCombatList);
    }

    updateCombatList() {
        this.setState({combatList: this.dataStore.combatList});
    }

    renderCombatList(combatList) {
        const entries = combatList.map((item, index) => (
            <li key={index}>
                <a href={window.location.href}>{`${item.start}-${item.end>=9999?"end":item.end}`}</a>
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
            <div className="col-sm-3 col-md-2 sidebar">
                <NavigationCategory />
                <CombatSelector />
            </div>
        );
    }

}

export default Navigation;