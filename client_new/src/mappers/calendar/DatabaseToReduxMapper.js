import moment from 'moment';


const mapShiftsFromDbToCalendar = (dateString, calendarFromDb, Employees) => {
    //  let calendarWithDays = getCalendarMonth_ArrayWithMoment(dateString);

    let returnCalendar = [];

    Employees.filter(x => ["YES"].includes(x.full_month_contract)).forEach(employee => {
        returnCalendar.push({
            "employeeId": employee.employeeId,
            "calendar": getCalendarMonth_ArrayWithMoment(dateString)
        })
    });
    Employees.filter(x => ["PARTIAL"].includes(x.full_month_contract)).forEach(employee => {
        returnCalendar.push({
            "employeeId": employee.employeeId,
            "calendar": getPartialCalendarMonth_ArrayWithMoment(dateString, employee.begin, employee.eind)
        })
    });

    for (let index1 = 0; index1 < returnCalendar.length; index1++) {
        for (let index2 = 0; index2 < returnCalendar[index1].calendar.length; index2++) {
            let shift = calendarFromDb === "" ? null : calendarFromDb.find(x => moment(x.datum, "YYYY-MM-DD").isSame(moment(returnCalendar[index1].calendar[index2].day, "DD-MM-YYYY"), 'day') && x.werknemers_id === returnCalendar[index1].employeeId);

            if (shift) {
                returnCalendar[index1].calendar[index2].shift = shift.shifttype_id;
                returnCalendar[index1].calendar[index2].startmoment = shift.beginuur;
                returnCalendar[index1].calendar[index2].endmoment = shift.einduur;

            }
        }
    }

    return returnCalendar;
}
const mapShiftsFromDbToTableRowHistory = (dateString, calendarFromDb) => {

    let returnCalendar = getCalendarMonth_ArrayWithMoment(dateString);


    for (let index = 0; index < returnCalendar.length; index++) {
        let shift = calendarFromDb === "" ? null : calendarFromDb.find(x => moment(x.datum, "YYYY-MM-DD").isSame(moment(returnCalendar[index].day, "DD-MM-YYYY"), 'day'));
        if (shift) {
            returnCalendar[index].shift = shift.shifttype_id;
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
                returnCalendar[index1].week[index2].shift = shift.shifttype_;
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

const mapSavedShiftsFromDbToHistory = (savedShifts) => {

    let shifttypes = [];
    let employees = [];


    let returnCalendar = [];

    savedShifts.forEach(shift => {

        if (!employees.some(x => x.id === shift.werknemer_id)) {
            employees.push({
                'id': shift.werknemer_id,
                'voornaam': shift.werknemer_voornaam,
                'familienaam': shift.werknemer_familienaam
            });
            returnCalendar.push({
                "employeeId": shift.werknemer_id,
                "calendar": getCalendarMonth_ArrayWithMoment(shift.calendar_versie.substring(0, 7))
            })
        }
        if (!shifttypes.some(x => x.naam === shift.shift_shifttypes_naam.trim())) {
            shifttypes.push({
                "naam": shift.shift_shifttypes_naam.trim(),
                "beginuur": shift.shifttypes_beginuur,
                "einduur": shift.shifttypes_einduur,
                "kleurcode": shift.shifttypes_kleurcode,
                "verplicht": shift.shifttypes_verplicht,
                "thuiswerk": shift.shifttypes_thuiswerk,
                "aanpasbare_uren": shift.shifttypes_aanpasbare_uren,
                "categorie": shift.shifttypes_categorie,
                "tekstkleurcode": shift.shifttypes_tekstkleurcode,
                "border": shift.shifttypes_border,
                "standaardtekst": shift.shifttypes_standaardtekst,
                "standby": shift.shifttypes_standby
            })

        }

        let index1 = returnCalendar.findIndex(x => x.employeeId === shift.werknemer_id);
        let index2 = returnCalendar[index1].calendar.findIndex(x => moment(x.day, "DD-MM-YYYY").isSame(moment(shift.shift_datum, "DD-MM-YYYY"), 'day'));
        returnCalendar[index1].calendar[index2].shift = shift.shift_shifttypes_naam;
        returnCalendar[index1].calendar[index2].startmoment = shift.shift_beginuur || null;
        returnCalendar[index1].calendar[index2].endmoment = shift.shift_einduur || null;
    })

    return ({
        'calendar': returnCalendar,
        'shifttypes': shifttypes,
        'employees': employees
    })
}

const mapShiftsFromDbToTotalHours = (dataString, calendarFromDb, shifttypes) => {
    let returnValue = {};
    let currentMonth = moment(dataString, "MM-YYYY");

    if(calendarFromDb.length===0){
        return {};
    }

    calendarFromDb.forEach(shiftDay => {

        let shift_datum = moment(shiftDay.datum, "YYYY-MM-DD");
        let shift = shifttypes.find(x => x.id === shiftDay.shifttype_id);
        let duration;
        if (shift_datum.isBefore(currentMonth, 'month')) {

            if (moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDay.beginuur ? `${shiftDay.datum}-${shiftDay.beginuur}` : `${shiftDay.datum}-${shift.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() < 0) {
                duration = moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDay.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();
            } else {
                return;
            }
        } else {
            duration = moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDay.beginuur ? `${shiftDay.datum}-${shiftDay.beginuur}` : `${shiftDay.datum}-${shift.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() >= 0 ?
                moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDay.beginuur ? `${shiftDay.datum}-${shiftDay.beginuur}` : `${shiftDay.datum}-${shift.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() :
                moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment((shiftDay.beginuur ? `${shiftDay.datum}-${shiftDay.beginuur}` : `${shiftDay.datum}-${shift.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
        }

        if (returnValue[`${shiftDay.werknemers_id}`] === undefined) {
            returnValue[`${shiftDay.werknemers_id}`] = duration;
        } else {
            returnValue[`${shiftDay.werknemers_id}`] += duration;
        }
    })

    return returnValue;


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

const getPartialCalendarMonth_ArrayWithMoment = (dateString, begin, eind) => {
    let calendar = [];
    const date = moment(dateString, "MM-YYYY");
    let startDay = date.clone().startOf('month').startOf('isoWeek');
    const endDay = date.clone().endOf('month').endOf('isoWeek').add(1, 'day');

    const beginContract = moment(begin, "DD/MM/YYYY").subtract(1, 'day');
    const eindContract = moment(eind, "DD/MM/YYYY").add(1, 'day');


    while (startDay.isBefore(endDay, 'day')) {
        calendar.push({
            "day": startDay.format("DD-MM-YYYY"),
            "shift": eind? (startDay.isBetween(beginContract, eindContract, "day") ? "" : false): (startDay.isAfter(beginContract,  "day")? "" : false),
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
    mapShiftsFromDbToTableRowHistory,
    mapSavedShiftsFromDbToHistory,
    mapShiftsFromDbToTotalHours
}