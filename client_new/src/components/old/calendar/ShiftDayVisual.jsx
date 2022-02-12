import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addShift } from '../../store/actions/shiftActions';


const ShiftDayVisual = ({ shiftDay, employeeId }) => {
    const dispatch = useDispatch();

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;


    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { currentShift } = currentCalendar;

    const [Shift, setShift] = useState("");
    

    const contextMenu = (e) => {
        e.preventDefault();
        console.log(e);

        return;
      };



    let cssStyling = Shift ? { backgroundColor: Shift.kleurcode, color: Shift.tekstkleurcode,padding:"0px", margin:'0px', textAlign: 'center', height: "100%", width: "100%", outline: Shift.border ? "2px solid black" : "" } : { padding:"0px", margin:'0px', textAlign: 'center', height: "100%",backgroundColor:"lightgrey", width: "100%" };

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

    const calculeerUren = () => {

        const shift = shifttypes.find(s => s.naam === currentShift);

        if (shiftDay.shift !== "" && shift) {
            let beginMoment = moment((shiftDay.day + "-" + shift.beginuur), "DD-MM-YYYY-hh:mm");
            let eindMoment = moment((shiftDay.day + "-" + shift.einduur), "DD-MM-YYYY-hh:mm");
            if (beginMoment.isAfter(eindMoment)) {
                eindMoment.add(1, 'day');
            }
            let duration = moment.duration(eindMoment.diff(beginMoment));

        } else {
        }
    }



    useEffect(() => {

        if (shiftDay.shift !== '') {
            setShift(shifttypes.find(o => o.naam === shiftDay.shift));
            calculeerUren();
        } else {
            setShift();
        }
        return () => {

        }
    }, [])

    return (
        <div style={cssStyling} onMouseOver={over} onMouseOut={out} onContextMenu={contextMenu}>
        <span >    {!Shift ? "" :
                Shift.standaardtekst === "uur" ? (
                    moment.duration(moment(Shift.einduur, "hh:mm").diff(moment(Shift.beginuur, "hh:mm"))).asHours() > 0 ?
                        moment.duration(moment(Shift.einduur, "hh:mm").diff(moment(Shift.beginuur, "hh:mm"))).asHours() :
                        moment.duration(moment(Shift.einduur, "hh:mm").add(1, "day").diff(moment(Shift.beginuur, "hh:mm"))).asHours()
                ) :
                    Shift.standaardtekst === "min" ?
                       ( moment.utc(moment.duration(moment(Shift.einduur, "hh:mm").diff(moment(Shift.beginuur, "hh:mm"))).asMilliseconds()).format("hh:mm") > 0?
                       moment.utc(moment.duration(moment(Shift.einduur, "hh:mm").diff(moment(Shift.beginuur, "hh:mm"))).asMilliseconds()).format("hh:mm") :
                       moment.utc(moment.duration(moment(Shift.einduur, "hh:mm").add(1, "day").diff(moment(Shift.beginuur, "hh:mm"))).asMilliseconds()).format("hh:mm")
                       )
                        :
                        Shift.standaardtekst
            } </span>
            
            <span style={{fontSize:'0px'}}>a</span>

        </div>
    )
}

export default ShiftDayVisual
