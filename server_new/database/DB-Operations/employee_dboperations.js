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

async function addEmployee(id, name, email, contracttype) {
    try {

        let pool = await sql.connect(config);
        let employee = await pool.request()
            .input('id', sql.Int, id)
            .input('naam', sql.VarChar(100), name)
            .input('email', sql.VarChar(100), email)
            .input('contracttype', sql.VarChar(50), contracttype)
            .execute('addWerknemer');
        return employee.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function updateEmployee(id, name, email,contracttype) {
    try {

        let pool = await sql.connect(config);
        let employee = await pool.request()
            .input('id', sql.Int, id)
            .input('naam', sql.VarChar(100), name)
            .input('email', sql.VarChar(100), email)
            .input('contracttype', sql.VarChar(50), contracttype)
            .execute('updateWerknemer');
        return employee.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};



export {getAllEmployees,getEmployeeWithId,deleteEmployeeWithId,addEmployee,updateEmployee};