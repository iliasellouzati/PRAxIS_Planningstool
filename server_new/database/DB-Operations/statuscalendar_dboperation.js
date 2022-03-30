import config from './dbconfig.js';
import sql from 'mssql';

sql.on('error', err => {
    console.log(err.message);
});


async function getAllStatusOfCalendarsByYear(year) {
    try {

        let pool = await sql.connect(config);
        let status = await pool.request()
            .input('year', sql.VarChar(100), year)
            .execute('getAllStatusOfCalendarsByYear');
        return status.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function getIndividualCalendarStatus(monthYear, version) {
    try {

        let pool = await sql.connect(config);
        let status = await pool.request()
            .input('month', sql.NVarChar(10), monthYear)
            .input('version', sql.Int, version)
            .execute('getIndividualCalendarStatus');
        return status.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}

async function addNewCalendarStatus(monthYear, version, progress, timestamp) {
    try {

        let pool = await sql.connect(config);
        let status = await pool.request()
            .input('month', sql.NVarChar(10), monthYear)
            .input('version', sql.Int, version)
            .input('progress', sql.Int, progress)
            .input('time_saved', sql.VarChar(50), timestamp)
            .execute('addCalendarStatusForMonth');
        return status.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function updateProgressForIndividualCalendarStatus(monthYear, version,timestamp) {
    try {

        let pool = await sql.connect(config);
        let status = await pool.request()
            .input('month', sql.NVarChar(10), monthYear)
            .input('version', sql.Int, version)
            .input('timestamp', sql.VarChar(50), timestamp)
            .execute('updateProgressForIndividualCalendarStatus');
        return status.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}

async function getLatestCalendarStatusForIndividualMonth(monthYear) {
    try {

        let pool = await sql.connect(config);
        let status = await pool.request()
            .input('month', sql.NVarChar(10), monthYear)
            .execute('getLatestCalendarStatusForIndividualMonth');
        return status.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}
export {
    getAllStatusOfCalendarsByYear,
    addNewCalendarStatus,
    getIndividualCalendarStatus,
    updateProgressForIndividualCalendarStatus,
    getLatestCalendarStatusForIndividualMonth
};