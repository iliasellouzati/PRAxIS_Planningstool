import Express from "express";
import * as Calendar_DB from '../database/DB-Operations/calendar_dboperation.js';
import moment from 'moment';
import '../helpers/moment_prototype.js';


const router = Express.Router();
const hostUrl = "http://localhost:3001/api/calendar";

router.get("/individual/:employeeId/year/:year", async (req, res) => {

    try {

        if (isNaN(req.params.employeeId))
            return res.status(400).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year} failed because "employeeId" is not valid`);

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2100)
            return res.status(400).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year} failed because "year" is not valid`);

        const beginDate = moment(`${req.params.year}`, "YYYY").clone().startOf("year");
        const endDate = moment(`${req.params.year}`, "YYYY").clone().endOf("year");

        const shiften = await Calendar_DB.getCalendarShiftsFromEmployee(beginDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"), req.params.employeeId);
        shiften.length ? res.status(200).send(shiften) : res.status(204).send(`No Shifts found for employee with id:${req.params.employeeId} in year ${req.params.year}`);

    } catch (e) {
        res.status(500).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year} failed with error "${e.message}"`);
    }

})
router.get("/individual/:employeeId/year/:year/month/:month", async (req, res) => {

    try {

        if (isNaN(req.params.employeeId))
            return res.status(400).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year}/month/${req.params.month} failed because "employeeId" is not valid`);

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2100)
            return res.status(400).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year}/month/${req.params.month} failed because "year" is not valid`);

        if (isNaN(req.params.month) || req.params.month < 1 || req.params.month > 12)
            return res.status(400).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year}/month/${req.params.month} failed because "month" is not valid`);

        const beginDate = moment(`${req.params.year}-${req.params.month}`, "YYYY-MM").clone().startOf("month");
        const endDate = moment(`${req.params.year}-${req.params.month}`, "YYYY-MM").clone().endOf("month")


        const shiften = await Calendar_DB.getCalendarShiftsFromEmployee(beginDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"), req.params.employeeId);
        shiften.length ? res.status(200).send(shiften) : res.status(204).send(`No Shifts found for employee with id:${req.params.employeeId} for month:${req.params.month} in year ${req.params.year}`);

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year}/month/${req.params.month} failed with error "${e.message}"`);

    }

})
router.get("/individual/:employeeId/year/:year/calendarmonth/:month", async (req, res) => {

    try {

        if (isNaN(req.params.employeeId))
            return res.status(400).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year}/calendarmonth/${req.params.month} failed because "employeeId" is not valid`);

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2100)
            return res.status(400).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year}/calendarmonth/${req.params.month} failed because "year" is not valid`);

        if (isNaN(req.params.month) || req.params.month < 1 || req.params.month > 12)
            return res.status(400).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year}/calendarmonth/${req.params.month} failed because "month" is not valid`);

        const beginDate = moment(`${req.params.year}-${req.params.month}`, "YYYY-MM").clone().startOf("month").startOf("isoWeek");
        const endDate = moment(`${req.params.year}-${req.params.month}`, "YYYY-MM").clone().endOf("month").endOf("isoWeek");


        const shiften = await Calendar_DB.getCalendarShiftsFromEmployee(beginDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"), req.params.employeeId);
        shiften.length ? res.status(200).send(shiften) : res.status(204).send(`No Shifts found for employee with id:${req.params.employeeId} for calendarmonth:${req.params.month} in year ${req.params.year}`);

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl}/individual/${req.params.employeeId}/year/${req.params.year}/calendarmonth/${req.params.month} failed with error "${e.message}"`);

    }

})

router.get("/global/year/:year", async (req, res) => {

    try {

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2100)
            return res.status(400).send(`GET on ${hostUrl}/global/year/${req.params.year} failed because "year" is not valid`);

        const beginDate = moment(`${req.params.year}`, "YYYY").clone().startOf("year");
        const endDate = moment(`${req.params.year}`, "YYYY").clone().endOf("year");

        const shiften = await Calendar_DB.getCalendarShifts(beginDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
        shiften.length ? res.status(200).send(shiften) : res.status(204).send(`No Shifts found in year ${req.params.year}`);

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl}/global/year/${req.params.year} failed with error "${e.message}"`);

    }

})
router.get("/global/year/:year/month/:month", async (req, res) => {

    try {

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2100)
            return res.status(400).send(`GET on ${hostUrl}/global/year/${req.params.year}/month/${req.params.month} failed because "year" is not valid`);

        if (isNaN(req.params.month) || req.params.month < 1 || req.params.month > 12)
            return res.status(400).send(`GET on ${hostUrl}/global/year/${req.params.year}/month/${req.params.month} failed because "month" is not valid`);


        const beginDate = moment(`${req.params.year}-${req.params.month}`, "YYYY-MM").clone().startOf("month");
        const endDate = moment(`${req.params.year}-${req.params.month}`, "YYYY-MM").clone().endOf("month");

        const shiften = await Calendar_DB.getCalendarShifts(beginDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
        shiften.length ? res.status(200).send(shiften) : res.status(204).send(`No Shifts found in year ${req.params.year}`);

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl}/global/year/${req.params.year}/month/${req.params.month} failed with error "${e.message}"`);

    }

})
router.get("/global/year/:year/calendarmonth/:month", async (req, res) => {

    try {

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2100)
            return res.status(400).send(`GET on ${hostUrl}/global/year/${req.params.year}/calendarmonth/${req.params.month} failed because "year" is not valid`);

        if (isNaN(req.params.month) || req.params.month < 1 || req.params.month > 12)
            return res.status(400).send(`GET on ${hostUrl}/global/year/${req.params.year}/calendarmonth/${req.params.month} failed because "month" is not valid`);


        const beginDate = moment(`${req.params.year}-${req.params.month}`, "YYYY-MM").clone().startOf("month").startOf("isoWeek");
        const endDate = moment(`${req.params.year}-${req.params.month}`, "YYYY-MM").clone().endOf("month").endOf("isoWeek");

        const shiften = await Calendar_DB.getCalendarShifts(beginDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
        shiften.length ? res.status(200).send(shiften) : res.status(204).send(`No Shifts found in year ${req.params.year}`);

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl}/global/year/${req.params.year}/calendarmonth/${req.params.month} failed with error "${e.message}"`);

    }

})
router.get("/global/custom/:begin/:end", async (req, res) => {

    try {

        const beginDate = moment(req.params.begin, "DD-MM-YYYY");
        const endDate = moment(req.params.end, "DD-MM-YYYY");

        const shiften = await Calendar_DB.getCalendarShifts(beginDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
        shiften.length ? res.status(200).send(shiften) : res.status(204).send(`No Shifts found in year ${req.params.year}`);

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl}/global/year/${req.params.year}/month/${req.params.month} failed with error "${e.message}"`);

    }

})
router.post("/global/year/:year/calendarmonth/:month", async (req, res) => {

    try {

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2100)
            return res.status(400).send(`POST on ${hostUrl}/global/year/${req.params.year}/calendarmonth/${req.params.month} failed because "year" is not valid`);

        if (isNaN(req.params.month) || req.params.month < 1 || req.params.month > 12)
            return res.status(400).send(`POST on ${hostUrl}/global/year/${req.params.year}/calendarmonth/${req.params.month} failed because "month" is not valid`);

        if (typeof req.body === 'undefined' || req.body.length === 0)
            return res.status(400).send(`POST on ${hostUrl}/global/year/${req.params.year}/calendarmonth/${req.params.month} failed because "body" is undefined`);


        const beginDate = moment(`${req.params.year}-${req.params.month}`, "YYYY-MM").clone().startOf("month").startOf("isoWeek");
        const endDate = moment(`${req.params.year}-${req.params.month}`, "YYYY-MM").clone().endOf("month").endOf("isoWeek");

        const storedShiften = await Calendar_DB.getCalendarShifts(beginDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));

        let postedShiften = req.body;

        let newShifts = [];
        let sameShifts = [];
        let updatedShifts = [];
        let deletedShifts = [];

        postedShiften.forEach(shiftDay => {

            let result = storedShiften.find(o =>
                o.werknemers_id == shiftDay.employeeId &&
                moment(o.datum, "YYYY-MM-DD").format("DD-MM-YYYY").toString() == shiftDay.day
            );

            if (!result) {
                newShifts.push({
                    'datum': shiftDay.day,
                    'shifttypes_naam': shiftDay.shift,
                    'werknemers_id': shiftDay.employeeId,
                    'beginuur': shiftDay.startmoment,
                    'einduur': shiftDay.endmoment
                });
            } else if (
                result.shifttypes_naam == shiftDay.shift &&
                result.beginuur == shiftDay.startmoment &&
                result.einduur == shiftDay.endmoment
            ) {
                sameShifts.push({
                    'datum': shiftDay.day,
                    'shifttypes_naam': shiftDay.shift,
                    'werknemers_id': shiftDay.employeeId,
                    'beginuur': shiftDay.startmoment,
                    'einduur': shiftDay.endmoment
                });
            } else {
                updatedShifts.push({
                    'datum': shiftDay.day,
                    'shifttypes_naam': shiftDay.shift,
                    'werknemers_id': shiftDay.employeeId,
                    'beginuur': shiftDay.startmoment,
                    'einduur': shiftDay.endmoment
                });
            }
        });


        storedShiften.forEach(storedShift => {
            if (!(
                    newShifts.some(e => moment(e.datum, "DD-MM-YYYY").format("YYYY-MM-DD").toString() == storedShift.datum && e.werknemers_id === storedShift.werknemers_id) ||
                    sameShifts.some(e => moment(e.datum, "DD-MM-YYYY").format("YYYY-MM-DD").toString() == storedShift.datum && e.werknemers_id === storedShift.werknemers_id) ||
                    updatedShifts.some(e => moment(e.datum, "DD-MM-YYYY").format("YYYY-MM-DD").toString() == storedShift.datum && e.werknemers_id === storedShift.werknemers_id)
                )) {
                deletedShifts.push({
                    ...storedShift,
                    'datum': moment(storedShift.datum, "YYYY-MM-DD").format("DD-MM-YYYY").toString()
                });
            }
        })

        if (newShifts.length !== 0) {
            await Calendar_DB.saveNewShifts(newShifts);
        }
        if (updatedShifts.length !== 0) {
            await Calendar_DB.saveUpdatedShifts(updatedShifts);
        }
        if (deletedShifts.length !== 0) {
            await Calendar_DB.saveDeletedShifts(deletedShifts)
        }

        res.send([`SAME: ${sameShifts.length}`, `NEW: ${newShifts.length}`, `UPDATED: ${updatedShifts.length}`, `DELETED: ${deletedShifts.length}`]);

    } catch (e) {
        res.status(500).send(`POST on ${hostUrl}/global/year/${req.params.year}/calendarmonth/${req.params.month} failed with error "${e.message}"`);

    }

})
router.post("/global/year/:year/calendarmonth/:month/version/:version", async (req, res) => {
    try {

        let result = await Calendar_DB.saveShiftsToSavedCalendar(req.body.calendarForDb);
        res.send(result);
        
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
})
router.get("/global/year/:year/calendarmonth/:month/version/:version", async (req, res) => {
    try {

        let result = await Calendar_DB.getSavedCalendarShifts(`${req.params.month}-${req.params.year}_V${req.params.version}`);
        res.status(200).send(result);
        
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
})
export default router;