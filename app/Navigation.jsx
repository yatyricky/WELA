import React from 'react';

class NavigationOptions extends React.Component {
    render() {
        var items = this.props.list.map((item, index) => 
            <div key={index}>{item}</div>
        );
        return (<div>{items}</div>);
    }
}

class NavigationCategory extends React.Component {
    render() {
        var categories = this.props.list.map((item, index) => 
            (
                <div key={index}>
                    <div key={index}>{item.category}</div>
                    <NavigationOptions list={item.options} />
                </div>
            )
        );
        return (<div>{categories}</div>);
    }
}

class Navigation extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<NavigationCategory list={this.props.menu} />);
    }

}

Navigation.defaultProps = {
    "menu": [
        {
            "category": "Fast Navigation",
            "options": [
                "Damage",
                "Heal",
                "Cast",
                "Damage Taken",
                "Mana"
            ]
        },
        {
            "category": "Combats",
            "options": []
        }
    ]
}

export default Navigation;