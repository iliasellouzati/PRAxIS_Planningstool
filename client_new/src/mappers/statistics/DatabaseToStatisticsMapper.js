import moment from "moment";

const makeObjectForAutomatisation = (ShiftsFromDb, shifttypes, monthYear) => {

    let returnObject = {};

    ShiftsFromDb.forEach((shift) => {
        let shiftObj = shifttypes.find(x => x.naam === shift.shifttypes_naam)

        if (typeof returnObject[`${shift.werknemers_id}`] === 'undefined') {
            returnObject[`${shift.werknemers_id}`] = {
                'order_by_cat': makeIndividualStatsObject(shifttypes),
                'history': makeIndividualHistoryObject(monthYear)
            };
        }

        if (typeof returnObject[`${shift.werknemers_id}`]['order_by_cat'][`${shiftObj.categorie.trim()}`][`${shiftObj.naam}`] === 'undefined') {
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`totaal`]++;
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`${shiftObj.naam}`] = 1;
            returnObject[`${shift.werknemers_id}`][`history`][`${moment(shift.datum,"YYYY-MM-DD").format("DD-MM-YYYY")}`] = shift.shifttypes_naam;
        } else {
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`totaal`]++;
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`${shiftObj.naam}`]++;
            returnObject[`${shift.werknemers_id}`][`history`][`${moment(shift.datum,"YYYY-MM-DD").format("DD-MM-YYYY")}`] = shift.shifttypes_naam;
        }
    })

    return returnObject;

}


const calculateCategories = (AllShifts) => {
    let cat = [];
    AllShifts.forEach(shift => {
        if (!cat.some(x => x.trim() === shift.categorie.trim())) {
            cat.push(shift.categorie.trim());
        }
    });
    return cat;
}

const makeIndividualHistoryObject = (monthYear) => {
    let endDay = moment(monthYear, "MM-YYYY").endOf('month').endOf('isoWeek');
    let loopDay = endDay.clone().startOf('year');

    let returnObject = {};

    let aantalDays = endDay.diff(loopDay, 'day');

    for (let index = 0; index < aantalDays; index++) {
        returnObject[`${loopDay.format("DD-MM-YYYY")}`] = ''
        loopDay.add(1, 'day');
    }

    return returnObject;

}

const makeIndividualStatsObject = (shifttypes) => {

    let returnObject = {};
    let shiftCategorien = calculateCategories(shifttypes);

    shiftCategorien.forEach((catName) => {
        returnObject[`${catName}`] = {
            'totaal': 0
        }
    })

    return returnObject;
}

