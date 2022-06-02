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
    return XLSX.utils.aoa_to_sheet([tempData]);

}

const makeMonthWorkSheet = (monthYearString, yearlyStatsObject, calendarObject, shiftTypes, Employees) => {

    let hulpVal_Days_Of_month = getCalendarMoments_ArrayWithMoments(monthYearString);
    let hulpValAlleShiftTypesOpCal = [];
    console.log(calendarObject);

    //init
    let ws = XLSX.utils.aoa_to_sheet([init]);
    //de grote van kolommen aanpassen
    ws = changeWidthColomnsInSheet(ws, hulpVal_Days_Of_month);
    //de calendertitels toevoegen
    ws = makeHeaderForCalendarInSheet(ws, hulpVal_Days_Of_month, monthYearString);

    //de individuele planningen toevoegen
    for (let index = 0; index < calendarObject.length; index++) {
        ws = makeIndividualScheduleROWInCalendarInSheet(ws, calendarObject[index], shiftTypes, index, Employees);
        hulpValAlleShiftTypesOpCal= checkForShiftTypes(calendarObject[index],hulpValAlleShiftTypesOpCal);
    }

    return ws;

}

const checkForShiftTypes =(individualCal, currentList) =>{

    for (let index = 0; index < individualCal.calendar.length; index++) {


    }


    return null;
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
                },

            }
        }
    ]

    for (let index = 0; index < individualCalendar.calendar.length; index++) {

        if (individualCalendar.calendar[index].shift === '') {
            if( [6, 7].includes(moment(individualCalendar.calendar[index].day,"DD-MM-YYYY").isoWeekday() )){
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
                                size:9
                            },
                            alignment: {
                                horizontal: "center"
                            }
                        }
                    }
                )
            }else{
                history.push({});

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
                            horizontal: "center"
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

const changeWidthColomnsInSheet = (ws, hulpVal_Days_Of_month) => {

    let wscols = Array(hulpVal_Days_Of_month.length + 2).fill({ wpx: 35 });

    wscols[0] = { wpx: 10 };
    wscols[1] = { wpx: 75 };


    ws['!cols'] = wscols;

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
                    bold:true
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
                horizontal: "center"
            },
            fill: {
                fgColor: { rgb: shift.kleurcode.substring(1, 7) }
            },
            font: {
                color: {
                    rgb: shift.tekstkleurcode.substring(1, 7)
                },
                size:9
            },
            border: border
        }
    }
}


export {
    makeOverzichtSheet,
    makeMonthWorkSheet
}