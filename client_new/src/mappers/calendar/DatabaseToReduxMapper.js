import moment from 'moment';


const mapShiftsFromDbToCalendar = (dateString, calendarFromDb, Employees) => {
    //  let calendarWithDays = getCalendarMonth_ArrayWithMoment(dateString);

    let returnCalendar = [];

    Employees.filter(x=>["YES","PARTIAL"].includes(x.full_month_contract)).forEach(employee => {
        returnCalendar.push({
            "employeeId": employee.employeeId,
            "calendar": getCalendarMonth_ArrayWithMoment(dateString)
        })
    });

    for (let index1 = 0; index1 < returnCalendar.length; index1++) {
        for (let index2 = 0; index2 < returnCalendar[index1].calendar.length; index2++) {
            let shift = calendarFromDb === "" ? null : calendarFromDb.find(x => moment(x.datum, "YYYY-MM-DD").isSame(moment(returnCalendar[index1].calendar[index2].day, "DD-MM-YYYY"), 'day') && x.werknemers_id === returnCalendar[index1].employeeId);
            if (shift) {
                returnCalendar[index1].calendar[index2].shift = shift.shifttypes_naam;
                returnCalendar[index1].calendar[index2].startmoment = shift.beginuur;
                returnCalendar[index1].calendar[index2].endmoment = shift.einduur;

            }
        }
    }

    return returnCalendar;
}
const mapShiftsFromDbToTableRowHistory = (dateString,calendarFromDb) => {

    let returnCalendar = getCalendarMonth_ArrayWithMoment(dateString);


        for (let index = 0; index < returnCalendar.length; index++) {
            let shift = calendarFromDb === "" ? null : calendarFromDb.find(x => moment(x.datum, "YYYY-MM-DD").isSame(moment(returnCalendar[index].day, "DD-MM-YYYY"), 'day'));
            if (shift) {
                returnCalendar[index].shift = shift.shifttypes_naam;
                returnCalendar[index].startmoment = shift.beginuur;
                returnCalendar[index].endmoment = shift.einduur;
            }
        }
        
    return returnCalendar;
}
const mapShiftsFromDbToAutomatisation = (dateString, calendarFromDb, Employees) => {
    //  let calendarWithDays = getCalendarMonth_ArrayWithMoment(dateString);

    let returnCalendar = [];

    Employees.forEach(employee => {
        returnCalendar.push({
            "employeeId": employee.id,
            "week": getCustom_ArrayWithMoment(dateString)
        })
    });


    for (let index1 = 0; index1 < returnCalendar.length; index1++) {
        for (let index2 = 0; index2 < returnCalendar[index1].week.length; index2++) {

            let shift = calendarFromDb?.find(x =>
                moment(x.datum, "YYYY-MM-DD").isSame(moment(returnCalendar[index1].week[index2].day, "DD-MM-YYYY"), 'day') &&
                x.werknemers_id === returnCalendar[index1].employeeId)

            if (shift) {
                returnCalendar[index1].week[index2].shift = shift.shifttypes_naam;
            }
        }
    }

    for (let index = 0; index < Employees.length; index++) {
        let hulpweek = returnCalendar[index].week;
        hulpweek = hulpweek.map(x => x.shift);
        returnCalendar[index].week = hulpweek;
    }


    return returnCalendar;
}

const getCalendarMonth_ArrayWithMoment = dateString => {
    let calendar = [];
    const date = moment(dateString, "MM-YYYY");
    let startDay = date.clone().startOf('month').startOf('isoWeek');
    const endDay = date.clone().endOf('month').endOf('isoWeek').add(1, 'day');


    while (startDay.isBefore(endDay, 'day')) {
        calendar.push({
            "day": startDay.format("DD-MM-YYYY"),
            "shift": "",
            "startmoment": null,
            "endmoment": null
        });
        startDay = startDay.add(1, 'day');
    };

    return calendar;
}


const getCustom_ArrayWithMoment = dateString => {
    let calendar = [];
    const date = moment(dateString, "MM-YYYY");
    let startDay = date.clone().startOf('month').startOf('isoWeek').subtract(1, "week");
    const endDay = date.clone().startOf('month').startOf('isoWeek');


    while (startDay.isBefore(endDay, 'day')) {
        calendar.push({
            "day": startDay.format("DD-MM-YYYY"),
            "shift": "",
        });
        startDay = startDay.add(1, 'day');
    };

    return calendar;
}

export {
    mapShiftsFromDbToCalendar,
    mapShiftsFromDbToAutomatisation,
    mapShiftsFromDbToTableRowHistory
}