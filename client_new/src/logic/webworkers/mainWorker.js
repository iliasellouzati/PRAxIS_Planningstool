/* eslint-disable eqeqeq */
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {



    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (message) => {

        let response = [];
        let incompatibelWeeks = [];

        switch (message.data[0]) {
            case "INIT":
                incompatibelWeeks = calcIncompatibelWeeks(message.data[1]);
                response = checkPossibleWeeklyStructures(message.data[1]);
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


    const checkPossibleWeeklyStructures = ({
        weeklyStructures,
        employeesDB,
        employeesSelectedIDs,
        logaritme,
        history,
        missingShiftsWeek,
        selectedWeeks,
        contractTypes,
        stats,
        tolerantie
    }) => {

        let possibleWeeklyStructures = [];

        let debugTextHeader = `WEEK : ${selectedWeeks[0]} `

        console.log('%c' + debugTextHeader, 'background: yellow; font-size:32px; font-weight:bold; border:3px green solid; color: #df0024;');


        for (let index = 0; index < employeesSelectedIDs.length; index++) {
            let hulpList = checkPossibleWeeklyStructuresIndividualy(
                weeklyStructures,
                employeesSelectedIDs[index],
                logaritme,
                history[`${employeesSelectedIDs[index]}`],
                missingShiftsWeek[0],
                selectedWeeks[0],
                employeesDB,
                contractTypes,
                stats[`${employeesSelectedIDs[index]}`],
                tolerantie[`${employeesSelectedIDs[index]}`]
            );

            let debuggedList = hulpList[1];
            hulpList = hulpList[0];

            let debugValuePassedWeeks = {
                "dag": hulpList.filter(x => !weeklyStructures.find(y => y.id === x).nacht_week && !weeklyStructures.find(y => y.id === x).omschakeling_dag_naar_nacht && !weeklyStructures.find(y => y.id === x).omschakeling_nacht_naar_dag)
                    .map(week => [`ID: ${weeklyStructures.find(y => y.id === week).id} - MA : ${weeklyStructures.find(y => y.id === week).maandag} - DI : ${weeklyStructures.find(y => y.id === week).dinsdag} - WO : ${weeklyStructures.find(y => y.id === week).woensdag} - DO : ${weeklyStructures.find(y => y.id === week).donderdag} - VR : ${weeklyStructures.find(y => y.id === week).vrijdag} - ZA : ${weeklyStructures.find(y => y.id === week).zaterdag} - ZO : ${weeklyStructures.find(y => y.id === week).zondag} `]),
                "nacht": hulpList.filter(x => weeklyStructures.find(y => y.id === x).nacht_week)
                    .map(week => [`ID: ${weeklyStructures.find(y => y.id === week).id} - MA : ${weeklyStructures.find(y => y.id === week).maandag} - DI : ${weeklyStructures.find(y => y.id === week).dinsdag} - WO : ${weeklyStructures.find(y => y.id === week).woensdag} - DO : ${weeklyStructures.find(y => y.id === week).donderdag} - VR : ${weeklyStructures.find(y => y.id === week).vrijdag} - ZA : ${weeklyStructures.find(y => y.id === week).zaterdag} - ZO : ${weeklyStructures.find(y => y.id === week).zondag} `]),
                'omschakeling_dag_naar_nacht': hulpList.filter(x => weeklyStructures.find(y => y.id === x).omschakeling_dag_naar_nacht)
                    .map(week => [`ID: ${weeklyStructures.find(y => y.id === week).id} - MA : ${weeklyStructures.find(y => y.id === week).maandag} - DI : ${weeklyStructures.find(y => y.id === week).dinsdag} - WO : ${weeklyStructures.find(y => y.id === week).woensdag} - DO : ${weeklyStructures.find(y => y.id === week).donderdag} - VR : ${weeklyStructures.find(y => y.id === week).vrijdag} - ZA : ${weeklyStructures.find(y => y.id === week).zaterdag} - ZO : ${weeklyStructures.find(y => y.id === week).zondag} `]),
                'omschakeling_nacht_naar_dag': hulpList.filter(x => weeklyStructures.find(y => y.id === x).omschakeling_nacht_naar_dag)
                    .map(week => [`ID: ${weeklyStructures.find(y => y.id === week).id} - MA : ${weeklyStructures.find(y => y.id === week).maandag} - DI : ${weeklyStructures.find(y => y.id === week).dinsdag} - WO : ${weeklyStructures.find(y => y.id === week).woensdag} - DO : ${weeklyStructures.find(y => y.id === week).donderdag} - VR : ${weeklyStructures.find(y => y.id === week).vrijdag} - ZA : ${weeklyStructures.find(y => y.id === week).zaterdag} - ZO : ${weeklyStructures.find(y => y.id === week).zondag} `])
            };
            let debugValueFailedWeeks = {
                "dag": weeklyStructures.map(week => week.id).filter(z => !hulpList.includes(z)).filter(x => !weeklyStructures.find(y => y.id === x).nacht_week && !weeklyStructures.find(y => y.id === x).omschakeling_dag_naar_nacht && !weeklyStructures.find(y => y.id === x).omschakeling_nacht_naar_dag)
                    .map(week => [`ID: ${weeklyStructures.find(y => y.id === week).id} - MA : ${weeklyStructures.find(y => y.id === week).maandag} - DI : ${weeklyStructures.find(y => y.id === week).dinsdag} - WO : ${weeklyStructures.find(y => y.id === week).woensdag} - DO : ${weeklyStructures.find(y => y.id === week).donderdag} - VR : ${weeklyStructures.find(y => y.id === week).vrijdag} - ZA : ${weeklyStructures.find(y => y.id === week).zaterdag} - ZO : ${weeklyStructures.find(y => y.id === week).zondag} - ERROR: ${debuggedList[`${week}`]} `]),
                "nacht": weeklyStructures.map(week => week.id).filter(z => !hulpList.includes(z)).filter(x => weeklyStructures.find(y => y.id === x).nacht_week)
                    .map(week => [`ID: ${weeklyStructures.find(y => y.id === week).id} - MA : ${weeklyStructures.find(y => y.id === week).maandag} - DI : ${weeklyStructures.find(y => y.id === week).dinsdag} - WO : ${weeklyStructures.find(y => y.id === week).woensdag} - DO : ${weeklyStructures.find(y => y.id === week).donderdag} - VR : ${weeklyStructures.find(y => y.id === week).vrijdag} - ZA : ${weeklyStructures.find(y => y.id === week).zaterdag} - ZO : ${weeklyStructures.find(y => y.id === week).zondag} - ERROR: ${debuggedList[`${week}`]}`]),
                'omschakeling_dag_naar_nacht': weeklyStructures.map(week => week.id).filter(z => !hulpList.includes(z)).filter(x => weeklyStructures.find(y => y.id === x).omschakeling_dag_naar_nacht)
                    .map(week => [`ID: ${weeklyStructures.find(y => y.id === week).id} - MA : ${weeklyStructures.find(y => y.id === week).maandag} - DI : ${weeklyStructures.find(y => y.id === week).dinsdag} - WO : ${weeklyStructures.find(y => y.id === week).woensdag} - DO : ${weeklyStructures.find(y => y.id === week).donderdag} - VR : ${weeklyStructures.find(y => y.id === week).vrijdag} - ZA : ${weeklyStructures.find(y => y.id === week).zaterdag} - ZO : ${weeklyStructures.find(y => y.id === week).zondag} - ERROR: ${debuggedList[`${week}`]}`]),
                'omschakeling_nacht_naar_dag': weeklyStructures.map(week => week.id).filter(z => !hulpList.includes(z)).filter(x => weeklyStructures.find(y => y.id === x).omschakeling_nacht_naar_dag)
                    .map(week => [`ID: ${weeklyStructures.find(y => y.id === week).id} - MA : ${weeklyStructures.find(y => y.id === week).maandag} - DI : ${weeklyStructures.find(y => y.id === week).dinsdag} - WO : ${weeklyStructures.find(y => y.id === week).woensdag} - DO : ${weeklyStructures.find(y => y.id === week).donderdag} - VR : ${weeklyStructures.find(y => y.id === week).vrijdag} - ZA : ${weeklyStructures.find(y => y.id === week).zaterdag} - ZO : ${weeklyStructures.find(y => y.id === week).zondag} - ERROR: ${debuggedList[`${week}`]}`])
            }
            console.log(debugValuePassedWeeks);
            console.log(debugValueFailedWeeks);

            possibleWeeklyStructures.push({
                "employeeId": employeesSelectedIDs[index],
                "possibleWeeks": hulpList
            });
        }

        return possibleWeeklyStructures;
    }
    const checkPossibleWeeklyStructuresIndividualy = (weeklyStructures, employee, logaritme, history, missingShiftsWeek, selectedWeeks, employeesDB, contractTypes, stats, tolerantie) => {

        let employeeObj = employeesDB.find(x => x.id === employee);
        let contracttypeObj = contractTypes.find(x => x.id === employeeObj.contracttype_id);
        let filter = [];
        let dubugFilter = {};

        const dayShifts = [1, 3];
        const nightShifts = [5, 7];
        const operatorShifts = [1, 3, 5, 7]

        let numberOfWeeksToCheck = parseInt(logaritme.data.maxWeeks) >= 4 ? parseInt(logaritme.data.maxWeeks) + 1 : 5;

        let startData = get1WeekLaterFromString(selectedWeeks);
        let historyIndividualEmployee = [];

        for (let index = 0; index < numberOfWeeksToCheck * 7; index++) {
            startData = get1DayEarlierFromString(startData);
            historyIndividualEmployee.unshift(history.history[`${startData}`]);
        }

        let possible_IDs = [];



        let requiredShifts = calculeerAantalInTePlannenUurVoorWeek(stats, selectedWeeks, contracttypeObj, tolerantie);

        let minShifts;
        let maxShifts;

        let debug = (requiredShifts / 12) % 1;

        if (((requiredShifts / 12) % 1) > 0.80) {
            minShifts = Math.ceil(requiredShifts / 12);
            maxShifts = Math.ceil(requiredShifts / 12);
        } else if (((requiredShifts / 12) % 1) < 0.20) {
            minShifts = Math.floor(requiredShifts / 12);
            maxShifts = Math.floor(requiredShifts / 12);
        } else {
            minShifts = Math.floor(requiredShifts / 12);
            maxShifts = Math.ceil(requiredShifts / 12);
        }


        for (let index = 0; index < weeklyStructures.length; index++) {
            let week = weeklyStructures[index];
            let aantal = 0;


            if (week.maandag !== "") {
                aantal++;
            }
            if (week.dinsdag !== "") {
                aantal++;
            }
            if (week.woensdag !== "") {
                aantal++;
            }
            if (week.donderdag !== "") {
                aantal++;
            }
            if (week.vrijdag !== "") {
                aantal++;
            }
            if (week.zaterdag !== "") {
                aantal++;
            }
            if (week.zondag !== "") {
                aantal++;
            }


            if (aantal < minShifts || maxShifts < aantal) {
                filter.push(week.id);
                dubugFilter[`${week.id}`] = "aantal shifts buiten tolerantie";
            }
        }

        let verplichtDAG = false;
        let verplichtNACHT = false;

        let momenteelInDagStructuur = true;
        let weekendToegelatenMetShiftsValue = false;
        let counter = 0;
        let eersteShiftGevonden = false;

        if (contracttypeObj.id === 1) {



            for (let index = historyIndividualEmployee.length - 1; index >= 0; index--) {

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

                // if (Math.ceil(counter / 7) >= logaritme.data.maxWeeks) {
                //     if (momenteelInDagStructuur) {
                //         verplichtNACHT = true;
                //     } else {
                //         verplichtDAG = true;
                //     }
                //     break;
                // }

            }


            for (let index = 0; index < weeklyStructures.length; index++) {

                let week = weeklyStructures[index];

                if (filter.some(x => x === week.id)) {
                    continue;
                }
                if (verplichtDAG && (week.nacht_week || week.omschakeling_dag_naar_nacht)) {
                    filter.push(week.id);
                    dubugFilter[`${week.id}`] = "Verplicht dagweek";
                    continue;
                }
                if (verplichtDAG && momenteelInDagStructuur && week.omschakeling_nacht_naar_dag) {
                    filter.push(week.id);
                    dubugFilter[`${week.id}`] = "Al reeds in dagstructuur en Verplicht dagweek";
                    continue;
                }
                if (verplichtNACHT && (!week.nacht_week || week.omschakeling_nacht_naar_dag)) {
                    filter.push(week.id);
                    dubugFilter[`${week.id}`] = "Verplicht nachtweek";
                    continue;
                }
                if (verplichtNACHT && !momenteelInDagStructuur && week.omschakeling_dag_naar_nacht) {
                    filter.push(week.id);
                    dubugFilter[`${week.id}`] = "Al reeds in nachtstructuur en Verplicht nachtweek";
                    continue;
                }

                if ((!verplichtNACHT && !verplichtDAG) && momenteelInDagStructuur && week.omschakeling_nacht_naar_dag) {
                    filter.push(week.id);
                    dubugFilter[`${week.id}`] = "resulteert is DAG->NACHT->DAG";
                    continue;
                }

                if ((!verplichtNACHT && !verplichtDAG) && !momenteelInDagStructuur && week.omschakeling_dag_naar_nacht) {
                    filter.push(week.id);
                    dubugFilter[`${week.id}`] = "resulteert is NACHT->DAG->NACHT";
                    continue;
                }
            }

            weekendToegelatenMetShiftsValue = WeekendToegelatenMetShifts(historyIndividualEmployee);

            if (!weekendToegelatenMetShiftsValue) {
                for (let index = 0; index < weeklyStructures.length; index++) {

                    let week = weeklyStructures[index];
                    if (filter.some(x => x === week.id)) {
                        continue;
                    }
                    if (!controleGeenWeekend(week)) {
                        filter.push(week.id);
                        dubugFilter[`${week.id}`] = "2 WEEKENDS MET SHIFT GEVOLG DOOR VRIJE WEEKEND";
                    }

                }
            }

        }


        let debugText1 = ` employee ${employeeObj.voornaam} (${employeeObj.id}) `
        let debugText2 = ` MIN ${minShifts} and AVERAGE ${ Math.round(requiredShifts*100 / 12)/100} and MAX ${maxShifts} SHIFTS `;
        let debugText3 = ` VERPLICHTDAG: ${verplichtDAG} and VERPLICHTNACHT: ${verplichtNACHT} and COUNTER: ${counter}`;
        let debugText4 = ` momenteelInDagStructuur :${momenteelInDagStructuur} and weekendToegelatenMetShifts: ${weekendToegelatenMetShiftsValue}`;

        console.log('%c' + debugText1, 'background: #00FF00;font-weight:bold; color: #df0024; border:2px blue solid');
        console.log('%c' + debugText2, 'background: #D3D3D3;font-weight:bold; color: #df0024;');
        console.log('%c' + debugText3, 'background: #D3D3D3;font-weight:bold; color: #df0024;');
        console.log('%c' + debugText4, 'background: #D3D3D3;font-weight:bold; color: #df0024;');




        for (let index = 0; index < weeklyStructures.length; index++) {

            let week = weeklyStructures[index];

            if (filter.includes(week.id)) {
                continue;
            }

            if (!contracttypeObj.nachtshiften_toegelaten && (week.nacht_week || week.omschakeling_nacht_naar_dag || week.omschakeling_dag_naar_nacht)) {
                filter.push(week.id);
                dubugFilter[`${week.id}`] = "Nachten niet toegelaten volgens contract";
                continue;
            }
            if (contracttypeObj.id !== 1 && !controleGeenWeekend(week)) {
                filter.push(week.id);
                dubugFilter[`${week.id}`] = "Weekend niet toegelaten volgens contract";
                continue;
            }
            if (!controleTweeShiftenOpEenDag(week, historyIndividualEmployee)) {
                filter.push(week.id);
                dubugFilter[`${week.id}`] = "Week bevat shiften op reeds gevulde dagen";
                continue;
            }
            if (!controleOperatorShiftReedsGepland(week, missingShiftsWeek)) {
                filter.push(week.id);
                dubugFilter[`${week.id}`] = "Week bevat operatorshiften die al reeds op planning staan";
                continue;
            }

            if (!DagNaNacht(week, historyIndividualEmployee)) {
                filter.push(week.id);
                dubugFilter[`${week.id}`] = "Week resulteert in DAG NA NACHT";
                continue;
            }
            if (!OverurenWeekControle(week, historyIndividualEmployee)) {
                filter.push(week.id);
                dubugFilter[`${week.id}`] = "Week resulteert in overuren situatie";

                continue;
            }
            if (!TweeLegeShiftenTussen3NachtenEnDagShift(week, historyIndividualEmployee)) {
                filter.push(week.id);
                dubugFilter[`${week.id}`] = "Week resulteert in minder dan 2 lege shiften tussen 3nacht en dag";
                continue;
            }
            if (!DrieLegeShiftenTussen4NachtenEnDagShift(week, historyIndividualEmployee)) {
                filter.push(week.id);
                dubugFilter[`${week.id}`] = "Week resulteert in minder dan 3 lege shiften tussen 4nacht en dag";

                continue;
            }
            if (!Max4OperatorShifts(week, historyIndividualEmployee)) {
                filter.push(week.id);
                dubugFilter[`${week.id}`] = "Week resulteert in meer dan 4 operatorshiften";

                continue;
            }
            // if (!TweeBlancoShiftsNaWeekendMet3Nacht(week, historyIndividualEmployee)) {
            //     filter.push(week.id);
            //     dubugFilter[`${week.id}`] = "Week resulteert in geen 2 blacko na weekend met 3 nacht";
            //     continue;
            // }


            if (!filter.some(x => x === week.id)) {
                possible_IDs.push(week.id)

            }


        }
        possible_IDs = possible_IDs.sort(function (a, b) {
            return a - b;
        })

        return [possible_IDs, dubugFilter];



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

        if (week.maandag !== "" && !missingShiftsWeek[0].includes(parseInt(week.maandag))) {
            return false;
        }
        if (week.dinsdag !== "" && !missingShiftsWeek[1].includes(parseInt(week.dinsdag))) {
            return false;
        }
        if (week.woensdag !== "" && !missingShiftsWeek[2].includes(parseInt(week.woensdag))) {
            return false;
        }
        if (week.donderdag !== "" && !missingShiftsWeek[3].includes(parseInt(week.donderdag))) {
            return false;
        }
        if (week.vrijdag !== "" && !missingShiftsWeek[4].includes(parseInt(week.vrijdag))) {
            return false;
        }
        if (week.zaterdag !== "" && !missingShiftsWeek[5].includes(parseInt(week.zaterdag))) {
            return false;
        }
        if (week.zondag !== "" && !missingShiftsWeek[6].includes(parseInt(week.zondag))) {
            return false;
        }

        return true;

    }


    const controleGeenNachten = (week) => {
        const nightShifts = [5, 7];

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
        const dayShifts = [1, 3];

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
        const nightShifts = [5, 7];

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


    const OverurenWeekControle = (week, history) => {


        return true;
    }

    const TweeLegeShiftenTussen3NachtenEnDagShift = (week, history) => {
        let hulpHistory = [...history];

        if (week.maandag !== "") {
            hulpHistory[history.length - 7] = parseInt(week.maandag);
        }
        if (week.dinsdag !== "") {
            hulpHistory[history.length - 6] = parseInt(week.dinsdag);
        }
        if (week.woensdag !== "") {
            hulpHistory[history.length - 5] = parseInt(week.woensdag);
        }
        if (week.donderdag !== "") {
            hulpHistory[history.length - 4] = parseInt(week.donderdag);
        }
        if (week.vrijdag !== "") {
            hulpHistory[history.length - 3] = parseInt(week.vrijdag);
        }
        if (week.zaterdag !== "") {
            hulpHistory[history.length - 2] = parseInt(week.zaterda);
        }
        if (week.zondag !== "") {
            hulpHistory[history.length - 1] = parseInt(week.zondag);
        }
        let opeenVolgendeNachtenShiften = 0;
        let blankoShift = 0;

        for (let individualDayLooper = hulpHistory.length - 10; individualDayLooper < hulpHistory.length; individualDayLooper++) {

            if ([5, 7].includes(hulpHistory[individualDayLooper]) && blankoShift !== 0 && opeenVolgendeNachtenShiften !== 0) {
                blankoShift = 0;
                opeenVolgendeNachtenShiften = 1;
                continue;
            } else if ([5, 7].includes(hulpHistory[individualDayLooper])) {
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
            hulpHistory[history.length - 7] = parseInt(week.maandag);
        }
        if (week.dinsdag !== "") {
            hulpHistory[history.length - 6] = parseInt(week.dinsdag);
        }
        if (week.woensdag !== "") {
            hulpHistory[history.length - 5] = parseInt(week.woensdag);
        }
        if (week.donderdag !== "") {
            hulpHistory[history.length - 4] = parseInt(week.donderdag);
        }
        if (week.vrijdag !== "") {
            hulpHistory[history.length - 3] = parseInt(week.vrijdag);
        }
        if (week.zaterdag !== "") {
            hulpHistory[history.length - 2] = parseInt(week.zaterda);
        }
        if (week.zondag !== "") {
            hulpHistory[history.length - 1] = parseInt(week.zondag);
        }
        let opeenVolgendeNachtenShiften = 0;
        let blankoShift = 0;

        for (let individualDayLooper = hulpHistory.length - 11; individualDayLooper < hulpHistory.length; individualDayLooper++) {

            if ([5, 7].includes(hulpHistory[individualDayLooper]) && blankoShift !== 0 && opeenVolgendeNachtenShiften !== 0) {
                blankoShift = 0;
                opeenVolgendeNachtenShiften = 1;
                continue;
            } else if ([5, 7].includes(hulpHistory[individualDayLooper])) {
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
            hulpHistory[history.length - 7] = parseInt(week.maandag);
        }
        if (week.dinsdag !== "") {
            hulpHistory[history.length - 6] = parseInt(week.dinsdag);
        }
        if (week.woensdag !== "") {
            hulpHistory[history.length - 5] = parseInt(week.woensdag);
        }
        if (week.donderdag !== "") {
            hulpHistory[history.length - 4] = parseInt(week.donderdag);
        }
        if (week.vrijdag !== "") {
            hulpHistory[history.length - 3] = parseInt(week.vrijdag);
        }
        if (week.zaterdag !== "") {
            hulpHistory[history.length - 2] = parseInt(week.zaterda);
        }
        if (week.zondag !== "") {
            hulpHistory[history.length - 1] = parseInt(week.zondag);
        }
        let shiftCounter = 0;
        for (let individualDayLooper = hulpHistory.length - 11; individualDayLooper < hulpHistory.length; individualDayLooper++) {


            if ([1, 3, 5, 7].some(x => x === hulpHistory[individualDayLooper])) {
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
            hulpHistory[history.length - 7] = parseInt(week.maandag);
        }
        if (week.dinsdag !== "") {
            hulpHistory[history.length - 6] = parseInt(week.dinsdag);
        }
        if (week.woensdag !== "") {
            hulpHistory[history.length - 5] = parseInt(week.woensdag);
        }
        if (week.donderdag !== "") {
            hulpHistory[history.length - 4] = parseInt(week.donderdag);
        }
        if (week.vrijdag !== "") {
            hulpHistory[history.length - 3] = parseInt(week.vrijdag);
        }
        if (week.zaterdag !== "") {
            hulpHistory[history.length - 2] = parseInt(week.zaterda);
        }
        if (week.zondag !== "") {
            hulpHistory[history.length - 1] = parseInt(week.zondag);
        }

        for (let individualDayLooper = hulpHistory.length - 7; individualDayLooper < hulpHistory.length; individualDayLooper++) {


            let shift = hulpHistory[individualDayLooper]
            let passedShift = hulpHistory[individualDayLooper - 1]
            if ([5, 7].some(x => x === passedShift) && [1, 3].some(x => x === shift)) {
                return false;
            }
        }

        return true;
    }

    const TweeBlancoShiftsNaWeekendMet3Nacht = (week, history) => {

        if ([5, 7].includes(history[history.length - 8]) && [5, 7].includes(history[history.length - 9]) && [5, 7].includes(history[history.length - 10])) {

            if (week.maandag !== "" || week.dinsdag !== "") {
                return false;
            }

        }

        return true;
    }

    const WeekendToegelatenMetShifts = (history) => {

        let voorbijeWeekMetShifts = false;

        let tweeWekenGeledenMetShifts = false;

        if ([1, 3, 7, 5].some(x => x == history[history.length - 8]) || [1, 3, 7, 5].some(x => x == history[history.length - 9]) || [7, 5].some(x => x == history[history.length - 10])) {
            voorbijeWeekMetShifts = true;
        }

        if ([1, 3, 7, 5].some(x => x == history[history.length - 15]) || [1, 3, 7, 5].some(x => x == history[history.length - 16]) || [7, 5].some(x => x == history[history.length - 17])) {
            tweeWekenGeledenMetShifts = true;
        }
        if (voorbijeWeekMetShifts && tweeWekenGeledenMetShifts) {
            return false;

        } else {
            return true;
        }

    }


    const calculeerAantalInTePlannenUurVoorWeek = (stats, missingShiftsWeek, contracttypeObj, tolerantie) => {


        let OldDay = missingShiftsWeek.substring(0, 2);
        let OldMonth = missingShiftsWeek.substring(3, 5);
        let OldYear = missingShiftsWeek.substring(6, 10);
        let currWeekDate = new Date(OldYear, parseInt(OldMonth) - 1, OldDay);
        let totalDaysInCurrMonth = new Date(OldYear, OldMonth, 0).getDate();
        let diffTime;
        let endWeekQuarter;


        let aantalInKwartaal = 0;
        let vereistKwartaal = 13 * contracttypeObj.wekelijkse_contract_uren;
        let aantalResterendeDagenInKwartaal;


        let aantalInMaand = stats.maand[`${missingShiftsWeek.substring(3, 5)}-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`${missingShiftsWeek.substring(3, 5)}-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand;
        let resterendeDagenInMaand = totalDaysInCurrMonth - parseInt(missingShiftsWeek.substring(0, 2));

        if (tolerantie !== undefined) {
            aantalInKwartaal = tolerantie;
            aantalInMaand += tolerantie;
        }



        switch (missingShiftsWeek.substring(3, 5)) {
            case "01":
            case "02":
            case "03":
                aantalInKwartaal += stats.maand[`01-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`01-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand +
                    stats.maand[`02-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`02-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand +
                    stats.maand[`03-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`03-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand;


                endWeekQuarter = new Date(OldYear, 2, 31);
                diffTime = Math.abs(endWeekQuarter - currWeekDate);
                aantalResterendeDagenInKwartaal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                break;
            case "04":
            case "05":
            case "06":
                aantalInKwartaal += stats.maand[`04-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`04-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand +
                    stats.maand[`05-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`05-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand +
                    stats.maand[`06-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`06-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand;

                endWeekQuarter = new Date(OldYear, 5, 30);
                diffTime = Math.abs(endWeekQuarter - currWeekDate);
                aantalResterendeDagenInKwartaal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                break;
            case "07":
            case "08":
            case "09":
                aantalInKwartaal += stats.maand[`07-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`07-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand +
                    stats.maand[`08-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`08-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand +
                    stats.maand[`09-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`09-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand;


                endWeekQuarter = new Date(OldYear, 8, 30);
                diffTime = Math.abs(endWeekQuarter - currWeekDate);
                aantalResterendeDagenInKwartaal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                break;

            case "10":
            case "11":
            case "12":
                aantalInKwartaal += stats.maand[`10-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`10-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand +
                    stats.maand[`11-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`11-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand +
                    stats.maand[`12-${missingShiftsWeek.substring(6,10)}`].cumul.totaalUrenOpKalender + stats.maand[`12-${missingShiftsWeek.substring(6,10)}`].cumul.urenUitVorigeMaand;



                endWeekQuarter = new Date(OldYear, 11, 31);
                diffTime = Math.abs(endWeekQuarter - currWeekDate);
                aantalResterendeDagenInKwartaal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                break;

            default:
                break;
        }

        let resterendeVereisteKwartaalUren = (vereistKwartaal - aantalInKwartaal);

        let shiftRequiredWeeklyBasedOnQuarted = (resterendeVereisteKwartaalUren / aantalResterendeDagenInKwartaal) * 7

        let requiredContractHoursMonth = ((contracttypeObj.wekelijkse_contract_uren / 7) * totalDaysInCurrMonth)

        let shiftRequiredWeeklyBasedOnMonth = ((requiredContractHoursMonth - aantalInMaand) / resterendeDagenInMaand) * 7

        // if (shiftRequiredWeeklyBasedOnMonth > shiftRequiredWeeklyBasedOnQuarted) {
        //     return shiftRequiredWeeklyBasedOnMonth;
        // } else {
        //     return shiftRequiredWeeklyBasedOnQuarted
        // }

        return shiftRequiredWeeklyBasedOnMonth;
    }
};