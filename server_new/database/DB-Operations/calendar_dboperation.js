import config from './dbconfig.js';
import sql from 'mssql';
import moment from 'moment';

sql.on('error', err => {
    console.log(err.message);
});

function createUDT_shift(shifts) {

    const UDT = new sql.Table();
    UDT.columns.add('datum', sql.Date);
    UDT.columns.add('shifttypes_naam', sql.VarChar(100));
    UDT.columns.add('werknemers_id', sql.Int);
    UDT.columns.add('beginuur', sql.NVarChar(5));
    UDT.columns.add('einduur', sql.NVarChar(5));

    shifts.forEach(shift => {
        UDT.rows.add(
            new Date(moment(shift.datum, "DD-MM-YYYY").format("YYYY-MM-DD").toString()),
            shift.shifttypes_naam,
            shift.werknemers_id,
            shift.beginuur ,
            shift.einduur
        );
    });

    return UDT;
}
async function saveNewShifts(shifts) {
    let UDT_shifts = createUDT_shift(shifts);
    try {
        let pool = await sql.connect(config);
        let shifts = await pool.request()
            .input('shifts', UDT_shifts)
            .execute('saveNewShifts');
        return shifts.rowsAffected[0];

    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}

async function saveUpdatedShifts(shifts) {
    let UDT_shifts = createUDT_shift(shifts);
    try {
        let pool = await sql.connect(config);
        let shifts = await pool.request()
            .input('shifts', UDT_shifts)
            .execute('saveUpdatedShifts');
        return shifts.rowsAffected[0];

    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}

async function saveDeletedShifts(shifts) {
    let UDT_shifts = createUDT_shift(shifts);
    try {
        let pool = await sql.connect(config);
        let shifts = await pool.request()
            .input('shifts', UDT_shifts)
            .execute('saveDeletedShifts');
        return shifts.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
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
        throw new Error(error.message);
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
        throw new Error(error.message);
    }
}


export {
    getCalendarShifts,
    getCalendarShiftsFromEmployee,
    saveNewShifts,
    saveUpdatedShifts,
    saveDeletedShifts
}