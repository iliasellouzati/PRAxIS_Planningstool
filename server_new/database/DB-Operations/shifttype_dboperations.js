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
        throw new Error(error.message);
    }
};

async function getShifttypeWithName(name) {
    try {

        let pool = await sql.connect(config);
        let shifttype = await pool.request()
            .input('naam', sql.VarChar(100), name)
            .execute('getShiftTypeWithNaam');
        return shifttype.recordsets[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};
async function deleteShifttypeWithName(name) {
    try {

        let pool = await sql.connect(config);
        let shifttype = await pool.request()
            .input('naam', sql.VarChar(100), name)
            .execute('removeShifttypeWithNaam');
        return shifttype.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function addShifttype(name, startmoment, endmoment, colorcode, obligated, homework, changeablehours, category, textcolorcode, border, standardtext, standby, active) {
    try {

        let pool = await sql.connect(config);
        let shifttypes = await pool.request()
            .input('naam', sql.VarChar(100), name)
            .input('beginuur', sql.VarChar(25), startmoment)
            .input('einduur', sql.VarChar(25), endmoment)
            .input('kleurcode', sql.VarChar(25), colorcode)
            .input('verplicht', sql.Bit, obligated)
            .input('thuiswerk', sql.Bit, homework)
            .input('aanpasbare_uren', sql.Bit, changeablehours)
            .input('categorie', sql.VarChar(100), category)
            .input('tekstkleurcode', sql.VarChar(25), textcolorcode)
            .input('border', sql.Bit, border)
            .input('standaardtekst', sql.VarChar(3), standardtext)
            .input('standby', sql.Bit, standby)
            .input('actief', sql.Bit, active)
            .execute('addShiftType');
        return shifttypes.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};

async function updateShifttype(oldname, name, startmoment, endmoment, colorcode, obligated, homework, changeablehours, category, textcolorcode, border, standardtext, standby, active) {
    try {

        let pool = await sql.connect(config);
        let shifttypes = await pool.request()
            .input('oudenaam', sql.VarChar(100), oldname)
            .input('naam', sql.VarChar(100), name)
            .input('beginuur', sql.VarChar(25), startmoment)
            .input('einduur', sql.VarChar(25), endmoment)
            .input('kleurcode', sql.VarChar(25), colorcode)
            .input('verplicht', sql.Bit, obligated)
            .input('thuiswerk', sql.Bit, homework)
            .input('aanpasbare_uren', sql.Bit, changeablehours)
            .input('categorie', sql.VarChar(100), category)
            .input('tekstkleurcode', sql.VarChar(25), textcolorcode)
            .input('border', sql.Bit, border)
            .input('standaardtekst', sql.VarChar(3), standardtext)
            .input('standby', sql.Bit, standby)
            .input('actief', sql.Bit, active)
            .execute('updateShiftType');
        return shifttypes.rowsAffected[0];
    } catch (error) {
        sql.close();
        throw new Error(error.message);
    }
};




export { getAllShiftTypes, getShifttypeWithName, deleteShifttypeWithName, addShifttype, updateShifttype };