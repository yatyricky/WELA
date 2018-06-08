import React from "react";
import { Link } from "react-router-dom"; // eslint-disable-line no-unused-vars
import axios from "axios";
import {setAllData, setCombatData} from "./DataStore.js";

class CombatSelector extends React.Component { // eslint-disable-line no-unused-vars

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.action(this.props.num);
    }

    render() {
        return (
            <button type="button" onClick={this.handleClick}>{this.props.name}</button>
        );
    }
}

class Navigation extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.setCombat = this.setCombat.bind(this);
        
        this.state = {
            requesting: false,
            combatList: <div />
        };
    }

    setCombat(num) {
        setCombatData(num);
    }

    handleClick() {
        this.setState({ requesting: "disabled" });
        axios({
            url: "/api/getdata",
            method: "get",
        }).then((response) => {
            this.setState({ requesting: false });
            setAllData(response.data);
            const combatList = [];
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                combatList.push(
                    <li key={i}>
                        <CombatSelector action={this.setCombat} num={i} name={`${element.start.toFixed(1)} - ${element.end.toFixed(1)} (${(element.end - element.start).toFixed(1)})`}/>
                    </li>
                );
            }
            if (combatList.length == 0) {
                this.setState({
                    combatList: <div />
                });
            } else {
                this.setState({
                    combatList: combatList
                });
            }
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
                <h3>Combats</h3>
                <ul>
                    {this.state.combatList}
                </ul>
            </div>
        );
    }

}

export default Navigation;