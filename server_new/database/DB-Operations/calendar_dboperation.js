import config from './dbconfig.js';
import sql from 'mssql';
import moment from 'moment';

sql.on('error', err => {
    console.log(err.message);
});


async function getNewShiftId() {
    try {
        let pool = await sql.connect(config);
        let shiftId = await pool.request()
            .execute('getNewShiftId');

        return shiftId.recordsets[0];
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


export {
    getNewShiftId,
    getCalendarShifts,
    getCalendarShiftsFromEmployee
}