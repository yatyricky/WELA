import React from "react";
import axios from "axios";

class Log extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        
        this.state = {
            requesting: false,
            listData: []
        };
    }

    handleClick() {
        this.setState({ requesting: "disabled" });
        axios({
            url: "/api/getlog",
            method: "get",
        }).then((response) => {
            this.setState({
                requesting: false,
                listData: response.data
            });
        }).catch((error) => {
            this.setState({ requesting: false });
            console.log(error.response);
        });
    }

    render() {
        const listItems = [];
        for (let i = 0; i < this.state.listData.length; i++) {
            const element = this.state.listData[i];
            listItems.push(
                <li key={i}>{element}</li>
            );
        }
        return (
            <div>
                <h1 className="page-header">Log</h1>
                <button type="button" disabled={this.state.requesting} onClick={this.handleClick}>Refresh</button>
                <ul>{listItems}</ul>
            </div>
        );
    }

}

export default Log;