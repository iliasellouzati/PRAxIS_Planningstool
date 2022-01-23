import config from '../SQL/DB-Operations/dbconfig.js';
import sql from 'mssql';

//async wait
async function getWerknemers() {
    try {

        let pool = await sql.connect(config);
        let products = await pool.request().query("select * from werknemers");
        sql.close();
        return products.recordsets;
    } catch (error) {
        sql.close();
        console.log(error);
    }
}

async function getWerknemer(id) {
    try {

        let pool = await sql.connect(config);
        let products = await pool.request()
            .input('input_parameter', sql.Int, id)
            .query("select * from werknemers where id = @input_parameter");
        sql.close();
        return products.recordsets;
    } catch (error) {
        sql.close();
        console.log(error);
    }
}

async function getWerknemerWithId(id) {
    try {

        let pool = await sql.connect(config);
        let werknemer = await pool.request()
            .input('id', sql.Int, id)
            .execute('getWerknemerWithId');
        sql.close();
        return werknemer.recordsets;
    } catch (error) {
        sql.close();
        console.log(error);
    }
}

//promise
sql.connect(config).then(pool => {
    return pool.request().input('input_parameter', sql.Int, 10).query("select * from werknemers where id = @input_parameter");
}).then(result => {
    console.log(result.recordset[0]);
    sql.close();

}).catch(err => {
console.log(err);
sql.close();
})

//Callback

sql.config(config, err=>{
    if (err) {
        console.log(err.message);
    } else {
        new sql.Request().input('input_parameter', sql.Int, 10).query("select * from werknemers where id = @input_parameter", (err,result)=>{
            if (err) {
                console.log(err);
            } else {
                console.log(result.recordset[0]);
                sql.close();
            }
        });
    }
})


export { getWerknemers, getWerknemer, getWerknemerWithId };