import React from 'react';

class AantalstandbyWerknemer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }



    reducer = (prev, current) => ((prev + (current.shift === "standby" ? 1 : 0)))



    render = () => {
        return (
            <div className='controlebox' style={{ border: '1px solid black' }} >  {this.props.werknemershiften ? this.props.werknemershiften.reduce(this.reducer, 0) : 0}

            </div>

        )
    }
}



export default AantalstandbyWerknemer;