const makeObjectForIndividualStats = (ShiftsFromDb, shifttypes, year) => {

    let returnObject = {};

    ShiftsFromDb.forEach((shiftDb) => {

        let shifttype = shifttypes.find(x => x.naam === shiftDb.shifttypes_naam)

        if (typeof returnObject[`${shiftDb.werknemers_id}`] === 'undefined') {
            returnObject[`${shiftDb.werknemers_id}`] = {
                'maand': makeIndividualMonthsObject(year)
            };
        }

        let duration;
        let duration24To06;
        let duration06To22;
        let duration22To24;
        let durationNextDay24To06;
        let durationNextDay06to22;



        switch (shifttype.categorie.trim()) {

            case "operator":

                // NACHTSHIFT 
                if (!moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(shiftDb.datum, "YYYY-MM-DD"), 'month') &&
                    moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() < 0) {

                    //NACHTSHIFT VOOR HUIDIG JAAR
                    if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year')) {
                        duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();
                        if (duration > 6) {
                            durationNextDay24To06 = 6;
                            durationNextDay06to22 = duration - 6;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].nacht_operator.urenUitVorigeMaand = durationNextDay24To06;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].dag_operator.urenUitVorigeMaand = durationNextDay06to22;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.urenUitVorigeMaand = (durationNextDay24To06 + durationNextDay06to22);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        } else {
                            durationNextDay24To06 = duration;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].nacht_operator.urenUitVorigeMaand = durationNextDay24To06;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.urenUitVorigeMaand = (durationNextDay24To06);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        }


                        //NACHTSHIFT OP LAATSTE DAG JAAR HUIDIG JAAR

                    } else if (!moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(shiftDb.datum, "YYYY-MM-DD"), 'year')) {
                        duration = moment.duration(moment(`${shiftDb.datum}-00:00`, "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                        if (duration > 2) {
                            duration06To22 = duration - 2;
                            duration22To24 = 2;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender = duration22To24;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalAantalShiften++;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalUrenOpKalender = duration06To22;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (duration06To22 + duration22To24);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;

                        

                        } else {
                            duration22To24 = duration;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender = duration22To24;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalAantalShiften++;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (durationNextDay24To06 + durationNextDay06to22);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;

                        }

                        //NACHTSHIFT TUSSEN 2 MAANDEN

                    } else {
                        let durationBeforeMidnight = moment.duration(moment(`${shiftDb.datum}-00:00`, "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        let durationAfterMidnight = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();

                        if (durationBeforeMidnight > 2) {
                            duration06To22 = durationBeforeMidnight - 2;
                            duration22To24 = 2;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender = duration22To24;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalAantalShiften++;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalUrenOpKalender = duration06To22;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (duration06To22 + duration22To24);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;
                        } else {
                            duration22To24 = durationBeforeMidnight;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender = duration22To24;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalAantalShiften++;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (durationNextDay24To06 + durationNextDay06to22);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;
                        }

                        if (durationAfterMidnight > 6) {

                            durationNextDay24To06 = 6;
                            durationNextDay06to22 = durationAfterMidnight - 6;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].nacht_operator.urenUitVorigeMaand = durationNextDay24To06;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].dag_operator.urenUitVorigeMaand = durationNextDay06to22;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.urenUitVorigeMaand = (durationNextDay24To06 + durationNextDay06to22);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        } else {
                            durationNextDay24To06 = durationAfterMidnight;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].nacht_operator.urenUitVorigeMaand = durationNextDay24To06;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.urenUitVorigeMaand = (durationNextDay24To06);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        }

                    }
                    //DAGSHIFT VOOR HUIDIG JAAR
                } else if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year')) {
                    break;

                } else {

                    //ALLE DAG SHIFTEN
                    if (moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() >= 0) {
                        duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();


                    } else {

                        // ALLE NACHTSHIFTEN IN ZELFDE MAAND

                    }
                }

                break;

            case "coopman":

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year') || moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(year, "YYYY"), 'month')) {
                    break;
                }


                //ALLE DAG SHIFTEN
                if (shiftDb.shifttypes_naam.includes('dag')) {
                    duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();



                } else {
                    duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment(`${shiftDb.datum}-16:00`, "YYYY-MM-DD-hh:mm"))).asHours();


                }

                break;

            case "praxis":
                break;
            case "ziekte":

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year') || moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(year, "YYYY"), 'month')) {
                    break;
                }

                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();


                break;

            case "verlof":


                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year') || moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(year, "YYYY"), 'month')) {
                    break;
                }

                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();



                break;
            case "standby":

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year') || moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(year, "YYYY"), 'month')) {
                    break;
                }

                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();



                break;


            default:

                // NACHTSHIFT TUSSEN 2 MAANDEN
                if (!moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(shiftDb.datum, "YYYY-MM-DD"), 'month') &&
                    moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() < 0) {

                    //NACHTSHIFT VOOR HUIDIG JAAR
                    if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year')) {
                        duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();


                    } else if (moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(year, "MM-YYYY"), 'month')) {

                        //NACHTSHIFT VOOR HUIDIG KALENDAR                        
                        duration = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();



                    } else {
                        //NACHTSHIFT TUSSEN 2 MAANDEN
                        duration = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();


                    }
                    //DAGSHIFT VOOR HUIDIG JAAR
                } else if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "MM-YYYY"), 'year')) {
                    break;

                } else {

                    //ALLE DAG SHIFTEN
                    if (moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() >= 0) {
                        duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();



                    } else {

                        // ALLE NACHTSHIFTEN IN ZELFDE MAAND
                        duration = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();


                    }
                }


                break;
        }
    })

    console.log(returnObject);
    return returnObject;
}

const makeIndividualMonthsObject = (year) => {
    let returnObject = {};
    let currYear = moment(year, "YYYY");
    let startMonth = moment(year, "YYYY").startOf('year');


    while (startMonth.isSame(currYear, 'year')) {
        returnObject[`${startMonth.format("MM-YYYY")}`] = {
            'dag_operator': makeIndividualMonthStatsObject(),
            'nacht_operator': makeIndividualMonthStatsObject(),
            'coopman': makeIndividualMonthStatsObject(),
            'praxis': makeIndividualMonthStatsObject(),
            'cumul': makeIndividualMonthStatsObject(),
            'verlof': makeIndividualMonthStatsObject(),
            'ziekte': makeIndividualMonthStatsObject(),
            'standby': makeIndividualMonthStatsObject(),
            'weekends': {
                'gepland_met_shifts': [],
                'gepland_met_standby': [],
            }
        };
        startMonth.add(1, 'month');
    }

    return returnObject;

}

const makeIndividualMonthStatsObject = () => {
    return {
        'totaalUrenOpKalender': 0,
        'urenUitVorigeMaand': 0,
        'totaalAantalShiften': 0,
        'shiftDb': [],
        '1': {
            'aantalShifts': 0
        },
        '2': {
            'aantalShifts': 0
        },
        '3': {
            'aantalShifts': 0
        },
        '4': {
            'aantalShifts': 0
        },
        '5': {
            'aantalShifts': 0
        },
        '6': {
            'aantalShifts': 0
        },
        '7': {
            'aantalShifts': 0
        }
    }
}

const makeIndividualKwartaalObject = (monthYear) => {
    let returnObject = {};
    let currMonth = moment(monthYear, "MM-YYYY");
    let startMonth = moment(monthYear, "MM-YYYY").startOf('year');


    while (startMonth.isBefore(currMonth, 'month')) {
        returnObject[`${startMonth.quarter()}`] = {};
        startMonth.add(3, 'month');

    }

    return returnObject;
}





export {
    makeObjectForAutomatisation,
    makeObjectForIndividualStats
}