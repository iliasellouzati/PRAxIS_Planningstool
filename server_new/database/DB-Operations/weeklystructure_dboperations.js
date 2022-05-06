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
        throw new Error(error.message);
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
        throw new Error(error.message);
    }
};
async function deleteWeekStructuurWithId(id) {
    try {

        let pool = await sql.connect(config);
        let weekstructuren = await pool.request()
            .input('id', sql.Int, id)
            .execute('removeWeekStructuurWithId');
        return weekstructuren.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function addWeekStructuur(ma, di, woe, don, vrij, za, zo, score,nacht_week,omschakeling_dag_naar_nacht,omschakeling_nacht_naar_dag) {
    try {

        let pool = await sql.connect(config);
        let weekstructuren = await pool.request()
            .input('maandag', sql.VarChar(100), ma)
            .input('dinsdag', sql.VarChar(100), di)
            .input('woensdag', sql.VarChar(100), woe)
            .input('donderdag', sql.VarChar(100), don)
            .input('vrijdag', sql.VarChar(100), vrij)
            .input('zaterdag', sql.VarChar(100), za)
            .input('zondag', sql.VarChar(100), zo)
            .input('score', sql.Int, score)
            .input('nacht_week', sql.Bit, nacht_week)
            .input('omschakeling_dag_naar_nacht', sql.Bit, omschakeling_dag_naar_nacht)
            .input('omschakeling_nacht_naar_dag', sql.Bit, omschakeling_nacht_naar_dag)
            .execute('addWeekStructuur');
        return weekstructuren.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function updateWeekStructuur(id, ma, di, woe, don, vrij, za, zo, score,nacht_week,omschakeling_dag_naar_nacht,omschakeling_nacht_naar_dag) {
    try {

        let pool = await sql.connect(config);
        let weekstructuren = await pool.request()
            .input('id', sql.Int, id)
            .input('maandag', sql.VarChar(100), ma)
            .input('dinsdag', sql.VarChar(100), di)
            .input('woensdag', sql.VarChar(100), woe)
            .input('donderdag', sql.VarChar(100), don)
            .input('vrijdag', sql.VarChar(100), vrij)
            .input('zaterdag', sql.VarChar(100), za)
            .input('zondag', sql.VarChar(100), zo)
            .input('score', sql.Int, score)
            .input('nacht_week', sql.Bit, nacht_week)
            .input('omschakeling_dag_naar_nacht', sql.Bit, omschakeling_dag_naar_nacht)
            .input('omschakeling_nacht_naar_dag', sql.Bit, omschakeling_nacht_naar_dag)
            .execute('updateWeekStructuur');
        return weekstructuren.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

export {
    getAllWeekStructuren, getWeekStructuurWithId, deleteWeekStructuurWithId, addWeekStructuur, updateWeekStructuur
}