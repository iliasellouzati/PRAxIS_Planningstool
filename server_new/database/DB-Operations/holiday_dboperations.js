import config from './dbconfig.js';
import sql from 'mssql';
import moment from 'moment';

sql.on('error', err => {
    console.log(err.message);
});

async function getFeestdagenBetweenDates(date1, date2) {
    try {
        let pool = await sql.connect(config);
        let feestdagen = await pool.request()
            .input('begindatum', sql.Date, moment(date1, "DD-MM-YYYY").format("YYYY-MM-DD").toString())
            .input('einddatum', sql.Date, moment(date2, "DD-MM-YYYY").format("YYYY-MM-DD").toString())
            .execute('getFeestdagenBetweenDates');
        return feestdagen.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}
async function getFeestdagWithId(id) {
    try {
        let pool = await sql.connect(config);
        let feestdagen = await pool.request()
            .input('id', sql.Int, id)
            .execute('getFeestdagWithId');
        return feestdagen.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }

}
async function getAllFeestdagenInYear(year) {
        try {
            let pool = await sql.connect(config);
            let feestdagen = await pool.request()
                .input('jaar', sql.Int, year)
                .execute('getAllFeestdagenInYear');
            return feestdagen.recordsets[0];
        } catch (error) {
            sql.close();
            throw new Error(error.message);
        } 
}

async function removeFeestdagWithId(id) {
    try {
        let pool = await sql.connect(config);
        let feestdagen = await pool.request()
            .input('id', sql.Int, id)
            .execute('removeFeestdagWithId');
        return feestdagen.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}

async function addFeestdag(naam, jaar, datum) {
    try {
        let pool = await sql.connect(config);
        let feestdagen = await pool.request()
            .input('naam', sql.NVarChar(100), naam)
            .input('jaar', sql.Int, jaar)
            .input('datum', sql.Date, moment(datum, "DD-MM-YYYY").format("YYYY-MM-DD").toString())
            .execute('addFeestdag');
        return feestdagen.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}
async function updateFeestdag(id, naam, jaar, datum) {
    try {
        let pool = await sql.connect(config);
        let feestdagen = await pool.request()
            .input('id', sql.Int, id)
            .input('naam', sql.NVarChar(100), naam)
            .input('jaar', sql.Int, jaar)
            .input('datum', sql.Date, moment(datum, "DD-MM-YYYY").format("YYYY-MM-DD").toString())
            .execute('updateFeestdag');
        return feestdagen.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
}

export {
    getFeestdagenBetweenDates,
    getFeestdagWithId,
    getAllFeestdagenInYear,
    removeFeestdagWithId,
    addFeestdag,
    updateFeestdag
}