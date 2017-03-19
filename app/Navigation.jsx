import React from 'react';
import { IndexLink, Link } from "react-router";

class NavigationOptions extends React.Component {
    render() {
        const items = this.props.list.map((item, index) => 
            {
                if (item.to == "/") {
                    return (
                        <li key={index} className="active">
                            <IndexLink to={item.to}>{item.text}</IndexLink>
                        </li>
                    );
                } else {
                    return (
                        <li key={index}>
                            <Link to={item.to}>{item.text}</Link>
                        </li>
                    );
                }
            }
        );
        return (
            <ul className="nav nav-sidebar">
                {items}
            </ul>
        );
    }
}

class NavigationCategory extends React.Component {
    render() {
        const categories = this.props.list.map((item, index) => 
            (
                <div key={index}>
                    <h3>{item.category}</h3>
                    <NavigationOptions list={item.options} />
                </div>
            )
        );
        return (
            <div className="col-xs-2">
                {categories}
            </div>
        );
    }
}

class Navigation extends React.Component {

    render() {
        const menu = [
            {
                "category": "Fast Navigation",
                "options": [
                    {
                        "text": "New",
                        "to": "/"
                    }, {
                        "text": "Damage",
                        "to": "damage"
                    }, {
                        "text": "Heal",
                        "to": "heal"
                    }, {
                        "text": "Cast",
                        "to": "cast"
                    }, {
                        "text": "Damage Taken",
                        "to": "damageTaken"
                    }, {
                        "text": "Mana",
                        "to": "mana"}
                ]
            }, {
                "category": "Combats",
                "options": []
            }
        ];
        return (<NavigationCategory list={menu} />);
    }

}

export default Navigation;