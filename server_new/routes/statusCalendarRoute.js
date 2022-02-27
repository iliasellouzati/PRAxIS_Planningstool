import Express from "express";
import * as Statuscalendars_DB from '../database/DB-Operations/statuscalendar_dboperation.js';
import moment from 'moment';

const router = Express.Router();

const hostUrl = "http://localhost:3001/api/statuscalendar";

router.get("/:year", async (req, res) => {
    try {

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2099)
            return res.status(400).send(`GET on ${hostUrl}/:year with year "${req.params.year}" failed  because year is not valid`);

        const statusCalendars = await Statuscalendars_DB.getAllStatusOfCalendarsByYear(req.params.year);
        statusCalendars.length ? res.status(200).send(statusCalendars) : res.status(204).send();

    } catch (e) {
        res.status(500).send(`GET on ${hostUrl}/:year  with year:"${req.params.year}" failed with error "${e.message}"`);
    }
});

router.post("/:year/:month", async (req, res) => {
    try {

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2099)
            return res.status(400).send(`POST on ${hostUrl}/:year/:month with year "${req.params.year}" and month "${req.params.month} failed  because year is not valid`);

        if (isNaN(req.params.month) || req.params.month < 1 || req.params.month > 12)
            return res.status(400).send(`POST on ${hostUrl}/:year/:month with year "${req.params.year}" and month "${req.params.month} failed  because month is not valid`);

        const rowsAffected = await Statuscalendars_DB.addNewCalendarStatus(`${req.params.month}-${req.params.year}`, 1, 0, req.body.timestamp);
        rowsAffected ? res.status(204).send() : res.status(404).send(`Status Calendar was not added`);

    } catch (e) {

        res.status(500).send(`POST on ${hostUrl}/:year/:month with year "${req.params.year}" and month "${req.params.month} failed with error "${e.message}"`);

    }
});



export default router;