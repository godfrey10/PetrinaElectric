import React from 'react';

const Header = (props) => {
    return(
        <header className="App-header">
            <h1 className="App-title">{props.name}</h1>
            <div>{props.company_address}</div>
        </header>
    )
}

export default Header;


