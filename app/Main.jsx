import React from 'react';
import {render} from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Layout from './Layout.jsx';
import Welcome from './pages/Welcome.jsx';
import Damage from './pages/Damage.jsx';
import Heal from './pages/Heal.jsx';
import Cast from './pages/Cast.jsx';
import DamageTaken from './pages/DamageTaken.jsx';
import Mana from './pages/Mana.jsx';

class Main extends React.Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={Layout}>
                    <IndexRoute component={Welcome}></IndexRoute>
                    <Route path="damage" name="damage" component={Damage}></Route>
                    <Route path="heal" name="heal" component={Heal}></Route>
                    <Route path="cast" name="cast" component={Cast}></Route>
                    <Route path="damageTaken" name="damageTaken" component={DamageTaken}></Route>
                    <Route path="mana" name="mana" component={Mana}></Route>
                </Route>
            </Router>
        );
    }
}

render(<Main />, document.getElementById('root'));
