import moment from 'moment';


const mapShiftsFromDbToCalendar = (dateString, calendarFromDb, Employees) => {
    //  let calendarWithDays = getCalendarMonth_ArrayWithMoment(dateString);

    let returnCalendar = [];

    Employees.forEach(employee => {
        returnCalendar.push({
            "employeeId": employee.id,
            "calendar": getCalendarMonth_ArrayWithMoment(dateString)
        })
    });

    for (let index1 = 0; index1 < returnCalendar.length; index1++) {
        for (let index2 = 0; index2 < returnCalendar[index1].calendar.length; index2++) {
            let shift = calendarFromDb.find(x => moment(x.datum, "YYYY-MM-DD").isSame(moment(returnCalendar[index1].calendar[index2].day, "DD-MM-YYYY"), 'day') && x.werknemers_id === returnCalendar[index1].employeeId);
            if (shift) {
                returnCalendar[index1].calendar[index2].shift = shift.shifttypes_naam;
            }
        }
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

export {
    mapShiftsFromDbToCalendar
}