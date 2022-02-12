import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';


const AantalUreninKwartaalVoorWerknemer = ({ employeeCalendar,aantalUurInKwartaal }) => {



    const [TotalHoursInCalendar, setTotalHoursInCalendar] = useState('initialState');

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar, datum } = currentCalendar;


    const calculateHours = () => {
        let total = 0;
        let currentCalendarMonth = moment(datum, "MM-YYYY")
        employeeCalendar.forEach(shiftDay => {

            if (shiftDay.shift !== "") {
                let shift = shifttypes.find(o => o.naam === shiftDay.shift)
                let beginMoment = moment((shiftDay.day + "-" + shift.beginuur), "DD-MM-YYYY-hh:mm");
                let eindMoment = moment((shiftDay.day + "-" + shift.einduur), "DD-MM-YYYY-hh:mm");
                if (beginMoment.isAfter(eindMoment)) {
                    eindMoment.add(1, 'day');
                }
                let duration = moment.duration(eindMoment.diff(beginMoment));

                if (beginMoment.isSame(currentCalendarMonth, "month") && eindMoment.isSame(currentCalendarMonth, "month")) {
                    total += (duration.asHours());
                } else if (beginMoment.isSame(currentCalendarMonth, "month")) {
                    eindMoment.set({ h: 0, m: 0 });
                    duration = moment.duration(eindMoment.diff(beginMoment));
                    total += (duration.asHours());
                } else if (eindMoment.isSame(currentCalendarMonth, "month")) {
                    beginMoment.add(1, 'day');
                    beginMoment.set({ h: 0, m: 0 });
                    duration = moment.duration(eindMoment.diff(beginMoment));
                    total += (duration.asHours());
                }
            }

        });
        total+=aantalUurInKwartaal;
        setTotalHoursInCalendar(total);
    }

    useEffect(() => {
        calculateHours();
        return () => {

        }
    }, [calendar])

    return  Math.round(TotalHoursInCalendar);
      

}

export default AantalUreninKwartaalVoorWerknemer
