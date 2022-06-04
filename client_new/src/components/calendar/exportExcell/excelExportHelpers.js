import { getCalendarMoments_ArrayWithMoments } from '../helpers';

import * as XLSX from 'xlsx-js-style';
import moment from 'moment';


const init = [{}]

const tempData = [
    { v: "Courier: 24", t: "s", s: { font: { name: "Courier", sz: 24 } } },
    { v: "bold & color", t: "s", s: { font: { bold: true, color: { rgb: "FF0000" } } } },
    { v: "fill: color", t: "s", s: { fill: { fgColor: { rgb: "E9E9E9" } } } },
    {
        v: "line\nbreak",
        t: "s",
        s: {
            alignment: { wrapText: true },
            border: {
                bottom: { style: 'thin', color: '#000000' },
                top: { style: 'thick', color: '#000000' },
                left: { style: 'medium', color: '#000000' },
                right: { style: 'thick', color: '#000000' }
            }
        }
    },
];

const makeOverzichtSheet = () => {
    let ws = XLSX.utils.aoa_to_sheet([[{}]]);



    XLSX.utils.sheet_add_aoa(ws, [tempData, tempData, tempData], { origin: `F13` });

    return ws;
}

const makeMonthWorkSheet = (monthYearString, yearlyStatsObject, calendarObject, shiftTypes, Employees) => {

    let hulpVal_Days_Of_month = getCalendarMoments_ArrayWithMoments(monthYearString);
    let hulpValAlleShiftTypesOpCal = [];
    console.log(calendarObject);

    console.log(monthYearString);

    //init
    let ws = XLSX.utils.aoa_to_sheet([init]);
    //de grote van kolommen aanpassen
    ws = changeWidthColomnsAndHeightRowsInSheet(ws, hulpVal_Days_Of_month, calendarObject);
    //de calendertitels toevoegen
    ws = makeHeaderForCalendarInSheet(ws, hulpVal_Days_Of_month, monthYearString);

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
        console.log(`${hulpArr[colomnNumber]}${rowNumber + 1}`);
        return `${hulpArr[colomnNumber]}${rowNumber + 1}`
    } else {
        console.log(`${hulpArr[Math.floor(colomnNumber / 26) - 1]}${hulpArr[colomnNumber % 26]}${rowNumber + 1}`);
        return `${hulpArr[Math.floor(colomnNumber / 26) - 1]}${hulpArr[colomnNumber % 26]}${rowNumber + 1}`
    }

}

