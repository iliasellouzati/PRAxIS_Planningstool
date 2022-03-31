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

const mapSavedShiftsFromDbToHistory = (savedShifts)=>{

let shifttypes=[];
let employees=[];


let returnCalendar=[];

savedShifts.forEach(shift=>{

if(!employees.some(x=>x.id===shift.werknemer_id)){
    employees.push({
        'id':shift.werknemer_id,
        'voornaam':shift.werknemer_voornaam,
        'familienaam':shift.werknemer_familienaam
      });
      returnCalendar.push({
        "employeeId":shift.werknemer_id,
        "calendar": getCalendarMonth_ArrayWithMoment(shift.calendar_versie.substring(0,7))
    })
}
if(!shifttypes.some(x=>x.naam===shift.shift_shifttypes_naam.trim())){
    shifttypes.push({
        "naam":shift.shift_shifttypes_naam.trim(),
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

let index1 = returnCalendar.findIndex(x=>x.employeeId===shift.werknemer_id);
let index2 = returnCalendar[index1].calendar.findIndex(x=>moment(x.day, "DD-MM-YYYY").isSame(moment(shift.shift_datum, "DD-MM-YYYY"), 'day'));
returnCalendar[index1].calendar[index2].shift = shift.shift_shifttypes_naam;
returnCalendar[index1].calendar[index2].startmoment = shift.shift_beginuur||null;
returnCalendar[index1].calendar[index2].endmoment = shift.shift_einduur||null;
})

return({
    'calendar': returnCalendar,
    'shifttypes': shifttypes,
    'employees': employees
})
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
    mapShiftsFromDbToTableRowHistory,
    mapSavedShiftsFromDbToHistory
}