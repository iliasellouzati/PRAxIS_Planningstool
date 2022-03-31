// eslint-disable-next-line import/no-anonymous-default-export
export default () => {



    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (message) => {

        let response = [];

        switch (message.data[0]) {
            case "INIT":
                response = checkPossibleWeeklyStructures(message.data[1]);
                postMessage(["POSSIBLE_IDS_FOUND", response]);
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
        config,
        previousWeeks,
        missingShiftsWeek,
        WeekNumber
    }) => {

        let possibleWeeklyStructures = [];

        for (let index = 0; index < employees.length; index++) {
            let hulpList = checkPossibleWeeklyStructuresIndividualy(
                weeklyStructures,
                employees[index],
                config.find(x => x.employeeId === employees[index].id),
                missingShiftsWeek,
                previousWeeks.find(x => x.employeeId === employees[index].id).week,
                WeekNumber
            );
            possibleWeeklyStructures.push({
                "employeeId": employees[index].id,
                "possibleWeeks": hulpList
            });


        }

        return possibleWeeklyStructures;
    }

    const checkPossibleWeeklyStructuresIndividualy = (weeklyStructures, employee, config, missingShiftsWeek, prevWeek, WeekNumber) => {


        const dayShifts = ["0618", "0719"];
        const nightShifts = ["1806", "1907"];


        let currentWeek = [...prevWeek];

        let possible_IDs = [];

        let filter = [];

        //controle 1shift/week enkel voor 4/5
        if (employee.contracttype_id !== 5) {
            weeklyStructures.forEach((week) => {
                let i = 0;
                if (week.maandag !== "") {
                    i++;
                }
                if (week.dinsdag !== "") {
                    i++;
                }
                if (week.woensdag !== "") {
                    i++;
                }
                if (week.donderdag !== "") {
                    i++;
                }
                if (week.vrijdag !== "") {
                    i++;
                }
                if (week.zaterdag !== "") {
                    i++;
                }
                if (week.zondag !== "") {
                    i++;
                }
                if (i === 1) {
                    !filter.some(x => x === week.id) && filter.push(week.id)
                }
            })

        }

        //controle 4shift/week enkel niet voor 4/5
        if (employee.contracttype_id === 5) {


            for (let index = 0; index < weeklyStructures.length; index++) {
                let i = 0;
                if (weeklyStructures[index].maandag !== "") {
                    i++;
                }
                if (weeklyStructures[index].dinsdag !== "") {
                    i++;
                }
                if (weeklyStructures[index].woensdag !== "") {
                    i++;
                }
                if (weeklyStructures[index].donderdag !== "") {
                    i++;
                }
                if (weeklyStructures[index].vrijdag !== "") {
                    i++;
                }
                if (weeklyStructures[index].zaterdag !== "") {
                    i++;
                }
                if (weeklyStructures[index].zondag !== "") {
                    i++;
                }

                if (i > 3) {
                    !filter.some(x => x === weeklyStructures[index].id) && filter.push(weeklyStructures[index].id)

                }
            }
        }

        //contole dag/nacht structuur en weekendstructuur
        let nachtStructuur = config[WeekNumber].night;
        let weekendToegelaten = config[WeekNumber].weekend;

        weeklyStructures.forEach((week) => {

            if (!weekendToegelaten && (nightShifts.some(x => x === week.vrijdag) || week.zaterdag !== "" || week.zondag !== "")) {
                !filter.some(x => x === week.id) && filter.push(week.id);
            } else if (weekendToegelaten && (week.zaterdag === "" || week.zondag === "")) {
                !filter.some(x => x === week.id) && filter.push(week.id);
            }


            if (nachtStructuur) {
                if (dayShifts.includes(week.maandag) ||
                    dayShifts.includes(week.dinsdag) ||
                    dayShifts.includes(week.woensdag) ||
                    dayShifts.includes(week.donderdag) ||
                    dayShifts.includes(week.vrijdag) ||
                    dayShifts.includes(week.zaterdag) ||
                    dayShifts.includes(week.zondag)) {
                    !filter.some(x => x === week.id) && filter.push(week.id)
                }

            } else {
                if (nightShifts.includes(week.maandag) ||
                    nightShifts.includes(week.dinsdag) ||
                    nightShifts.includes(week.woensdag) ||
                    nightShifts.includes(week.donderdag) ||
                    nightShifts.includes(week.vrijdag) ||
                    nightShifts.includes(week.zaterdag) ||
                    nightShifts.includes(week.zondag)) {
                    !filter.some(x => x === week.id) && filter.push(week.id)
                }
            }
        })

        //controle dubbele shiften
        for (let index = 0; index < weeklyStructures.length; index++) {

            if (weeklyStructures[index].maandag !== "" && !missingShiftsWeek[parseInt(WeekNumber) - 1][0].includes(weeklyStructures[index].maandag)) {
                !filter.some(x => x === weeklyStructures[index].id) && filter.push(weeklyStructures[index].id);
                continue;

            }
            if (weeklyStructures[index].dinsdag !== "" && !missingShiftsWeek[parseInt(WeekNumber) - 1][1].includes(weeklyStructures[index].dinsdag)) {
                !filter.some(x => x === weeklyStructures[index].id) && filter.push(weeklyStructures[index].id);
                continue;
            }
            if (weeklyStructures[index].woensdag !== "" && !missingShiftsWeek[parseInt(WeekNumber) - 1][2].includes(weeklyStructures[index].woensdag)) {
                !filter.some(x => x === weeklyStructures[index].id) && filter.push(weeklyStructures[index].id);
                continue;
            }
            if (weeklyStructures[index].donderdag !== "" && !missingShiftsWeek[parseInt(WeekNumber) - 1][3].includes(weeklyStructures[index].donderdag)) {
                !filter.some(x => x === weeklyStructures[index].id) && filter.push(weeklyStructures[index].id);
                continue;
            }
            if (weeklyStructures[index].vrijdag !== "" && !missingShiftsWeek[parseInt(WeekNumber) - 1][4].includes(weeklyStructures[index].vrijdag)) {
                !filter.some(x => x === weeklyStructures[index].id) && filter.push(weeklyStructures[index].id);
                continue;
            }
            if (weeklyStructures[index].zaterdag !== "" && !missingShiftsWeek[parseInt(WeekNumber) - 1][5].includes(weeklyStructures[index].zaterdag)) {
                !filter.some(x => x === weeklyStructures[index].id) && filter.push(weeklyStructures[index].id);
                continue;
            }
            if (weeklyStructures[index].zondag !== "" && !missingShiftsWeek[parseInt(WeekNumber) - 1][6].includes(weeklyStructures[index].zondag)) {
                !filter.some(x => x === weeklyStructures[index].id) && filter.push(weeklyStructures[index].id);
                continue;
            }

        }



        //controle de andere filters
        weeklyStructures.filter(x => !filter.includes(x.id)).forEach(week => {

            let tempKalendar = [...currentWeek, week.maandag, week.dinsdag, week.woensdag, week.donderdag, week.vrijdag, week.zaterdag, week.zondag];



            if (isWeekPossible(tempKalendar)) {
                possible_IDs.push(week.id);
            }

        })




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