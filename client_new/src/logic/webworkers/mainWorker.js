// eslint-disable-next-line import/no-anonymous-default-export
export default () => {



    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (message) => {

        let response = [];
        let incompatibelWeeks = [];

        switch (message.data[0]) {
            case "INIT":
                response = checkPossibleWeeklyStructures(message.data[1]);
                incompatibelWeeks = calcIncompatibelWeeks(message.data[1]);
                postMessage(["FIRST_POSSIBLE_IDS_FOUND", response, incompatibelWeeks]);
                break;

            case "CONTINU":
                response = checkPossibleWeeklyStructures(message.data[1]);
                postMessage(["POSSIBLE_IDS_FOUND", response]);
                break;

            case "LAST_ONE":

                response = checkPossibleWeeklyStructures(message.data[1]);
                postMessage(["LAST_POSSIBLE_IDS_FOUND", response]);
                break;

            case "FILTER_WEEKEND_EN_NACHT_INGEVULD":
                postMessage("");
                break;

            default:
                break;
        }

    }



    const checkPossibleWeeklyStructures = ({
        weeklyStructures,
        employeesDB,
        employeesSelectedIDs,
        logaritme,
        history,
        missingShiftsWeek,
        selectedWeeks,
        contractTypes
    }) => {

        let possibleWeeklyStructures = [];

        for (let index = 0; index < employeesSelectedIDs.length; index++) {
            let hulpList = checkPossibleWeeklyStructuresIndividualy(
                weeklyStructures,
                employeesSelectedIDs[index],
                logaritme,
                history[`${employeesSelectedIDs[index]}`],
                missingShiftsWeek[0],
                selectedWeeks[0],
                employeesDB,
                contractTypes
            );

            possibleWeeklyStructures.push({
                "employeeId": employeesSelectedIDs[index],
                "possibleWeeks": hulpList
            });
        }

        return possibleWeeklyStructures;
    }
    const checkPossibleWeeklyStructuresIndividualy = (weeklyStructures, employee, logaritme, history, missingShiftsWeek, selectedWeeks, employeesDB, contractTypes) => {

        let employeeObj = employeesDB.find(x => x.id === employee);
        let contracttypeObj = contractTypes.find(x => x.id === employeeObj.contracttype_id);

        const dayShifts = ["0618", "0719"];
        const nightShifts = ["1806", "1907"];
        const operatorShifts = ["0618", "0719", "1806", "1907"]

        let numberOfWeeksToCheck = parseInt(logaritme.data.maxWeeks) + 1;

        let startData = get1WeekLaterFromString(selectedWeeks);
        let historyIndividualEmployee = [];

        for (let index = 0; index < numberOfWeeksToCheck * 7; index++) {
            startData = get1DayEarlierFromString(startData);
            historyIndividualEmployee.unshift(history.history[`${startData}`]);
        }

        let possible_IDs = [];
        let filter = [];


        if (contracttypeObj.id === 1) {

            let eersteShiftGevonden = false;

            let momenteelInDagStructuur = true;

            let counter = 0;
            let verplichtDAG = false;
            let verplichtNACHT = false;

            for (let index = historyIndividualEmployee.length - 1; index => 0; index--) {

                counter++;

                if (!eersteShiftGevonden && operatorShifts.includes(historyIndividualEmployee[index])) {
                    eersteShiftGevonden = true;
                    if (nightShifts.includes(historyIndividualEmployee[index])) {
                        momenteelInDagStructuur = false;
                    }
                    if (counter > 7) {
                        counter -= 7;
                    }

                } else if (!eersteShiftGevonden) {
                    continue;
                }

                if (momenteelInDagStructuur && nightShifts.includes(historyIndividualEmployee[index])) {
                    if ((counter / 7) < logaritme.data.minWeeks) {
                        verplichtDAG = true;
                        break;
                    } else {
                        break;
                    }
                }

                if (!momenteelInDagStructuur && dayShifts.includes(historyIndividualEmployee[index])) {
                    if ((counter / 7) < logaritme.data.minWeeks) {
                        verplichtNACHT = true;
                        break;
                    } else {
                        break;
                    }
                }

                if (Math.ceil(counter / 7) >= logaritme.data.maxWeeks) {
                    if (momenteelInDagStructuur) {
                        verplichtNACHT = true;
                    } else {
                        verplichtDAG = true;
                    }
                    break;
                }

            }

            if (verplichtDAG || verplichtNACHT) {

                for (let index = 0; index < weeklyStructures.length; index++) {

                    let week = weeklyStructures[index];
                    if (verplichtDAG && !controleGeenNachten(week)) {
                        filter.push(week.id);
                        continue;
                    }
                    if (verplichtNACHT && !controleGeenDagen(week)) {
                        filter.push(week.id);
                        continue;
                    }
                }
            }
        }





        for (let index = 0; index < weeklyStructures.length; index++) {

            let week = weeklyStructures[index];

            if (filter.includes(week.id)) {
                continue;
            }

            if (!contracttypeObj.nachtshiften_toegelaten && !controleGeenNachten(week)) {
                filter.push(week.id);
                continue;
            }
            if (contracttypeObj.id !== 1 && !controleGeenWeekend(week)) {
                filter.push(week.id);
                continue;
            }
            if (!controleTweeShiftenOpEenDag(week, historyIndividualEmployee)) {
                filter.push(week.id);
                continue;
            }
            if (!controleOperatorShiftReedsGepland(week, missingShiftsWeek)) {
                filter.push(week.id);
                continue;
            }

            if (!DagNaNacht(week, historyIndividualEmployee)) {
                filter.push(week.id);
                continue;
            }
            if (!OverurenWeekControle(week, historyIndividualEmployee)) {
                filter.push(week.id);
                continue;
            }
            if (!TweeLegeShiftenTussen3NachtenEnDagShift(week, historyIndividualEmployee)) {
                filter.push(week.id);
                continue;
            }
            if (!DrieLegeShiftenTussen4NachtenEnDagShift(week, historyIndividualEmployee)) {
                filter.push(week.id);
                continue;
            }
            if (!Max4OperatorShifts(week, historyIndividualEmployee)) {
                filter.push(week.id);
                continue;
            }
            if (!TweeBlancoShiftsNaWeekendMet3Nacht(week, historyIndividualEmployee)) {
                filter.push(week.id);
                continue;
            }

            
            if (!filter.some(x => x === week.id)) {
                possible_IDs.push(week.id)

            }


        }
        possible_IDs = possible_IDs.sort(function (a, b) {
            return a - b;
        })

        return possible_IDs;



    }
    const controleTweeShiftenOpEenDag = (week, history) => {

        if (week.maandag !== "" && history[history.length - 7] !== "") {
            return false;
        }
        if (week.dinsdag !== "" && history[history.length - 6] !== "") {
            return false;

        }
        if (week.woensdag !== "" && history[history.length - 5] !== "") {
            return false;

        }
        if (week.donderdag !== "" && history[history.length - 4] !== "") {
            return false;

        }
        if (week.vrijdag !== "" && history[history.length - 3] !== "") {
            return false;

        }
        if (week.zaterdag !== "" && history[history.length - 2] !== "") {
            return false;

        }
        if (week.zondag !== "" && history[history.length - 1] !== "") {
            return false;

        }

        return true;



    }
    const controleOperatorShiftReedsGepland = (week, missingShiftsWeek) => {

        if (week.maandag !== "" && !missingShiftsWeek[0].includes(week.maandag)) {
            return false;
        }
        if (week.dinsdag !== "" && !missingShiftsWeek[1].includes(week.dinsdag)) {
            return false;
        }
        if (week.woensdag !== "" && !missingShiftsWeek[2].includes(week.woensdag)) {
            return false;
        }
        if (week.donderdag !== "" && !missingShiftsWeek[3].includes(week.donderdag)) {
            return false;
        }
        if (week.vrijdag !== "" && !missingShiftsWeek[4].includes(week.vrijdag)) {
            return false;
        }
        if (week.zaterdag !== "" && !missingShiftsWeek[5].includes(week.zaterdag)) {
            return false;
        }
        if (week.zondag !== "" && !missingShiftsWeek[6].includes(week.zondag)) {
            return false;
        }

        return true;

    }
    const controleGeenNachten = (week) => {
        const nightShifts = ["1806", "1907"];

        if (
            nightShifts.includes(week.maandag) ||
            nightShifts.includes(week.dinsdag) ||
            nightShifts.includes(week.woensdag) ||
            nightShifts.includes(week.donderdag) ||
            nightShifts.includes(week.vrijdag) ||
            nightShifts.includes(week.zaterdag) ||
            nightShifts.includes(week.zondag)
        ) {
            return false;
        }
        return true;


    }
    const controleGeenDagen = (week) => {
        const dayShifts = ["0618", "0719"];

        if (
            dayShifts.includes(week.maandag) ||
            dayShifts.includes(week.dinsdag) ||
            dayShifts.includes(week.woensdag) ||
            dayShifts.includes(week.donderdag) ||
            dayShifts.includes(week.vrijdag) ||
            dayShifts.includes(week.zaterdag) ||
            dayShifts.includes(week.zondag)
        ) {
            return false;
        }
        return true;


    }
    const controleGeenWeekend = (week) => {
        const nightShifts = ["1806", "1907"];

        if (

            week.zaterdag !== '' ||
            week.zondag !== '' ||
            nightShifts.includes(week.vrijdag)

        ) {
            return false;
        }
        return true;
    }
    const get1DayEarlierFromString = (date) => {
        let OldDay = date.substring(0, 2);
        let OldMonth = date.substring(3, 5);
        let OldYear = date.substring(6, 10);
        let oldData = new Date(OldYear, parseInt(OldMonth) - 1, OldDay);
        let returnData = new Date(oldData - 86400000);

        const [month, day, year] = [returnData.getMonth(), returnData.getDate(), returnData.getFullYear()];


        return `${('0' + day).slice(-2)}-${('0' + (month+1)).slice(-2)}-${year}`

    }
    const get1DayLaterFromString = (date) => {
        let OldDay = date.substring(0, 2);
        let OldMonth = date.substring(3, 5);
        let OldYear = date.substring(6, 10);
        let oldData = new Date(OldYear, parseInt(OldMonth) - 1, OldDay);
        let returnData = new Date(oldData + 86400000);

        const [month, day, year] = [returnData.getMonth(), returnData.getDate(), returnData.getFullYear()];


        return `${('0' + day).slice(-2)}-${('0' + (month+1)).slice(-2)}-${year}`

    }
    const get1WeekLaterFromString = (date) => {
        let OldDay = date.substring(0, 2);
        let OldMonth = date.substring(3, 5);
        let OldYear = date.substring(6, 10);
        let oldData = new Date(OldYear, parseInt(OldMonth) - 1, OldDay);
        oldData.setDate(oldData.getDate() + 7);

        const [month, day, year] = [oldData.getMonth(), oldData.getDate(), oldData.getFullYear()];


        return `${('0' + day).slice(-2)}-${('0' + (month+1)).slice(-2)}-${year}`

    }
    const calcIncompatibelWeeks = ({
        weeklyStructures
    }) => {

        let returnObj = {};

        for (let index = 0; index < weeklyStructures.length; index++) {

            let week = weeklyStructures[index];
            let incompatibelWeeks = [];

            weeklyStructures.filter(x => x.id !== week.id).forEach((incompWeek) => {

                if (
                    (week.maandag !== '' && week.maandag === incompWeek.maandag) ||
                    (week.dinsdag !== '' && week.dinsdag === incompWeek.dinsdag) ||
                    (week.woensdag !== '' && week.woensdag === incompWeek.woensdag) ||
                    (week.donderdag !== '' && week.donderdag === incompWeek.donderdag) ||
                    (week.vrijdag !== '' && week.vrijdag === incompWeek.vrijdag) ||
                    (week.zaterdag !== '' && week.zaterdag === incompWeek.zaterdag) ||
                    (week.zondag !== '' && week.zondag === incompWeek.zondag)
                ) {
                    incompatibelWeeks.push(incompWeek.id);
                }
            })

            returnObj[`${week.id}`] = incompatibelWeeks;

        }
        return returnObj;




    }

    const OverurenWeekControle = (week, history) => {


        return true;
    }

    const TweeLegeShiftenTussen3NachtenEnDagShift = (week, history) => {
        let hulpHistory = [...history];

        if (week.maandag !== "") {
            hulpHistory[history.length - 7] = week.maandag;
        }
        if (week.dinsdag !== "") {
            hulpHistory[history.length - 6] = week.dinsdag;
        }
        if (week.woensdag !== "") {
            hulpHistory[history.length - 5] = week.woensdag;
        }
        if (week.donderdag !== "") {
            hulpHistory[history.length - 4] = week.donderdag;
        }
        if (week.vrijdag !== "") {
            hulpHistory[history.length - 3] = week.vrijdag;
        }
        if (week.zaterdag !== "") {
            hulpHistory[history.length - 2] = week.zaterdag;
        }
        if (week.zondag !== "") {
            hulpHistory[history.length - 1] = week.zondag;
        }
        let opeenVolgendeNachtenShiften = 0;
        let blankoShift = 0;

        for (let individualDayLooper = hulpHistory.length - 10; individualDayLooper < hulpHistory.length; individualDayLooper++) {

            if (["1806", "1907"].includes(hulpHistory[individualDayLooper]) && blankoShift !== 0 && opeenVolgendeNachtenShiften !== 0) {
                blankoShift = 0;
                opeenVolgendeNachtenShiften = 1;
                continue;
            } else if (["1806", "1907"].includes(hulpHistory[individualDayLooper])) {
                opeenVolgendeNachtenShiften++;
                continue;
            } else if (hulpHistory[individualDayLooper] === '' && opeenVolgendeNachtenShiften !== 0) {
                blankoShift++;
                continue;
            }
            if (opeenVolgendeNachtenShiften === 3 && blankoShift < 2) {
                return false;

            }
        }
        return true;
    }

    const DrieLegeShiftenTussen4NachtenEnDagShift = (week, history) => {
        let hulpHistory = [...history];

        if (week.maandag !== "") {
            hulpHistory[history.length - 7] = week.maandag;
        }
        if (week.dinsdag !== "") {
            hulpHistory[history.length - 6] = week.dinsdag;
        }
        if (week.woensdag !== "") {
            hulpHistory[history.length - 5] = week.woensdag;
        }
        if (week.donderdag !== "") {
            hulpHistory[history.length - 4] = week.donderdag;
        }
        if (week.vrijdag !== "") {
            hulpHistory[history.length - 3] = week.vrijdag;
        }
        if (week.zaterdag !== "") {
            hulpHistory[history.length - 2] = week.zaterdag;
        }
        if (week.zondag !== "") {
            hulpHistory[history.length - 1] = week.zondag;
        }
        let opeenVolgendeNachtenShiften = 0;
        let blankoShift = 0;

        for (let individualDayLooper = hulpHistory.length - 11; individualDayLooper < hulpHistory.length; individualDayLooper++) {

            if (["1806", "1907"].includes(hulpHistory[individualDayLooper]) && blankoShift !== 0 && opeenVolgendeNachtenShiften !== 0) {
                blankoShift = 0;
                opeenVolgendeNachtenShiften = 1;
                continue;
            } else if (["1806", "1907"].includes(hulpHistory[individualDayLooper])) {
                opeenVolgendeNachtenShiften++;
                continue;
            } else if (hulpHistory[individualDayLooper] === '' && opeenVolgendeNachtenShiften !== 0) {
                blankoShift++;
                continue;
            }
            if (opeenVolgendeNachtenShiften === 4 && blankoShift < 3) {
                return false;

            }
        }
        return true;
    }

    const Max4OperatorShifts = (week, history) => {

        let hulpHistory = [...history];

        if (week.maandag !== "") {
            hulpHistory[history.length - 7] = week.maandag;
        }
        if (week.dinsdag !== "") {
            hulpHistory[history.length - 6] = week.dinsdag;
        }
        if (week.woensdag !== "") {
            hulpHistory[history.length - 5] = week.woensdag;
        }
        if (week.donderdag !== "") {
            hulpHistory[history.length - 4] = week.donderdag;
        }
        if (week.vrijdag !== "") {
            hulpHistory[history.length - 3] = week.vrijdag;
        }
        if (week.zaterdag !== "") {
            hulpHistory[history.length - 2] = week.zaterdag;
        }
        if (week.zondag !== "") {
            hulpHistory[history.length - 1] = week.zondag;
        }
        let shiftCounter = 0;
        for (let individualDayLooper = hulpHistory.length - 10; individualDayLooper < hulpHistory.length; individualDayLooper++) {


            if (["0618", "0719", "1806", "1907"].some(x => x === hulpHistory[individualDayLooper])) {
                shiftCounter++;
            } else {
                shiftCounter = 0;
            }

            if (shiftCounter > 4) {
                return false;
            }
        }

        return true;
    }

    const DagNaNacht = (week, history) => {

        let hulpHistory = [...history];

        if (week.maandag !== "") {
            hulpHistory[history.length - 7] = week.maandag;
        }
        if (week.dinsdag !== "") {
            hulpHistory[history.length - 6] = week.dinsdag;
        }
        if (week.woensdag !== "") {
            hulpHistory[history.length - 5] = week.woensdag;
        }
        if (week.donderdag !== "") {
            hulpHistory[history.length - 4] = week.donderdag;
        }
        if (week.vrijdag !== "") {
            hulpHistory[history.length - 3] = week.vrijdag;
        }
        if (week.zaterdag !== "") {
            hulpHistory[history.length - 2] = week.zaterdag;
        }
        if (week.zondag !== "") {
            hulpHistory[history.length - 1] = week.zondag;
        }

        for (let individualDayLooper = hulpHistory.length - 7; individualDayLooper < hulpHistory.length; individualDayLooper++) {


            let shift = hulpHistory[individualDayLooper]
            let passedShift = hulpHistory[individualDayLooper - 1]
            if (["1806", "1907"].some(x => x === passedShift) && ["0618", "0719"].some(x => x === shift)) {
                return false;
            }
        }

        return true;
    }

    const TweeBlancoShiftsNaWeekendMet3Nacht = (week, history) => {

        if (["1806", "1907"].includes(history[history.length - 8]) && ["1806", "1907"].includes(history[history.length - 9]) && ["1806", "1907"].includes(history[history.length - 10])) {

            if (week.maandag !== "" || week.dinsdag !== "") {
                return false;
            }

        }

        return true;
    }


};