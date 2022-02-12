import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';


const AantalStandByInMaandVoorWerknemer = ({ employeeCalendar }) => {

    const [TotalHoursInCalendar, setTotalHoursInCalendar] = useState(0);


    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar, datum } = currentCalendar;

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;


    const calculateHours = () => {
        let total = 0;
        let currentCalendarMonth = moment(datum, "MM-YYYY")
        employeeCalendar.forEach(shiftDay => {

            if (shiftDay.shift!== ""&&shifttypes.find(x=>x.naam===shiftDay.shift).standby) {

                let beginMoment = moment(shiftDay.day , "DD-MM-YYYY");
                if (beginMoment.isSame(currentCalendarMonth, "month")) {
                    total++;
                } 
            }

        });

        setTotalHoursInCalendar(total);
    }

    useEffect(() => {
        calculateHours();
        return () => {

        }
    }, [calendar])

    return (
        <div  style={{ fontSize: '12px' }} >        
                {TotalHoursInCalendar}
        </div>
    )
}

export default AantalStandByInMaandVoorWerknemer
