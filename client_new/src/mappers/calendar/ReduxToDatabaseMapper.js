const mapReduxCalendarToDb = (calendar) => {

    //  let calendarWithDays = getCalendarMonth_ArrayWithMoment(dateString);
    let shiftsToStore = [];

    calendar.forEach(individualCalendar =>
        individualCalendar.calendar.forEach(shiftDay => {
            if (shiftDay.shift !== '') {
                shiftsToStore.push({
                    ...shiftDay,
                    "employeeId": individualCalendar.employeeId
                })
            }
        })
    )

    return shiftsToStore;
}

export {
    mapReduxCalendarToDb
}