import React from "react";
import { Link } from "react-router-dom"; // eslint-disable-line no-unused-vars
import Grid from "@material-ui/core/Grid"; // eslint-disable-line no-unused-vars
import Button from "@material-ui/core/Button"; // eslint-disable-line no-unused-vars
import Navigation from "./Navigation.jsx"; // eslint-disable-line no-unused-vars
import Contents from "./Contents.jsx"; // eslint-disable-line no-unused-vars

class Layout extends React.Component {
    render() {
        return (
            <Grid container>
                <Grid item xs={2}><Navigation /></Grid>
                <Grid item xs={10}>
                    <Button><Link to='/'>Damage</Link></Button>
                    <Button><Link to='/heal'>Healing</Link></Button>
                    <Button><Link to='/cast'>Cast</Link></Button>
                    <Button><Link to='/damageTaken'>Damage Taken</Link></Button>
                    <Button><Link to='/mana'>Mana</Link></Button>
                    <Button><Link to='/log'>Log</Link></Button>
                    <Contents />
                </Grid>
            </Grid>
        );
    }
}

export default Layout;