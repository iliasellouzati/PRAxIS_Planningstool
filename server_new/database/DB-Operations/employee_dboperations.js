import config from './dbconfig.js';
import sql from 'mssql';

sql.on('error', err => {
    console.log(err.message);
});


async function getAllEmployees() {
    try {

        let pool = await sql.connect(config);
        let employees = await pool.request()
            .execute('getAllWerknemers');
        return employees.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function getEmployeeWithId(id) {
    try {

        let pool = await sql.connect(config);
        let employee = await pool.request()
            .input('id', sql.Int, id)
            .execute('getWerknemerWithId');
        return employee.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};
async function deleteEmployeeWithId(id) {
    try {

        let pool = await sql.connect(config);
        let employees = await pool.request()
            .input('id', sql.Int, id)
            .execute('removeWerknemerWithId');
        return employees.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};




async function addEmployee(voornaam, familienaam, contracttype_id,email, franstalig, opleiding, geboortedatum, geboortedatum_partner) {
    try {

        let pool = await sql.connect(config);
        let employee = await pool.request()
            .input('voornaam', sql.NVarChar(100), voornaam)
            .input('familienaam', sql.NVarChar(100), familienaam)
            .input('contracttype_id', sql.Int, contracttype_id)
            .input('email', sql.NVarChar(100), email)
            .input('franstalig', sql.Bit, franstalig)
            .input('opleiding', sql.Bit, opleiding)
            .input('geboortedatum', sql.NVarChar(10), geboortedatum)
            .input('geboortedatum_partner', sql.NVarChar(10), geboortedatum_partner)
            .execute('addWerknemer');
        return employee.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function updateEmployee(id,voornaam, familienaam, contracttype_id,email, franstalig, opleiding, geboortedatum, geboortedatum_partner) {
    try {

        let pool = await sql.connect(config);
        let employee = await pool.request()
            .input('id',sql.Int,id)
            .input('voornaam', sql.NVarChar(100), voornaam)
            .input('familienaam', sql.NVarChar(100), familienaam)
            .input('contracttype_id', sql.Int, contracttype_id)
            .input('email', sql.NVarChar(100), email)
            .input('franstalig', sql.Bit, franstalig)
            .input('opleiding', sql.Bit, opleiding)
            .input('geboortedatum', sql.NVarChar(10), geboortedatum)
            .input('geboortedatum_partner', sql.NVarChar(10), geboortedatum_partner)
            .execute('updateWerknemer');
        return employee.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};



export {
    getAllEmployees,
    getEmployeeWithId,
    deleteEmployeeWithId,
    addEmployee,
    updateEmployee
    
};