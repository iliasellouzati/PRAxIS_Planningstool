import Excel from 'exceljs';
import moment from 'moment';
import * as MOMENT_OPERATIONS from '../../moment_operations/index.js';


async function createExcelFile(dummy, shifts) {
    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile('C:/Users/User/Documents/projects/planning tool praxis/v1.2/backend/temp_rapporten/template.xlsx');
    let worksheet = workbook.getWorksheet(6);
    let rowCounter = 8;



    //INFO OPERATOR + TITEL


    worksheet.getCell('B1').value = "";
    worksheet.getCell('B2').value = dummy.voornaam;
    worksheet.getCell('A4').value = "Prestatiefiche " + dummy.calendarMonth;



    //PLANNING
    let row;

    let totaalGewoneWerkurenWeek = 0;
    let totaalGewoneWerkurenZaterdag = 0;
    let totaalGewoneWerkurenZondag = 0;
    let nachturenWeek = 0;
    let nachturenZaterdag = 0;
    let nachturenZondag = 0;
    let overlappendeShiften00_06 = 0;
    let overlappendeShiften06_22 = 0;
    let overlappendeShiften22_24 = 0;
    let currentCalendarMonth = moment(dummy.calendarMonth, "MM-YYYY");



    dummy.employeeCalendar.forEach(shiftDay => {

        let duration00_06 = 0;
        let duration06_22 = 0;
        let duration22_24 = 0;
        let LocalOverlappendeShiften00_06 = overlappendeShiften00_06;
        let LocalOverlappendeShiften06_22 = overlappendeShiften06_22;
        let LocalOverlappendeShiften22_24 = overlappendeShiften22_24;
        overlappendeShiften00_06 = 0;
        overlappendeShiften06_22 = 0;
        overlappendeShiften22_24 = 0;


        let beginMoment;
        let eindMoment;
        //BEGIN EN EINDMOMENT BEPALEN
        if (shiftDay.shift !== "" && shiftDay.shift !== "standby") {
            let shift = shifts.find(o => o.naam === shiftDay.shift);
            beginMoment = moment((shiftDay.day + "-" + shift.beginuur), "DD-MM-YYYY-hh:mm");
            eindMoment = moment((shiftDay.day + "-" + shift.einduur), "DD-MM-YYYY-hh:mm");
            if (beginMoment.isAfter(eindMoment)) {
                eindMoment.add(1, 'day');
            }
        } else {
            beginMoment = moment((shiftDay.day), "DD-MM-YYYY");
        }





        switch (true) {
            //shifts voor de maand
            case !eindMoment && !beginMoment.isSame(currentCalendarMonth, "month"):
            case eindMoment && !beginMoment.isSame(currentCalendarMonth, "month") && !eindMoment.isSame(currentCalendarMonth, "month"):

                return;

            //shift voor de maand met uren in de maand
            case eindMoment && !beginMoment.isSame(currentCalendarMonth, "month") && eindMoment.isSame(currentCalendarMonth, "month"): {

                beginMoment.add(1, 'day');
                beginMoment.set({ h: 0, m: 0 });
                let hulpEindMoment06_00 = eindMoment.clone().set({ h: 6, m: 0 });
                duration00_06 = moment.duration(hulpEindMoment06_00.diff(beginMoment));
                overlappendeShiften00_06 = duration00_06.asHours();
                if (eindMoment.isAfter(hulpEindMoment06_00)) {
                    overlappendeShiften06_22 = moment.duration(eindMoment.diff(hulpEindMoment06_00)).asHours();
                } 
                return;
            }



            //lege shifts in de maand
            case !eindMoment && beginMoment.isSame(currentCalendarMonth, "month"):

                break;

            //shifts in de maand
            case eindMoment && beginMoment.isSame(currentCalendarMonth, "month") && eindMoment.isSame(currentCalendarMonth, "month"): {

                let hulpBeginMoment06_00 = beginMoment.clone().set({ h: 6, m: 0 });
                let hulpBeginMoment22_00 = beginMoment.clone().set({ h: 22, m: 0 });
                let hulpBeginMoment24_00 = beginMoment.clone().set({ h: 24, m: 0 });
                let hulpEindMoment06_00 = eindMoment.clone().set({ h: 6, m: 0 });


                switch (true) {
                    case beginMoment.isBefore(hulpBeginMoment06_00) || beginMoment.isSame(hulpBeginMoment06_00, 'hour'):
                        duration00_06 = moment.duration(hulpBeginMoment06_00.diff(beginMoment)).asHours();
                        duration06_22 = moment.duration(eindMoment.diff(hulpBeginMoment06_00)).asHours();
                        break;


                    case beginMoment.isAfter(hulpBeginMoment06_00) && eindMoment.isBefore(hulpBeginMoment22_00):

                        duration06_22 = moment.duration(eindMoment.diff(beginMoment)).asHours();
                        break;


                    case beginMoment.isAfter(hulpBeginMoment06_00) && (eindMoment.isBefore(hulpBeginMoment24_00) || eindMoment.isSame(hulpBeginMoment24_00, 'hour')):

                        duration06_22 = moment.duration(hulpBeginMoment22_00.diff(beginMoment)).asHours();
                        duration22_24 = moment.duration(eindMoment.diff(hulpBeginMoment22_00)).asHours();
                        break;

                    case eindMoment.isAfter(hulpBeginMoment24_00) && (eindMoment.isBefore(hulpEindMoment06_00) || eindMoment.isSame(hulpEindMoment06_00, 'hour')):
                        duration06_22 = moment.duration(hulpBeginMoment22_00.diff(beginMoment)).asHours();
                        duration22_24 = 2;
                        overlappendeShiften00_06 = moment.duration(eindMoment.diff(hulpBeginMoment24_00)).asHours();
                        break;

                    case eindMoment.isAfter(hulpEindMoment06_00):

                        duration06_22 = moment.duration(hulpBeginMoment22_00.diff(beginMoment)).asHours();
                        duration22_24 = 2;
                        overlappendeShiften00_06 = 6;
                        overlappendeShiften06_22 = moment.duration(eindMoment.diff(hulpEindMoment06_00)).asHours();
                        break;

                    default:
                        break;
                }

            }
                break;


            //laatste shift van de maand met einde in volgende maand
            case eindMoment && beginMoment.isSame(currentCalendarMonth, "month") && !eindMoment.isSame(currentCalendarMonth, "month"): {
                let hulpBeginMoment22_00 = beginMoment.clone().set({ h: 22, m: 0 });
                let hulpBeginMoment24_00 = beginMoment.clone().set({ h: 24, m: 0 });
                duration06_22 = moment.duration(hulpBeginMoment22_00.diff(beginMoment)).asHours();
                duration22_24 = moment.duration(eindMoment.diff(hulpBeginMoment22_00)).asHours();
            }
                break;

            default:
                break;
        }

        row = [
            MOMENT_OPERATIONS.getDayName_String(beginMoment),
            beginMoment.format("DD/MM/YYYY"),
            LocalOverlappendeShiften00_06 !== 0 ? LocalOverlappendeShiften00_06 + duration00_06 : duration00_06 !== 0 ? duration00_06 : '',
            LocalOverlappendeShiften06_22 !== 0 ? LocalOverlappendeShiften06_22 + duration06_22 : duration06_22 !== 0 ? duration06_22 : '',
            LocalOverlappendeShiften22_24 !== 0 ? LocalOverlappendeShiften22_24 + duration22_24 : duration22_24 !== 0 ? duration22_24 : '',
            '',
            shiftDay.shift === "standby" ? 1 : '',
            shiftDay.shift !== "" ? shiftDay.shift : ''];



        var sheetRow = worksheet.getRow(rowCounter);
        sheetRow.getCell(1).value = row[0];
        sheetRow.getCell(2).value = row[1];
        sheetRow.getCell(3).value = row[2];
        sheetRow.getCell(4).value = row[3];
        sheetRow.getCell(5).value = row[4];
        // sheetRow.getCell(6).value = row[5];
        sheetRow.getCell(7).value = row[6];
        sheetRow.getCell(8).value = row[7];
        sheetRow.commit();



        //   worksheet.insertRow(rowCounter, row);

        rowCounter++;

    })



     await workbook
        .xlsx
        .writeFile('C:/Users/User/Documents/projects/planning tool praxis/v1.2/backend/temp_rapporten/'+dummy.voornaam+'_'+dummy.calendarMonth+'.xlsx');

        console.log("excel end  -> "+dummy.voornaam+'_'+dummy.calendarMonth+'.xlsx created');
    



}


export { createExcelFile }