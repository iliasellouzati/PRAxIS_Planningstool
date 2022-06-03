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
    let ws = XLSX.utils.aoa_to_sheet([tempData, tempData, tempData]);

    XLSX.utils.sheet_add_aoa(ws, [tempData, tempData, tempData], { origin: `F13` });

    return ws;


}

const makeMonthWorkSheet = (monthYearString, yearlyStatsObject, calendarObject, shiftTypes, Employees) => {

    let hulpVal_Days_Of_month = getCalendarMoments_ArrayWithMoments(monthYearString);
    let hulpValAlleShiftTypesOpCal = [];
    console.log(calendarObject);

    //init
    let ws = XLSX.utils.aoa_to_sheet([init]);
    //de grote van kolommen aanpassen
    ws = changeWidthColomnsAndHeightRowsInSheet(ws, hulpVal_Days_Of_month, calendarObject);
    //de calendertitels toevoegen
    ws = makeHeaderForCalendarInSheet(ws, hulpVal_Days_Of_month, monthYearString);

    //de individuele planningen toevoegen
    for (let index = 0; index < calendarObject.length; index++) {
        ws = makeIndividualScheduleROWInCalendarInSheet(ws, calendarObject[index], shiftTypes, index, Employees);
        hulpValAlleShiftTypesOpCal = checkForShiftTypes(calendarObject[index], hulpValAlleShiftTypesOpCal);
    }

    //De geselecteerde shifttypes in legende toevoegen
    ws = addSelectedShiftTypesInfoInSheet(ws, calendarObject, shiftTypes, hulpValAlleShiftTypesOpCal, hulpVal_Days_Of_month);

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
        { s: { r: 1, c: 1 }, e: { r: 1, c: (1 + hulpVal_Days_Of_month.length) } },
        { s: { r: 2, c: 1 }, e: { r: 2, c: (1 + hulpVal_Days_Of_month.length) } }
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
                                bottom: { style: 'thin', color: '#D3D3D3' },
                                top: { style: 'thin', color: '#D3D3D3' },
                                left: { style: 'thin', color: '#D3D3D3' },
                                right: { style: 'thin', color: '#D3D3D3' }
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
                            bottom: { style: 'thin', color: '#D3D3D3' },
                            top: { style: 'thin', color: '#D3D3D3' },
                            left: { style: 'thin', color: '#D3D3D3' },
                            right: { style: 'thin', color: '#D3D3D3' }
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

    let wscols = Array(hulpVal_Days_Of_month.length + 2).fill({ wpx: 35 });

    wscols[0] = { wpx: 10 };
    wscols[1] = { wpx: 75 };

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
        { s: { r: 1, c: 1 }, e: { r: 1, c: (1 + hulpVal_Days_Of_month.length) } },
        { s: { r: 2, c: 1 }, e: { r: 2, c: (1 + hulpVal_Days_Of_month.length) } }
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
                    horizontal: "center"
                }
            }
        }]], { origin: "B2" });
    //MAANDNAAM MET RODE ACHTERKANT
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
        }]], { origin: "B3" });
    //DATUM HULPTEXT
    XLSX.utils.sheet_add_aoa(ws, [[
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
        }]], { origin: "B4" });
    //DAG HULPTEXT
    XLSX.utils.sheet_add_aoa(ws, [[
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
        }]], { origin: "B5" });

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
        bottom: { style: 'thin', color: '#000000' },
        top: { style: 'thin', color: '#000000' },
        left: { style: 'thin', color: '#000000' },
        right: { style: 'thin', color: '#000000' }
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