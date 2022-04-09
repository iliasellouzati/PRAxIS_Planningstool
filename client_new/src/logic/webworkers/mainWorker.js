

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

    

    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (message) => {

        let response = [];

        switch (message.data[0]) {
            case "INIT":
                response=checkPossibleWeeklyStructures(message.data[1]);
                
                postMessage(["POSSIBLE_IDS_FOUND", message.data[1]]);
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
        employees,
        logaritme,
        history,
        missingShiftsWeek,
        weeksToCheck
        }) => {

        let possibleWeeklyStructures = [];

        for (let index = 0; index < employees.length; index++) {
            let hulpList = checkPossibleWeeklyStructuresIndividualy(
                weeklyStructures,
                employees[index],
                logaritme,
                history[`${employees[index]}`],
                missingShiftsWeek,
                weeksToCheck[0]
            );

            possibleWeeklyStructures.push({
                "employeeId": employees[index].id,
                "possibleWeeks": hulpList
            });


        }

        return possibleWeeklyStructures;
    }

    const checkPossibleWeeklyStructuresIndividualy = (weeklyStructures, employee, logaritme, history, missingShiftsWeek, weeksToCheck) => {

        const moment = require('moment'); //moment


        const dayShifts = ["0618", "0719"];
        const nightShifts = ["1806", "1907"];
        let numberOfWeeksToCheck =logaritme.data.maxWeeks +1 ;

        let weekToCheckMoment=moment(weeksToCheck,"DD-MM-YYYY");






        

        let possible_IDs = [];

        let filter = [];




        return possible_IDs;



    }

    const isWeekPossible = (week) => {

        const dayShifts = ["0618", "0719"];
        const nightShifts = ["1806", "1907"];

        let hulpVarVierOpeenvolgendeShiften = 0;
        /*  Controle MAX 4 opeenvolgende shiften */
        for (let index = 0; index < week.length; index++) {

            if (week[index] === "") {
                hulpVarVierOpeenvolgendeShiften = 0;
            } else {
                hulpVarVierOpeenvolgendeShiften++;
            }

            if (hulpVarVierOpeenvolgendeShiften > 4) {
                return false;
            }

        }



        /*  Controle 2(3) blanco shift tussen 3(4) nachtshifts en nieuwe dagshift */

        let aantalOpeenVolgendeNachten = 0;
        let aantalBlancoShifts = 0;

        for (let index = 0; index < week.length; index++) {

            if (nightShifts.includes(week[index])) {
                aantalOpeenVolgendeNachten++;
            }
            if (week[index] === "") {
                aantalBlancoShifts++;
            }

            if (dayShifts.includes(week[index])) {
                if (aantalOpeenVolgendeNachten === 3 && aantalBlancoShifts < 2) {
                    return false;
                }
                if (aantalOpeenVolgendeNachten === 4 && aantalBlancoShifts < 3) {
                    return false;
                }
            }
        }





        /* return true indien alles oke is */
        return true;

    }

};