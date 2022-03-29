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



async function getContracttypeWithName(id) {
    try {

        let pool = await sql.connect(config);
        let contract = await pool.request()
            .input('id', sql.VarChar(50), id)
            .execute('getContracttypeWithNaam');
        return contract.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};
async function deleteContracttypeWithName(id) {
    try {

        let pool = await sql.connect(config);
        let contracttype = await pool.request()
            .input('id', sql.Int, id)
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
    nightShiftsAllowed,
    standbyAllowed,
    maxWeekendsAYear) {
    try {

        let pool = await sql.connect(config);
        let contracttype = await pool.request()
            .input('naam', sql.NVarChar(50), name)
            .input('wekelijkse_contract_uren', sql.Int, weeklyContractHours)
            .input('nachtshiften_toegelaten', sql.Bit, nightShiftsAllowed)
            .input('standby_toegelaten', sql.Bit, standbyAllowed)
            .input('max_weekends_per_jaar', sql.Int, maxWeekendsAYear)
            .execute('addContracttype');
        return contracttype.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function updateContracttypes(
    id,
    name,
    weeklyContractHours,
    nightShiftsAllowed,
    standbyAllowed,
    maxWeekendsAYear) {
    try {

        let pool = await sql.connect(config);
        let contracttype = await pool.request()
            .input('id', sql.Int, id)
            .input('naam', sql.NVarChar(50), name)
            .input('wekelijkse_contract_uren', sql.Int, weeklyContractHours)
            .input('nachtshiften_toegelaten', sql.Bit, nightShiftsAllowed)
            .input('standby_toegelaten', sql.Bit, standbyAllowed)
            .input('max_weekends_per_jaar', sql.Int, maxWeekendsAYear)
            .execute('updateContracttype');
        return contracttype.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};




export {
    getAllContracts,
    updateContracttypes,
    getContracttypeWithName,
    deleteContracttypeWithName,
    addContracttype
}