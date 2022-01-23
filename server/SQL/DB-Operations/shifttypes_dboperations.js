import config from './dbconfig.js';
import sql from 'mssql';

sql.on('error', err => {
    console.log(err.message);
});


async function getAllShiftTypes() {
    try {

        let pool = await sql.connect(config);
        let shifttypes = await pool.request()
            .execute('getAllShifttypes');
        return shifttypes.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function getShifttypeWithNaam(naam) {
    try {

        let pool = await sql.connect(config);
        let shifttype = await pool.request()
            .input('naam', sql.VarChar(100), naam)
            .execute('getShiftTypeWithNaam');
        return shifttype.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};
async function removeShifttypeWithNaam(naam) {
    try {

        let pool = await sql.connect(config);
        let shifttypes = await pool.request()
            .input('naam', sql.VarChar(100), naam)
            .execute('removeShifttypeWithNaam');
        return shifttypes.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function addShifttype(naam, beginuur, einduur, kleurcode, verplicht, thuiswerk, aanpasbare_uren, categorie, tekstkleurcode, border, standaardtekst, standby, actief) {
    try {

        let pool = await sql.connect(config);
        let shifttypes = await pool.request()
            .input('naam', sql.VarChar(100), naam)
            .input('beginuur', sql.VarChar(25), beginuur)
            .input('einduur', sql.VarChar(25), einduur)
            .input('kleurcode', sql.VarChar(25), kleurcode)
            .input('verplicht', sql.Bit, verplicht)
            .input('thuiswerk', sql.Bit, thuiswerk)
            .input('aanpasbare_uren', sql.Bit, aanpasbare_uren)
            .input('categorie', sql.VarChar(100), categorie)
            .input('tekstkleurcode', sql.VarChar(25), tekstkleurcode)
            .input('border', sql.Bit, border)
            .input('standaardtekst', sql.VarChar(3), standaardtekst)
            .input('standby', sql.Bit, standby)
            .input('actief', sql.Bit, actief)
            .execute('addShiftType');
        return shifttypes.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};

async function updateShifttype(oudenaam, naam, beginuur, einduur, kleurcode, verplicht, thuiswerk, aanpasbare_uren, categorie, tekstkleurcode, border, standaardtekst, standby, actief) {
    try {

        let pool = await sql.connect(config);
        let shifttypes = await pool.request()
            .input('oudenaam', sql.VarChar(100), oudenaam)
            .input('naam', sql.VarChar(100), naam)
            .input('beginuur', sql.VarChar(25), beginuur)
            .input('einduur', sql.VarChar(25), einduur)
            .input('kleurcode', sql.VarChar(25), kleurcode)
            .input('verplicht', sql.Bit, verplicht)
            .input('thuiswerk', sql.Bit, thuiswerk)
            .input('aanpasbare_uren', sql.Bit, aanpasbare_uren)
            .input('categorie', sql.VarChar(100), categorie)
            .input('tekstkleurcode', sql.VarChar(25), tekstkleurcode)
            .input('border', sql.Bit, border)
            .input('standaardtekst', sql.VarChar(3), standaardtekst)
            .input('standby', sql.Bit, standby)
            .input('actief', sql.Bit, actief)
            .execute('updateShiftType');
        return shifttypes.recordsets[0];
    } catch (error) {
        sql.close();
        console.log(error);
    }
};




export { getAllShiftTypes, getShifttypeWithNaam, removeShifttypeWithNaam, addShifttype, updateShifttype };