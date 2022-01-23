import moment from 'moment';
import './moment_prototype.js';
import * as constants from './constants.js';

const getFirstDayOfCalendarMonth_Moment = object =>{
    return object.startDayOfMonth();
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

const getNextYear_Moment = object =>{
    return object.clone().add(1,"year");
}

const getLastYear_Moment = object =>{
    return object.clone().subtract(1,"year");
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




export {    
    getTotalDaysInCalendarMonth_Int, 
    getCalendarHeaderDays_ArrayWithString,   
    getCalendarMonth_ArrayWithMoment, 
    getMonthName_String, 
    getYear_Int,
    getNextMonth_Moment,
    getLastMonth_Moment,
    getNextYear_Moment,
    getLastYear_Moment,
    isSameDay_Boolean,
    isBeforeToday_Boolean, 
    isToday_Boolean,
    getFirstDayOfCalendarMonth_Moment,
    getLastDayOfCalendarMonth_Moment, 
    constants

}

