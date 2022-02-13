import config from './dbconfig.js';
import sql from 'mssql';

sql.on('error', err => {
    console.log(err.message);
});

async function getAllContracts() {
    try {

        let pool = await sql.connect(config);
        let contracts = await pool.request()
            .execute('getAllContacttypes');
        return contracts.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}



async function getContracttypeWithName(name) {
    try {

        let pool = await sql.connect(config);
        let contract = await pool.request()
            .input('naam', sql.VarChar(50), name)
            .execute('getContracttypeWithNaam');
        return contract.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};
async function deleteContracttypeWithName(name) {
    try {

        let pool = await sql.connect(config);
        let contracttype = await pool.request()
            .input('naam', sql.VarChar(50), name)
            .execute('removeContracttypeWithNaam');
        return contracttype.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function addContracttype(
    name,
    weeklyContractHours,
    monthlyContractHours,
    maxFollowingShifts,
    maxShiftsAWeek,
    maxHoursAWeek,
    nightShiftsAllowed,
    standbyAllowed,
    maxHoursAMonth,
    maxWeekendsAYear,
    ideaalShiftsAWeek

) {
    try {

        let pool = await sql.connect(config);
        let contracttype = await pool.request()
        .input('naam', sql.VarChar(50), name)
        .input('wekelijkse_contract_uren', sql.Int, weeklyContractHours)
        .input('maandelijke_contract_uren', sql.Int, monthlyContractHours)
        .input('max_opeenvolgende_shifts', sql.Int, maxFollowingShifts)
        .input('max_shifts_per_week', sql.Int, maxShiftsAWeek)
        .input('nachtshiften_toegelaten', sql.Bit, nightShiftsAllowed)
        .input('standby_toegelaten', sql.Bit, standbyAllowed)
        .input('max_uur_per_week', sql.Int, maxHoursAWeek)
        .input('max_uur_per_maand', sql.Int, maxHoursAMonth)
        .input('max_weekends_per_jaar', sql.Int, maxWeekendsAYear)
        .input('ideaal_shifts_per_week', sql.Int, ideaalShiftsAWeek)
            .execute('addContracttype');
        return contracttype.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function updateContracttypes(
    oldname,
    name,
    weeklyContractHours,
    monthlyContractHours,
    maxFollowingShifts,
    maxShiftsAWeek,
    maxHoursAWeek,
    nightShiftsAllowed,
    standbyAllowed,
    maxHoursAMonth,
    maxWeekendsAYear,
    ideaalShiftsAWeek) {
    try {

        let pool = await sql.connect(config);
        let contracttype = await pool.request()
            .input('oudenaam', sql.VarChar(50), oldname)
            .input('naam', sql.VarChar(50), name)
            .input('wekelijkse_contract_uren', sql.Int, weeklyContractHours)
            .input('maandelijke_contract_uren', sql.Int, monthlyContractHours)
            .input('max_opeenvolgende_shifts', sql.Int, maxFollowingShifts)
            .input('max_shifts_per_week', sql.Int, maxShiftsAWeek)
            .input('nachtshiften_toegelaten', sql.Bit, nightShiftsAllowed)
            .input('standby_toegelaten', sql.Bit, standbyAllowed)
            .input('max_uur_per_week', sql.Int, maxHoursAWeek)
            .input('max_uur_per_maand', sql.Int, maxHoursAMonth)
            .input('max_weekends_per_jaar', sql.Int, maxWeekendsAYear)
            .input('ideaal_shifts_per_week', sql.Int, ideaalShiftsAWeek)
            .execute('updateContracttype');
        return contracttype.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};




export { getAllContracts, updateContracttypes, getContracttypeWithName, deleteContracttypeWithName, addContracttype }