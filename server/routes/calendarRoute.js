import Express from "express";
import * as Shift_DB from '../SQL/DB-Operations/shift_dboperations.js';
import * as Employee_DB from '../SQL/DB-Operations/werknemers_dboperations.js';
import * as Moment_Operations from '../moment_operations/index.js';
import * as Shifttypes_DB from '../SQL/DB-Operations/shifttypes_dboperations.js';

import moment from 'moment';
const router = Express.Router();

router.get("/:id", async (req, res) => {
    let begindatum = Moment_Operations.getFirstDayOfCalendarMonth_Moment(moment(req.params.id, 'MM-YYYY'));
    let einddatum = Moment_Operations.getLastDayOfCalendarMonth_Moment(moment(req.params.id, 'MM-YYYY'));
    let currentMonth = moment(req.params.id, 'MM-YYYY');
    const shifttypes = await Shifttypes_DB.getAllShiftTypes();
    const currentStoredShifts = await Shift_DB.getCalendarShifts(begindatum.format('YYYY-MM-DD'), einddatum.format('YYYY-MM-DD'));

    let lastbegindatum = Moment_Operations.getFirstDayOfCalendarMonth_Moment(currentMonth.clone().subtract(1, "month"));
    let lasteinddatum = Moment_Operations.getLastDayOfCalendarMonth_Moment(currentMonth.clone().subtract(1, "month"));
    const lastStoredShifts = await Shift_DB.getCalendarShifts(lastbegindatum.format('YYYY-MM-DD'), lasteinddatum.format('YYYY-MM-DD'));

    let SecondLastbegindatum = Moment_Operations.getFirstDayOfCalendarMonth_Moment(currentMonth.clone().subtract(2, "month"));
    let SecondLasteinddatum = Moment_Operations.getLastDayOfCalendarMonth_Moment(currentMonth.clone().subtract(2, "month"));
    const SecondLastStoredShifts = await Shift_DB.getCalendarShifts(SecondLastbegindatum.format('YYYY-MM-DD'), SecondLasteinddatum.format('YYYY-MM-DD'));

    

    const employees = await Employee_DB.getAllWerknemers();

    let hulpCalendar = Moment_Operations.getCalendarMonth_ArrayWithMoment(moment(req.params.id, 'MM-YYYY'));

    if (currentStoredShifts) {
        let EmployeesWithShifts = [];
        let EmployeeItterator = 0;


        

        employees.forEach((employee) => {

            let tempEmployee = [];
            let tempEmplItterator = 0;
            let aantalUurInKwartaal = 0;

            hulpCalendar.forEach(week =>
                week.forEach(day => {

                    let hulpShift = currentStoredShifts.find(o => o.werknemers_id === employee.id && moment(o.datum, "YYYY-MM-DD").format("DD-MM-YYYY") == day.format("DD-MM-YYYY"))
                    if (hulpShift) {

                        tempEmployee[tempEmplItterator++] = {
                            'day': day.format("DD-MM-YYYY"),
                            'shift': hulpShift.shifttypes_naam
                        }
                    } else {
                        tempEmployee[tempEmplItterator++] = {
                            'day': day.format("DD-MM-YYYY"),
                            'shift': ''
                        }
                    }
                }
                ));

            switch (Moment_Operations.getMonthName_String(currentMonth)) {
                case "Januari":
                case "April":
                case "Juli":
                case "Oktober":
                    break;
                case "Februari":
                case "Mei":
                case "Augustus":
                case "November":
                    aantalUurInKwartaal += Moment_Operations.calculateHoursInCalendarMonth_Int(currentMonth.clone().subtract(1, 'month').format("MM-YYYY"), employee.id, shifttypes, lastStoredShifts);
                    break;
                case "Maart":
                case "Juni":
                case "September":
                case "December":
                    aantalUurInKwartaal += Moment_Operations.calculateHoursInCalendarMonth_Int(currentMonth.clone().subtract(1, 'month').format("MM-YYYY"), employee.id, shifttypes, lastStoredShifts);
                    aantalUurInKwartaal += Moment_Operations.calculateHoursInCalendarMonth_Int(currentMonth.clone().subtract(2, 'month').format("MM-YYYY"), employee.id, shifttypes, SecondLastStoredShifts);
                    break;

                default:
                    break;
            }




            EmployeesWithShifts[EmployeeItterator++] = {
                'employeeId': employee.id,
                'aantalUurInKwartaal': aantalUurInKwartaal,
                'employeeCalendar': tempEmployee

            }

        })

        res.send(EmployeesWithShifts);



    } else {
        res.status(404).send("No calendar shifts found")
    }
})


