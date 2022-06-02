import config from './dbconfig.js';
import sql from 'mssql';

sql.on('error', err => {
    console.log(err.message);
});



async function getAllContractsForEmployee(employeeId) {
    try {

        let pool = await sql.connect(config);
        let status = await pool.request()
            .input('werknemer_id', sql.Int, employeeId)
            .execute('getWerknemerContractsFromEmployee');
        return status.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}


async function updateIndividualContractForEmployee(id, begin, end) {
    try {

        let pool = await sql.connect(config);
        let status = await pool.request()
            .input('id', sql.Int, id)
            .input('begindatum', sql.NVarChar(10), begin)
            .input('einddatum', sql.NVarChar(10), end)
            .execute('updateIndividualContractForEmployee');
        return status.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function addIndividualContractForEmployee(id, begin, end){
    try {

        let pool = await sql.connect(config);
        let status = await pool.request()
            .input('werknemer_id', sql.Int, id)
            .input('begindatum', sql.NVarChar(10), begin)
            .input('einddatum', sql.NVarChar(10), end)
            .execute('addIndividualContractForEmployee');
        return status.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}

async function getAllContractsForAllEmployees(){
    try {

        let pool = await sql.connect(config);
        let employee = await pool.request()
            .execute('getAllContractsForAllEmployee');
        return employee.recordset;
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}


export {
    getAllContractsForEmployee,
    updateIndividualContractForEmployee,
    addIndividualContractForEmployee,
    getAllContractsForAllEmployees
}