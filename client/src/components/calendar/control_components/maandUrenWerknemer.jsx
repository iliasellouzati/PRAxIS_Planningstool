import React from 'react';


class MaandUrenWerknemer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            percentage: false
        };
    }



    render = () => {
        return (

            <div className='controlebox' style={{border: '1px solid black'}} >  {this.props.totaleUren ? this.props.totaleUren : '0'}
                <span style={{ fontSize: '10px' }}>/168</span> 
            </div>

        )
    }
}


export default MaandUrenWerknemer;