router.get("/:idEmployee/:date", async (req, res) => {
    console.log("individual get received on " + req.params.date + " for bitch " + req.params.idEmployee);

    let begindatum = Moment_Operations.getFirstDayOfCalendarMonth_Moment(moment(req.params.date, 'MM-YYYY'));
    let einddatum = Moment_Operations.getLastDayOfCalendarMonth_Moment(moment(req.params.date, 'MM-YYYY'));
    const currentStoredShifts = await Shift_DB.getCalendarShiftsFromEmployee(begindatum.format('YYYY-MM-DD'), einddatum.format('YYYY-MM-DD'), req.params.idEmployee);

    let hulpCalendar = Moment_Operations.getCalendarMonth_ArrayWithMoment(moment(req.params.date, 'MM-YYYY'));
    let tempEmployee = [];
    let tempEmplItterator = 0;



    hulpCalendar.forEach(week =>
        week.forEach(day => {

            let hulpShift = currentStoredShifts.find(o => moment(o.datum, "YYYY-MM-DD").format("DD-MM-YYYY") == day.format("DD-MM-YYYY"))
            if (hulpShift) {

                tempEmployee[tempEmplItterator++] = {
                    'day': day.format("DD-MM-YYYY"),
                    'shift': hulpShift.shifttypes_naam
                }
            } else {
                tempEmployee[tempEmplItterator++] = {
                    'day': day.format("DD-MM-YYYY"),
                    'shift': ''
                }


            }
        }
        ));


    res.send(tempEmployee);
})

router.get("/jaaroverzicht/:id/:jaar", async (req, res) => {
    let begindatum = Moment_Operations.getFistDayOfYear_Moment(moment(req.params.jaar, 'YYYY'));
    let einddatum = Moment_Operations.getLastDayOfYear_Moment(moment(req.params.jaar, 'YYYY'));
    const currentStoredShifts = await Shift_DB.getCalendarShiftsFromEmployee(begindatum.format('YYYY-MM-DD'), einddatum.format('YYYY-MM-DD'), req.params.id);

    const dagShiften = ["0618", "0719"];
    const nachtShiften = ["1806", "1907"];


    let aantalDag = 0;
    let aantalNacht = 0;
    let aantalWeekends = 0;
    let laatsteShift="";

    for (let index = 0; index < currentStoredShifts.length; index++) {
        let shift = currentStoredShifts[index];

        if (dagShiften.includes(shift.shifttypes_naam)) {
            aantalDag++;
            laatsteShift=shift.shifttypes_naam;
        }
        if (nachtShiften.includes(shift.shifttypes_naam)) {
            aantalNacht++;
            laatsteShift=shift.shifttypes_naam;
        }
        if (moment(shift.datum, "YYYY-MM-DD").isoWeekday() === 5
            && (nachtShiften.includes(shift.shifttypes_naam))) {
            aantalWeekends++

            if (moment(currentStoredShifts[index + 1].datum, "YYYY-MM-DD").isSame(moment(shift.datum, "YYYY-MM-DD").add(1, "day"), "day") && moment(currentStoredShifts[index + 2].datum, "YYYY-MM-DD").isSame(moment(shift.datum, "YYYY-MM-DD").add(2, "day"), "day")) {
                aantalNacht += 2;
                index += 2;
            }
        }
        if (moment(shift.datum, "YYYY-MM-DD").isoWeekday() === 6
            && (nachtShiften.includes(shift.shifttypes_naam) || dagShiften.includes(shift.shifttypes_naam))) {
            aantalWeekends++;

            if (dagShiften.includes(shift.shifttypes_naam)) {
                aantalDag++;
            }
            if (nachtShiften.includes(shift.shifttypes_naam)) {
                aantalNacht++;
            } index++;
        }
    }


    res.send({ "aantal_dagshiften": aantalDag, "aantal_nachtshiften": aantalNacht, "aantal_weekends": aantalWeekends , "laatste_shift":laatsteShift});

})



