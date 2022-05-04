import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addShift } from '../../redux/actions/calendarActions';
import ReadAndWriteShiftContextMenu from '../contextmenu/ReadAndWriteShiftContextMenu';

const ReadAndWriteShift = ({ setContextMenu, shiftDay, shifttypes, employeeId }) => {


    const dispatch = useDispatch();

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { currentShift, calendar } = currentCalendar;

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
            cursor:'pointer',
            outline: Shift.border ? "1px solid black" : ""
            
        }
        :
        {
            padding: "0px",
            margin: '0px',
            textAlign: 'center',
            cursor:'pointer',
            height: "100%"
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

    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
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
        let shift = shifttypes.find(o => o.naam === shiftDay.shift);



        let text = shift.standaardtekst === "uur" ? roundToTwo(
            moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() > 0 ?
                moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() :
                moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").add(1, "day").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours()
        ) :
            shift.standaardtekst === "min" ?
                (moment.utc(moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shiftDay.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asMilliseconds()).format("hh:mm") > 0 ?
                    moment.utc(moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shiftDay.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asMilliseconds()).format("h:mm") :
                    moment.utc(moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shiftDay.einduur}`), "DD-MM-YYYY-hh:mm").add(1, "day").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asMilliseconds()).format("h:mm")
                )
                :
                shift.standaardtekst;


        setShiftText(text.toString());
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
    }, [shiftDay, calendar])

    return (
        <div style={cssStyling} onMouseOver={over} onMouseOut={out} onContextMenu={contextMenu} onClick={(e) => handleClick(e)}>

            {!Shift ?<span style={{color:"white", fontSize:"0px"}}>- </span> : ShiftText}

        
        </div >
    )
}

export default ReadAndWriteShift