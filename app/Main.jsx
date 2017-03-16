import React from 'react';
import {render} from 'react-dom';
import Navigation from './Navigation.jsx';

class Main extends React.Component {
    render() {
        return <Navigation />;
    }
}

render(<Main/>, document.getElementById('root'));