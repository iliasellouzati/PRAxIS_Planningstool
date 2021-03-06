import config from './dbconfig.js';
import sql from 'mssql';

sql.on('error', err => {
    console.log(err.message);
});



async function getAllWeekStructuren() {
    try {

        let pool = await sql.connect(config);
        let weekstructuren = await pool.request()
            .execute('getAllWeekStructuren');
        return weekstructuren.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function getWeekStructuurWithId(id) {
    try {

        let pool = await sql.connect(config);
        let weekstructuren = await pool.request()
            .input('id', sql.Int, id)
            .execute('getWeekStructuurWithId');
        return weekstructuren.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};
async function removeWeekStructuurWithId(id) {
    try {

        let pool = await sql.connect(config);
        let weekstructuren = await pool.request()
            .input('id', sql.Int, id)
            .execute('removeWeekStructuurWithId');
        return weekstructuren.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function addWeekStructuur(id, ma, di, woe, don, vrij, za, zo, score) {
    try {

        let pool = await sql.connect(config);
        let weekstructuren = await pool.request()
            .input('id', sql.Int, id)
            .input('maandag', sql.VarChar(50), ma)
            .input('dinsdag', sql.VarChar(50), di)
            .input('woensdag', sql.VarChar(50), woe)
            .input('donderdag', sql.VarChar(50), don)
            .input('vrijdag', sql.VarChar(50), vrij)
            .input('zaterdag', sql.VarChar(50), za)
            .input('zondag', sql.VarChar(50), zo)
            .input('score', sql.Int, score)
            .execute('addWeekStructuur');
        return weekstructuren.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function updateWeekStructuur(id, ma, di, woe, don, vrij, za, zo, score) {
    try {

        let pool = await sql.connect(config);
        let weekstructuren = await pool.request()
            .input('id', sql.Int, id)
            .input('maandag', sql.VarChar(50), ma)
            .input('dinsdag', sql.VarChar(50), di)
            .input('woensdag', sql.VarChar(50), woe)
            .input('donderdag', sql.VarChar(50), don)
            .input('vrijdag', sql.VarChar(50), vrij)
            .input('zaterdag', sql.VarChar(50), za)
            .input('zondag', sql.VarChar(50), zo)
            .input('score', sql.Int, score)
            .execute('updateWeekStructuur');
        return weekstructuren.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

export {
    getAllWeekStructuren, getWeekStructuurWithId, removeWeekStructuurWithId, addWeekStructuur, updateWeekStructuur
}