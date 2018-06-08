import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom"; // eslint-disable-line no-unused-vars
import Layout from "./Layout.jsx"; // eslint-disable-line no-unused-vars

class Main extends React.Component { // eslint-disable-line no-unused-vars
    render() {
        return (
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        );
    }
}

render(<Main />, document.getElementById("root"));
