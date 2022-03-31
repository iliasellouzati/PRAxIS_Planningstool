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
            shift.beginuur,
            shift.einduur
        );
    });

    return UDT;
}

function createUDT_saved_calendar(shifts) {

    const UDT = new sql.Table();
    UDT.columns.add('calendar_versie', sql.NVarChar(10));
    UDT.columns.add('werknemer_id', sql.Int);
    UDT.columns.add('werknemer_voornaam', sql.NVarChar(100));
    UDT.columns.add('werknemer_familienaam', sql.NVarChar(100));
    UDT.columns.add('shift_datum', sql.NVarChar(10));
    UDT.columns.add('shift_shifttypes_naam', sql.VarChar(100));
    UDT.columns.add('shift_beginuur', sql.NVarChar(5));
    UDT.columns.add('shift_einduur', sql.NVarChar(5));
    UDT.columns.add('shifttypes_beginuur', sql.VarChar(25));
    UDT.columns.add('shifttypes_einduur', sql.VarChar(25));
    UDT.columns.add('shifttypes_kleurcode', sql.VarChar(25));
    UDT.columns.add('shifttypes_verplicht', sql.Bit);
    UDT.columns.add('shifttypes_thuiswerk', sql.Bit);
    UDT.columns.add('shifttypes_aanpasbare_uren', sql.Bit);
    UDT.columns.add('shifttypes_categorie', sql.NChar(100));
    UDT.columns.add('shifttypes_tekstkleurcode', sql.VarChar(25));
    UDT.columns.add('shifttypes_border', sql.Bit);
    UDT.columns.add('shifttypes_standaardtekst', sql.VarChar(3));
    UDT.columns.add('shifttypes_standby', sql.Bit);

    shifts.forEach(shift => {
        UDT.rows.add(
            shift.calendar_versie,
            shift.werknemer_id,
            shift.werknemer_voornaam,
            shift.werknemer_familienaam,
            shift.shift_datum,
            shift.shift_shifttypes_naam,
            shift.shift_beginuur,
            shift.shift_einduur,
            shift.shifttypes_beginuur,
            shift.shifttypes_einduur,
            shift.shifttypes_kleurcode,
            shift.shifttypes_verplicht,
            shift.shifttypes_thuiswerk,
            shift.shifttypes_aanpasbare_uren,
            shift.shifttypes_categorie,
            shift.shifttypes_tekstkleurcode,
            shift.shifttypes_border,
            shift.shifttypes_standaardtekst,
            shift.shifttypes_standby
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

async function saveShiftsToSavedCalendar(shifts) {
    try {


        let UDT_saved_calendar = createUDT_saved_calendar(shifts);

        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('shifts', UDT_saved_calendar)
            .execute('saveShiftsToSavedCalendar');
        return result.rowsAffected[0];

    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}

async function getSavedCalendarShifts(savedCalendarVersion) {
    try {

        let pool = await sql.connect(config);
        let shifts = await pool.request()
            .input('calendar_versie', savedCalendarVersion)
            .execute('getSavedCalendarShifts');
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
    saveDeletedShifts,
    saveShiftsToSavedCalendar,
    getSavedCalendarShifts
}