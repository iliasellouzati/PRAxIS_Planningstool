import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Header from './building_components/header';
import Body from './building_components/body';
import './index.css';
import * as Custom_Moment_Operations from '../../moment_operations';




export default function Calendar({possibleShifts, currentShift}) {
    const [calendar, setCalendar] = useState([]);
    const [value, setValue] = useState(moment());

    useEffect(() => {
       
        setCalendar(Custom_Moment_Operations.getCalendarMonth_ArrayWithMoment(value));
        return () => {
            setCalendar([]);
        }
        
    }, [value])

    return (

        <div className="calendar" >
            <Header value={value} setValue={setValue}  />
            <Body value={value} setValue={setValue} calendar ={calendar} possibleShifts={possibleShifts} currentShift={currentShift} />  
    
       </div>)
}
