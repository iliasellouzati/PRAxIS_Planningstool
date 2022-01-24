import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as MOMENT_OPERATIONS from '../../moment_operations';
import { addShift } from '../../store/actions/shiftActions';
import WorkerBuilder from './worker-builder';
import Worker from './fibo.worker';



const Stap6BetaV2 = ({ setStap6Week }) => {
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
    let nachtShiften = ["1806", "1907"];
    let dagShiften = ["0618", "0719"];
    let mogelijkeCombinaties = [];

    const [OntbrekendeShiften, setOntbrekendeShiften] = useState([]);

    const [AantalDagenWeek1, setAantalDagenWeek1] = useState("");
    const [AantalDagenWeek2, setAantalDagenWeek2] = useState("");
    const [AantalDagenWeek3, setAantalDagenWeek3] = useState("");
    const [AantalDagenWeek4, setAantalDagenWeek4] = useState("");
    const [AantalDagenWeek5, setAantalDagenWeek5] = useState("");

    const [AantalOperatorenNacht, setAantalOperatorenNacht] = useState(0);
    const [AantalOperatorenWeekend, setAantalOperatorenWeekend] = useState(0);
    const [OngeldigeKeuzeOperatoren, setOngeldigeKeuzeOperatoren] = useState(true);

    const [AantalMogelijkeWeekStructuren, setAantalMogelijkeWeekStructuren] = useState([]);
    const [EffectieveWeekStructuren, setEffectieveWeekStructuren] = useState([]);


    const [Express, setExpress] = useState(true);

    const [FeedBackWorkers, setFeedBackWorkers] = useState(0);

    const [SelectedCombos, setSelectedCombos] = useState(0);

    let i = 0;

    const [Progressie, setProgressie] = useState(0);

    let worker1 = new WorkerBuilder(Worker);
    let worker2 = new WorkerBuilder(Worker);
    let worker3 = new WorkerBuilder(Worker);
    let worker4 = new WorkerBuilder(Worker);
    let worker5 = new WorkerBuilder(Worker);
    let worker6 = new WorkerBuilder(Worker);

    worker1.onmessage = (message) => {
        if (message) {
            console.log("------- Message in MAIN THREAD from web worker 1: ");
            console.log(message.data);
            handleWorkerResponse(message.data);

        }
    };
    worker2.onmessage = (message) => {
        if (message) {
            console.log("------- Message in MAIN THREAD from web worker 2");
            console.log(message.data);
            handleWorkerResponse(message.data);
        }
    };
    worker3.onmessage = (message) => {
        if (message) {
            console.log("------- Message in MAIN THREAD from web worker 3");
            console.log(message.data);
            handleWorkerResponse(message.data);
        }
    };

    worker4.onmessage = (message) => {
        if (message) {
            console.log("------- Message in MAIN THREAD from web worker 4");
            console.log(message.data);
            handleWorkerResponse(message.data);
        }
    };

    worker5.onmessage = (message) => {
        if (message) {
            console.log("------- Message in MAIN THREAD from web worker 5");
            console.log(message.data);
            handleWorkerResponse(message.data);
        }
    };
    worker6.onmessage = (message) => {
        if (message) {
            console.log("------- Message in MAIN THREAD from web worker 6");
            console.log(message.data);
            handleWorkerResponse(message.data);
        }
    };



    const handleWorkerResponse = (respons) => {

        console.log("combos voor responss behandeling : ")
        console.log(mogelijkeCombinaties);

        respons.forEach(element => {

            if (!mogelijkeCombinaties?.some(x => x.nietIngevuldeShiften === element.nietIngevuldeShiften)) {

                mogelijkeCombinaties.push(element)
            } else {

                let hulpIndex = mogelijkeCombinaties.findIndex(x => x.nietIngevuldeShiften === element.nietIngevuldeShiften);

                mogelijkeCombinaties[hulpIndex].combinaties.push(...element.combinaties);
            }


        });

        let som = 0;

        for (let index = 0; index < mogelijkeCombinaties.length; index++) {
            som += mogelijkeCombinaties[index].combinaties.length;

        }



        console.log("alle combinaties samen : " + som.toLocaleString())
        setEffectieveWeekStructuren(mogelijkeCombinaties);
        console.log(mogelijkeCombinaties);
        setFeedBackWorkers(++i);
        if (i === 6) {
            setProgressie(1);
        }


    }

    const filter = (filter) => {
        switch (filter[0]) {
            // eslint-disable-next-line no-lone-blocks
            case "FILTER_WEEKEND_EN_NACHT_INGEVULD": {
                let totaalAantal = EffectieveWeekStructuren.length;
                let aantalPerWorker = Math.floor(totaalAantal / 6);
                let restPerWorker = (totaalAantal % 6);
                let startIndex = 0;
                let endIndex = 0;




                endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
                worker1.postMessage(["FILTER_WEEKEND_EN_NACHT_INGEVULD", {
                    "weekNummer": (TeAutomatiserenWeek - 2),
                    "OntbrekendeShiften": OntbrekendeShiften,
                    "weekStructuren": weekStructuren,
                    "mogelijkeCombinaties": [...EffectieveWeekStructuren].slice(startIndex, endIndex)
                }]);
                restPerWorker !== 0 && restPerWorker--;

                startIndex = endIndex;
                endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
                worker2.postMessage(["FILTER_WEEKEND_EN_NACHT_INGEVULD", {
                    "weekNummer": (TeAutomatiserenWeek - 2),
                    "weekStructuren": weekStructuren,
                    "OntbrekendeShiften": OntbrekendeShiften,
                    "mogelijkeCombinaties": [...EffectieveWeekStructuren].slice(startIndex, endIndex)
                }]);
                restPerWorker !== 0 && restPerWorker--;

                startIndex = endIndex;
                endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
                worker3.postMessage(["FILTER_WEEKEND_EN_NACHT_INGEVULD", {
                    "weekNummer": (TeAutomatiserenWeek - 2),
                    "weekStructuren": weekStructuren,
                    "OntbrekendeShiften": OntbrekendeShiften,
                    "mogelijkeCombinaties": [...EffectieveWeekStructuren].slice(startIndex, endIndex)
                }]);
                restPerWorker !== 0 && restPerWorker--;


                startIndex = endIndex;
                endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
                worker4.postMessage(["FILTER_WEEKEND_EN_NACHT_INGEVULD", {
                    "weekNummer": (TeAutomatiserenWeek - 2),
                    "weekStructuren": weekStructuren,
                    "OntbrekendeShiften": OntbrekendeShiften,
                    "mogelijkeCombinaties": [...EffectieveWeekStructuren].slice(startIndex, endIndex)
                }]);
                restPerWorker !== 0 && restPerWorker--;


                startIndex = endIndex;
                endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
                worker5.postMessage(["FILTER_WEEKEND_EN_NACHT_INGEVULD", {
                    "weekNummer": (TeAutomatiserenWeek - 2),
                    "weekStructuren": weekStructuren,
                    "OntbrekendeShiften": OntbrekendeShiften,
                    "mogelijkeCombinaties": [...EffectieveWeekStructuren].slice(startIndex, endIndex)
                }]);
                restPerWorker !== 0 && restPerWorker--;

                startIndex = endIndex;
                endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
                worker6.postMessage(["FILTER_WEEKEND_EN_NACHT_INGEVULD", {
                    "weekNummer": (TeAutomatiserenWeek - 2),
                    "weekStructuren": weekStructuren,
                    "OntbrekendeShiften": OntbrekendeShiften,
                    "mogelijkeCombinaties": [...EffectieveWeekStructuren].slice(startIndex, endIndex)
                }]);
                restPerWorker !== 0 && restPerWorker--;

                mogelijkeCombinaties = [];
                setEffectieveWeekStructuren([]);
                console.log("combos voor responss behandeling : ")
                console.log(mogelijkeCombinaties);

            }
                break;

            default:
                break;
        }
    }

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

        console.log("Ontbrekende shifts berekend:");
        console.log(hulpCalenderMetOntbrekendeShiften);


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

                                        let nietIngevuldeShiften = teBehalenWeekIndex8[0].length + teBehalenWeekIndex8[1].length + teBehalenWeekIndex8[2].length + teBehalenWeekIndex8[3].length + teBehalenWeekIndex8[4].length + teBehalenWeekIndex8[5].length + teBehalenWeekIndex8[6].length;
                                        if (nietIngevuldeShiften > 7) {
                                            continue
                                        }

                                        //       let score1 = weekStructuren.find(x => x.id === mogelijkeStructuren[0][index1]).score;
                                        //      let score2 = weekStructuren.find(x => x.id === mogelijkeStructuren[1][index2]).score;
                                        //   let score3 = weekStructuren.find(x => x.id === mogelijkeStructuren[2][index3]).score;
                                        //        let score4 = weekStructuren.find(x => x.id === mogelijkeStructuren[3][index4]).score;
                                        //       let score5 = weekStructuren.find(x => x.id === mogelijkeStructuren[4][index5]).score;
                                        //     let score6 = weekStructuren.find(x => x.id === mogelijkeStructuren[5][index6]).score;
                                        //       let score7 = weekStructuren.find(x => x.id === mogelijkeStructuren[6][index7]).score;
                                        //        let score8 = weekStructuren.find(x => x.id === mogelijkeStructuren[7][index8]).score;

                                        //      let score = score1 + score2 + score3 + score4 + score5 + score6 + score7 + score8;

                                        //     score = Math.ceil(score * 100 / 80);

                                        console.log("Niet ingevuld: " + nietIngevuldeShiften + " ||| index 1 - 2 : " + index1 + " - " + index2);

                                        if (!mogelijkeCombinaties.some(x => x.nietIngevuldeShiften === nietIngevuldeShiften)) {
                                            let hhulpVal = [
                                                mogelijkeStructuren[0][index1],
                                                mogelijkeStructuren[1][index2],
                                                mogelijkeStructuren[2][index3],
                                                mogelijkeStructuren[3][index4],
                                                mogelijkeStructuren[4][index5],
                                                mogelijkeStructuren[5][index6],
                                                mogelijkeStructuren[6][index7],
                                                mogelijkeStructuren[7][index8]
                                            ]
                                            mogelijkeCombinaties.push({
                                                "nietIngevuldeShiften": nietIngevuldeShiften,
                                                "combinaties": [hhulpVal]
                                            })
                                        } else {
                                            let hulpIndex = mogelijkeCombinaties.findIndex(x => x.nietIngevuldeShiften === nietIngevuldeShiften);
                                            let hhulpVal = [
                                                mogelijkeStructuren[0][index1],
                                                mogelijkeStructuren[1][index2],
                                                mogelijkeStructuren[2][index3],
                                                mogelijkeStructuren[3][index4],
                                                mogelijkeStructuren[4][index5],
                                                mogelijkeStructuren[5][index6],
                                                mogelijkeStructuren[6][index7],
                                                mogelijkeStructuren[7][index8]
                                            ]
                                            mogelijkeCombinaties[hulpIndex].combinaties.push(hhulpVal)
                                        }


                                        index3++;
                                        index4 = 1000;
                                        index5 = 1000;
                                        index6 = 1000;
                                        index7 = 1000;
                                        index8 = 1000;



                                        // dispatchWeek(week);


                                    }
                                }
                            }
                        }
                    }
                }
            }


            //    setMogelijkeStructerenArrayWeek1(mogelijkeCombinaties);
            //  console.log("Mogelijke combinaties na looooooops:");
            // console.log(mogelijkeCombinaties);

        }


        /*
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
        */

    }




    const isWeekMogelijk = (week, aantalGewerkteDagenVoorWeek, weekNr, id) => {

        let hulpKal = OntbrekendeShiften.length !== 0 ? OntbrekendeShiften[weekNr] : hulpCalenderMetOntbrekendeShiften[weekNr];
        let hulpVarVierOpeenvolgendeShiften = aantalGewerkteDagenVoorWeek;
        let contractType = contracttypes.find(x => x.naam.trim() === employees.find(x => x.id === id).contracttype.trim());


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
                    if (i === 1) { filter.push(week.id) }
                })

            }



            let nachtStructuur = OperatorConfig.find(x => x.id === id).nacht;
            let weekendToegelaten = OperatorConfig.find(x => x.id === id).weekend;

            weekStructuren.forEach((week) => {
                if (!weekendToegelaten && (nachtShiften.includes(week.vrijdag) || week.zaterdag !== "" || week.zondag !== "")) {
                    filter.push(week.id);
                }
                if (nachtStructuur) {
                    if (dagShiften.includes(week.maandag) ||
                        dagShiften.includes(week.dinsdag) ||
                        dagShiften.includes(week.woensdag) ||
                        dagShiften.includes(week.donderdag) ||
                        dagShiften.includes(week.vrijdag) ||
                        dagShiften.includes(week.zaterdag) ||
                        dagShiften.includes(week.zondag)) {
                        filter.push(week.id)
                    }

                } else {
                    if (nachtShiften.includes(week.maandag) ||
                        nachtShiften.includes(week.dinsdag) ||
                        nachtShiften.includes(week.woensdag) ||
                        nachtShiften.includes(week.donderdag) ||
                        nachtShiften.includes(week.vrijdag) ||
                        nachtShiften.includes(week.zaterdag) ||
                        nachtShiften.includes(week.zondag)) {
                        filter.push(week.id)
                    }
                }
            })

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
                    if (i === 1) { filter.push(week.id) }
                })

            }



            let nachtStructuur = OperatorConfig.find(x => x.id === id).nacht;
            let weekendToegelaten = OperatorConfig.find(x => x.id === id).weekend;

            weekStructuren.forEach((week) => {
                if (!weekendToegelaten && (nachtShiften.includes(week.vrijdag) || week.zaterdag !== "" || week.zondag !== "")) {
                    filter.push(week.id);
                }
                if (nachtStructuur) {
                    if (dagShiften.includes(week.maandag) ||
                        dagShiften.includes(week.dinsdag) ||
                        dagShiften.includes(week.woensdag) ||
                        dagShiften.includes(week.donderdag) ||
                        dagShiften.includes(week.vrijdag) ||
                        dagShiften.includes(week.zaterdag) ||
                        dagShiften.includes(week.zondag)) {
                        filter.push(week.id)
                    }

                } else {
                    if (nachtShiften.includes(week.maandag) ||
                        nachtShiften.includes(week.dinsdag) ||
                        nachtShiften.includes(week.woensdag) ||
                        nachtShiften.includes(week.donderdag) ||
                        nachtShiften.includes(week.vrijdag) ||
                        nachtShiften.includes(week.zaterdag) ||
                        nachtShiften.includes(week.zondag)) {
                        filter.push(week.id)
                    }
                }
            })

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
        let aantalStructuren = [];

        for (let index = 0; index < OperatorConfig.length; index++) {
            let hulpList = await checkMogelijkeWeekStructuren(weekNummer, OperatorConfig[index].id)
            mogelijkeStructuren.push(hulpList);
            aantalStructuren.push({
                "id": OperatorConfig[index].id,
                "aantal": hulpList.length
            })

            console.log("Mogelijke structuren (aantal: " + hulpList.length + ") berekend voor empl " + OperatorConfig[index].id)

        }
        console.log("einde mogelijke weken per werknemer berekenen voor week " + (weekNummer + 1) + " !");

        console.log(mogelijkeStructuren);
        setAantalMogelijkeWeekStructuren(aantalStructuren);


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
        console.log("einde mogelijke weken per werknemer berekenen voor week " + weekNummer);

        console.log(mogelijkeStructuren);
        // berekenCorrecteCombinatie(mogelijkeStructuren, weekNummer);

        let totaalAantal = mogelijkeStructuren[0].length;
        let aantalPerWorker = Math.floor(totaalAantal / 6);
        let restPerWorker = (totaalAantal % 6);
        let startIndex = 0;
        let endIndex = 0;



        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker1 = [...mogelijkeStructuren];
        hulpValWorker1[0] = mogelijkeStructuren[0].slice(startIndex, endIndex);
        worker1.postMessage(["ALLE_MOGELIJKHEDEN", {
            "mogelijkeStructuren": hulpValWorker1,
            "weekNummer": weekNummer,
            "OntbrekendeShiften": OntbrekendeShiften,
            "weekStructuren": weekStructuren,
            "express": Express
        }]);
        restPerWorker !== 0 && restPerWorker--;



        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker2 = [...mogelijkeStructuren];
        hulpValWorker2[0] = mogelijkeStructuren[0].slice(startIndex, endIndex);
        worker2.postMessage(["ALLE_MOGELIJKHEDEN", {
            "mogelijkeStructuren": hulpValWorker2,
            "weekNummer": weekNummer,
            "OntbrekendeShiften": OntbrekendeShiften,
            "weekStructuren": weekStructuren,
            "express": Express
        }]);
        restPerWorker !== 0 && restPerWorker--;



        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker3 = [...mogelijkeStructuren];
        hulpValWorker3[0] = mogelijkeStructuren[0].slice(startIndex, endIndex);
        worker3.postMessage(["ALLE_MOGELIJKHEDEN", {
            "mogelijkeStructuren": hulpValWorker3,
            "weekNummer": weekNummer,
            "OntbrekendeShiften": OntbrekendeShiften,
            "weekStructuren": weekStructuren,
            "express": Express
        }]);
        restPerWorker !== 0 && restPerWorker--;


        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker4 = [...mogelijkeStructuren];
        hulpValWorker4[0] = mogelijkeStructuren[0].slice(startIndex, endIndex);
        worker4.postMessage(["ALLE_MOGELIJKHEDEN", {
            "mogelijkeStructuren": hulpValWorker4,
            "weekNummer": weekNummer,
            "OntbrekendeShiften": OntbrekendeShiften,
            "weekStructuren": weekStructuren,
            "express": Express
        }]);
        restPerWorker !== 0 && restPerWorker--;


        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker5 = [...mogelijkeStructuren];
        hulpValWorker5[0] = mogelijkeStructuren[0].slice(startIndex, endIndex);
        worker5.postMessage(["ALLE_MOGELIJKHEDEN", {
            "mogelijkeStructuren": hulpValWorker5,
            "weekNummer": weekNummer,
            "OntbrekendeShiften": OntbrekendeShiften,
            "weekStructuren": weekStructuren,
            "express": Express
        }]);


        let hulpValWorker6 = [...mogelijkeStructuren];
        hulpValWorker6[0] = mogelijkeStructuren[0].slice(endIndex);
        worker6.postMessage(["ALLE_MOGELIJKHEDEN", {
            "mogelijkeStructuren": hulpValWorker6,
            "weekNummer": weekNummer,
            "OntbrekendeShiften": OntbrekendeShiften,
            "weekStructuren": weekStructuren,
            "express": Express
        }]);

        if (hulpCalenderMetDeDagen.length > TeAutomatiserenWeek) {
            setStap6Week(hulpCalenderMetDeDagen[TeAutomatiserenWeek][0])
            setTeAutomatiserenWeek(TeAutomatiserenWeek + 1);
        }

        setLOADING(false);

    };

    const checkAantalOperatorenNachtEnWeekend = () => {

        let aantalNacht = 0;
        let aantalWeekend = 0;
        let NachtOps = [];
        let WeekendOps = [];

        OperatorConfig.forEach(x => {
            if (x.nacht) {
                NachtOps.push(x.id);
                aantalNacht++
            }
            if (x.weekend) {
                WeekendOps.push(x.id);
                aantalWeekend++
            }
        })
        if (aantalNacht >= 4 && aantalWeekend >= 4) {

            setOngeldigeKeuzeOperatoren(false);

            if (NachtOps.filter(x => WeekendOps.includes(x)) < 2)
                setOngeldigeKeuzeOperatoren(true);
            if (NachtOps.filter(x => !WeekendOps.includes(x)) < 2)
                setOngeldigeKeuzeOperatoren(true);
            if (WeekendOps.filter(x => !NachtOps.includes(x)) < 2)
                setOngeldigeKeuzeOperatoren(true);


        } else {
            setOngeldigeKeuzeOperatoren(true);
        }



        setAantalOperatorenNacht(aantalNacht);
        setAantalOperatorenWeekend(aantalWeekend);
    }



    useEffect(() => {
        checkOntbrekendeShiften();
        // tempFunctie(0)
        setStap6Week(hulpCalenderMetDeDagen[0][0]);


        return () => {
            /* worker1.terminate();
             worker2.terminate();
             worker3.terminate();
             worker4.terminate();
             worker5.terminate();
             worker6.terminate();*/

        }
    }, [])

    useEffect(() => {


        checkAantalOperatorenNachtEnWeekend();

        return () => {

        }
    }, [OperatorConfig])


    return (
        <div style={{ textAlign: 'left' }}>
            <div className="row">
                {Progressie === 0 && <div className="col-md-10" style={{ textAlign: 'left' }}>
                    <h5>Voor week {TeAutomatiserenWeek}</h5>
                    <p style={{ margin: "1px" }}>Aantal operatoren met nachtshiften voor deze week : {AantalOperatorenNacht} {AantalOperatorenNacht < 4 ? <b style={{ color: "red" }}>(Min. 4 vereist)</b> : <span>(Min. 4 vereist)</span>} </p>
                    <p style={{ margin: "1px" }}>Aantal operatoren met Weekend voor deze week : {AantalOperatorenWeekend}   {AantalOperatorenWeekend < 4 ? <b style={{ color: "red" }}>(Min. 4 vereist)</b> : <span>(Min. 4 vereist)</span>} </p>

                    {OngeldigeKeuzeOperatoren === true ? <button type="button" style={{ margin: "10px", color: "red" }}> Niet beschikbaar</button> : <button type="button" onClick={() => { tempFunctie(TeAutomatiserenWeek - 1) }} style={{ margin: "10px" }}> Check mogelijke weken </button>}

                    {OperatorConfig.map(empl =>
                        <p style={{ margin: "1px" }}>Voor <b>{employees.find(x => x.id === empl.id).naam}</b> zijn er
                            <b> {AantalMogelijkeWeekStructuren.length !== 0 ? AantalMogelijkeWeekStructuren.find(x => x.id === empl.id).aantal : "XXX"} </b>
                            mogelijk weekstructuren met nog
                            <b> {empl.extra_operatorshiften} + {empl.extra_operatorshiften_volgende_maand} </b>
                            resterende shifts
                        </p>
                    )}
                    {OngeldigeKeuzeOperatoren === true ? <button type="button" style={{ margin: "10px", color: "red" }}> Niet beschikbaar</button> : <button type="button" onClick={() => { automatiseerWeek(TeAutomatiserenWeek - 1) }} style={{ margin: "10px" }}> AUTOMATISEER WEEK {TeAutomatiserenWeek} </button>}
                    <div class="custom-control custom-checkbox" style={{ display: "inline-block" }}>
                        <input class="custom-control-input custom-control-input-danger" type="checkbox" id={"Express"} checked={Express} onClick={() => setExpress(!Express)} />
                        <label for={'Express'} class="custom-control-label" >Express ? ( minder dan 1% resultaat)</label>
                    </div>
                </div>}


                {Progressie === 1 &&
                    <div className="col-md-3" style={{ textAlign: 'left' }}>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#Lege shiften</th>
                                    <th>#Combos</th>
                                    <th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {EffectieveWeekStructuren.sort((a, b) => a.nietIngevuldeShiften < b.nietIngevuldeShiften ? -1 : 1).map(combo => (

                                    <tr>
                                        <td>{combo.nietIngevuldeShiften}</td>
                                        <td>{combo.combinaties.length.toLocaleString()}</td>
                                        <td onClick={() => setSelectedCombos(combo.combinaties)}>
                                            <i class="fas fa-edit"></i>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" >
                                        TOTAAL: {EffectieveWeekStructuren.reduce((old, curr) => old + curr.combinaties.length, 0).toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                    </div>
                }

                {Progressie === 1 &&
                    <div className="col-md-7" style={{ textAlign: 'left' }}>

                        {SelectedCombos ===0 ?"Geen lijst geselecteerd" :




                    
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            {OperatorConfig.map(conf => 
                                                <th >
                                                    {employees.find(emp=>emp.id==conf.id).naam.substring(0,8)}
                                                </th>


                                            )}
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SelectedCombos.map(combo => 

                                            <tr key={combo.join()}>
                                                {combo.map(comb=><td>{comb}</td>)}
                                                <td onClick={() =>  dispatchWeek(TeAutomatiserenWeek-2,combo )}>
                                                    <i class="fas fa-edit"></i>
                                                </td>
                                            </tr>

                                        )}
                                    </tbody>

                                </table>

                            }
                    </div>
                }
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
                    {LOADING ? <div style={{ backgroundColor: "red" }}>OCCUPIED</div> : <div style={{ backgroundColor: "green" }}>SYSTEM STANDBY</div>}
                    {Progressie === 1 && <button type="button" onClick={() => { filter(["FILTER_WEEKEND_EN_NACHT_INGEVULD"]) }} style={{ margin: "10px" }}>Weergeef enkel combos met ingevulde nacht en weekend</button>}


                </div>


            </div>



        </div>
    )
}

export default Stap6BetaV2
