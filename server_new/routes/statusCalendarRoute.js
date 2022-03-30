import Express from "express";
import * as Statuscalendars_DB from '../database/DB-Operations/statuscalendar_dboperation.js';

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
router.get("/:year/:month", async (req, res) => {
    try {

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2099)
            return res.status(400).send(`GET on ${hostUrl}/:year/:month with year "${req.params.year}" failed  because year is not valid`);
        if (isNaN(req.params.month) || req.params.month < 1 || req.params.month > 12)
            return res.status(400).send(`GET on ${hostUrl}/:year/:month with month "${req.params.year}" failed  because month is not valid`);

        const status = await Statuscalendars_DB.getLatestCalendarStatusForIndividualMonth(`${req.params.month}-${req.params.year}`);
        status.length ? res.status(200).send(status) : res.status(400).send(`Calender Status does not exist yet for ${req.params.month}-${req.params.year}`);

    } catch (e) {
        res.status(500).send(`GET on ${hostUrl}/:year/:month  year "${req.params.year}" and month "${req.params.month} failed with error "${e.message}"`);
    }
});
router.get("/:year/:month/:version", async (req, res) => {
    try {

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2099)
            return res.status(400).send(`GET on ${hostUrl}/:year/:month/:version with year "${req.params.year}" failed  because year is not valid`);
        if (isNaN(req.params.month) || req.params.month < 1 || req.params.month > 12)
            return res.status(400).send(`GET on ${hostUrl}/:year with year/:month/:version  with month "${req.params.year}" failed  because because is not valid`);
        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2099)
            return res.status(400).send(`GET on ${hostUrl}/:year/:month/:version with version "${req.params.version}" failed because version is not valid`);


        const status = await Statuscalendars_DB.getIndividualCalendarStatus(`${req.params.month}-${req.params.year}`, req.params.version);
        status.length ? res.status(200).send(status) : res.status(400).send(`Version ${req.params.version} does not exist yet for ${req.params.month}-${req.params.year}`);

    } catch (e) {
        res.status(500).send(`GET on ${hostUrl}/:year/:month/:version  year "${req.params.year}" and month "${req.params.month} and version "${req.params.version} failed with error "${e.message}"`);
    }
});


router.post("/:year/:month", async (req, res) => {
    try {

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2099)
            return res.status(400).send(`POST on ${hostUrl}/:year/:month with year "${req.params.year}" and month "${req.params.month} failed  because year is not valid`);

        if (isNaN(req.params.month) || req.params.month < 1 || req.params.month > 12)
            return res.status(400).send(`POST on ${hostUrl}/:year/:month with year "${req.params.year}" and month "${req.params.month} failed  because month is not valid`);
        if (isNaN(req.body.version))
            return res.status(400).send(`POST on ${hostUrl}/:year/:month with year failed  because version (in the body) is not valid`);
        if (isNaN(req.body.progress) || req.params.progress < 0 || req.params.progress > 2)
            return res.status(400).send(`POST on ${hostUrl}/:year/:month with year failed  because progress (in the body) is not valid`);

        const rowsAffected = await Statuscalendars_DB.addNewCalendarStatus(`${req.params.month}-${req.params.year}`, req.body.version, req.body.progress, req.body.timestamp);
        rowsAffected ? res.status(204).send() : res.status(404).send(`Status Calendar was not added`);

    } catch (e) {

        res.status(500).send(`POST on ${hostUrl}/:year/:month with year "${req.params.year}" and month "${req.params.month} failed with error "${e.message}"`);

    }
});

router.post("/:year/:month/:version", async (req, res) => {
    try {

        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2099)
            return res.status(400).send(`POST on ${hostUrl}/:year/:month/:version with year "${req.params.year}" failed  because year is not valid`);
        if (isNaN(req.params.month) || req.params.month < 1 || req.params.month > 12)
            return res.status(400).send(`POST on ${hostUrl}/:year with year/:month/:version  with month "${req.params.year}" failed  because because is not valid`);
        if (isNaN(req.params.year) || req.params.year < 2015 || req.params.year > 2099)
            return res.status(400).send(`POST on ${hostUrl}/:year/:month/:version with version "${req.params.version}" failed because version is not valid`);

        const rowsAffected = await Statuscalendars_DB.updateProgressForIndividualCalendarStatus(`${req.params.month}-${req.params.year}`, req.params.version, req.body.timestamp);
        rowsAffected ? res.status(204).send() : res.status(404).send(`Version ${req.params.version} was not updated for ${req.params.month}-${req.params.year}`);

    } catch (e) {

        res.status(500).send(`POST on ${hostUrl}/:year/:month/:version  year "${req.params.year}" and month "${req.params.month} and version "${req.params.version} failed with error "${e.message}"`);

    }
});



export default router;