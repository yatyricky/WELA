import React from "react";
import { Link } from "react-router";

import Navigation from './Navigation.jsx';

class Layout extends React.Component {
    render() {
        const { location } = this.props;
        return (
            <div className="container-fluid">
                <div className="row">
                    <Navigation location={location} />
                    <div className="col-xs-8">
                        {this.props.children}
                    </div>
                </div>
            </div>

        );
    }
}

export default Layout;