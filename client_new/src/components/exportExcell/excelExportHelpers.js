import { getCalendarMoments_ArrayWithMoments } from '../calendar/helpers';

import * as XLSX from 'xlsx-js-style';
import moment from 'moment';


const makeOverzichtSheet = () => {
    let ws = XLSX.utils.aoa_to_sheet([[{
        v: `PLANNING UIT PRAXISTOOL, DEZE SHEET : NOT IMPLEMENTED YET ( data ? )`,
        t: "s",
        s: {
            font: {
                bold: true,
                sz: 24,
                underline: true,
            },
            alignment: {
                horizontal: "center",
                vertical: "center"

            },
            fill: {
                fgColor: { rgb: "F247FF" }
            }
        }
    }]]);

    let merges = [
        { s: { r: 0, c: 0 }, e: { r: 3, c: (20) } },


    ];
    ws["!merges"] = merges;



    return ws;
}

const makeMonthWorkSheet = (monthYearString, yearlyStatsObject, calendarObject, shiftTypes, Employees, Holidays) => {

    let hulpVal_Days_Of_month = getCalendarMoments_ArrayWithMoments(monthYearString);
    let hulpValAlleShiftTypesOpCal = [];
    console.log(calendarObject);

    console.log(monthYearString);

    //init
    let ws = XLSX.utils.aoa_to_sheet([[{}]]);
    //de grote van kolommen aanpassen
    ws = changeWidthColomnsAndHeightRowsInSheet(ws, hulpVal_Days_Of_month, calendarObject);
    //de calendertitels toevoegen
    ws = makeHeaderForCalendarInSheet(ws, hulpVal_Days_Of_month, monthYearString, Holidays);

    //de individuele planningen toevoegen
    for (let index = 0; index < calendarObject.length; index++) {
        ws = makeIndividualScheduleROWInCalendarInSheet(ws, calendarObject[index], shiftTypes, index, Employees);
        ws = addMarioStats(ws, yearlyStatsObject[`${calendarObject[index].employeeId}`], shiftTypes, index, monthYearString, hulpVal_Days_Of_month)
        hulpValAlleShiftTypesOpCal = checkForShiftTypes(calendarObject[index], hulpValAlleShiftTypesOpCal);

    }

    //De geselecteerde shifttypes in legende toevoegen
    ws = addSelectedShiftTypesInfoInSheet(ws, calendarObject, shiftTypes, hulpValAlleShiftTypesOpCal, hulpVal_Days_Of_month);

    //Mario Statistieken toevoegen 


    return ws;

}

const translateOriginToLocationText = (rowNumber, colomnNumber) => {
    const hulpArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    if (colomnNumber <= 25) {
        return `${hulpArr[colomnNumber]}${rowNumber + 1}`
    } else {
        return `${hulpArr[Math.floor(colomnNumber / 26) - 1]}${hulpArr[colomnNumber % 26]}${rowNumber + 1}`
    }

}

