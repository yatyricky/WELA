import React from "react";
import Navigation from "./Navigation.jsx";
import Contents from "./Contents.jsx";

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