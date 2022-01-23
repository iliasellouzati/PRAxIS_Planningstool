import React from 'react'

class KwartaalUrenWerknemer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            percentage: false
        };
    }
    render = () => {

        return (

            <>{this.props.totaleUren ? this.props.totaleUren : '0'}</>


        )

    }


}

export default KwartaalUrenWerknemer