const addMarioStats = (ws, stats, shiftTypes, index, currMonth, hulpVal_Days_Of_month) => {


    const currMonthMoment = moment(currMonth, "MM-YYYY");


    //UREN DEZE MAAND  
    let STAT1_totaalUrenOpKalender = Math.round(stats.maand[currMonth].cumul.totaalUrenOpKalender * 100) / 100;
    let STAT1_urenUitVorigeMaand = Math.round(stats.maand[currMonth].cumul.urenUitVorigeMaand * 100) / 100;

    let STAT1 = [{

        v: (STAT1_totaalUrenOpKalender + STAT1_urenUitVorigeMaand) | 'error',
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


    XLSX.utils.sheet_add_aoa(ws, [STAT1], { origin: { r: (5 + index), c: (3 + hulpVal_Days_Of_month.length) } });

    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length)))}`].c = [];
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length)))}`].c.hidden = true;
    ws[`${translateOriginToLocationText((5 + index), ((3 + hulpVal_Days_Of_month.length)))}`].c.push({
        a: "PRAxIS_Planningstool", t: `VM: ${STAT1_urenUitVorigeMaand}\nHM: ${STAT1_totaalUrenOpKalender}\nTOTAAL: ${STAT1_totaalUrenOpKalender + STAT1_urenUitVorigeMaand} `
    });


    //TOTAAL OPERATORUREN
    let STAT2_dag_operator_urenUitVorigeMaand = Math.round(stats.maand[currMonth].dag_operator.urenUitVorigeMaand * 100) / 100;
    let STAT2_dag_operator_totaalUrenOpKalender = Math.round(stats.maand[currMonth].dag_operator.totaalUrenOpKalender * 100) / 100;
    let STAT2_nacht_operator_urenUitVorigeMaand = Math.round(stats.maand[currMonth].nacht_operator.urenUitVorigeMaand * 100) / 100;
    let STAT2_nacht_operator_totaalUrenOpKalender = Math.round(stats.maand[currMonth].nacht_operator.totaalUrenOpKalender * 100) / 100;
    let STAT2_coopman_totaalUrenOpKalender = Math.round(stats.maand[currMonth].coopman.totaalUrenOpKalender * 100) / 100;
    let STAT2_Totaal = STAT2_coopman_totaalUrenOpKalender + STAT2_dag_operator_totaalUrenOpKalender + STAT2_dag_operator_urenUitVorigeMaand + STAT2_nacht_operator_totaalUrenOpKalender + STAT2_nacht_operator_urenUitVorigeMaand;


    let STAT2 = [{

        v: (STAT2_Totaal) | 'error',
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
        a: "PRAxIS_Planningstool", t: `Dag VM: ${STAT2_dag_operator_urenUitVorigeMaand}\nNACHT VM: ${STAT2_nacht_operator_urenUitVorigeMaand}\nDag HM: ${STAT2_dag_operator_totaalUrenOpKalender}\nNACHT HM: ${STAT2_nacht_operator_totaalUrenOpKalender}\nTOTAAL: ${STAT2_Totaal} `
    });


    //TOTAAL DAGEN DEZE MAAND

    let STAT3_Totaal = stats.maand[currMonth].cumul.totaalAantalShiften - stats.maand[currMonth].standby.totaalAantalShiften;

    let STAT3_Object = {};

    for (let STAT3_LOOPER = 0; STAT3_LOOPER < stats.maand[currMonth].cumul.shiftDb.length; STAT3_LOOPER++) {
        let STAT3_LOOPER_Shift = shiftTypes.find(x => x.id === stats.maand[currMonth].cumul.shiftDb[STAT3_LOOPER].shifttype_id);
        if (STAT3_LOOPER_Shift.categorie === 'standby') {
            continue;
        }
        if (STAT3_Object[`${stats.maand[currMonth].cumul.shiftDb[STAT3_LOOPER].shifttypes_naam}`] === undefined) {
            STAT3_Object[`${stats.maand[currMonth].cumul.shiftDb[STAT3_LOOPER].shifttypes_naam}`] = 1;
        } else {
            STAT3_Object[`${stats.maand[currMonth].cumul.shiftDb[STAT3_LOOPER].shifttypes_naam}`]++;
        }
    }

    let STAT3_TEXT = "";

    Object.keys(STAT3_Object).forEach(key => { STAT3_TEXT = STAT3_TEXT.concat(`${key}: ${STAT3_Object[`${key}`]}\n`); });

    Object.keys(STAT3_Object).forEach(key => console.log(`${key}: ${STAT3_Object[`${key}`]}\n`));

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
        a: "PRAxIS_Planningstool", t: `Totaal: ${STAT3_Totaal}\n${STAT3_TEXT} `
    });










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
            v: `${employee.voornaam.toUpperCase()} ${employee.familienaam.substring(0, 2).toUpperCase()}.`,
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
    wscols[1] = { wpx: 200 };
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

const makeHeaderForCalendarInSheet = (ws, hulpVal_Days_Of_month, monthYearString) => {


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







    ]], { origin: { r: 1, c: (3 + hulpVal_Days_Of_month.length) } });

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
    XLSX.utils.sheet_add_aoa(ws, [[

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


    ]], { origin: { r: 2, c: (3 + hulpVal_Days_Of_month.length) } });

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
                v: `datum`,
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
                v: `dag`,
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
        if ([6, 7].includes(hulpVal_Days_Of_month[index].isoWeekday())) {
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


export {
    makeOverzichtSheet,
    makeMonthWorkSheet
}