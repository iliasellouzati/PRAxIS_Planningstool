import sql from 'mssql';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    var resultaat = await getDBusersAsyncFunction();
    res.send(resultaat);

});

const config = {
    server: 'localhost', //192.168.0.244
    port:50396,
    user: "NodeJS_Server",
    password: "PRAxIS_8501",
    database: "planning",

    options:{
        trustServerCertificate:true,
        enableArithPort: true,
       
    },
    
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },

};

sql.on('error', err => {
    console.log(err.message);
})

async function getDBusersAsyncFunction() {
    try {
    

        let pool = await  sql.connect(config);
     
        var result1 = await pool.request().query('select * from werknemers;');
     
        sql.close();
        return result1;


    } catch (error) {
        console.log(error.message)
        sql.close();
    }
}



export default router;