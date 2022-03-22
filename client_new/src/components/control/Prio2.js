import moment, {
    duration
} from 'moment';

const dayShifts = ["0618", "0719"];
const nightShifts = ["1806", "1907"];
const operatorShifts = ["0618", "0719", "1806", "1907"];

const CoopmanShiftControle = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {

    let hulpArrMetDeDagen = [];

    for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {
        if ((calendarMonthHelper[individualDayLooper].isoWeekday() === 6 || calendarMonthHelper[individualDayLooper].isoWeekday() === 7)) {
            continue;
        }
        hulpArrMetDeDagen.push(calendarMonthHelper[individualDayLooper].format("DD-MM-YYYY"));

        for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

            let shift = calendar[employeeLooper].calendar[individualDayLooper].shift;
            if (shift !== "" && shifttypes.find(s => s.naam === shift)?.categorie.trim() === "coopman") {
                hulpArrMetDeDagen.pop();
                break;
            }
        }
    }

    return hulpArrMetDeDagen;

}

const OverurenWeekControle = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {

    let result = [];



    for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

        for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper+=7) {

            let uurCounter = moment.duration('0', 'hours');


            let shiftNameMa = calendar[employeeLooper].calendar[individualDayLooper].shift;
            let shiftNameDi = calendar[employeeLooper].calendar[individualDayLooper + 1].shift;
            let shiftNameWo = calendar[employeeLooper].calendar[individualDayLooper + 2].shift;
            let shiftNameDo = calendar[employeeLooper].calendar[individualDayLooper + 3].shift;
            let shiftNameVr = calendar[employeeLooper].calendar[individualDayLooper + 4].shift;
            let shiftNameZa = calendar[employeeLooper].calendar[individualDayLooper + 5].shift;
            let shiftNameZo = calendar[employeeLooper].calendar[individualDayLooper + 6].shift;

            let week = [shiftNameMa, shiftNameDi, shiftNameWo, shiftNameDo, shiftNameVr, shiftNameZa];

            week.forEach(shiftName => {
                if (shiftName !== "") {
                    let shift = shifttypes.find(x => x.naam === shiftName);
                    let duration = moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() > 0 ?
                        moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() :
                        moment.duration(moment(shift.einduur, "hh:mm").add(1, "day").diff(moment(shift.beginuur, "hh:mm"))).asHours();
                    uurCounter.add(duration);
                }
            })

            if (shiftNameZo !== "") {
                let shift = shifttypes.find(x => x.naam === shiftNameZo);
                let duration = moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() > 0 ?
                    moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() :
                    moment.duration(moment("24:00", "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours();
                uurCounter.add(duration);
            }

            if (uurCounter > 48) {
                result.push({
                    'employeeId': calendar[employeeLooper].employeeId,
                    'start': calendarMonthHelper[individualDayLooper],
                    'end': calendarMonthHelper[individualDayLooper + 6]
                })
            }


        }
    }

    return result;

}

const OverurenMaandControle = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {


}
const TweeLegeShiftNa3Nachten = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {


}
const DrieLegeShiftNa4Nachten = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {


}



export {
    CoopmanShiftControle,
    OverurenWeekControle
}