router.post("/:id", async (req, res) => {

    let begindatum = Moment_Operations.getFirstDayOfCalendarMonth_Moment(moment(req.params.id, 'MM-YYYY'));
    let einddatum = Moment_Operations.getLastDayOfCalendarMonth_Moment(moment(req.params.id, 'MM-YYYY'));
    let newShiftId = await Shift_DB.getNewShiftId();
    newShiftId = newShiftId[0].id;
    newShiftId++;
    const currentStoredShifts = await Shift_DB.getCalendarShifts(begindatum.format('YYYY-MM-DD'), einddatum.format('YYYY-MM-DD'));
    let calendar = req.body;

    let newShifts = [];
    let sameShifts = [];

    let updatedShifts = [];
    let deletedShifts = [];

    {/* NIEUWE GELIJKE EN UPDATED SHIFTS ZOEKEN */ }
    calendar.forEach(employee =>
        employee.employeeCalendar.forEach(shiftDay => {
            if (shiftDay.shift !== "") {
                let result = currentStoredShifts.find(o => o.werknemers_id == employee.employeeId && moment(o.datum, "YYYY-MM-DD").format("DD-MM-YYYY").toString() == shiftDay.day)
                if (!result) {
                    newShifts.push({ ...shiftDay, 'werknemers_id': employee.employeeId });
                } else if (result.shifttypes_naam == shiftDay.shift) {
                    sameShifts.push({ ...shiftDay, 'werknemers_id': employee.employeeId });
                } else {
                    updatedShifts.push({ ...shiftDay, 'werknemers_id': employee.employeeId });
                }
            }
        }));

    {/* VERWIJDERDE SHIFTS ZOEKEN */ }
    calendar.forEach(employee =>
        employee.employeeCalendar.forEach(shiftDay => {
            if (
                !(newShifts.some(e => e.day === shiftDay.day && e.shift === shiftDay.shift)
                    ||
                    sameShifts.some(e => e.day === shiftDay.day && e.shift === shiftDay.shift)
                    ||
                    updatedShifts.some(e => e.day === shiftDay.day && e.shift === shiftDay.shift)
                )
                &&
                (currentStoredShifts
                    .find(o =>
                        o.werknemers_id == employee.employeeId
                        &&
                        moment(o.datum, "YYYY-MM-DD").format("DD-MM-YYYY").toString() == shiftDay.day)
                )
            ) {
                deletedShifts.push({ ...shiftDay, 'werknemers_id': employee.employeeId });

            }

        }))

    if (newShifts) { await Shift_DB.saveNewShifts(newShiftId, newShifts); }
    if (updatedShifts) { await Shift_DB.saveUpdatedShifts(1, updatedShifts); }
    if (deletedShifts) { await Shift_DB.saveDeletedShifts(1, deletedShifts) }



    if (currentStoredShifts) {
        res.send({ 'new': newShifts ? newShifts.length : 0, 'same': sameShifts ? sameShifts.length : 0, 'updated': updatedShifts ? updatedShifts.length : 0, 'deleted': deletedShifts ? deletedShifts.length : 0 });
    } else {
        res.status(404).send("Calendar not found")
    }



})

export default router;