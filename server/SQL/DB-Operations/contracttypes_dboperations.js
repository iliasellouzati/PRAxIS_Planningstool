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
        console.log(error);
    }
}



async function getContracttypeWithNaam(naam) {
    try {

        let pool = await sql.connect(config);
        let contract = await pool.request()
            .input('naam', sql.VarChar(50), naam)
            .execute('getContracttypeWithNaam');
        return contract.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};
async function removeContracttypeWithNaam(naam) {
    try {

        let pool = await sql.connect(config);
        let contracttype = await pool.request()
            .input('naam', sql.VarChar(50), naam)
            .execute('removeContracttypeWithNaam');
        return contracttype.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function addContracttype(
    naam,
    wekelijkse_contract_uren,
    maandelijke_contract_uren,
    max_opeenvolgende_shifts,
    max_shifts_per_week,
    max_uur_per_week,
    nachtshiften_toegelaten,
    standby_toegelaten,
    max_uur_per_maand,
    max_weekends_per_jaar,
    ideaal_shifts_per_week

) {
    try {

        let pool = await sql.connect(config);
        let contracttypes = await pool.request()
            .input('naam', sql.VarChar(50), naam)
            .input('wekelijkse_contract_uren', sql.Int, wekelijkse_contract_uren)
            .input('maandelijke_contract_uren', sql.Int, maandelijke_contract_uren)
            .input('max_opeenvolgende_shifts', sql.Int, max_opeenvolgende_shifts)
            .input('max_shifts_per_week', sql.Int, max_shifts_per_week)
            .input('nachtshiften_toegelaten', sql.Bit, nachtshiften_toegelaten)
            .input('standby_toegelaten', sql.Bit, standby_toegelaten)
            .input('max_uur_per_week', sql.Int, max_uur_per_week)
            .input('max_uur_per_maand', sql.Int, max_uur_per_maand)
            .input('max_weekends_per_jaar', sql.Int, max_weekends_per_jaar)
            .input('ideaal_shifts_per_week', sql.Int, ideaal_shifts_per_week)
            .execute('addContracttype');
        return contracttypes.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function updateContracttypes(
    oudenaam,
    naam,
    wekelijkse_contract_uren,
    maandelijke_contract_uren,
    max_opeenvolgende_shifts,
    max_shifts_per_week,
    max_uur_per_week,
    nachtshiften_toegelaten,
    standby_toegelaten,
    max_uur_per_maand,
    max_weekends_per_jaar,
    ideaal_shifts_per_week) {
    try {

        let pool = await sql.connect(config);
        let contracttypes = await pool.request()
            .input('oudenaam', sql.VarChar(50), oudenaam)
            .input('naam', sql.VarChar(50), naam)
            .input('wekelijkse_contract_uren', sql.Int, wekelijkse_contract_uren)
            .input('maandelijke_contract_uren', sql.Int, maandelijke_contract_uren)
            .input('max_opeenvolgende_shifts', sql.Int, max_opeenvolgende_shifts)
            .input('max_shifts_per_week', sql.Int, max_shifts_per_week)
            .input('nachtshiften_toegelaten', sql.Bit, nachtshiften_toegelaten)
            .input('standby_toegelaten', sql.Bit, standby_toegelaten)
            .input('max_uur_per_week', sql.Int, max_uur_per_week)
            .input('max_uur_per_maand', sql.Int, max_uur_per_maand)
            .input('max_weekends_per_jaar', sql.Int, max_weekends_per_jaar)
            .input('ideaal_shifts_per_week', sql.Int, ideaal_shifts_per_week)
            .execute('updateContracttype');
        return contracttypes.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};




export { getAllContracts, updateContracttypes, getContracttypeWithNaam, removeContracttypeWithNaam, addContracttype }