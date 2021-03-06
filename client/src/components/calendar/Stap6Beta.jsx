import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as MOMENT_OPERATIONS from '../../moment_operations';
import { addShift } from '../../store/actions/shiftActions';




const Stap6Beta = ({ setStap6Week }) => {
    const dispatch = useDispatch();


    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { datum, calendar } = currentCalendar;

    const contracttypeList = useSelector((state) => state.contracttypeList);
    const { contracttypes } = contracttypeList;

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;

    const employeesList = useSelector((state) => state.employeesList);
    const { employees } = employeesList;

    const beta = useSelector((state) => state.beta);
    const { nonOperatorConfig, OperatorConfig, weekStructuren } = beta;

    const [TeAutomatiserenWeek, setTeAutomatiserenWeek] = useState(1);

    const [LOADING, setLOADING] = useState(false);

    let hulpCalenderMetDeDagen = MOMENT_OPERATIONS.getCalendarMonth_ArrayWithMoment(moment(datum, "MM-YYYY"));
    let hulpCalenderMetOntbrekendeShiften = [];
    const verplichteShiften = ["0618", "0719", "1806", "1907"];
    let mogelijkeCombinaties = [];


    const [OntbrekendeShiften, setOntbrekendeShiften] = useState([]);
    const [MogelijkeStructerenArrayWeek1, setMogelijkeStructerenArrayWeek1] = useState([]);

    const [AantalDagenWeek1, setAantalDagenWeek1] = useState("");
    const [AantalDagenWeek2, setAantalDagenWeek2] = useState("");
    const [AantalDagenWeek3, setAantalDagenWeek3] = useState("");
    const [AantalDagenWeek4, setAantalDagenWeek4] = useState("");
    const [AantalDagenWeek5, setAantalDagenWeek5] = useState("");


    const checkOntbrekendeShiften = () => {
        for (let index = 0; index < hulpCalenderMetDeDagen.length; index++) {
            hulpCalenderMetOntbrekendeShiften.push(Array(7).fill(0).map(() => verplichteShiften));
        }

        calendar.forEach(empl => {
            empl.employeeCalendar.forEach((shiftDay, index) => {

                if (verplichteShiften.includes(shiftDay.shift)) {
                    let hulpVal = hulpCalenderMetOntbrekendeShiften[Math.floor(index / 7)][index % 7];
                    hulpVal = hulpVal.filter(x => x !== shiftDay.shift);
                    hulpCalenderMetOntbrekendeShiften[Math.floor(index / 7)][index % 7] = hulpVal;
                }
            })
        })
        let hlpval1 = hulpCalenderMetOntbrekendeShiften[0][0].length + hulpCalenderMetOntbrekendeShiften[0][1].length +
            hulpCalenderMetOntbrekendeShiften[0][2].length + hulpCalenderMetOntbrekendeShiften[0][3].length +
            hulpCalenderMetOntbrekendeShiften[0][4].length + hulpCalenderMetOntbrekendeShiften[0][5].length +
            hulpCalenderMetOntbrekendeShiften[0][6].length;

        let hlpval2 = hulpCalenderMetOntbrekendeShiften[1][0].length + hulpCalenderMetOntbrekendeShiften[1][1].length +
            hulpCalenderMetOntbrekendeShiften[1][2].length + hulpCalenderMetOntbrekendeShiften[1][3].length +
            hulpCalenderMetOntbrekendeShiften[1][4].length + hulpCalenderMetOntbrekendeShiften[1][5].length +
            hulpCalenderMetOntbrekendeShiften[1][6].length;

        let hlpval3 = hulpCalenderMetOntbrekendeShiften[2][0].length + hulpCalenderMetOntbrekendeShiften[2][1].length +
            hulpCalenderMetOntbrekendeShiften[2][2].length + hulpCalenderMetOntbrekendeShiften[2][3].length +
            hulpCalenderMetOntbrekendeShiften[2][4].length + hulpCalenderMetOntbrekendeShiften[2][5].length +
            hulpCalenderMetOntbrekendeShiften[2][6].length;

        let hlpval4 = hulpCalenderMetOntbrekendeShiften[3][0].length + hulpCalenderMetOntbrekendeShiften[3][1].length +
            hulpCalenderMetOntbrekendeShiften[3][2].length + hulpCalenderMetOntbrekendeShiften[3][3].length +
            hulpCalenderMetOntbrekendeShiften[3][4].length + hulpCalenderMetOntbrekendeShiften[3][5].length +
            hulpCalenderMetOntbrekendeShiften[3][6].length;

        if (hulpCalenderMetDeDagen.length === 5) {
            let hlpval5 = hulpCalenderMetOntbrekendeShiften[4][0].length + hulpCalenderMetOntbrekendeShiften[4][1].length +
                hulpCalenderMetOntbrekendeShiften[4][2].length + hulpCalenderMetOntbrekendeShiften[4][4].length +
                hulpCalenderMetOntbrekendeShiften[4][4].length + hulpCalenderMetOntbrekendeShiften[4][5].length +
                hulpCalenderMetOntbrekendeShiften[4][6].length;

            setAantalDagenWeek5(hlpval5);
        }

        setAantalDagenWeek1(hlpval1);
        setAantalDagenWeek2(hlpval2);
        setAantalDagenWeek3(hlpval3);
        setAantalDagenWeek4(hlpval4);

        setOntbrekendeShiften(hulpCalenderMetOntbrekendeShiften);
        console.log("Ontbrekende shifts berekend!");


    }

    const dispatchWeek = (week, dispatchWeek) => {


        let hulpKal = hulpCalenderMetDeDagen[week];

        for (let index = 0; index < OperatorConfig.length; index++) {

            let week = weekStructuren.find(x => x.id === dispatchWeek[index])

            dispatch(addShift({ 'id': OperatorConfig[index].id, 'day': hulpKal[0].format("DD-MM-YYYY"), 'shift': week.maandag }));
            dispatch(addShift({ 'id': OperatorConfig[index].id, 'day': hulpKal[1].format("DD-MM-YYYY"), 'shift': week.dinsdag }));
            dispatch(addShift({ 'id': OperatorConfig[index].id, 'day': hulpKal[2].format("DD-MM-YYYY"), 'shift': week.woensdag }));
            dispatch(addShift({ 'id': OperatorConfig[index].id, 'day': hulpKal[3].format("DD-MM-YYYY"), 'shift': week.donderdag }));
            dispatch(addShift({ 'id': OperatorConfig[index].id, 'day': hulpKal[4].format("DD-MM-YYYY"), 'shift': week.vrijdag }));
            dispatch(addShift({ 'id': OperatorConfig[index].id, 'day': hulpKal[5].format("DD-MM-YYYY"), 'shift': week.zaterdag }));
            dispatch(addShift({ 'id': OperatorConfig[index].id, 'day': hulpKal[6].format("DD-MM-YYYY"), 'shift': week.zondag }));

        }

    }

    const checkWeekVoorWerknemer = (weekIndex, teBehalenWeekIndex) => {
        if (weekIndex.maandag !== "") {

            if (teBehalenWeekIndex[0].includes(weekIndex.maandag)) {
                let hulpDag = teBehalenWeekIndex[0];
                hulpDag = hulpDag.filter(x => weekIndex.maandag !== x);
                teBehalenWeekIndex[0] = hulpDag;
            }
            else {
                return false;
            }

        }
        if (weekIndex.dinsdag !== "") {
            if (teBehalenWeekIndex[1].includes(weekIndex.dinsdag)) {
                let hulpDag = teBehalenWeekIndex[1];
                hulpDag = hulpDag.filter(x => x !== weekIndex.dinsdag);
                teBehalenWeekIndex[1] = hulpDag;
            }
            else {
                return false;
            }

        }
        if (weekIndex.woensdag !== "") {
            if (teBehalenWeekIndex[2].includes(weekIndex.woensdag)) {
                let hulpDag = teBehalenWeekIndex[2];
                hulpDag = hulpDag.filter(x => x !== weekIndex.woensdag);
                teBehalenWeekIndex[2] = hulpDag;
            }
            else {
                return false;
            }

        }
        if (weekIndex.donderdag !== "") {
            if (teBehalenWeekIndex[3].includes(weekIndex.donderdag)) {
                let hulpDag = teBehalenWeekIndex[3];
                hulpDag = hulpDag.filter(x => x !== weekIndex.donderdag);
                teBehalenWeekIndex[3] = hulpDag;
            }
            else {
                return false;
            }

        }
        if (weekIndex.vrijdag !== "") {
            if (teBehalenWeekIndex[4].includes(weekIndex.vrijdag)) {
                let hulpDag = teBehalenWeekIndex[4];
                hulpDag = hulpDag.filter(x => x !== weekIndex.vrijdag);
                teBehalenWeekIndex[4] = hulpDag;
            }
            else {
                return false;
            }

        }
        if (weekIndex.zaterdag !== "") {
            if (teBehalenWeekIndex[5].includes(weekIndex.zaterdag)) {
                let hulpDag = teBehalenWeekIndex[5];
                hulpDag = hulpDag.filter(x => x !== weekIndex.zaterdag);
                teBehalenWeekIndex[5] = hulpDag;
            }
            else {
                return false;
            }

        }
        if (weekIndex.zondag !== "") {
            if (teBehalenWeekIndex[6].includes(weekIndex.zondag)) {
                let hulpDag = teBehalenWeekIndex[6];
                hulpDag = hulpDag.filter(x => x !== weekIndex.zondag);
                teBehalenWeekIndex[6] = hulpDag;
            }
            else {
                return false;
            }

        }

        return teBehalenWeekIndex;


    }

    const berekenCorrecteCombinatie = (mogelijkeStructuren, week) => {
        let ontbrekendeShiften = OntbrekendeShiften[week];
        console.log(ontbrekendeShiften);
        let i = 0;
        //-----------------------------------------loop1----------------------------------------------------------------------------
        for (let index1 = 0; index1 < mogelijkeStructuren[0].length; index1++) {

            let teBehalenWeekIndex1 = [...ontbrekendeShiften];
            let weekIndex1 = weekStructuren.find(x => x.id === mogelijkeStructuren[0][index1]);
            teBehalenWeekIndex1 = checkWeekVoorWerknemer(weekIndex1, teBehalenWeekIndex1);
            if (teBehalenWeekIndex1 === false) {
                continue;
            };

            //-----------------------------------------loop2----------------------------------------------------------------------------
            for (let index2 = 0; index2 < mogelijkeStructuren[1].length; index2++) {

                let weekIndex2 = weekStructuren.find(x => x.id === mogelijkeStructuren[1][index2]);
                let teBehalenWeekIndex2 = [...teBehalenWeekIndex1];
                teBehalenWeekIndex2 = checkWeekVoorWerknemer(weekIndex2, teBehalenWeekIndex2);
                if (teBehalenWeekIndex2 === false) {
                    continue;
                };

                //-----------------------------------------loop3----------------------------------------------------------------------------
                for (let index3 = 0; index3 < mogelijkeStructuren[2].length; index3++) {

                    let weekIndex3 = weekStructuren.find(x => x.id === mogelijkeStructuren[2][index3]);
                    let teBehalenWeekIndex3 = [...teBehalenWeekIndex2];
                    teBehalenWeekIndex3 = checkWeekVoorWerknemer(weekIndex3, teBehalenWeekIndex3);
                    if (teBehalenWeekIndex3 === false) {
                        continue;
                    };

                    //-----------------------------------------loop4---------------------------------------------------------------------------
                    for (let index4 = 0; index4 < mogelijkeStructuren[3].length; index4++) {

                        let weekIndex4 = weekStructuren.find(x => x.id === mogelijkeStructuren[3][index4]);
                        let teBehalenWeekIndex4 = [...teBehalenWeekIndex3];
                        teBehalenWeekIndex4 = checkWeekVoorWerknemer(weekIndex4, teBehalenWeekIndex4);
                        if (teBehalenWeekIndex4 === false) {
                            continue;
                        };

                        //-----------------------------------------loop5---------------------------------------------------------------------------
                        for (let index5 = 0; index5 < mogelijkeStructuren[4].length; index5++) {

                            let weekIndex5 = weekStructuren.find(x => x.id === mogelijkeStructuren[4][index5]);
                            let teBehalenWeekIndex5 = [...teBehalenWeekIndex4];
                            teBehalenWeekIndex5 = checkWeekVoorWerknemer(weekIndex5, teBehalenWeekIndex5);
                            if (teBehalenWeekIndex5 === false) {
                                continue;
                            };

                            //-----------------------------------------loop6---------------------------------------------------------------------------
                            for (let index6 = 0; index6 < mogelijkeStructuren[5].length; index6++) {

                                let weekIndex6 = weekStructuren.find(x => x.id === mogelijkeStructuren[5][index6]);
                                let teBehalenWeekIndex6 = [...teBehalenWeekIndex5];
                                teBehalenWeekIndex6 = checkWeekVoorWerknemer(weekIndex6, teBehalenWeekIndex6);
                                if (teBehalenWeekIndex6 === false) {
                                    continue;
                                };

                                //-----------------------------------------loop7---------------------------------------------------------------------------
                                for (let index7 = 0; index7 < mogelijkeStructuren[6].length; index7++) {

                                    let weekIndex7 = weekStructuren.find(x => x.id === mogelijkeStructuren[6][index7]);
                                    let teBehalenWeekIndex7 = [...teBehalenWeekIndex6];
                                    teBehalenWeekIndex7 = checkWeekVoorWerknemer(weekIndex7, teBehalenWeekIndex7);
                                    if (teBehalenWeekIndex7 === false) {
                                        continue;
                                    };

                                    //-----------------------------------------loop8--------------------------------------------------------------------------
                                    for (let index8 = 0; index8 < mogelijkeStructuren[7].length; index8++) {

                                        let weekIndex8 = weekStructuren.find(x => x.id === mogelijkeStructuren[7][index8]);
                                        let teBehalenWeekIndex8 = [...teBehalenWeekIndex7];
                                        teBehalenWeekIndex8 = checkWeekVoorWerknemer(weekIndex8, teBehalenWeekIndex8);
                                        if (teBehalenWeekIndex8 === false) {
                                            continue;
                                        };

                                        let hulpVar = teBehalenWeekIndex8[0].length + teBehalenWeekIndex8[1].length + teBehalenWeekIndex8[2].length + teBehalenWeekIndex8[3].length + teBehalenWeekIndex8[4].length + teBehalenWeekIndex8[5].length + teBehalenWeekIndex8[6].length;
                                        if (hulpVar <= 2) {

                                            console.log("iteratie : " + ++i + " , 1: " + index1 + " , 2 : " + index2 + " , 3 : " + index3 + " , 4 : " + index4 + " , 5 : " + index5 + " , 6 : " + index6 + " , 7 : " + index7 + " , 8 : " + index8);
                                            let score1 = weekStructuren.find(x => x.id === mogelijkeStructuren[0][index1]).score;
                                            let score2 = weekStructuren.find(x => x.id === mogelijkeStructuren[1][index2]).score;
                                            let score3 = weekStructuren.find(x => x.id === mogelijkeStructuren[2][index3]).score;
                                            let score4 = weekStructuren.find(x => x.id === mogelijkeStructuren[3][index4]).score;
                                            let score5 = weekStructuren.find(x => x.id === mogelijkeStructuren[4][index5]).score;
                                            let score6 = weekStructuren.find(x => x.id === mogelijkeStructuren[5][index6]).score;
                                            let score7 = weekStructuren.find(x => x.id === mogelijkeStructuren[6][index7]).score;
                                            let score8 = weekStructuren.find(x => x.id === mogelijkeStructuren[7][index8]).score;

                                            let score = score1 + score2 + score3 + score4 + score5 + score6 + score7 + score8;

                                            score = Math.ceil(score * 100 / 80);

                                            console.log("Aantal niet ingevulde operator shiften: " + hulpVar + " ||| Score voor deze weekcombo: " + score);



                                            mogelijkeCombinaties.push([
                                                mogelijkeStructuren[0][index1],
                                                mogelijkeStructuren[1][index2],
                                                mogelijkeStructuren[2][index3],
                                                mogelijkeStructuren[3][index4],
                                                mogelijkeStructuren[4][index5],
                                                mogelijkeStructuren[5][index6],
                                                mogelijkeStructuren[6][index7],
                                                mogelijkeStructuren[7][index8]
                                            ]);



                                            // dispatchWeek(week);

                                        } else { continue }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            setMogelijkeStructerenArrayWeek1(mogelijkeCombinaties);


        }



        let hoogsteScore = 0;
        let dispatchdezeWeek = [];

        mogelijkeCombinaties.forEach((checkWeek) => {
            let score1 = weekStructuren.find(x => x.id === checkWeek[0]).score;
            let score2 = weekStructuren.find(x => x.id === checkWeek[1]).score;
            let score3 = weekStructuren.find(x => x.id === checkWeek[2]).score;
            let score4 = weekStructuren.find(x => x.id === checkWeek[3]).score;
            let score5 = weekStructuren.find(x => x.id === checkWeek[4]).score;
            let score6 = weekStructuren.find(x => x.id === checkWeek[5]).score;
            let score7 = weekStructuren.find(x => x.id === checkWeek[6]).score;
            let score8 = weekStructuren.find(x => x.id === checkWeek[7]).score;

            let score = score1 + score2 + score3 + score4 + score5 + score6 + score7 + score8;
            if (score > hoogsteScore) {
                dispatchdezeWeek = checkWeek;
            }

        })

        dispatchWeek(week, dispatchdezeWeek);
        checkOntbrekendeShiften();


    }




    const isWeekMogelijk = (week, aantalGewerkteDagenVoorWeek, weekNr, id) => {

        let hulpKal = OntbrekendeShiften.length !== 0 ? OntbrekendeShiften[weekNr] : hulpCalenderMetOntbrekendeShiften[weekNr];
        let hulpVarVierOpeenvolgendeShiften = aantalGewerkteDagenVoorWeek;
        let contractType = contracttypes.find(x => x.naam.trim() === employees.find(x => x.id === id).contracttype.trim());
        let nachtShiften = ["1806", "1907"];
        let dagShiften = ["0618", "0719"];

        /* 4-5'en mag geen 4 shiften/week hebben */
        if (contractType.naam.trim() === "4-5") {
            let i = 0;
            for (let index = 0; index < week.length; index++) {
                if (week[index].shift !== "") {
                    i++;
                    if (i > 3) { return false }
                }
            }
        }

        
        /*enkel 4-5'en mogen 1 shift/week hebben */
        if (contractType.naam.trim() !== "4-5") {
            let i = 0;
            for (let index = 0; index < week.length; index++) {
                if (week[index].shift !== "") {
                    i++;
                    
                }
            }
            if (i ===1) { return false }
        }
        /* Nachtweeken toekennen TESTTTT */
        if ([2, 9, 10, 13].includes(id)) {
            for (let index = 0; index < week.length; index++) {

                if (dagShiften.includes(week[index].shift)) { return false }
            }

        } else {
            for (let index = 0; index < week.length; index++) {

                if (nachtShiften.includes(week[index].shift)) { return false }
            }

        }

        /* Controle Nachtshiften toegelaten */
        if (!contractType.nachtshiften_toegelaten) {
            for (let index = 0; index < week.length; index++) {
                if (nachtShiften.includes(week[index].shift)) { return false }
            }
        }

        /* Weekends toegelaten */
        if (contractType.naam.trim() === "4-5") {
            for (let index = 0; index < week.length; index++) {
                if (week[index].shift !== "" && (moment(week[index].day, "DD-MM-YYYY").isoWeekday() === 6 || moment(week[index].day, "DD-MM-YYYY").isoWeekday() === 7)) {
                    return false
                }
            }
        }


        /*  Controle MAX 4 opeenvolgende shiften */
        for (let index = 1; index < week.length; index++) {
            if (week[index].shift === "") {
                hulpVarVierOpeenvolgendeShiften = 0;
            } else {
                hulpVarVierOpeenvolgendeShiften++;
            }

            if (hulpVarVierOpeenvolgendeShiften > 4) {
                return false;
            }

        }

        /* Dubbele shift controle */
        if (week[week.length - 7].shift !== "" && !hulpKal[0].includes(week[week.length - 7].shift)) {
            return false;
        }
        if (week[week.length - 6].shift !== "" && !hulpKal[1].includes(week[week.length - 6].shift)) {
            return false;


        }
        if (week[week.length - 5].shift !== "" && !hulpKal[2].includes(week[week.length - 5].shift)) {
            return false;


        }
        if (week[week.length - 4].shift !== "" && !hulpKal[3].includes(week[week.length - 4].shift)) {
            return false;


        }
        if (week[week.length - 3].shift !== "" && !hulpKal[4].includes(week[week.length - 3].shift)) {
            return false;


        }
        if (week[week.length - 2].shift !== "" && !hulpKal[5].includes(week[week.length - 2].shift)) {
            return false;

        }
        if (week[week.length - 1].shift !== "" && !hulpKal[6].includes(week[week.length - 1].shift)) {
            return false;

        }


        /*  Controle 2 blanco shift tussen 3 nachtshifts en nieuwe dagshift */

        let aantalOpeenVolgendeNachten = 0;
        let aantalBlancoShifts = 0;

        for (let index = 0; index < week.length; index++) {

            if (index === 0 && nachtShiften.includes(week[index].shift)) {
                aantalOpeenVolgendeNachten = aantalGewerkteDagenVoorWeek;

            }
            if (nachtShiften.includes(week[index].shift)) {
                aantalOpeenVolgendeNachten++;
            }
            if (week[index].shift === "") {
                aantalBlancoShifts++;
            }

            if (dagShiften.includes(week[index].shift)) {
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


    const checkMogelijkeWeekStructuren = async (weekNummer, id) => {


        let laatsteGewerkteShiftDay;
        let aantalOpeenvolgendeDagenVoorLaatsteGewerkteShiftDay;
        let eersteShiftDayVanWeek_Moment = hulpCalenderMetDeDagen[weekNummer][0];

        let planning = [];

        let mogelijkeStructuren_IDs = [];



        if (weekNummer === 0) {

            let { data } = await axios.get("/api/planning/" + id + "/" + moment(datum, "MM-YYYY").subtract(1, "month").format("MM-YYYY"));

            for (let index = data.length - 1; index >= 0; index--) {
                if (verplichteShiften.includes(data[index].shift)) {
                    laatsteGewerkteShiftDay = data[index];
                    aantalOpeenvolgendeDagenVoorLaatsteGewerkteShiftDay = 1;

                    let i = index;
                    while (data[--i].shift !== "") {
                        aantalOpeenvolgendeDagenVoorLaatsteGewerkteShiftDay++;
                    }
                    break;
                }
            }
            planning.push(laatsteGewerkteShiftDay);

            while (!moment(planning[planning.length - 1].day, "DD-MM-YYYY").add(1, "day").isSame(eersteShiftDayVanWeek_Moment, "month")) {
                planning.push({
                    "day": moment(planning[planning.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": ""
                })
            }

            let filter = []

            if (employees.find(x => x.id === id).contracttype.trim() !== "4-5") {
                weekStructuren.forEach((week) => {
                    let i = 0;
                    if (week.maandag !== "") { i++; }
                    if (week.dinsdag !== "") { i++; }
                    if (week.woensdag !== "") { i++; }
                    if (week.donderdag !== "") { i++; }
                    if (week.vrijdag !== "") { i++; }
                    if (week.zaterdag !== "") { i++; }
                    if (week.zondag !== "") { i++; }
                    if (i === 1) { filter.push(i) }
                })

            }

            weekStructuren.filter(x => !filter.includes(x.id)).forEach(week => {

                let tempKalendar = [...planning];

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.maandag
                });
                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.dinsdag
                })

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.woensdag
                })

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.donderdag
                })

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.vrijdag
                })


                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.zaterdag
                })

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.zondag
                })

                if (isWeekMogelijk(tempKalendar, aantalOpeenvolgendeDagenVoorLaatsteGewerkteShiftDay, weekNummer, id)) {
                    mogelijkeStructuren_IDs.push(week.id);
                }
            })

        } else {


            planning = calendar.find(x => x.employeeId === id).employeeCalendar.filter(shiftDay => moment(shiftDay.day, "DD-MM-YYYY").isBefore(hulpCalenderMetDeDagen[weekNummer][0], "day"));

            for (let index = planning.length - 1; index >= 0; index--) {
                if (verplichteShiften.includes(planning[index].shift)) {
                    laatsteGewerkteShiftDay = planning[index];
                    aantalOpeenvolgendeDagenVoorLaatsteGewerkteShiftDay = 1;

                    let i = index;
                    while (i >= 1 && planning[--i].shift !== "") {
                        aantalOpeenvolgendeDagenVoorLaatsteGewerkteShiftDay++;
                    }
                    break;
                }
            }
            planning = [];

            planning.push(laatsteGewerkteShiftDay);

            while (moment(planning[planning.length - 1].day, "DD-MM-YYYY").add(1, "day").isBefore(hulpCalenderMetDeDagen[weekNummer][0], "day")) {
                planning.push({
                    "day": moment(planning[planning.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": ""
                })
            }

            let filter = []

            if (employees.find(x => x.id === id).contracttype.trim() !== "4-5") {
                weekStructuren.forEach((week) => {
                    let i = 0;
                    if (week.maandag !== "") { i++; }
                    if (week.dinsdag !== "") { i++; }
                    if (week.woensdag !== "") { i++; }
                    if (week.donderdag !== "") { i++; }
                    if (week.vrijdag !== "") { i++; }
                    if (week.zaterdag !== "") { i++; }
                    if (week.zondag !== "") { i++; }
                    if (i === 1) { filter.push(i) }
                })

            }

            weekStructuren.filter(x => !filter.includes(x.id)).forEach(week => {

                let tempKalendar = [...planning];

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.maandag
                });
                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.dinsdag
                })

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.woensdag
                })

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.donderdag
                })

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.vrijdag
                })

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.zaterdag
                })

                tempKalendar.push({
                    "day": moment(tempKalendar[tempKalendar.length - 1].day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY"),
                    "shift": week.zondag
                })

                if (isWeekMogelijk(tempKalendar, aantalOpeenvolgendeDagenVoorLaatsteGewerkteShiftDay, weekNummer, id)) {
                    mogelijkeStructuren_IDs.push(week.id);
                }
            })


        }


        return mogelijkeStructuren_IDs;



    }

    const tempFunctie = async (weekNummer) => {

        setLOADING(true);
        let mogelijkeStructuren = [];

        for (let index = 0; index < OperatorConfig.length; index++) {
            let hulpList = await checkMogelijkeWeekStructuren(weekNummer, OperatorConfig[index].id)
            mogelijkeStructuren.push(hulpList);

            console.log("Mogelijke structuren (aantal: " + hulpList.length + ") berekend voor empl " + OperatorConfig[index].id)

        }
        console.log("einde mogelijke weken per werknemer berekenen voor week " + (weekNummer + 1) + " !");

        console.log(mogelijkeStructuren);

        setLOADING(false);

    }

    const automatiseerWeek = async (weekNummer) => {

        setLOADING(true);
        let mogelijkeStructuren = [];

        for (let index = 0; index < OperatorConfig.length; index++) {
            let hulpList = await checkMogelijkeWeekStructuren(weekNummer, OperatorConfig[index].id)
            mogelijkeStructuren.push(hulpList);

            console.log("Mogelijke structuren (aantal: " + hulpList.length + ") berekend voor empl " + OperatorConfig[index].id)

        }
        console.log("einde mogelijke weken per werknemer berekenen voor week 1!");

        console.log(mogelijkeStructuren);
        berekenCorrecteCombinatie(mogelijkeStructuren, weekNummer);
        if (hulpCalenderMetDeDagen.length > TeAutomatiserenWeek) {
            setStap6Week(hulpCalenderMetDeDagen[TeAutomatiserenWeek][0])
            setTeAutomatiserenWeek(TeAutomatiserenWeek + 1);
        }

        setLOADING(false);

    };

    useEffect(() => {
        checkOntbrekendeShiften();
      tempFunctie(0)
        setStap6Week(hulpCalenderMetDeDagen[0][0]);

        return () => {

        }
    }, [])




    return (
        <div style={{ textAlign: 'left' }}>
            <div className="row">
                <div className="col-md-10" style={{ textAlign: 'left' }}>
                    <h5>Voor week {TeAutomatiserenWeek}</h5>
                    <p>Aantal operatoren met nachtshiften voor deze week : XXX  (Min. 4 vereist)</p>
                    <p>Aantal operatoren met Weekend voor deze week : XXX  (Min. 4 vereist)</p>
                    {OperatorConfig.map(empl =>
                        <p style={{ margin: "1px" }}>Voor <b>{employees.find(x => x.id === empl.id).naam}</b> zijn er <b>XXX</b> mogelijk weekstructuren</p>
                    )}
                    {TeAutomatiserenWeek === 1 && <button type="button" onClick={() => { automatiseerWeek(0) }} style={{ margin: "10px" }}> AUTOMATISEER WEEK 1 </button>}
                    {TeAutomatiserenWeek === 2 && <button type="button" onClick={() => { automatiseerWeek(1) }} style={{ margin: "10px" }}> AUTOMATISEER WEEK 2 </button>}
                    {TeAutomatiserenWeek === 3 && <button type="button" onClick={() => { automatiseerWeek(2) }} style={{ margin: "10px" }}> AUTOMATISEER WEEK 3 </button>}
                    {TeAutomatiserenWeek === 4 && <button type="button" onClick={() => { automatiseerWeek(3) }} style={{ margin: "10px" }}> AUTOMATISEER WEEK 4 </button>}
                    {TeAutomatiserenWeek === 5 && <button type="button" onClick={() => { automatiseerWeek(4) }} style={{ margin: "10px" }}> AUTOMATISEER WEEK 5 </button>}
                    {TeAutomatiserenWeek === 6 && <button type="button" onClick={() => { tempFunctie(0) }} style={{ margin: "10px" }}> Check mogelijke weken voor WEEK 1 </button>}

                    {LOADING ? "BEZIG MET BEREKENINGEN UIT TE VOEREN" : "SYSTEEM IS GEREED OM TE CHECKEN"}
                </div>
                <div className="col-md-2" style={{ textAlign: 'center' }}>
                    <b># ontbrekende shifts</b>

                    <div>
                        Week 1: {AantalDagenWeek1}

                    </div>
                    <div>
                        Week 2: {AantalDagenWeek2}
                    </div>
                    <div>
                        Week 3: {AantalDagenWeek3}
                    </div>
                    <div>
                        Week 4: {AantalDagenWeek4}
                    </div>
                    {AantalDagenWeek5 !== "" &&
                        <div>
                            Week 5: {AantalDagenWeek5}
                        </div>}
                </div>
            </div>



        </div>
    )
}

export default Stap6Beta
