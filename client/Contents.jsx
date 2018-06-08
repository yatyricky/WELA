import React from "react";
import { Switch, Route } from "react-router-dom"; // eslint-disable-line no-unused-vars
import Damage from "./Damage.jsx";
import Heal from "./Heal.jsx";
import Cast from "./Cast.jsx";
import DamageTaken from "./DamageTaken.jsx";
import Mana from "./Mana.jsx";

class Contents extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path='/' component={Damage} />
                <Route path='/heal' component={Heal} />
                <Route path='/cast' component={Cast} />
                <Route path='/damageTaken' component={DamageTaken} />
                <Route path='/mana' component={Mana} />
            </Switch>
        );
    }

}

export default Contents;
