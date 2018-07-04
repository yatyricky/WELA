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
        let linesCounter = 0;
        for (let i = 0; i < this.state.listData.length; i++) {
            const element = this.state.listData[i];
            const lines = element.split(/\|[nN]/g);
            for (let l = 0; l < lines.length; l++) {
                const line = lines[l];
                const regexSplit = /\|[cC][a-fA-F0-9]{8}[^\|]*\|[rR]/g;
                const regexExtract = /\|[cC]([a-fA-F0-9]{8})([^\|]*)\|[rR]/g;
                const tokens = line.split(regexSplit);
                const parts = [];
                let counter = 0;
                for (let j = 0; j < tokens.length; j ++) {
                    parts.push(<span key={counter++}>{tokens[j]}</span>);
                    if (j < tokens.length - 1) {
                        let match = regexExtract.exec(line);
                        const style = {color: "#" + match[1].substr(2, 8)};
                        if (match) {
                            parts.push(<span key={counter++} style={style}>{match[2]}</span>);
                        } else {
                            throw new Error("regex boomed");
                        }
                    }
                }
                listItems.push(
                    <li key={linesCounter++}>{parts}</li>
                );
            }
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