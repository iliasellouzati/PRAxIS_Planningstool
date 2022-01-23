import React from 'react';


class Shiftbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: this.props.CalendarShifts[this.props.employeeId].find(o=>o.day===this.props.day).shift===''?
            'grey':
                 this.props.possibleShifts.find(o=>o.naam===this.props.CalendarShifts[this.props.employeeId].find(o=>o.day===this.props.day).shift).kleurcode
        };
    }

    handleClick = () => {

        var foundIndex = this.props.CalendarShifts[this.props.employeeId].findIndex(x => x.day === this.props.day);


        var hulpItterator = 0;
        var totalUrenWerknemers = [];


        if (this.props.CalendarShifts[this.props.employeeId][foundIndex].shift === '') {
            this.setState({ color: this.props.possibleShifts[this.props.currentShift].kleurcode });


        } else {
            this.setState({ color: 'grey' });
        }

        this.props.CalendarShifts.forEach((emplo) => {
            var counter = 0;
            if (emplo) {
                emplo.forEach((obj) => {
                    // console.log(obj);
                    if (obj.shift !== '') {
                        switch (obj.shift) {
                            case "standby":

                                break;

                            default:
                                counter += 12;
                                break;
                        }

                    }
                }, 0);

                totalUrenWerknemers[hulpItterator++] = counter;
            }


        });

        this.props.setTotaleUrenWerknemers(totalUrenWerknemers);


    }

    render = () => {
        return (
            <div className='shiftbox' style={{ background: this.state.color, height: '100%', width: '100%' }}
                onClick={this.handleClick} >
                {this.state.color === 'grey' ? '' : this.state.color === '#03FFBB' ? 'SB' : '12'}
            </div>

        )
    }
}


export default Shiftbox;