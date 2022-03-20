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


export default router;