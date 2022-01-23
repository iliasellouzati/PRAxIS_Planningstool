import config from './dbconfig.js';
import sql from 'mssql';
import moment from 'moment';

sql.on('error', err => {
    console.log(err.message);
});

function createUDT_shift(startingId, shifts) {

    const UDT = new sql.Table();
    UDT.columns.add('id', sql.Int);
    UDT.columns.add('datum', sql.Date);
    UDT.columns.add('shifttypes_naam', sql.VarChar(100));
    UDT.columns.add('werknemers_id', sql.Int);

    shifts.forEach(shift => {
        UDT.rows.add(startingId++, new Date(moment(shift.day, "DD-MM-YYYY").format("YYYY-MM-DD").toString()), shift.shift, shift.werknemers_id);
    });

    return UDT;
}

async function saveNewShifts(startingId, shifts) {
    let UDT_shifts = createUDT_shift(startingId, shifts);
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('shifts', UDT_shifts)
            .execute('saveNewShifts');
        // return shifts.recordsets[0];

    } catch (error) {
        sql.close();
        console.log(error);
    }
}

async function saveUpdatedShifts(startingId, shifts) {
    let UDT_shifts = createUDT_shift(startingId, shifts);
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('shifts', UDT_shifts)
            .execute('saveUpdatedShifts');
        // return shifts.recordsets[0];

    } catch (error) {
        sql.close();
        console.log(error);
    }
}

async function saveDeletedShifts(startingId, shifts) {
    let UDT_shifts = createUDT_shift(startingId, shifts);
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('shifts', UDT_shifts)
            .execute('saveDeletedShifts');
        // return shifts.recordsets[0];

    } catch (error) {
        sql.close();
        console.log(error);
    }
}

async function getAllShifts() {
    try {

        let pool = await sql.connect(config);
        let shifts = await pool.request()
            .execute('getAllShifts');
        return shifts.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
}

async function getNewShiftId() {
    try {
        let pool = await sql.connect(config);
        let shifts = await pool.request()
            .execute('getNewShiftId');

        return shifts.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
}

async function getCalendarShifts(begindatum, einddatum) {
    try {
        let pool = await sql.connect(config);
        let shifts = await pool.request()
            .input('begindatum', sql.Date, begindatum)
            .input('einddatum', sql.Date, einddatum)
            .execute('getCalendarShifts');

        return shifts.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
}

async function getCalendarShiftsFromEmployee(begindatum, einddatum, employeeId) {
    try {
        let pool = await sql.connect(config);
        let shifts = await pool.request()
            .input('begindatum', sql.Date, begindatum)
            .input('einddatum', sql.Date, einddatum)
            .input('werknemers_id', sql.Int, employeeId)
            .execute('getCalendarShiftsFromEmployee');

        return shifts.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
}
async function getYearlyCalendarOverview(year) {
    try {
        let pool = await sql.connect(config);
        let yearOvervieuw = await pool.request()
            .input('datum', sql.VarChar(10), year)
            .execute('getYearlyCalendarOverview');
        return yearOvervieuw.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
}

export { getAllShifts, getYearlyCalendarOverview, getCalendarShifts, getNewShiftId, saveNewShifts, saveUpdatedShifts, saveDeletedShifts,getCalendarShiftsFromEmployee }