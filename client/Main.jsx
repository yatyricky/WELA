import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout.jsx";

class Main extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        );
    }
}

render(<Main />, document.getElementById("root"));
