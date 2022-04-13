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

        switch (shifttype.categorie.trim()) {
            case "operator":

                if (!moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').isSame(moment(shiftDb.datum, "YYYY-MM-DD"), 'month') &&
                    moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() < 0) {

                    if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(monthYear, "MM-YYYY"), 'year')) {
                        let duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].operator.nachtUrenUitVorigeMaand = duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].operator.shiftDb.push(shiftDb);
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.nachtUrenUitVorigeMaand = duration;
                        returnObject[`${shiftDb.werknemers_id}`].maand[`${moment(shiftDb.datum,"YYYY-MM-DD").add(1,'day').format("MM-YYYY")}`].cumul.shiftDb.push(shiftDb);
                    } else {
                        let durationCurrMonth = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        let durationNextMonth = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();

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
                } else if (moment(shiftDb.datum, "YYYY-MM-DD").isBefore(moment(monthYear, "MM-YYYY"), 'year')) {
                    break;

                } else {
                    if (moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours() >= 0) {
                        let duration = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").diff(moment((shiftDb.startmoment ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();

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
                        let durationCurrDay = moment.duration(moment(shiftDb.datum, "YYYY-MM-DD").endOf("day").diff(moment((shiftDb.beginuur ? `${shiftDb.datum}-${shiftDb.beginuur}` : `${shiftDb.datum}-${shifttype.beginuur}`), "YYYY-MM-DD-hh:mm"))).asHours();
                        let durationNextDay = moment.duration(moment((shiftDb.einduur ? `${shiftDb.datum}-${shiftDb.einduur}` : `${shiftDb.datum}-${shifttype.einduur}`), "YYYY-MM-DD-hh:mm").add(1, "day").diff(moment(shiftDb.datum, "YYYY-MM-DD").add(1, 'day').startOf('day'))).asHours();
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








                break;
            case "ziekte":








                break;
            case "verlof":






                break;
            case "standby":








                break;


            default:
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
            'operator': {
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
            },
            'coopman': {
                'totaalUren': 0,
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

            },
            'dagshift': {
                'totaalUren': 0,
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
            },
            'nachtshift': {
                'totaalUren': 0,
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
            },
            'ziekte': {
                'totaalUren': 0,
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
            },
            'verlof': {
                'totaalUren': 0,
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
            },
            'standby': {
                'totaalUren': 0,
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
            },
            'cumul': {
                'totaalUrenOpKalender': 0,
                'nachtUrenUitVorigeMaand': 0,
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
        };
        startMonth.add(1, 'month');
    }

    return returnObject;

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