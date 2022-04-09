const mapReduxCalendarToDb = (calendar) => {

    //  let calendarWithDays = getCalendarMonth_ArrayWithMoment(dateString);
    let shiftsToStore = [];

    calendar.forEach(individualCalendar =>
        individualCalendar.calendar.forEach(shiftDay => {
            if (shiftDay.shift !== ''&&shiftDay.shift!==false) {
                shiftsToStore.push({
                    ...shiftDay,
                    "employeeId": individualCalendar.employeeId
                })
            }
        })
    )

    return shiftsToStore;
}

const mapReduxCalendarToSavedCalendarInDb = ({
    versie,
    calendar,
    employees,
    shifttypes
}) => {
    let shiftsToStore = [];

    calendar.forEach(individualCalendar =>
        individualCalendar.calendar.forEach(shiftDay => {
            if (shiftDay.shift !== ''&& shiftDay.shift!== false) {
                let shift = shifttypes.find(x => x.naam === shiftDay.shift);
                let employee = employees.find(x => x.id === individualCalendar.employeeId);
                shiftsToStore.push({
                    "calendar_versie": versie,
                    "werknemer_id": employee.id,
                    "werknemer_voornaam": employee.voornaam,
                    "werknemer_familienaam": employee.familienaam,
                    "shift_datum": shiftDay.day,
                    "shift_shifttypes_naam": shift.naam,
                    "shift_beginuur": shiftDay.startmoment ? shiftDay.startmoment : null,
                    "shift_einduur": shiftDay.endmoment ? shiftDay.endmoment : null,
                    "shifttypes_beginuur": shift.beginuur,
                    "shifttypes_einduur": shift.einduur,
                    "shifttypes_kleurcode": shift.kleurcode,
                    "shifttypes_verplicht": shift.verplicht,
                    "shifttypes_thuiswerk": shift.thuiswerk,
                    "shifttypes_aanpasbare_uren": shift.aanpasbare_uren,
                    "shifttypes_categorie": shift.categorie,
                    "shifttypes_tekstkleurcode": shift.tekstkleurcode,
                    "shifttypes_border": shift.border,
                    "shifttypes_standaardtekst": shift.standaardtekst,
                    "shifttypes_standby": shift.standby
                })
            }
        })
    )

    return shiftsToStore;
}


export {
    mapReduxCalendarToDb,
    mapReduxCalendarToSavedCalendarInDb
}