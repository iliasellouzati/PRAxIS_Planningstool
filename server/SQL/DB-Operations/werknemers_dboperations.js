import config from './dbconfig.js';
import sql from 'mssql';

sql.on('error', err => {
    console.log(err.message);
});


async function getAllWerknemers() {
    try {

        let pool = await sql.connect(config);
        let werknemer = await pool.request()
            .execute('getAllWerknemers');
        return werknemer.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function getWerknemerWithId(id) {
    try {

        let pool = await sql.connect(config);
        let werknemer = await pool.request()
            .input('id', sql.Int, id)
            .execute('getWerknemerWithId');
        return werknemer.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};
async function removeWerknemerWithId(id) {
    try {

        let pool = await sql.connect(config);
        let werknemer = await pool.request()
            .input('id', sql.Int, id)
            .execute('removeWerknemerWithId');
        return werknemer.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function addWerknemer(id, naam, email, contracttype) {
    try {

        let pool = await sql.connect(config);
        let werknemer = await pool.request()
            .input('id', sql.Int, id)
            .input('naam', sql.VarChar(100), naam)
            .input('email', sql.VarChar(100), email)
            .input('contracttype', sql.VarChar(50), contracttype)
            .execute('addWerknemer');
        return werknemer.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function updateWerknemer(id, naam, email,contracttype) {
    try {

        let pool = await sql.connect(config);
        let werknemer = await pool.request()
            .input('id', sql.Int, id)
            .input('naam', sql.VarChar(100), naam)
            .input('email', sql.VarChar(100), email)
            .input('contracttype', sql.VarChar(50), contracttype)
            .execute('updateWerknemer');
        return werknemer.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};



export {getAllWerknemers,getWerknemerWithId,removeWerknemerWithId,addWerknemer,updateWerknemer};