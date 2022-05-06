import moment from "moment";

const makeObjectForAutomatisation = (ShiftsFromDb, shifttypes, monthYear) => {

    let returnObject = {};

    ShiftsFromDb.forEach((shift) => {
        let shiftObj = shifttypes.find(x => x.id === shift.shifttype_id)

        if (typeof returnObject[`${shift.werknemers_id}`] === 'undefined') {
            returnObject[`${shift.werknemers_id}`] = {
                'order_by_cat': makeIndividualStatsObject(shifttypes),
                'history': makeIndividualHistoryObject(monthYear)
            };
        }

        if (typeof returnObject[`${shift.werknemers_id}`]['order_by_cat'][`${shiftObj.categorie.trim()}`][`${shiftObj.naam}`] === 'undefined') {
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`totaal`]++;
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`${shiftObj.naam}`] = 1;
            returnObject[`${shift.werknemers_id}`][`history`][`${moment(shift.datum,"YYYY-MM-DD").format("DD-MM-YYYY")}`] = shift.shifttype_id;
        } else {
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`totaal`]++;
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`${shiftObj.naam}`]++;
            returnObject[`${shift.werknemers_id}`][`history`][`${moment(shift.datum,"YYYY-MM-DD").format("DD-MM-YYYY")}`] = shift.shifttype_id;
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

    if (ShiftsFromDb === undefined || ShiftsFromDb.length === 0) {
        return {};
    }

    ShiftsFromDb.forEach((shiftDb) => {

        let shifttype = shifttypes.find(x => x.id === shiftDb.shifttype_id)

        if (typeof returnObject[`${shiftDb.werknemers_id}`] === 'undefined') {
            returnObject[`${shiftDb.werknemers_id}`] = {
                'maand': makeIndividualMonthsObject(year)
            };
        }


        if (moment(shiftDb.datum, "YYYY-MM-DD").startOf('isoWeek').isSame(moment(year,"YYYY"),"year")&&
            (([6, 7].includes(moment(shiftDb.datum, "YYYY-MM-DD").isoWeekday())) ||
                ([5].includes(moment(shiftDb.datum, "YYYY-MM-DD").isoWeekday()) &&
                    (
                        moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").isAfter(moment(`${shiftDb.datum}-18:00`, "YYYY-MM-DD-hh:mm")) ||
                        moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() <= 0
                    )))
        ) {
            let beginDayOfWeek = moment(shiftDb.datum, "YYYY-MM-DD").startOf('isoWeek').format("DD-MM-YYYY");
            let fridayOfWeek;
            switch (moment(shiftDb.datum, "YYYY-MM-DD").isoWeekday()) {
                case 5:
                    fridayOfWeek = moment(shiftDb.datum, "YYYY-MM-DD");
                    break;
                case 6:
                    fridayOfWeek = moment(shiftDb.datum, "YYYY-MM-DD").subtract(1, 'day');
                    break;
                case 7:
                    fridayOfWeek = moment(shiftDb.datum, "YYYY-MM-DD").subtract(2, 'day');
                    break;
                default:
                    break;
            }

            let currWeekendObject = returnObject[`${shiftDb.werknemers_id}`].maand[`${fridayOfWeek.format("MM-YYYY")}`].weekends;

            switch (shifttype.categorie.trim()) {
                case 'verlof':
                    break;
                case 'standby':
                    if (currWeekendObject.volledig_vrij.includes(beginDayOfWeek)) {
                        currWeekendObject.volledig_vrij = currWeekendObject.volledig_vrij.filter(x => x !== beginDayOfWeek);
                        currWeekendObject.gepland_met_standby.push(beginDayOfWeek);
                    }
                    break;
                default:
                    if (currWeekendObject.volledig_vrij.includes(beginDayOfWeek)) {
                        currWeekendObject.volledig_vrij = currWeekendObject.volledig_vrij.filter(x => x !== beginDayOfWeek);
                        currWeekendObject.gepland_met_shifts.push(beginDayOfWeek);
                    } else if (currWeekendObject.gepland_met_standby.includes(beginDayOfWeek)) {
                        currWeekendObject.gepland_met_standby = currWeekendObject.gepland_met_standby.filter(x => x !== beginDayOfWeek);
                        currWeekendObject.gepland_met_shifts.push(beginDayOfWeek);
                    }
                    break;
            } 

        }




        let duration;
        let duration24To06;
        let duration06To22;
        let duration22To24;
        let durationNextDay24To06;
        let durationNextDay06to22;


        switch (shifttype.categorie.trim()) {

            case "operator":

                // NACHTSHIFT TUSSEN 2 MAANDEN
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
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += duration22To24;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalAantalShiften++;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalUrenOpKalender += duration06To22;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (duration06To22 + duration22To24);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;



                        } else {
                            duration22To24 = duration;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += duration22To24;
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
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += duration22To24;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalAantalShiften++;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalUrenOpKalender += duration06To22;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (duration06To22 + duration22To24);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;
                        } else {
                            duration22To24 = durationBeforeMidnight;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += duration22To24;
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

                    //SHIFT MET BEGIN EN EINDE OP 1 DAG
                    if (moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() >= 0) {

                        //START SHIFT VOOR 06U00
                        if (moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm").isBefore(moment(`${shiftDb.datum}-06:00`, "YYYY-MM-DD-hh:mm"))) {
                            duration24To06 = moment.duration(moment(`${shiftDb.datum}-06:00`, "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                            //START SHIFT VOOR 06U00 EN EINDE NA 22U00
                            if (moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").isAfter(moment(`${shiftDb.datum}-22:00`, "YYYY-MM-DD-hh:mm"))) {
                                duration06To22 = 16;
                                duration22To24 = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment(`${shiftDb.datum}-22:00`, "YYYY-MM-DD-hh:mm"))).asHours();

                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += duration24To06 + duration22To24;
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.shiftDb.push(shiftDb);
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalAantalShiften++;

                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalUrenOpKalender += duration06To22;

                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (duration24To06 + duration06To22 + duration22To24);
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;

                                //START SHIFT VOOR 06UU EN EINDE VOOR 22U
                            } else {
                                duration06To22 = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment(`${shiftDb.datum}-06:00`, "YYYY-MM-DD-hh:mm"))).asHours();


                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += duration24To06;
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.shiftDb.push(shiftDb);
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalAantalShiften++;

                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalUrenOpKalender += duration06To22;

                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (duration24To06 + duration06To22);
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;

                            }

                            // EINDE SHIFT NA 22U
                        } else if (moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").isAfter(moment(`${shiftDb.datum}-22:00`, "YYYY-MM-DD-hh:mm"))) {
                            duration06To22 = moment.duration(moment(`${shiftDb.datum}-22:00`, "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                            duration22To24 = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment(`${shiftDb.datum}-22:00`, "YYYY-MM-DD-hh:mm"))).asHours();


                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += duration22To24;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalAantalShiften++;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalUrenOpKalender += duration06To22;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (duration22To24 + duration06To22);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;

                            //SHIFT TUSSEN 06U EN 22U
                        } else {
                            duration06To22 = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalUrenOpKalender += duration06To22;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalAantalShiften++;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration06To22;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;

                        }

                    } else {

                        let durationBeforeMidnight = moment.duration(moment(`${shiftDb.datum}-00:00`, "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        let durationAfterMidnight = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();

                        if (durationBeforeMidnight > 2) {
                            duration06To22 = durationBeforeMidnight - 2;
                            duration22To24 = 2;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += duration22To24;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalAantalShiften++;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalUrenOpKalender += duration06To22;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (duration06To22 + duration22To24);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;
                        } else {
                            duration22To24 = durationBeforeMidnight;

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += duration22To24;
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

                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += durationNextDay24To06;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].dag_operator.totaalUrenOpKalender += durationNextDay06to22;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (durationNextDay24To06 + durationNextDay06to22);
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        } else {
                            durationNextDay24To06 = durationAfterMidnight;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].nacht_operator.totaalUrenOpKalender += durationNextDay24To06;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += durationNextDay24To06;
                            returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        }
                    }
                }

                break;

            case "coopman":

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year')) {
                    break;
                }


                //ALLE DAGCOOPMAN SHIFTEN
                if (shiftDb.shifttypes_naam.includes('dag')) {
                    duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.totaalUrenOpKalender += duration;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.shiftDb.push(shiftDb);
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.totaalAantalShiften++;


                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;


                } else {
                    duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment(`${shiftDb.datum}-16:00`, "YYYY-MM-DD-hh:mm"))).asHours();

                    let praxisDeeltot16uur = moment.duration(moment(`${shiftDb.datum}-16:00`, "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                    let coopmanDeelVanaf16uur = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment(`${shiftDb.datum}-16:00`, "YYYY-MM-DD-hh:mm"))).asHours();

                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.totaalUrenOpKalender += coopmanDeelVanaf16uur;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.shiftDb.push(shiftDb);
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.totaalAantalShiften++;

                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].praxis.totaalUrenOpKalender += praxisDeeltot16uur;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].praxis.shiftDb.push(shiftDb);

                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (praxisDeeltot16uur + coopmanDeelVanaf16uur);
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;
                }

                break;

            case "praxis":

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year')) {
                    break;
                }
                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].praxis.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].praxis.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].praxis[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].praxis.totaalAantalShiften++;


                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;


                break;
            case "ziekte":

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year')) {
                    break;
                }

                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].ziekte.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].ziekte.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].ziekte[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].ziekte.totaalAantalShiften++;



                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;


                break;

            case "verlof":


                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year')) {
                    break;
                }

                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].verlof.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].verlof.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].verlof[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].verlof.totaalAantalShiften++;



                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;

                break;
            case "standby":

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year')) {
                    break;
                }

                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].standby.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].standby.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].standby[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].standby.totaalAantalShiften++;



                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;




                break;


            default:

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(year, "YYYY"), 'year')) {
                    break;
                }

                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() >= 0 ?
                    moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() :
                    moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, 'day').diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalAantalShiften++;

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
            'weekends': makeIndividualMonthWeekensStatsObject(startMonth.format("MM-YYYY"))
        };
        startMonth.add(1, 'month');
    }

    return returnObject;

}

const makeIndividualMonthWeekensStatsObject = (currMonth) => {

    let startDay = moment(currMonth, 'MM-YYYY').startOf('month');
    let returnArray = [];

    while (startDay.isSame(moment(currMonth, "MM-YYYY"), 'month')) {

        if (startDay.isoWeekday() === 5) {
            returnArray.push(startDay.clone().startOf('isoWeek').format("DD-MM-YYYY"));
        }
        startDay.add(1, 'day');
    }


    return {
        'volledig_vrij': returnArray,
        'gepland_met_shifts': [],
        'gepland_met_standby': [],
    }

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






export {
    makeObjectForAutomatisation,
    makeObjectForIndividualStats
}