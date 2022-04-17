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

const makeObjectForIndividualStats = (ShiftsFromDb, shifttypes, monthYear) => {
    let returnObject = {};

    ShiftsFromDb.forEach((shiftDb) => {

        let shifttype = shifttypes.find(x => x.naam === shiftDb.shifttypes_naam)

        if (typeof returnObject[`${shiftDb.werknemers_id}`] === 'undefined') {
            returnObject[`${shiftDb.werknemers_id}`] = {
                'maand': makeIndividualMonthsObject(monthYear),
                'kwartaal': makeIndividualKwartaalObject(monthYear),
                'jaar': {},
                'standby': {},
                'verlof': {}
            };
        }
        let duration;
        let durationCurrMonth;
        let durationNextMonth;
        let durationCurrDay;
        let durationNextDay;

        switch (shifttype.categorie.trim()) {
            case "operator":

                // NACHTSHIFT TUSSEN 2 MAANDEN
                if (!moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(shiftDb.datum, "YYYY-MM-DD"), 'month') &&
                    moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() < 0) {

                    //NACHTSHIFT VOOR HUIDIG JAAR
                    if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(monthYear, "MM-YYYY"), 'year')) {
                        duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].operator.nachtUrenUitVorigeMaand = duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].operator.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.nachtUrenUitVorigeMaand = duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                    } else if (moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(monthYear, "MM-YYYY"), 'month')) {

                        //NACHTSHIFT VOOR HUIDIG KALENDAR                        
                        durationCurrMonth = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.totaalAantalShiften += 1;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.totaalUrenOpKalender += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;

                    } else {
                        //NACHTSHIFT TUSSEN 2 MAANDEN
                        durationCurrMonth = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        durationNextMonth = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();

                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.totaalAantalShiften += 1;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.totaalUrenOpKalender += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].operator.nachtUrenUitVorigeMaand = durationNextMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].operator.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.nachtUrenUitVorigeMaand = durationNextMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                    }
                    //DAGSHIFT VOOR HUIDIG JAAR
                } else if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(monthYear, "MM-YYYY"), 'year')) {
                    break;

                } else {

                    //ALLE DAG SHIFTEN
                    if (moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() >= 0) {
                        duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.totaalAantalShiften += 1;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.totaalUrenOpKalender += duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;

                    } else {

                        // ALLE NACHTSHIFTEN IN ZELFDE MAAND
                        durationCurrDay = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        durationNextDay = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += durationCurrDay;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').isoWeekday()}`].aantalUren += durationNextDay;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.totaalAantalShiften += 1;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.totaalUrenOpKalender += (durationCurrDay + durationNextDay);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].operator.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (durationCurrDay + durationNextDay);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += durationCurrDay;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').isoWeekday()}`].aantalUren += durationNextDay;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                    }
                }

                break;

            case "coopman":

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(monthYear, "MM-YYYY"), 'year') || moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(monthYear, "MM-YYYY"), 'month')) {
                    break;
                }


                //ALLE DAG SHIFTEN
                if (shiftDb.shifttypes_naam.includes('dag')) {
                    duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.totaalAantalShiften += 1;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.totaalUren += duration;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.shiftDb.push(shiftDb);
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;

                } else {
                    duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment(`${shiftDb.datum}-16:00`, "YYYY-MM-DD-hh:mm"))).asHours();

                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.totaalAantalShiften += 1;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.totaalUren += duration;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].coopman.shiftDb.push(shiftDb);
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                    returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;

                }

                break;
            case "ziekte":

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(monthYear, "MM-YYYY"), 'year') || moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(monthYear, "MM-YYYY"), 'month')) {
                    break;
                }

                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].ziekte[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].ziekte[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].ziekte.totaalAantalShiften += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].ziekte.totaalUren += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].ziekte.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                break;

            case "verlof":


                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(monthYear, "MM-YYYY"), 'year') || moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(monthYear, "MM-YYYY"), 'month')) {
                    break;
                }

                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].verlof[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].verlof[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].verlof.totaalAantalShiften += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].verlof.totaalUren += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].verlof.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;

                break;
            case "standby":

                if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(monthYear, "MM-YYYY"), 'year') || moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(monthYear, "MM-YYYY"), 'month')) {
                    break;
                }

                duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].standby[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].standby[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].standby.totaalAantalShiften += 1;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].standby.totaalUren += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].standby.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;

                break;


            default:

                // NACHTSHIFT TUSSEN 2 MAANDEN
                if (!moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(shiftDb.datum, "YYYY-MM-DD"), 'month') &&
                    moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() < 0) {

                    //NACHTSHIFT VOOR HUIDIG JAAR
                    if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(monthYear, "MM-YYYY"), 'year')) {
                        duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();

                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.nachtUrenUitVorigeMaand = duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                    } else if (moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(monthYear, "MM-YYYY"), 'month')) {

                        //NACHTSHIFT VOOR HUIDIG KALENDAR                        
                        durationCurrMonth = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;

                    } else {
                        //NACHTSHIFT TUSSEN 2 MAANDEN
                        durationCurrMonth = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        durationNextMonth = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();

                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += durationCurrMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;

                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.nachtUrenUitVorigeMaand = durationNextMonth;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                    }
                    //DAGSHIFT VOOR HUIDIG JAAR
                } else if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(monthYear, "MM-YYYY"), 'year')) {
                    break;

                } else {

                    //ALLE DAG SHIFTEN
                    if (moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() >= 0) {
                        duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();


                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;

                    } else {

                        // ALLE NACHTSHIFTEN IN ZELFDE MAAND
                        durationCurrDay = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        durationNextDay = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();

                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.totaalUrenOpKalender += (durationCurrDay + durationNextDay);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalUren += durationCurrDay;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').isoWeekday()}`].aantalUren += durationNextDay;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").format("MM-YYYY")}`].cumul[`${moment(shiftDb.datum,"YYYY-MM-DD").isoWeekday()}`].aantalShifts += 1;
                    }
                }


                break;
        }
    })

    return returnObject;
}
const makeIndividualMonthsObject = (monthYear) => {
    let returnObject = {};
    let currMonth = moment(monthYear, "MM-YYYY");
    let startMonth = moment(monthYear, "MM-YYYY").startOf('year');

    while (startMonth.isBefore(currMonth, 'month')) {
        returnObject[`${startMonth.format("MM-YYYY")}`] = {
            'operator':     makeIndividualMonthStatsObject(),
            'coopman':      makeIndividualMonthStatsObject(),
            'dagshift':     makeIndividualMonthStatsObject(),
            'nachtshift':   makeIndividualMonthStatsObject(),
            'ziekte':       makeIndividualMonthStatsObject(),
            'verlof':       makeIndividualMonthStatsObject(),
            'standby':      makeIndividualMonthStatsObject(),
            'cumul':        makeIndividualMonthStatsObject()
        };
        startMonth.add(1, 'month');
    }

    return returnObject;

}

const makeIndividualMonthStatsObject = () => {
    return {
        'totaalUrenOpKalender': 0,
        'nachtUrenUitVorigeMaand': 0,
        'totaalAantalShiften': 0,
        'shiftDb': [],
        '1': {
            'aantalShifts': 0,
            'aantalUren': 0
        },
        '2': {
            'aantalShifts': 0,
            'aantalUren': 0
        },
        '3': {
            'aantalShifts': 0,
            'aantalUren': 0
        },
        '4': {
            'aantalShifts': 0,
            'aantalUren': 0
        },
        '5': {
            'aantalShifts': 0,
            'aantalUren': 0
        },
        '6': {
            'aantalShifts': 0,
            'aantalUren': 0
        },
        '7': {
            'aantalShifts': 0,
            'aantalUren': 0
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