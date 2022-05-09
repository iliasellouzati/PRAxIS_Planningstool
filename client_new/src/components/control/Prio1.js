import moment from 'moment';

const dayShifts = ["0618", "0719"];
const nightShifts = ["1806", "1907"];
const operatorShifts = [1,3,5,7];

const StandbyControle = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {

    let hulpArrMetDeDagen = [];

    for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {

        hulpArrMetDeDagen.push(calendarMonthHelper[individualDayLooper].format("DD-MM-YYYY"));

        for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

            let shift = calendar[employeeLooper].calendar[individualDayLooper].shift;
            if (shift !== false && shift !== "" && shifttypes.find(s => s.id === shift)?.categorie.trim() === "standby") {
                hulpArrMetDeDagen.pop();
                break;
            }
        }
    }

    return hulpArrMetDeDagen;

}
const Max4OperatorShifts = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {

    let result = [];

    for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {
        let shiftCounter = 0;

        for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {

            let shift = calendar[employeeLooper].calendar[individualDayLooper].shift

            if (operatorShifts.some(x => x === shift)) {
                shiftCounter++;
            } else {
                shiftCounter = 0;
            }

            if (shiftCounter > 4) {
                if (result.length !== 0 && result[result.length - 1].start === calendarMonthHelper[individualDayLooper + 1 - shiftCounter] && result[result.length - 1].employeeId === calendar[employeeLooper].employeeId) {
                    result.pop();
                }
                result.push({
                    'employeeId': calendar[employeeLooper].employeeId,
                    'start': calendarMonthHelper[individualDayLooper + 1 - shiftCounter],
                    'end': calendarMonthHelper[individualDayLooper]
                })
            }
        }
    }

    return result;
}
const DagNaNacht = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {
    let result = [];

    for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

        for (let individualDayLooper = 1; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {

            let shift = calendar[employeeLooper].calendar[individualDayLooper].shift
            let passedShift = calendar[employeeLooper].calendar[individualDayLooper - 1].shift
            if (nightShifts.some(x => x === passedShift) && dayShifts.some(x => x === shift)) {
                result.push({
                    'employeeId': calendar[employeeLooper].employeeId,
                    'start': calendarMonthHelper[individualDayLooper - 1],
                    'end': calendarMonthHelper[individualDayLooper]
                })
            }
        }
    }

    return result;
}
const DubbeleOperatorShift = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {
    let hulpArrMetDeDagen = [];

    for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {

        let checker = {
            '0618': 0,
            '0719': 0,
            '1806': 0,
            '1907': 0
        }

        for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

            let shift = calendar[employeeLooper].calendar[individualDayLooper].shift;
            if (operatorShifts.includes(shift)) {
                checker[`${shift}`]++;
            }
        }
        if (checker['0618'] > 1 || checker['0719'] > 1 || checker['1806'] > 1 || checker['1907'] > 1) {
            hulpArrMetDeDagen.push(calendarMonthHelper[individualDayLooper].format('DD-MM-YYYY'));
        }
    }

    return hulpArrMetDeDagen;
}
const OperatorShiftenControle = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {
    let hulpArrMetDeDagen = [];

    for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {

        let checker = {
            "1": 0,
            "3": 0,
            "5": 0,
            "7": 0
        }

        for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

            let shift = calendar[employeeLooper].calendar[individualDayLooper].shift;
            if (operatorShifts.includes(shift)) {
                checker[`${shift}`]++;
            }
        }
        if (checker['1'] === 0 || checker['3'] === 0 || checker['5'] === 0 || checker['7'] === 0) {
            hulpArrMetDeDagen.push(calendarMonthHelper[individualDayLooper].format('DD-MM-YYYY'));
        }
    }

    return hulpArrMetDeDagen;
}
const LegeShiftenTussen3NachtenEnDagShift = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {

    let result = [];

    for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {
        let opeenVolgendeNachtenShiften = 0;
        let blankoShift = 0;

        for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {


            let shiftName = calendar[employeeLooper].calendar[individualDayLooper].shift;
            if (shiftName === false) {
                continue;
            }

            if (nightShifts.includes(shiftName) && blankoShift !== 0 && opeenVolgendeNachtenShiften !== 0) {
                blankoShift = 0;
                opeenVolgendeNachtenShiften = 1;
                continue;
            } else if (nightShifts.includes(shiftName)) {
                opeenVolgendeNachtenShiften++;
                continue;
            } else if ((shiftName === '' || ['verlof', 'standby'].includes(shifttypes.find(x => x.id === shiftName).categorie.trim())) && opeenVolgendeNachtenShiften !== 0) {
                blankoShift++;
                continue;
            }
            if (opeenVolgendeNachtenShiften === 3 && blankoShift < 1) {
                result.push({
                    'employeeId': calendar[employeeLooper].employeeId,
                    'start': calendarMonthHelper[individualDayLooper - (opeenVolgendeNachtenShiften + blankoShift)],
                    'end': calendarMonthHelper[individualDayLooper]
                });
                opeenVolgendeNachtenShiften = 0;
                blankoShift = 0;

            } else {
                opeenVolgendeNachtenShiften = 0;
                blankoShift = 0;
            }
        }
    }
    return result;
}
const TweeLegeShiftenTussen4NachtenEnDagShift = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {

    let result = [];


    for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {
        let opeenVolgendeNachtenShiften = 0;
        let blankoShift = 0;
        for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {

            let shiftName = calendar[employeeLooper].calendar[individualDayLooper].shift;
            if (shiftName === false) {
                continue;
            }


            if (nightShifts.includes(shiftName) && blankoShift !== 0 && opeenVolgendeNachtenShiften !== 0) {
                blankoShift = 0;
                opeenVolgendeNachtenShiften = 1;
                continue;
            } else if (nightShifts.includes(shiftName)) {
                opeenVolgendeNachtenShiften++;
                continue;
            } else if ((shiftName === '' || ['verlof', 'standby'].includes(shifttypes.find(x => x.id === shiftName).categorie.trim())) && opeenVolgendeNachtenShiften !== 0) {
                blankoShift++;
                continue;
            }
            if (opeenVolgendeNachtenShiften === 4 && blankoShift < 2) {
                result.push({
                    'employeeId': calendar[employeeLooper].employeeId,
                    'start': calendarMonthHelper[individualDayLooper - (opeenVolgendeNachtenShiften + blankoShift)],
                    'end': calendarMonthHelper[individualDayLooper]
                });
                opeenVolgendeNachtenShiften = 0;
                blankoShift = 0;
            }
        }
    }
    return result;
}

