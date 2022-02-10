import Excel from 'exceljs';
import moment from 'moment';
import * as MOMENT_OPERATIONS from '../../moment_operations/index.js';

import { dummy, shifts } from './dummydata.js';

const createExcelFile = () => {
    const workbook = new Excel.Workbook();
    var worksheet;

    

    workbook.xlsx.readFile('C:/Users/User/Documents/projects/planning tool praxis/v1.2/backend/temp_rapporten/template.xlsx')
    .then(function() {
        console.log('file READ');
         worksheet = workbook.getWorksheet(1);

    })


 /*   const worksheet = workbook.addWorksheet("Prestatiefiche " + dummy.calendarMonth, {
        pageSetup: { paperSize: 9, orientation: 'portrait' }
    });*/ 




    //INFO OPERATOR + TITEL
    worksheet.mergeCells('B1:D1');
    worksheet.mergeCells('B2:D2');
    worksheet.mergeCells('F1:H1');
    worksheet.mergeCells('F2:H2');
    worksheet.getCell('A1').value = 'Voornaam';
    worksheet.getCell('B1').value = dummy.familienaam;
    worksheet.getCell('E1').value = 'Agentnummer';
    worksheet.getCell('F1').value = 'NB';
    worksheet.getCell('A2').value = 'Naam';
    worksheet.getCell('B2').value = dummy.voornaam;
    worksheet.getCell('E2').value = 'Functie';
    worksheet.getCell('F2').value = 'NB';

    worksheet.mergeCells('A4:H5');
    worksheet.getCell('A4').value = "Prestatiefiche " + dummy.calendarMonth;

    let overlappendeShiften00_06 = 0;
    let overlappendeShiften06_22 = 0;
    let overlappendeShiften22_24 = 0;

    //PLANNING
    let row = ['Dag', 'Datum', '00:00-06:00', '06:00-22:00', '22:00-24:00', 'Aantal uren', 'Standby', 'info(shift)'];
    worksheet.insertRow(rowCounter++, row);

    let totaalGewoneWerkurenWeek = 0;
    let totaalGewoneWerkurenZaterdag = 0;
    let totaalGewoneWerkurenZondag = 0;
    let nachturenWeek = 0;
    let nachturenZaterdag = 0;
    let nachturenZondag = 0;
    let currentCalendarMonth = moment(dummy.calendarMonth, "MM-YYYY");



    dummy.employeeCalendar.forEach(shiftDay => {

        let LocalOverlappendeShiften00_06 = overlappendeShiften00_06;
        let LocalOverlappendeShiften06_22 = overlappendeShiften06_22;
        let LocalOverlappendeShiften22_24 = overlappendeShiften22_24;
        overlappendeShiften00_06 = 0;
        overlappendeShiften06_22 = 0;
        overlappendeShiften22_24 = 0;

        let beginMoment;
        let eindMoment;
        //BEGIN EN EINDMOMENT BEPALEN
        if (shiftDay.shift !== ""&&shiftDay.shift !=="standby") {
            let shift = shifts.find(o => o.naam === shiftDay.shift);
            beginMoment = moment((shiftDay.day + "-" + shift.beginuur), "DD-MM-YYYY-hh:mm");
            eindMoment = moment((shiftDay.day + "-" + shift.einduur), "DD-MM-YYYY-hh:mm");
            if (beginMoment.isAfter(eindMoment)) {
                eindMoment.add(1, 'day');
            }
        } else {
            beginMoment = moment((shiftDay.day), "DD-MM-YYYY");
        }


        //DAGEN VOOR MAAND
        if (!eindMoment && !beginMoment.isSame(currentCalendarMonth, "month") || eindMoment && !beginMoment.isSame(currentCalendarMonth, "month") && !eindMoment.isSame(currentCalendarMonth, "month")) {
            return;


        } else //SHIFT VOOR DE MAAND
            if (eindMoment && !beginMoment.isSame(currentCalendarMonth, "month") && eindMoment.isSame(currentCalendarMonth, "month")) {
                beginMoment.add(1, 'day');
                beginMoment.set({ h: 0, m: 0 });
                let hulpEindMoment06_00 = eindMoment.clone().set({ h: 6, m: 0 });
                let duration06_00 = moment.duration(hulpEindMoment06_00.diff(beginMoment));
                overlappendeShiften00_06 = duration06_00.asHours();


                if (eindMoment.isAfter(hulpEindMoment06_00)) {
                    overlappendeShiften06_22 = moment.duration(eindMoment.diff(hulpEindMoment06_00)).asHours();
                }
            } else // SHIFT IN DE MAAND
                if (!eindMoment && beginMoment.isSame(currentCalendarMonth, "month")) {
                    row = [MOMENT_OPERATIONS.getDayName_String(beginMoment),
                    beginMoment.format("DD/MM/YYYY"),
                    LocalOverlappendeShiften00_06 !== 0 ? LocalOverlappendeShiften00_06 : '',
                    LocalOverlappendeShiften06_22 !== 0 ? LocalOverlappendeShiften06_22 : '',
                    LocalOverlappendeShiften22_24 !== 0 ? LocalOverlappendeShiften22_24 : '',
                        '',
                        '',
                        ''];

                } else if (eindMoment && beginMoment.isSame(currentCalendarMonth, "month") && eindMoment.isSame(currentCalendarMonth, "month")) {
                    let hulpBeginMoment06_00 = beginMoment.clone().set({ h: 6, m: 0 });
                    let hulpBeginMoment22_00 = beginMoment.clone().set({ h: 22, m: 0 });
                    let hulpBeginMoment24_00 = beginMoment.clone().set({ h: 24, m: 0 });
                    let hulpEindMoment06_00 = eindMoment.clone().set({ h: 6, m: 0 });
                    let duration00_06 = 0;
                    let duration06_22 = 0;
                    let duration22_24 = 0;
                    let durationNextDay24_06;
                    let durationNextDay06_22;



                    if (beginMoment.isBefore(hulpBeginMoment06_00) || beginMoment.isSame(hulpBeginMoment06_00, 'hour')) {
                        duration00_06 = moment.duration(hulpBeginMoment06_00.diff(beginMoment)).asHours();
                        duration06_22 = moment.duration(eindMoment.diff(hulpBeginMoment06_00)).asHours();

                    };

                    if (beginMoment.isAfter(hulpBeginMoment06_00) && beginMoment.isBefore(hulpBeginMoment22_00)) {
                        duration06_22 = moment.duration(hulpBeginMoment22_00.diff(beginMoment)).asHours();
                        if (eindMoment.isAfter(hulpBeginMoment22_00) && eindMoment.isBefore(hulpBeginMoment24_00)) {
                            duration22_24 = moment.duration(hulpBeginMoment22_00.diff(eindMoment)).asHours();
                        } else if (eindMoment.isAfter(hulpBeginMoment24_00) && (eindMoment.isBefore(hulpEindMoment06_00) || beginMoment.isSame(hulpBeginMoment06_00, 'hour'))) {
                            duration22_24 = 2;
                            overlappendeShiften00_06 = moment.duration(hulpBeginMoment24_00.diff(eindMoment)).asHours();
                        }
                        else if (eindMoment.isAfter(hulpEindMoment06_00)) {
                            duration22_24 = 2;
                            overlappendeShiften00_06 = 6;
                            overlappendeShiften06_22 = moment.duration(eindMoment.diff(hulpEindMoment06_00)).asHours();
                        }
                    }



                    row = [
                        MOMENT_OPERATIONS.getDayName_String(beginMoment),
                        beginMoment.format("DD/MM/YYYY"),
                        LocalOverlappendeShiften00_06 !== 0 ? LocalOverlappendeShiften00_06 + duration00_06 : duration00_06 !== 0 ? duration00_06 : '',
                        LocalOverlappendeShiften06_22 !== 0 ? LocalOverlappendeShiften06_22 + duration06_22 : duration06_22 !== 0 ? duration06_22 : '',
                        LocalOverlappendeShiften22_24 !== 0 ? LocalOverlappendeShiften22_24 + duration22_24 : duration22_24 !== 0 ? duration22_24 : '',
                        '',
                        '',
                        shiftDay.shift!==""?shiftDay.shift:''
                    ];



                }

        worksheet.insertRow(rowCounter++, row);










    })




   workbook
        .xlsx
        .writeFile('C:/Users/User/Documents/projects/planning tool praxis/v1.2/backend/temp_rapporten/sample.xlsx')
        .then(() => {
            return true;


        })
        .catch((err) => {

            console.log("err", err);
            return false;
        }); 



}

createExcelFile();

export { createExcelFile }