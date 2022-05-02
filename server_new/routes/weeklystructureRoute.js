import Express from 'express';
import * as WeeklyStructure_DB from '../database/DB-Operations/weeklystructure_dboperations.js';

const router = Express.Router();

const hostUrl = "http://localhost:3001/api/weekstructure";



router.get("/:id", async (req, res) => {

    try {

        if (isNaN(req.params.id))
            return res.status(400).send(`GET on ${hostUrl}/:id with id "${req.params.id}" failed with because id is not a number`);

        const weeklyStructure = await WeeklyStructure_DB.getWeekStructuurWithId(req.params.id);

        weeklyStructure.length ? res.status(200).send(weeklyStructure) : res.status(404).send(`Weekly Structure with id:${req.params.id} was not found`);

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl}/:id with id "${req.params.id}" failed with error "${e.message}"`);

    }



});

router.put("/:id", async (req, res) => {

    try {

        if (isNaN(req.body.id))
            return res.status(400).send(`PUT on ${hostUrl}/:id with id "${req.params.id}" failed  because id is not a number`);

        if (parseInt(req.params.id) !== parseInt(req.body.id))
            return res.status(400).send(`PUT on ${hostUrl}/:id with id "${req.params.id}" failed with because id is not equal to employee Id:${req.body.id}`);

        if (typeof req.body.maandag !== 'string')
            return res.status(400).send(`PUT on ${hostUrl}/:id failed because maandag is not a string`);

        if (typeof req.body.dinsdag !== 'string')
            return res.status(400).send(`PUT on ${hostUrl}/:id failed because dinsdag is not a string`);

        if (typeof req.body.woensdag !== 'string')
            return res.status(400).send(`PUT on ${hostUrl}/:id failed because woensdag is not a string`);

        if (typeof req.body.donderdag !== 'string')
            return res.status(400).send(`PUT on ${hostUrl}/:id failed because donderdag is not a string`);

        if (typeof req.body.vrijdag !== 'string')
            return res.status(400).send(`PUT on ${hostUrl}/:id failed because vrijdag is not a string`);

        if (typeof req.body.zaterdag !== 'string')
            return res.status(400).send(`PUT on ${hostUrl}/:id failed because zaterdag is not a string`);

        if (typeof req.body.zondag !== 'string')
            return res.status(400).send(`PUT on ${hostUrl}/:id failed because zondag is not a string`);

        if (isNaN(req.body.score))
            return res.status(400).send(`PUT on ${hostUrl}/:id with id "${req.params.score}" failed  because score is not a number`);


        const rowsAffected = await WeeklyStructure_DB.updateWeekStructuur(req.body.id, req.body.maandag, req.body.dinsdag, req.body.woensdag, req.body.donderdag, req.body.vrijdag, req.body.zaterdag, req.body.zondag, req.body.score, req.body.nacht_week, req.body.omschakeling_dag_naar_nacht, req.body.omschakeling_nacht_naar_dag);
        rowsAffected ? res.status(204).send() : res.status(404).send(`WeeklyStructure was not added`);


    } catch (e) {

        res.status(500).send(`POST on ${hostUrl} failed with error "${e.message}"`);

    }
})

router.delete("/:id", async (req, res) => {

    try {

        if (isNaN(req.params.id))
            return res.status(400).send(`DELETE on ${hostUrl}/:id with id "${req.params.id}" failed with because id is not a number`);

        const rowsAffected = await WeeklyStructure_DB.deleteWeekStructuurWithId(req.params.id);
        rowsAffected ? res.status(204).send() : res.status(404).send(`WeeklyStructure with id:${req.params.id} was not found`);

    } catch (e) {

        res.status(500).send(`DELETE on ${hostUrl}/:id with id "${req.params.id}" failed with error "${e.message}"`);

    }


});

router.post("/", async (req, res) => {

    try {

        if (typeof req.body.maandag !== 'string')
            return res.status(400).send(`POST on ${hostUrl} failed because maandag is not a string`);

        if (typeof req.body.dinsdag !== 'string')
            return res.status(400).send(`POST on ${hostUrl} failed because dinsdag is not a string`);

        if (typeof req.body.woensdag !== 'string')
            return res.status(400).send(`POST on ${hostUrl} failed because woensdag is not a string`);

        if (typeof req.body.donderdag !== 'string')
            return res.status(400).send(`POST on ${hostUrl} failed because donderdag is not a string`);

        if (typeof req.body.vrijdag !== 'string')
            return res.status(400).send(`POST on ${hostUrl} failed because vrijdag is not a string`);

        if (typeof req.body.zaterdag !== 'string')
            return res.status(400).send(`POST on ${hostUrl} failed because zaterdag is not a string`);

        if (typeof req.body.zondag !== 'string')
            return res.status(400).send(`POST on ${hostUrl} failed because zondag is not a string`);

        if (isNaN(req.body.score))
            return res.status(400).send(`POST on ${hostUrl} with id "${req.params.score}" failed  because score is not a number`);

        const rowsAffected = await WeeklyStructure_DB.addWeekStructuur(req.body.maandag, req.body.dinsdag, req.body.woensdag, req.body.donderdag, req.body.vrijdag, req.body.zaterdag, req.body.zondag, req.body.score, req.body.nacht_week, req.body.omschakeling_dag_naar_nacht, req.body.omschakeling_nacht_naar_dag);
        rowsAffected ? res.status(204).send() : res.status(404).send(`WeeklyStructure was not added`);


    } catch (e) {

        res.status(500).send(`POST on ${hostUrl} failed with error "${e.message}"`);

    }
})


router.get('/', async (req, res) => {

    try {

        const weekstructuren = await WeeklyStructure_DB.getAllWeekStructuren();

        weekstructuren.length ? res.status(200).send(weekstructuren) : res.status(204).send("No WeekStructures Found");

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);

    }




})



export default router;