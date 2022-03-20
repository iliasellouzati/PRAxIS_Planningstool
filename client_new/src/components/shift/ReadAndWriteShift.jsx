import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addShift } from '../../redux/actions/calendarActions';
import ReadAndWriteShiftContextMenu from '../contextmenu/ReadAndWriteShiftContextMenu';

const ReadAndWriteShift = ({ setContextMenu, shiftDay, shifttypes, employeeId }) => {


    const dispatch = useDispatch();

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { currentShift,calendar } = currentCalendar;

    const [Shift, setShift] = useState("");

    const [ShiftText, setShiftText] = useState("");


    const contextMenu = (e) => {
        e.preventDefault();
        setContextMenu([true, { 'e': e, 'shiftDay': shiftDay, 'shifttypes': shifttypes, 'employeeId': employeeId }]);
    };



    let cssStyling = Shift ?
        {
            backgroundColor: Shift.kleurcode,
            color: Shift.tekstkleurcode,
            padding: "0px",
            margin: '0px',
            textAlign: 'center',
            verticalAlign: 'middle',
            height: "27px",
            width: "100%",
            fontSize: Shift.standaardtekst !== "uur" ? "10px" : "",
            outline: Shift.border ? "1px solid black" : ""
        }
        :
        {
            padding: "0px",
            margin: '0px',
            textAlign: 'center',
            height: "100%",
            width: "100%"
        };

    function over(e) {
        if (shiftDay.shift === "") {
            e.target.style.outline = "1px solid black";
        }
    }

    function out(e) {
        if (shiftDay.shift === "") {
            e.target.style.outline = "";
        }
    }


    const handleClick = (e) => {

        if (currentShift === '' && shiftDay.shift === '') { }
        else {
            dispatch(addShift({ 'id': employeeId, 'day': shiftDay.day, 'shift': currentShift !== shiftDay.shift ? currentShift : "", 'startmoment': null, 'endmoment': null }));
            currentShift === "" || Shift?.naam === currentShift ? setShift() : setShift(shifttypes.find(o => o.naam === currentShift));
            out(e);
        }
    }
    const calculateShiftText = () => {
        let shift = shifttypes.find(o => o.naam === shiftDay.shift)

        let text = shift.standaardtekst === "uur" ? (
            moment.duration(moment((shiftDay.endmoment || shift.einduur), "hh:mm").diff(moment((shiftDay.startmoment || shift.beginuur), "hh:mm"))).asHours() > 0 ?
                moment.duration(moment((shiftDay.endmoment || shift.einduur), "hh:mm").diff(moment((shiftDay.startmoment || shift.beginuur), "hh:mm"))).asHours() :
                moment.duration(moment((shiftDay.endmoment || shift.einduur), "hh:mm").add(1, "day").diff(moment((shiftDay.startmoment || shift.beginuur), "hh:mm"))).asHours()
        ) :
            shift.standaardtekst === "min" ?
                (moment.utc(moment.duration(moment((shiftDay.endmoment | shift.einduur), "hh:mm").diff(moment((shiftDay.startmoment | shift.beginuur), "hh:mm"))).asMilliseconds()).format("hh:mm") > 0 ?
                    moment.utc(moment.duration(moment((shiftDay.endmoment | shift.einduur), "hh:mm").diff(moment((shiftDay.startmoment | shift.beginuur), "hh:mm"))).asMilliseconds()).format("h:mm") :
                    moment.utc(moment.duration(moment((shiftDay.endmoment | shift.einduur), "hh:mm").add(1, "day").diff(moment((shiftDay.startmoment | shift.beginuur), "hh:mm"))).asMilliseconds()).format("h:mm")
                )
                :
                shift.standaardtekst;

        setShiftText(text);
    }


    useEffect(() => {

        if (shiftDay.shift !== '') {
            setShift(shifttypes.find(o => o.naam === shiftDay.shift));
            calculateShiftText();
        } else {
            setShift();
        }
        return () => {

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shiftDay,calendar])

    return (
        <div style={cssStyling} onMouseOver={over} onMouseOut={out} onContextMenu={contextMenu} onClick={(e) => handleClick(e)}>

            {!Shift ? "" : ShiftText}

            <span style={{ fontSize: '0px' }}>a</span>
        </div>
    )
}

export default ReadAndWriteShift