import React from "react";

class ShiftSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 0 };
    }

    handleClick = index => {
        this.setState({ value: this.props.possibleShifts.findIndex(shift => shift.naam === index) });
        this.props.setCurrentShift(this.props.possibleShifts.findIndex(shift => shift.naam === index));
        console.log(index);
    }

    render = () => {

        return (
            <>
                {this.props.possibleShifts!==undefined &&
                    <div>
                        <p>Geselecteerd: {this.props.possibleShifts[this.state.value]?this.props.possibleShifts[this.state.value].naam : "geen geselcteerd"} </p>

                        {this.props.possibleShifts.map(shift =>
                            <button key={shift.naam} onClick={() => this.handleClick(shift.naam)} style={{ backgroundColor: shift.kleurcode }}>{shift.naam}</button>
                        )

                        }

                    </div>
                }
            </>
        );
    }
}

export default ShiftSelector;