import moment from 'moment';
import './moment_prototype.js';
import * as constants from './constants.js';

const getFirstDayOfCalendarMonth_Moment = object =>{
    return object.startDayOfMonth();
}

const getFistDayOfYear_Moment = object =>{
    return object.startOf('year');
}

const getLastDayOfYear_Moment = object =>{
    return object.endOf('year');
}
const getLastDayOfCalendarMonth_Moment = object =>{
    return object.endDayOfMonth();
}

const getTotalDaysInCalendarMonth_Int = object =>{
    return Math.round(moment.duration(object.endDayOfMonth().diff(object.startDayOfMonth())).asDays());
}

const getCalendarHeaderDays_ArrayWithString = object =>{

    let headerDays = [];

    for (let index = 0; index < getTotalDaysInCalendarMonth_Int(object) ; index++) {
        headerDays.push(constants.dayNamesShort[index % 7]);
    }
    return headerDays;
}

const getCalendarMonth_ArrayWithMoment = object =>{
    let calendar = [];
    let day = object.startDayOfMonth().subtract(1, "day");
    const endDay = object.endDayOfMonth();

    while (day.isBefore(endDay, 'day')) {
        calendar.push(
            Array(7).fill(0).map(() => day.add(1, "day").clone())

        );
    };

    return calendar;
}

const getDayName_String = object =>{
    return constants.dayNames[object.day()]
}

const getMonthName_String = object => {
    return constants.monthNames[object.month()];
}

const getYear_Int = object =>{
    return object.format("YYYY")
}

const getNextMonth_Moment = object =>{
    return object.clone().add(1,"month");
}

const getLastMonth_Moment = object =>{
    return object.clone().subtract(1,"month");
}

const isSameDay_Boolean = (day1, day2)=>{
    return day1.isSame(day2,"day");
}

const isBeforeToday_Boolean = object => {
    return object.isBefore(new Date(), "day");
}

const isToday_Boolean = object => {
    return object.isSame(new Date(), "day")
}

const calculateHoursInCalendarMonth_Int = (monthMoment,employee,shifttypes, calendar) =>{
    
        let total = 0;
        let currentCalendar = moment(monthMoment, "MM-YYYY");

        let filteredCalendar = calendar.filter(shiftDay=>shiftDay.werknemers_id===employee);
        
        filteredCalendar.forEach(shiftDay => {

            if (shiftDay.shifttypes_naam !== "") {
                let shift = shifttypes.find(o => o.naam === shiftDay.shifttypes_naam)
                let beginMoment = moment((moment(shiftDay.datum, "YYYY-MM-DD").format("DD-MM-YYYY")+ "-" + shift.beginuur), "DD-MM-YYYY-hh:mm");
                let eindMoment = moment((moment(shiftDay.datum, "YYYY-MM-DD").format("DD-MM-YYYY")+ "-" + shift.einduur), "DD-MM-YYYY-hh:mm");
                if (beginMoment.isAfter(eindMoment)) {
                    eindMoment.add(1, 'day');
                }
                let duration = moment.duration(eindMoment.diff(beginMoment));

                if (beginMoment.isSame(currentCalendar, "month") && eindMoment.isSame(currentCalendar, "month")) {
                    total += (duration.asHours());
                } else if (beginMoment.isSame(currentCalendar, "month")) {
                    eindMoment.set({ h: 0, m: 0 });
                    duration = moment.duration(eindMoment.diff(beginMoment));
                    total += (duration.asHours());
                } else if (eindMoment.isSame(currentCalendar, "month")) {
                    beginMoment.add(1, 'day');
                    beginMoment.set({ h: 0, m: 0 });
                    duration = moment.duration(eindMoment.diff(beginMoment));
                    total += (duration.asHours());
                }
            }
        });

        return total;
    }






export {    
    getTotalDaysInCalendarMonth_Int, 
    getCalendarHeaderDays_ArrayWithString,   
    getCalendarMonth_ArrayWithMoment, 
    getDayName_String,
    getMonthName_String, 
    getYear_Int,
    getNextMonth_Moment,
    getLastMonth_Moment,
    isSameDay_Boolean,
    isBeforeToday_Boolean, 
    isToday_Boolean,
    getFirstDayOfCalendarMonth_Moment,
    getLastDayOfCalendarMonth_Moment, 
    calculateHoursInCalendarMonth_Int,    
    constants,
    getLastDayOfYear_Moment,
    getFistDayOfYear_Moment

}

