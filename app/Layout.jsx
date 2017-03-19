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
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                        {this.props.children}
                    </div>
                </div>
            </div>

        );
    }
}

export default Layout;