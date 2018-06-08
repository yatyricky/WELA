import React from "react";
import Navigation from "./Navigation.jsx"; // eslint-disable-line no-unused-vars
import Contents from "./Contents.jsx"; // eslint-disable-line no-unused-vars

class Layout extends React.Component {
    render() {
        return (
            <div>
                <Navigation />
                <Contents />
            </div>
        );
    }
}

export default Layout;