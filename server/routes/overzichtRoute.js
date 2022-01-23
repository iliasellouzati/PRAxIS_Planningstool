import Express from "express";
import * as Shift_DB from '../SQL/DB-Operations/shift_dboperations.js';
import * as Employee_DB from '../SQL/DB-Operations/werknemers_dboperations.js';
import * as Custom_Moment_Operations from '../moment_operations/index.js';
import moment from 'moment';

const router = Express.Router();


router.get("/:id", async (req, res)=>{

    const overview = await Shift_DB.getYearlyCalendarOverview(req.params.id);
    if (overview) {
        res.send(overview);
    } else {
        res.status(404).send("Year Not Found.")
    }

})



export default router;