const TweeBlancoShiftsNaWeekendMet3Nacht = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {
    let result = [];

    for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {
        let opeenVolgendeNachtenShiften = 0;
        let blankoShift = 0;

        for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {

            let shiftName = calendar[employeeLooper].calendar[individualDayLooper].shift;
            if (shiftName === false) {
                continue;
            }

            if (nightShifts.includes(shiftName) && blankoShift === 0 && (calendarMonthHelper[individualDayLooper].isoWeekday() === 5 || calendarMonthHelper[individualDayLooper].isoWeekday() === 6 || calendarMonthHelper[individualDayLooper].isoWeekday() === 7)) {
                opeenVolgendeNachtenShiften++;
                continue;
            } else if (opeenVolgendeNachtenShiften !== 0 && (shiftName === '' || ['verlof', 'standby'].includes(shifttypes.find(x => x.id === shiftName).categorie.trim()))) {
                blankoShift++;

                continue;
            }
            if (opeenVolgendeNachtenShiften === 3 && blankoShift < 2) {
                result.push({
                    'employeeId': calendar[employeeLooper].employeeId,
                    'start': calendarMonthHelper[individualDayLooper - (opeenVolgendeNachtenShiften + blankoShift)],
                    'end': calendarMonthHelper[individualDayLooper]
                });
                opeenVolgendeNachtenShiften = 0;
                blankoShift = 0;

            } else {
                opeenVolgendeNachtenShiften = 0;
                blankoShift = 0;
            }
        }
    }
    return result;

}
const StandbyCorrectePlaatsingControle = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {


    let result = [];

    for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

        for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {

            let shift = calendar[employeeLooper].calendar[individualDayLooper].shift

            if (shifttypes.find(x => x.id === shift)?.categorie.trim() === "standby") {

                switch (shift) {
                    case 'standby 24h':
                        if (individualDayLooper !== 0 && (
                                nightShifts.includes(calendar[employeeLooper].calendar[individualDayLooper - 1].shift) ||
                                ['standby 24h', 'standby nacht'].includes(calendar[employeeLooper].calendar[individualDayLooper - 1].shift)
                            )) {
                            if (result.length !== 0 && result[result.length - 1].start === calendarMonthHelper[individualDayLooper - 1] && result[result.length - 1].employeeId === calendar[employeeLooper].employeeId) {
                                result.pop();
                            }
                            result.push({
                                'employeeId': calendar[employeeLooper].employeeId,
                                'start': calendarMonthHelper[individualDayLooper - 1],
                                'end': calendarMonthHelper[individualDayLooper]
                            })
                        } else if (individualDayLooper !== calendarMonthHelper.length - 1 && (
                                dayShifts.includes(calendar[employeeLooper].calendar[individualDayLooper + 1].shift) ||
                                ['standby 24h', 'standby dag'].includes(calendar[employeeLooper].calendar[individualDayLooper + 1].shift)
                            )) {
                            if (result.length !== 0 && result[result.length - 1].start === calendarMonthHelper[individualDayLooper - 1] && result[result.length - 1].employeeId === calendar[employeeLooper].employeeId) {
                                result.pop();
                            }
                            result.push({
                                'employeeId': calendar[employeeLooper].employeeId,
                                'start': calendarMonthHelper[individualDayLooper],
                                'end': calendarMonthHelper[individualDayLooper + 1]
                            })
                        }
                        break;

                    case 'standby dag':
                        if (individualDayLooper !== 0 && (
                                nightShifts.includes(calendar[employeeLooper].calendar[individualDayLooper - 1].shift) ||
                                ['standby 24h', 'standby nacht'].includes(calendar[employeeLooper].calendar[individualDayLooper - 1].shift)
                            )) {
                            if (result.length !== 0 && result[result.length - 1].start === calendarMonthHelper[individualDayLooper - 1] && result[result.length - 1].employeeId === calendar[employeeLooper].employeeId) {
                                result.pop();
                            }
                            result.push({
                                'employeeId': calendar[employeeLooper].employeeId,
                                'start': calendarMonthHelper[individualDayLooper - 1],
                                'end': calendarMonthHelper[individualDayLooper]
                            })
                        }


                        break;

                    case 'standby nacht':
                        if (individualDayLooper !== calendarMonthHelper.length - 1 && (
                                dayShifts.includes(calendar[employeeLooper].calendar[individualDayLooper + 1].shift) ||
                                ['standby 24h', 'standby dag'].includes(calendar[employeeLooper].calendar[individualDayLooper + 1].shift)
                            )) {
                            if (result.length !== 0 && result[result.length - 1].start === calendarMonthHelper[individualDayLooper - 1] && result[result.length - 1].employeeId === calendar[employeeLooper].employeeId) {
                                result.pop();
                            }
                            result.push({
                                'employeeId': calendar[employeeLooper].employeeId,
                                'start': calendarMonthHelper[individualDayLooper],
                                'end': calendarMonthHelper[individualDayLooper + 1]
                            })
                        }

                        break;

                    default:
                        break;
                }
            }
        }
    }

    return result;

}



export {
    StandbyControle,
    Max4OperatorShifts,
    DagNaNacht,
    DubbeleOperatorShift,
    OperatorShiftenControle,
    LegeShiftenTussen3NachtenEnDagShift,
    TweeLegeShiftenTussen4NachtenEnDagShift,
    TweeBlancoShiftsNaWeekendMet3Nacht,
    StandbyCorrectePlaatsingControle
}