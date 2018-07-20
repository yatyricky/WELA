import React from "react";
import axios from "axios";
import Divider from "@material-ui/core/Divider"; // eslint-disable-line no-unused-vars
import Button from "@material-ui/core/Button"; // eslint-disable-line no-unused-vars
import List from "@material-ui/core/List"; // eslint-disable-line no-unused-vars
import ListItem from "@material-ui/core/ListItem"; // eslint-disable-line no-unused-vars
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
            <Button onClick={this.handleClick}>{this.props.name}</Button>
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
            combatList: null
        };
    }

    setCombat(num) {
        setCombatData(num);
    }

    handleClick() {
        this.setState({ requesting: false });
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
                    <ListItem key={i}>
                        <CombatSelector action={this.setCombat} num={i} name={`${element.start.toFixed(1)} - ${element.end.toFixed(1)} (${(element.end - element.start).toFixed(1)})`}/>
                    </ListItem>
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
                <Button disabled={this.state.requesting} onClick={this.handleClick}>Reload Data</Button>
                <Divider />
                <h3>Combats</h3>
                <List>
                    {this.state.combatList}
                </List>
            </div>
        );
    }

}

export default Navigation;