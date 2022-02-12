import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from "moment";

const Stap1Beta = () => {


    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;


    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;

    const [Status, setStatus] = useState([]);
    const [Aantal, setAantal] = useState([])


    const checkCalender = () => {

        let hulpArr = [];
        let hulpArrAantal = [];

        calendar.forEach(cal => {
            cal.employeeCalendar.forEach(shiftDay => {

                if (shiftDay.shift !== '') {
                    if (!hulpArr.some(x => x.naam === shiftDay.shift)) {
                        hulpArr.push(shifttypes.find(x => x.naam === shiftDay.shift));
                        hulpArrAantal.push(1);
                    } else {
                        hulpArrAantal[hulpArr.indexOf(shifttypes.find(x => x.naam === shiftDay.shift))] = (hulpArrAantal[hulpArr.indexOf(shifttypes.find(x => x.naam === shiftDay.shift))] + 1);
                    }
                }
            })
        })

        setStatus(hulpArr);
        setAantal(hulpArrAantal);

    }

    useEffect(() => {

        checkCalender();

        return () => {

        }
    }, [calendar])

    return (
        <div style={{ textAlign: 'center' }}>
            {Status.map(shift =>
                <div style={{ borderBottom: "1px dashed black", paddingBottom:"3px", paddingTop:"3px" }}>

                    <div style={{
                        backgroundColor: shift.kleurcode,
                        color: shift.tekstkleurcode,
                        textAlign: 'center',
                        height: '100%',
                        width: "65px",
                        border: (shift.border ? "2px solid black" : ""),
                        display:'inline-block',
                        float:"left"
                    }}>
                        {shift.standaardtekst === "uur" ? (
                            moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() > 0 ?
                                moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() :
                                moment.duration(moment(shift.einduur, "hh:mm").add(1, "day").diff(moment(shift.beginuur, "hh:mm"))).asHours()
                        ) :
                            shift.standaardtekst === "min" ?
                                moment.utc(moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asMilliseconds()).format("hh:mm")
                                :
                                shift.standaardtekst}
                    </div>

                    {shift.naam} : {Aantal[Status.indexOf(shifttypes.find(x => x.naam === shift.naam))]}</div>
            )}
        </div>
    )
}

export default Stap1Beta
