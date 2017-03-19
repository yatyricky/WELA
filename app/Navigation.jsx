import React from 'react';
import { IndexLink, Link } from "react-router";

class NavigationOptions extends React.Component {
    render() {
        const items = this.props.list.map((item, index) => 
            {
                if (item.to == "/") {
                    return (
                        <li key={index}>
                            <IndexLink to={item.to} activeClassName="active">{item.text}</IndexLink>
                        </li>
                    );
                } else {
                    return (
                        <li key={index}>
                            <Link to={item.to} activeClassName="active">{item.text}</Link>
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
            <div className="col-sm-3 col-md-2 sidebar">
                {categories}
            </div>
        );
    }
}

class Navigation extends React.Component {

    render() {
        const menu = [
            {
                "category": "快速导航",
                "options": [
                    {
                        "text": "新建分析",
                        "to": "/"
                    }, {
                        "text": "伤害统计",
                        "to": "damage"
                    }, {
                        "text": "治疗统计",
                        "to": "heal"
                    }, {
                        "text": "施法统计",
                        "to": "cast"
                    }, {
                        "text": "承受伤害统计",
                        "to": "damageTaken"
                    }, {
                        "text": "法力曲线",
                        "to": "mana"}
                ]
            }, {
                "category": "战斗列表",
                "options": []
            }
        ];
        return (<NavigationCategory list={menu} />);
    }

}

export default Navigation;