import React from 'react';

//stateless component
// prop is always a variable used in passing from one component to another.
const Intro = (props) => {
    return (
        <p className="App-intro">
          {props.name} To get started, edit <code>src/App.js</code> and save to reload.
        </p>
    )
}

export default Intro;