const addMarioStats = (ws, stats, shiftTypes, index, currMonth, hulpVal_Days_Of_month) => {


    const currMonthMoment = moment(currMonth, "MM-YYYY");

    // #region 1 UREN DEZE MAAND  

    let STAT1_totaalUrenOpKalender = Math.round(stats.maand[currMonth].cumul.totaalUrenOpKalender * 100) / 100;
    let STAT1_urenUitVorigeMaand = Math.round(stats.maand[currMonth].cumul.urenUitVorigeMaand * 100) / 100;

    let STAT1 = [{

        v: STAT1_totaalUrenOpKalender + STAT1_urenUitVorigeMaand,
        t: "n",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },

            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            fill: {
                fgColor: { rgb: "ededed" }
            }
        }
    }];


    XLSX.utils.sheet_add_aoa(ws, [STAT1], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length) } });

    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length)))}`].c = [];
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length)))}`].c.hidden = true;
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length)))}`].c.push({
        a: "PRAxIS_Planningstool", t: `VM: ${STAT1_urenUitVorigeMaand}\nHM: ${STAT1_totaalUrenOpKalender}\nTOTAAL: ${STAT1_totaalUrenOpKalender + STAT1_urenUitVorigeMaand} `
    });

    // #endregion


    // #region 2 TOTAAL OPERATOR UREN

    let STAT2_dag_operator_urenUitVorigeMaand = Math.round(stats.maand[currMonth].dag_operator.urenUitVorigeMaand * 100) / 100;
    let STAT2_dag_operator_totaalUrenOpKalender = Math.round(stats.maand[currMonth].dag_operator.totaalUrenOpKalender * 100) / 100;
    let STAT2_nacht_operator_urenUitVorigeMaand = Math.round(stats.maand[currMonth].nacht_operator.urenUitVorigeMaand * 100) / 100;
    let STAT2_nacht_operator_totaalUrenOpKalender = Math.round(stats.maand[currMonth].nacht_operator.totaalUrenOpKalender * 100) / 100;
    let STAT2_coopman_totaalUrenOpKalender = Math.round(stats.maand[currMonth].coopman.totaalUrenOpKalender * 100) / 100;
    let STAT2_Totaal = STAT2_coopman_totaalUrenOpKalender + STAT2_dag_operator_totaalUrenOpKalender + STAT2_dag_operator_urenUitVorigeMaand + STAT2_nacht_operator_totaalUrenOpKalender + STAT2_nacht_operator_urenUitVorigeMaand;


    let STAT2 = [{

        v: STAT2_Totaal | 'error',
        t: "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },

            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            fill: {
                fgColor: { rgb: "FFFFFF" }
            }
        }
    }];


    XLSX.utils.sheet_add_aoa(ws, [STAT2], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 1) } });

    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 1)))}`].c = [];
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 1)))}`].c.hidden = true;
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 1)))}`].c.push({
        a: "PRAxIS_Planningstool", t: `VM: ${STAT2_dag_operator_urenUitVorigeMaand + STAT2_nacht_operator_urenUitVorigeMaand}\nHM: ${STAT2_dag_operator_totaalUrenOpKalender + STAT2_nacht_operator_totaalUrenOpKalender}\nCOOPMAN: ${STAT2_coopman_totaalUrenOpKalender}\nTOTAAL: ${STAT2_Totaal} `
    });

    // #endregion

    // #region 3 TOTAAL DAGEN DEZE MAAND

    let STAT3_Totaal = stats.maand[currMonth].cumul.totaalAantalShiften - stats.maand[currMonth].standby.totaalAantalShiften;

    let STAT3_Object = {};

    for (let STAT3_LOOPER = 0; STAT3_LOOPER < stats.maand[currMonth].cumul.shiftDb.length; STAT3_LOOPER++) {
        let STAT3_LOOPER_Shift = shiftTypes.find(x => x.id === stats.maand[currMonth].cumul.shiftDb[STAT3_LOOPER].shifttype_id);
        if (STAT3_LOOPER_Shift.categorie === 'standby') {
            continue;
        }
        if (STAT3_Object[`${STAT3_LOOPER_Shift.categorie}`] === undefined) {
            STAT3_Object[`${STAT3_LOOPER_Shift.categorie}`] = 1;
        } else {
            STAT3_Object[`${STAT3_LOOPER_Shift.categorie}`]++;
        }
    }

    let STAT3_TEXT = "";

    Object.keys(STAT3_Object).forEach(key => { STAT3_TEXT = STAT3_TEXT.concat(`${key}: ${STAT3_Object[`${key}`]}\n`); });


    let STAT3 = [{

        v: (STAT3_Totaal) | 'error',
        t: "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },

            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            fill: {
                fgColor: { rgb: "ededed" }
            }
        }
    }];


    XLSX.utils.sheet_add_aoa(ws, [STAT3], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 2) } });

    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 2)))}`].c = [];
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 2)))}`].c.hidden = true;
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 2)))}`].c.push({
        a: "PRAxIS_Planningstool", t: `TOTAAL: ${STAT3_Totaal}\n${STAT3_TEXT} `
    });

    // #endregion

    // #region 4 TOTAAL DAGEN CUMUL
    let STAT4_TEXT = "";
    let hulpVal_Counter = 0;

    let STAT4_Total = Object.keys(stats.maand).reduce((accumulator, currVal) => {
        let hulpVal_ShiftDB = stats.maand[currVal].cumul.shiftDb.filter(cumulShift => shiftTypes.find(ST => ST.id === cumulShift.shifttype_id).categorie !== 'standby');
        STAT4_TEXT = STAT4_TEXT.concat(`${currVal.substring(0, 2)}:${hulpVal_ShiftDB.length}${((++hulpVal_Counter) % 3) === 0 ? '\n' : ' - '}`);
        return accumulator += hulpVal_ShiftDB.length;
    }, 0);

    let STAT4 = [{

        v: (STAT4_Total) | 'error',
        t: "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },

            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            fill: {
                fgColor: { rgb: "ffffff" }
            }
        }
    }];

    XLSX.utils.sheet_add_aoa(ws, [STAT4], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 3) } });
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 3)))}`].c = [];
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 3)))}`].c.hidden = true;
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 3)))}`].c.push({
        a: "PRAxIS_Planningstool", t: `TOTAAL: ${STAT4_Total}\n${STAT4_TEXT} `
    });


    // #endregion

    // #region 5 UREN VORIGE MAAND

    let lastMonth = moment(currMonth, 'MM-YYYY').subtract(1, 'month').isSame(moment(currMonth, 'MM-YYYY'), 'year') ? moment(currMonth, 'MM-YYYY').subtract(1, 'month').format('MM-YYYY') : false;

    let STAT5_Totaal = lastMonth === false ? 'To-Do' : Math.round((stats.maand[lastMonth].cumul.totaalUrenOpKalender + stats.maand[lastMonth].cumul.urenUitVorigeMaand) * 100) / 100;



    let STAT5 = [{

        v: STAT5_Totaal,
        t: "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },

            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            fill: {
                fgColor: { rgb: "ededed" }
            }
        }
    }];


    XLSX.utils.sheet_add_aoa(ws, [STAT5], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 4) } });



    // #endregion

    // #region 6 TOTAAL UREN CUMUL


    let STAT6_TEXT = {};

    let STAT6_Total = Object.keys(stats.maand).reduce((accumulator, currVal, index) => {
        let totalThisMonth = Math.round((stats.maand[currVal].cumul.totaalUrenOpKalender + stats.maand[currVal].cumul.urenUitVorigeMaand + Number.EPSILON) * 100) / 100;
        if (STAT6_TEXT[`${Math.floor(index / 3) + 1}`] === undefined) {
            STAT6_TEXT[`${Math.floor(index / 3) + 1}`] = totalThisMonth;
        } else {
            STAT6_TEXT[`${Math.floor(index / 3) + 1}`] += totalThisMonth;
        }
        return accumulator += totalThisMonth;
    }, 0);

    STAT6_Total = Math.round(100 * STAT6_Total + Number.EPSILON) / 100

    let STAT6 = [{

        v: STAT6_Total,
        t: "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },

            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            fill: {
                fgColor: { rgb: "ffffff" }
            }
        }
    }];

    XLSX.utils.sheet_add_aoa(ws, [STAT6], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 5) } });
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 5)))}`].c = [];
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 5)))}`].c.hidden = true;
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 5)))}`].c.push({
        a: "PRAxIS_Planningstool", t: `TOTAAL: ${STAT6_Total}\nI : ${STAT6_TEXT['1']}\nII :${STAT6_TEXT['2']}\nIII :${STAT6_TEXT['3']}\nIV :${STAT6_TEXT['4']} `
    });



    // #endregion


    // #region 7 UREN VORIGE MAANDEN KWARTAAL

    let STAT7_Totaal = lastMonth === false ? 'To-Do' : Math.round((stats.maand[lastMonth].cumul.totaalUrenOpKalender + stats.maand[lastMonth].cumul.urenUitVorigeMaand) * 100) / 100;

    <td style={{ padding: "1px" }}>{Math.round((Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (moment(currVal, "MM-YYYY").isSame(currMonthMoment, 'quarter') && moment(currVal, "MM-YYYY").isBefore(currMonthMoment, 'month') ? (stats.maand[currVal].cumul.totaalUrenOpKalender + stats.maand[currVal].cumul.urenUitVorigeMaand) : 0), 0)) * 100) / 100}</td>


    let STAT7 = [{

        v: STAT7_Totaal,
        t: "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },

            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            fill: {
                fgColor: { rgb: "ededed" }
            }
        }
    }];


    XLSX.utils.sheet_add_aoa(ws, [STAT7], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 6) } });



    // #endregion


    // #region 8 TOTAAL UREN KWARTAAL CUMUL

    let STAT8_Totaal = Math.round((Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (moment(currVal, "MM-YYYY").isSame(currMonthMoment, 'quarter') ? (stats.maand[currVal].cumul.totaalUrenOpKalender + stats.maand[currVal].cumul.urenUitVorigeMaand) : 0), 0)) * 100) / 100;


    let STAT8 = [{

        v: STAT8_Totaal,
        t: "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },

            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            fill: {
                fgColor: { rgb: "FFFFFF" }
            }
        }
    }];


    XLSX.utils.sheet_add_aoa(ws, [STAT8], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 7) } });

    // #endregion



    // #region 9 GEWERKTE WEEKENDS DEZE MAAND


    let STAT9_TEXT = {
        vrij: stats.maand[currMonth].weekends.volledig_vrij.length,
        standby: stats.maand[currMonth].weekends.gepland_met_standby.length,
        shift: stats.maand[currMonth].weekends.gepland_met_shifts.length
    };

    let STAT9_Totaal = stats.maand[currMonth].weekends.gepland_met_shifts.length;


    let STAT9 = [{

        v: STAT9_Totaal,
        t: "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },

            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            fill: {
                fgColor: { rgb: "ededed" }
            }
        }
    }];


    XLSX.utils.sheet_add_aoa(ws, [STAT9], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 8) } });

    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 8)))}`].c = [];
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 8)))}`].c.hidden = true;
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 8)))}`].c.push({
        a: "PRAxIS_Planningstool", t: `VRIJ: ${STAT9_TEXT['vrij']}\nSB: ${STAT9_TEXT.standby}\nSHIFT: ${STAT9_TEXT.shift}`
    });


    // #endregion


    // #region 10 TOTAAL GEWERKTE WEEKENDS

    let STAT10_TEXT = {
        vrij: 0,
        standby: 0,
        shift: 0
    };

    let STAT10_Totaal = Object.keys(stats.maand).reduce((accumulator, currVal) => {

        STAT10_TEXT.vrij += stats.maand[currVal].weekends.volledig_vrij.length;
        STAT10_TEXT.standby += stats.maand[currVal].weekends.gepland_met_standby.length;
        STAT10_TEXT.shift += stats.maand[currVal].weekends.gepland_met_shifts.length;

        return accumulator += stats.maand[currVal].weekends.gepland_met_shifts.length
    }, 0);

    let STAT10 = [{

        v: STAT10_Totaal,
        t: "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },

            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            fill: {
                fgColor: { rgb: "FFFFFF" }
            }
        }
    }];


    XLSX.utils.sheet_add_aoa(ws, [STAT10], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 9) } });
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 9)))}`].c = [];
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 9)))}`].c.hidden = true;
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length + 9)))}`].c.push({
        a: "PRAxIS_Planningstool", t: `VRIJ: ${STAT10_TEXT['vrij']}\nSB: ${STAT10_TEXT.standby}\nSHIFT: ${STAT10_TEXT.shift}`
    });



    // #endregion



    // #region 11 STANDY


    let STAT11_TOTAAL = Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].standby.totaalAantalShiften), 0);

    let STAT11_MAAND = stats.maand[currMonth].standby.totaalAantalShiften;


    let STAT11 = [{
        v: STAT11_MAAND,
        t: "s",
        s: {
            font: {
                color: {
                    rgb: "ffffff"
                },
            },
            fill: {
                fgColor: { rgb: "001a52" }
            },
            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            alignment: {
                horizontal: "center",
                vertical: 'center'
            }
        }
    },
    {
        v: STAT11_TOTAAL,
        t: "s",
        s: {
            font: {
                color: {
                    rgb: "ffffff"
                },
            },
            fill: {
                fgColor: { rgb: "001a52" }
            },
            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            alignment: {
                horizontal: "center",
                vertical: 'center'
            }
        }
    }
    ];


    XLSX.utils.sheet_add_aoa(ws, [STAT11], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 10) } });

    // #endregion


    // #region 12 VERLOF

    let STAT12_TOTAAL = Math.round((Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].verlof.shiftDb.filter(x => shiftTypes.find(y => y.id === x.shifttype_id).naam.includes('verlof')).reduce((acc, val) => acc += calcHoursShift(val, shiftTypes), 0)), 0)) * 100) / 100;



    let STAT12 = [{
        v: STAT12_TOTAAL,
        t: "s",
        s: {

            fill: {
                fgColor: { rgb: "D8E4BC" }
            },
            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            alignment: {
                horizontal: "center",
                vertical: 'center'
            }
        }
    },
    {
        v: 'ToDo',
        t: "s",
        s: {

            fill: {
                fgColor: { rgb: "D8E4BC" }
            },
            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            alignment: {
                horizontal: "center",
                vertical: 'center'
            }
        }
    }
    ];


    XLSX.utils.sheet_add_aoa(ws, [STAT12], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 12) } });

    // #endregion



    // #region 13 ANCIENNITEIT
    let STAT13_TOTAAL = Math.round((Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].verlof.shiftDb.filter(x => shiftTypes.find(y => y.id === x.shifttype_id).naam.includes('ancienniteit')).reduce((acc, val) => acc += calcHoursShift(val, shiftTypes), 0)), 0)) * 100) / 100;



    let STAT13 = [{
        v: STAT13_TOTAAL,
        t: "s",
        s: {

            fill: {
                fgColor: { rgb: "FCD5B4" }
            },
            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            alignment: {
                horizontal: "center",
                vertical: 'center'
            }
        }
    },
    {
        v: 'ToDo',
        t: "s",
        s: {

            fill: {
                fgColor: { rgb: "FCD5B4" }
            },
            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            alignment: {
                horizontal: "center",
                vertical: 'center'
            }
        }
    }
    ];


    XLSX.utils.sheet_add_aoa(ws, [STAT13], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 14) } });

    // #endregion


    // #region 14 ONBETAALD VERLOF
    let STAT14_TOTAAL = (Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].verlof.shiftDb.filter(x => shiftTypes.find(y => y.id === x.shifttype_id).naam.includes('onbetaald')).length), 0));



    let STAT14 = [{
        v: STAT14_TOTAAL,
        t: "s",
        s: {

            fill: {
                fgColor: { rgb: "46D7DE" }
            },
            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            alignment: {
                horizontal: "center",
                vertical: 'center'
            }
        }
    },
    {
        v: 'ToDo',
        t: "s",
        s: {

            fill: {
                fgColor: { rgb: "46D7DE" }
            },
            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            alignment: {
                horizontal: "center",
                vertical: 'center'
            }
        }
    }
    ];


    XLSX.utils.sheet_add_aoa(ws, [STAT14], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 16) } });

    // #endregion



    // #region 15 UITZONDERINGSDAGEN
    let STAT15_TOTAAL = Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].verlof.shiftDb.filter(x => shiftTypes.find(y => y.id === x.shifttype_id).naam.includes('uitzonderingsdag')).length), 0)



    let STAT15 = [{
        v: STAT15_TOTAAL,
        t: "s",
        s: {
            fill: {
                fgColor: { rgb: "F247FF" }
            },
            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            alignment: {
                horizontal: "center",
                vertical: 'center'
            }
        }
    },
    {
        v: 'ToDo',
        t: "s",
        s: {
            fill: {
                fgColor: { rgb: "F247FF" }
            },
            border: {
                bottom: { style: 'thick', color: '#000000' },
                top: { style: 'thick', color: '#000000' }
            },
            alignment: {
                horizontal: "center",
                vertical: 'center'
            }
        }
    }
    ];


    XLSX.utils.sheet_add_aoa(ws, [STAT15], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length + 18) } });

    // #endregion


    return ws;
}

const addSelectedShiftTypesInfoInSheet = (ws, calendarObject, shiftTypes, hulpValAlleShiftTypesOpCal, hulpVal_Days_Of_month) => {

    let MeldkamerShiften = [];
    let Verlof_VrijDagenShiften = [];
    let OverigeShiften = [];

    for (let index = 0; index < hulpValAlleShiftTypesOpCal.length; index++) {
        let ID = hulpValAlleShiftTypesOpCal[index]
        if (ID === false) {
            OverigeShiften.push(false);
            continue;
        }
        let shifttype = shiftTypes.find(x => x.id === ID);

        switch (shifttype.categorie) {

            //MELDKAMER : OPERATOR+STANDBY+COOPMAN
            case 'operator':
            case 'standby':
            case 'coopman':
                MeldkamerShiften.push(shifttype);
                break;

            //VERLOF - VRIJE DAGEN : VERLOF + ZIEKTE
            case 'verlof':
            case 'ziekte':
                Verlof_VrijDagenShiften.push(shifttype);
                break;

            // ANDERE
            default:
                OverigeShiften.push(shifttype);
                break;

        }
    }

    let merges = [
        { s: { r: 1, c: 2 }, e: { r: 1, c: (1 + hulpVal_Days_Of_month.length) } },
        { s: { r: 2, c: 2 }, e: { r: 2, c: (1 + hulpVal_Days_Of_month.length) } },

        { s: { r: 1, c: (13 + hulpVal_Days_Of_month.length) }, e: { r: 1, c: (14 + hulpVal_Days_Of_month.length) } },
        { s: { r: 1, c: (15 + hulpVal_Days_Of_month.length) }, e: { r: 1, c: (16 + hulpVal_Days_Of_month.length) } },
        { s: { r: 1, c: (17 + hulpVal_Days_Of_month.length) }, e: { r: 1, c: (18 + hulpVal_Days_Of_month.length) } },
        { s: { r: 1, c: (19 + hulpVal_Days_Of_month.length) }, e: { r: 1, c: (20 + hulpVal_Days_Of_month.length) } },
        { s: { r: 1, c: (21 + hulpVal_Days_Of_month.length) }, e: { r: 1, c: (22 + hulpVal_Days_Of_month.length) } }

    ];


    //MELDKAMER
    let MELDKAMER = [];

    merges.push({ s: { r: (6 + calendarObject.length), c: 2 }, e: { r: (6 + calendarObject.length), c: 8 } });


    MeldkamerShiften.sort((a, b) => a.id - b.id).forEach((shift, index) => {
        MELDKAMER.push([shiftLayOutForCell(shift), {
            v: shift.export_text,
            t: "s",
            s: {
                alignment: {
                    horizontal: "center"
                },
                font: { sz: 8 }
            }
        }]);

        merges.push({ s: { r: (8 + calendarObject.length + index), c: 3 }, e: { r: (8 + calendarObject.length + index), c: 8 } });

    });


    //VERLOf - VRIJE DAGEN
    let VERLOF_VRIJE_DAGEN = [];

    merges.push({ s: { r: (6 + calendarObject.length), c: 10 }, e: { r: (6 + calendarObject.length), c: 16 } });


    Verlof_VrijDagenShiften.sort((a, b) => a.id - b.id).forEach((shift, index) => {
        VERLOF_VRIJE_DAGEN.push([shiftLayOutForCell(shift), {
            v: shift.export_text,
            t: "s",
            s: {
                alignment: {
                    horizontal: "center"
                },
                font: { sz: 8 }
            }
        }]);

        merges.push({ s: { r: (8 + calendarObject.length + index), c: 11 }, e: { r: (8 + calendarObject.length + index), c: 16 } });

    })

    //OVERIGE
    let OVERIGE = [];

    merges.push({ s: { r: (6 + calendarObject.length), c: 18 }, e: { r: (6 + calendarObject.length), c: 24 } });


    OverigeShiften.sort((a, b) => a.id - b.id).forEach((shift, index) => {
        if (shift === false) {
            OVERIGE.push([
                {
                    v: `X`,
                    t: "s",
                    s: {
                        fill: {
                            fgColor: { rgb: "000000" }
                        },
                        font: {
                            color: {
                                rgb: "ffffff"
                            }
                        },
                        alignment: {
                            horizontal: "center"
                        }
                    }
                }
                ,
                {
                    v: `Einde arbeidsovereenkomst`,
                    t: "s",
                    s: {
                        alignment: {
                            horizontal: "center"
                        },

                        font: { sz: 8 }

                    }
                }
            ]);
        } else {
            OVERIGE.push([shiftLayOutForCell(shift), {
                v: shift.export_text,
                t: "s",
                s: {
                    alignment: {
                        horizontal: "center"
                    },

                    font: { sz: 8 }
                }
            }]);

        }
        merges.push({ s: { r: (8 + calendarObject.length + index), c: 19 }, e: { r: (8 + calendarObject.length + index), c: 24 } });

    })





    ws["!merges"] = merges;

    //INFOHEADERS
    XLSX.utils.sheet_add_aoa(ws, [[
        {
            v: `MELDKAMER`,
            t: "s",
            s: {
                fill: {
                    fgColor: { rgb: "df0024" }
                },
                font: {
                    color: {
                        rgb: "ffffff"
                    },
                    bold: true
                },
                alignment: {
                    horizontal: "center"
                }
            }
        }]], { origin: `C${7 + calendarObject.length}` });

    XLSX.utils.sheet_add_aoa(ws, [[
        {
            v: `VERLOF - ZIEKTE`,
            t: "s",
            s: {
                fill: {
                    fgColor: { rgb: "df0024" }
                },
                font: {
                    color: {
                        rgb: "ffffff"
                    },
                    bold: true
                },
                alignment: {
                    horizontal: "center"
                }
            }
        }]], { origin: `K${7 + calendarObject.length}` });

    XLSX.utils.sheet_add_aoa(ws, [[
        {
            v: `OVERIGE`,
            t: "s",
            s: {
                fill: {
                    fgColor: { rgb: "df0024" }
                },
                font: {
                    color: {
                        rgb: "ffffff"
                    },
                    bold: true
                },
                alignment: {
                    horizontal: "center"
                }
            }
        }]], { origin: `S${7 + calendarObject.length}` });

    //INFOTABELS
    XLSX.utils.sheet_add_aoa(ws, MELDKAMER, { origin: `C${9 + calendarObject.length}` });
    XLSX.utils.sheet_add_aoa(ws, VERLOF_VRIJE_DAGEN, { origin: `K${9 + calendarObject.length}` });
    XLSX.utils.sheet_add_aoa(ws, OVERIGE, { origin: `S${9 + calendarObject.length}` });

    return ws;

}

const checkForShiftTypes = (individualCal, currentList) => {

    for (let index = 0; index < individualCal.calendar.length; index++) {
        if (individualCal.calendar[index].shift !== '' && !currentList.includes(individualCal.calendar[index].shift)) {
            currentList.push(individualCal.calendar[index].shift)
        }
    }
    return currentList;
}

const makeIndividualScheduleROWInCalendarInSheet = (ws, individualCalendar, shiftTypes, index, Employees) => {

    let employee = Employees.find(x => x.id === individualCalendar.employeeId);

    let history = [
        {
            v: `${employee.voornaam.toUpperCase()} ${employee.familienaam.toUpperCase()}`,
            t: "s",
            s: {
                alignment: {
                    horizontal: "left",
                    vertical: "center"
                },
                border: {
                    bottom: { style: 'thin', color: '#D3D3D3' },
                    top: { style: 'thin', color: '#D3D3D3' },
                    left: { style: 'thin', color: '#D3D3D3' },
                    right: { style: 'thin', color: '#D3D3D3' }
                }

            }
        }
    ]

    for (let index = 0; index < individualCalendar.calendar.length; index++) {

        if (individualCalendar.calendar[index].shift === '') {
            if ([6, 7].includes(moment(individualCalendar.calendar[index].day, "DD-MM-YYYY").isoWeekday())) {
                history.push(
                    {
                        v: `X`,
                        t: "s",
                        s: {
                            fill: {
                                fgColor: { rgb: "005f00" }
                            },
                            font: {
                                color: {
                                    rgb: "ffffff"
                                },
                                size: 9
                            },
                            alignment: {
                                horizontal: "center",
                                vertical: "center"
                            },
                            border: {
                                bottom: { style: 'dashed', color: '#D3D3D3' },
                                top: { style: 'dashed', color: '#D3D3D3' },
                                left: { style: 'dashed', color: '#D3D3D3' },
                                right: { style: 'dashed', color: '#D3D3D3' }
                            }
                        }
                    }
                )
            } else {
                history.push({
                    v: ` `,
                    t: "s",
                    s: {
                        border: {
                            bottom: { style: 'dashed', color: '#D3D3D3' },
                            top: { style: 'dashed', color: '#D3D3D3' },
                            left: { style: 'dashed', color: '#D3D3D3' },
                            right: { style: 'dashed', color: '#D3D3D3' }
                        }
                    }
                });

            }

        } else if (individualCalendar.calendar[index].shift === false) {
            history.push(
                {
                    v: `X`,
                    t: "s",
                    s: {
                        fill: {
                            fgColor: { rgb: "000000" }
                        },
                        font: {
                            color: {
                                rgb: "ffffff"
                            }
                        },
                        alignment: {
                            horizontal: "center",
                            vertical: "center"
                        }
                    }
                }
            )
        }
        else {

            history.push(shiftDayLayOutForCell(individualCalendar.calendar[index], shiftTypes))
        }


    }

    XLSX.utils.sheet_add_aoa(ws, [history], { origin: `B${6 + index}` });
    return ws;

}

const changeWidthColomnsAndHeightRowsInSheet = (ws, hulpVal_Days_Of_month, calendarObject) => {

    let wscols = Array(hulpVal_Days_Of_month.length + 3).fill({ wpx: 35 });

    wscols[0] = { wpx: 10 };
    wscols[1] = { wpx: 170 };
    wscols[wscols.length - 1] = { wpx: 10 }

    let wsrows = Array(5 + calendarObject.length).fill({ hpx: 22 })

    wsrows[0] = { hpx: 7 };
    wsrows[1] = {};
    wsrows[2] = { hpx: 15 };
    wsrows[3] = { hpx: 15 };
    wsrows[4] = { hpx: 15 };


    ws['!cols'] = wscols;

    ws['!rows'] = wsrows;

    return ws;

}

const makeHeaderForCalendarInSheet = (ws, hulpVal_Days_Of_month, monthYearString, Holidays) => {


    const merge = [
        { s: { r: 1, c: 2 }, e: { r: 1, c: (1 + hulpVal_Days_Of_month.length) } },
        { s: { r: 2, c: 2 }, e: { r: 2, c: (1 + hulpVal_Days_Of_month.length) } },

        { s: { r: 1, c: (13 + hulpVal_Days_Of_month.length) }, e: { r: 1, c: (14 + hulpVal_Days_Of_month.length) } },
        { s: { r: 1, c: (15 + hulpVal_Days_Of_month.length) }, e: { r: 1, c: (16 + hulpVal_Days_Of_month.length) } },
        { s: { r: 1, c: (17 + hulpVal_Days_Of_month.length) }, e: { r: 1, c: (18 + hulpVal_Days_Of_month.length) } },
        { s: { r: 1, c: (19 + hulpVal_Days_Of_month.length) }, e: { r: 1, c: (20 + hulpVal_Days_Of_month.length) } },
        { s: { r: 1, c: (21 + hulpVal_Days_Of_month.length) }, e: { r: 1, c: (22 + hulpVal_Days_Of_month.length) } }
    ];

    ws["!merges"] = merge;

    //PLANNING MAAND-JAAR - PRAxIS GROUP NV 
    XLSX.utils.sheet_add_aoa(ws, [[
        {
            v: `PLANNING ${monthYearString} - PRAxIS Group NV`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    sz: 24
                },
                alignment: {
                    horizontal: "center",
                    vertical: "center"

                }
            }
        }
    ]], { origin: "C2" });
    //STAT-TITELS NAAST HEADER
    XLSX.utils.sheet_add_aoa(ws, [[
        {
            v: `Uren\ndeze\nmaand`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 8
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "ededed" }
                }
            }
        },
        {
            v: `Operator\nuren`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 8
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "ffffff" }
                }
            }
        },
        {
            v: `Totaal\ndagen\ndeze\nmaand`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 8
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "ededed" }
                }
            }
        },
        {
            v: `Totaal\ndagen\ncumul`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 8
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "ffffff" }
                }
            }
        },
        {
            v: `Uren\nvorige\nmaanden`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 8
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "ededed" }
                }
            }
        },
        {
            v: `Tot.\nUren\ncumul\njaar`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 8
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "ffffff" }
                }
            }
        },
        {
            v: `Uren\nvorige\nmaanden\nkwartaal`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 8
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "ededed" }
                }
            }
        },
        {
            v: `Tot.\nUren\ncumul\nkwartaal`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 8
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "ffffff" }
                }
            }
        },
        {
            v: `Gewerkte\nweekends\ndeze\nmaand`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 8
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "ededed" }
                }
            }
        },
        {
            v: `Totaal\ngewerkte\nweekends`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 8
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "ffffff" }
                }
            }
        },
        {
            v: `Standby`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 10,
                    color: {
                        rgb: "ffffff"
                    },
                },
                fill: {
                    fgColor: { rgb: "001a52" }
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                }
            }
        },
        {
            v: ` `,
            t: "s",
            s: {
                alignment: {
                    horizontal: "center"
                },
                fill: {
                    fgColor: { rgb: "001a52" }
                }
            }
        },
        {
            v: `Verlof`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 10
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "D8E4BC" }
                }
            }
        },
        {
            v: ``,
            t: "s",
            s: {
                fill: {
                    fgColor: { rgb: "D8E4BC" }
                }
            }
        }
        ,
        {
            v: `Anciënniteit`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 10
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "FCD5B4" }
                }
            }
        },
        {
            v: ``,
            t: "s",
            s: {
                fill: {
                    fgColor: { rgb: "FCD5B4" }
                }
            }
        }
        ,
        {
            v: `Onbetaald verlof`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 10
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "46D7DE" }
                }
            }
        },
        {
            v: ``,
            t: "s",
            s: {
                fill: {
                    fgColor: { rgb: "46D7DE" }
                }
            }
        }
        ,
        {
            v: `Uitzonderingsdagen`,
            t: "s",
            s: {
                font: {
                    bold: true,
                    underline: true,
                    sz: 10
                },
                alignment: {
                    horizontal: "center",
                    vertical: 'center',
                    wrapText: true
                },
                fill: {
                    fgColor: { rgb: "F247FF" }
                }
            }
        },
        {
            v: ``,
            t: "s",
            s: {
                fill: {
                    fgColor: { rgb: "F247FF" }
                }
            }
        }
    ]
    ], { origin: { r: 1, c: (3 + hulpVal_Days_Of_month.length) } });

    //MAANDNAAM MET RODE ACHTERKANT + STATS AFKORTINGEN
    XLSX.utils.sheet_add_aoa(ws, [[
        {
            v: `${moment(monthYearString, "MM-YYYY").format("MMMM")}`,
            t: "s",
            s: {
                fill: {
                    fgColor: { rgb: "df0024" }
                },
                font: {
                    color: {
                        rgb: "ffffff"
                    },
                    bold: true
                },
                alignment: {
                    horizontal: "center"
                }
            }
        }
    ]], { origin: "C3" });

    //STATS AFKORTINGEN NAAST HEADER
    XLSX.utils.sheet_add_aoa(ws, [
        [

            {
                v: `UDM`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: `OU`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: `TDDM`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: `TDC`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: `UVM`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: `TUC`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: `UVMkw`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: `TuKw`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: `GWDM`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: `TGW`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: `SB`,
                t: "s",
                s: {

                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    font: {
                        bold: true,

                        color: {
                            rgb: "ffffff"
                        }
                    },
                    fill: {
                        fgColor: { rgb: "001a52" }
                    }
                }
            },
            {
                v: `SBC`,
                t: "s",
                s: {
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    font: {
                        bold: true,

                        color: {
                            rgb: "ffffff"
                        }
                    },
                    fill: {
                        fgColor: { rgb: "001a52" }
                    }
                }
            },
            {
                v: `OV`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "D8E4BC" }
                    }
                }
            },
            {
                v: `NOTNV`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "D8E4BC" }
                    }
                }
            }
            ,
            {
                v: `OA`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "FCD5B4" }
                    }
                }
            },
            {
                v: `NOTNA`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "FCD5B4" }
                    }
                }
            }
            ,
            {
                v: `OOV`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "46D7DE" }
                    }
                }
            },
            {
                v: `NOTNOV`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "46D7DE" }
                    }
                }
            }
            ,
            {
                v: `OUD`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "F247FF" }
                    }
                }
            },
            {
                v: `NOTUD`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "F247FF" }
                    }
                }
            }


        ],
        [

            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true,
                        underline: true,
                        sz: 10,
                        color: {
                            rgb: "ffffff"
                        },
                    },
                    fill: {
                        fgColor: { rgb: "001a52" }
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center',
                        wrapText: true
                    }
                }
            },
            {
                v: ` `,
                t: "s",
                s: {
                    alignment: {
                        horizontal: "center"
                    },
                    fill: {
                        fgColor: { rgb: "001a52" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true,
                        underline: true,
                        sz: 10
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center',
                        wrapText: true
                    },
                    fill: {
                        fgColor: { rgb: "D8E4BC" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    fill: {
                        fgColor: { rgb: "D8E4BC" }
                    }
                }
            }
            ,
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true,
                        underline: true,
                        sz: 10
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center',
                        wrapText: true
                    },
                    fill: {
                        fgColor: { rgb: "FCD5B4" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    fill: {
                        fgColor: { rgb: "FCD5B4" }
                    }
                }
            }
            ,
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true,
                        underline: true,
                        sz: 10
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center',
                        wrapText: true
                    },
                    fill: {
                        fgColor: { rgb: "46D7DE" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    fill: {
                        fgColor: { rgb: "46D7DE" }
                    }
                }
            }
            ,
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true,
                        underline: true,
                        sz: 10
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center',
                        wrapText: true
                    },
                    fill: {
                        fgColor: { rgb: "F247FF" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    fill: {
                        fgColor: { rgb: "F247FF" }
                    }
                }
            }
        ],
        [

            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ededed" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center'
                    },
                    fill: {
                        fgColor: { rgb: "ffffff" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true,
                        underline: true,
                        sz: 10,
                        color: {
                            rgb: "ffffff"
                        },
                    },
                    fill: {
                        fgColor: { rgb: "001a52" }
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center',
                        wrapText: true
                    }
                }
            },
            {
                v: ` `,
                t: "s",
                s: {
                    alignment: {
                        horizontal: "center"
                    },
                    fill: {
                        fgColor: { rgb: "001a52" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true,
                        underline: true,
                        sz: 10
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center',
                        wrapText: true
                    },
                    fill: {
                        fgColor: { rgb: "D8E4BC" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    fill: {
                        fgColor: { rgb: "D8E4BC" }
                    }
                }
            }
            ,
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true,
                        underline: true,
                        sz: 10
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center',
                        wrapText: true
                    },
                    fill: {
                        fgColor: { rgb: "FCD5B4" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    fill: {
                        fgColor: { rgb: "FCD5B4" }
                    }
                }
            }
            ,
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true,
                        underline: true,
                        sz: 10
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center',
                        wrapText: true
                    },
                    fill: {
                        fgColor: { rgb: "46D7DE" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    fill: {
                        fgColor: { rgb: "46D7DE" }
                    }
                }
            }
            ,
            {
                v: ``,
                t: "s",
                s: {
                    font: {
                        bold: true,
                        underline: true,
                        sz: 10
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: 'center',
                        wrapText: true
                    },
                    fill: {
                        fgColor: { rgb: "F247FF" }
                    }
                }
            },
            {
                v: ``,
                t: "s",
                s: {
                    fill: {
                        fgColor: { rgb: "F247FF" }
                    }
                }
            }
        ]
    ], { origin: { r: 2, c: (3 + hulpVal_Days_Of_month.length) } });

    //INFO LINKS CAN HEADER BOVEN WERKNEMER
    XLSX.utils.sheet_add_aoa(ws, [

        [
            {
                v: `FOD 0478243652`,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "center"
                    }
                }
            }

        ],
        [
            {
                v: `datum  `,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "right"
                    }
                }
            }
        ],
        [
            {
                v: `dag  `,
                t: "s",
                s: {
                    font: {
                        bold: true
                    },
                    alignment: {
                        horizontal: "right"
                    }
                }
            }
        ]
    ], { origin: "B3" });


    //m-d-w-d-v-z-z
    //28-29-30-31-1-2-.....-30-1-2
    let hulpValHeaderNames = [];
    let hulpValHeaderDates = []

    for (let index = 0; index < hulpVal_Days_Of_month.length; index++) {
        if (Holidays.some(x => moment(x.datum, "YYYY-MM-DD").isSame(hulpVal_Days_Of_month[index], 'day'))) {
            hulpValHeaderNames.push(
                {
                    v: `${hulpVal_Days_Of_month[index].format("dd")}`,
                    t: "s",
                    s: {
                        fill: {
                            fgColor: { rgb: "4bacc6" }
                        },
                        alignment: {
                            horizontal: "center"
                        },
                        font: {
                            bold: true,
                            color: {
                                rgb: "df0024"
                            }
                        }
                    }
                }
            );
            hulpValHeaderDates.push(
                {
                    v: `${hulpVal_Days_Of_month[index].format("DD")}`,
                    t: "n",
                    s: {
                        fill: {
                            fgColor: { rgb: "4bacc6" }
                        },
                        font: {
                            bold: true,
                            color: {
                                rgb: "df0024"
                            }
                        },
                        alignment: {
                            horizontal: "center"
                        }
                    }
                }
            );
        }
        else if ([6, 7].includes(hulpVal_Days_Of_month[index].isoWeekday())) {
            hulpValHeaderNames.push(
                {
                    v: `${hulpVal_Days_Of_month[index].format("dd")}`,
                    t: "s",
                    s: {
                        fill: {
                            fgColor: { rgb: "c9e5f0" }
                        },
                        alignment: {
                            horizontal: "center"
                        },
                        font: {
                            color: {
                                rgb: "df0024"
                            }
                        }
                    }
                }
            );
            hulpValHeaderDates.push(
                {
                    v: `${hulpVal_Days_Of_month[index].format("DD")}`,
                    t: "n",
                    s: {
                        fill: {
                            fgColor: { rgb: "c9e5f0" }
                        },
                        font: {
                            bold: true,
                            color: {
                                rgb: "df0024"
                            }
                        },
                        alignment: {
                            horizontal: "center"
                        }
                    }
                }
            );
        } else {
            hulpValHeaderNames.push(
                {
                    v: `${hulpVal_Days_Of_month[index].format("dd")}`,
                    t: "s",
                    s: {
                        fill: {
                            fgColor: { rgb: "f2f2f2" }
                        },
                        alignment: {
                            horizontal: "center"
                        }
                    }
                }
            );
            hulpValHeaderDates.push(
                {
                    v: `${hulpVal_Days_Of_month[index].format("DD")}`,
                    t: "n",
                    s: {
                        font: {
                            bold: true
                        },
                        alignment: {
                            horizontal: "center"
                        },
                        fill: {
                            fgColor: { rgb: "f2f2f2" }
                        }
                    }
                }
            );

        }
    }
    XLSX.utils.sheet_add_aoa(ws, [hulpValHeaderDates], { origin: "C4" });
    XLSX.utils.sheet_add_aoa(ws, [hulpValHeaderNames], { origin: "C5" });
    return ws;
}
const roundToTwo = (num) => {
    return +(Math.round(num + "e+2") + "e-2");
}

const shiftLayOutForCell = (shift) => {


    let shiftText = shift.standaardtekst === "uur" ? roundToTwo(
        moment.duration(moment((`${shift.einduur}`), "hh:mm").diff(moment((`${shift.beginuur}`), "hh:mm"))).asHours() >= 0 ?
            moment.duration(moment((`${shift.einduur}`), "hh:mm").diff(moment((`${shift.beginuur}`), "hh:mm"))).asHours() :
            moment.duration(moment((`${shift.einduur}`), "hh:mm").add(1, "day").diff(moment((`${shift.beginuur}`), "hh:mm"))).asHours()
    ) :
        shift.standaardtekst === "min" ?
            (moment.utc(moment.duration(moment((`${shift.einduur}`), "hh:mm").diff(moment((`${shift.beginuur}`), "hh:mm"))).asMilliseconds()) >= 0 ?
                moment.utc(moment.duration(moment((`${shift.einduur}`), "hh:mm").diff(moment((`${shift.beginuur}`), "hh:mm"))).asMilliseconds()).format("h:mm") :
                moment.utc(moment.duration(moment((`${shift.einduur}`), "hh:mm").add(1, "day").diff(moment((`${shift.beginuur}`), "hh:mm"))).asMilliseconds()).format("h:mm")
            )
            :
            shift.standaardtekst;

    let border = shift.border ? {
        bottom: { style: 'medium', color: '#000000' },
        top: { style: 'medium', color: '#000000' },
        left: { style: 'medium', color: '#000000' },
        right: { style: 'medium', color: '#000000' }
    } : {};


    return {
        v: shiftText,
        t: shift.standaardtekst === "uur" ? "n" : "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },
            fill: {
                fgColor: { rgb: shift.kleurcode.substring(1, 7) }
            },
            font: {
                color: {
                    rgb: shift.tekstkleurcode.substring(1, 7)
                },
                size: 9
            },
            border: border
        }
    }
}

const shiftDayLayOutForCell = (shiftDay, shiftTypes) => {

    let shift = shiftTypes.find(x => x.id == shiftDay.shift);

    let shiftText = shift.standaardtekst === "uur" ? roundToTwo(
        moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() >= 0 ?
            moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() :
            moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").add(1, "day").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours()
    ) :
        shift.standaardtekst === "min" ?
            (moment.utc(moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asMilliseconds()) >= 0 ?
                moment.utc(moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asMilliseconds()).format("h:mm") :
                moment.utc(moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").add(1, "day").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asMilliseconds()).format("h:mm")
            )
            :
            shift.standaardtekst;

    let border = shift.border ? {
        bottom: { style: 'thick', color: '#000000' },
        top: { style: 'thick', color: '#000000' },
        left: { style: 'thick', color: '#000000' },
        right: { style: 'thick', color: '#000000' }
    } : {
        bottom: { style: 'dashed', color: '#000000' },
        top: { style: 'dashed', color: '#000000' },
        left: { style: 'dashed', color: '#000000' },
        right: { style: 'dashed', color: '#000000' }
    };


    return {
        v: shiftText,
        t: shift.standaardtekst === "uur" ? "n" : "s",
        s: {
            alignment: {
                horizontal: "center",
                vertical: "center"
            },
            fill: {
                fgColor: { rgb: shift.kleurcode.substring(1, 7) }
            },
            font: {
                color: {
                    rgb: shift.tekstkleurcode.substring(1, 7)
                },
                size: 9
            },
            border: border
        }
    }
}

const calcHoursShift = (shiftDay, shifttypes) => {

    let shift = shifttypes.find(x => x.id === shiftDay.shifttype_id);


    let duratie = moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.beginuur ? `${shiftDay.datum}-${shiftDay.beginuur}` : `${shiftDay.datum}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() >= 0 ?
        moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.beginuur ? `${shiftDay.datum}-${shiftDay.beginuur}` : `${shiftDay.datum}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() :
        moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").add(1, "day").diff(moment((shiftDay.beginuur ? `${shiftDay.datum}-${shiftDay.beginuur}` : `${shiftDay.datum}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours()

    return duratie;
}


export {
    makeOverzichtSheet,
    makeMonthWorkSheet
}