import Express from 'express';
import * as Holiday_DB from '../database/DB-Operations/holiday_dboperations.js';
import moment from 'moment';

const router = Express.Router();

const hostUrl = "http://localhost:3001/api/holiday";

router.get('/:id', async (req, res) => {

    try {

        let holiday = await Holiday_DB.getFeestdagWithId(req.params.id);

        holiday.length ? res.status(200).send(holiday) : res.status(404).send(`holiday with id:${req.params.id} was not found`);


    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }


});

router.get('/custom/start/:date1/end/:date2', async (req, res) => {

    try {

        let holidays = await Holiday_DB.getFeestdagenBetweenDates(req.params.date1, req.params.date2);

        holidays.length ? res.status(200).send(holidays) : res.status(204).send();


    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

router.get('/custom/year/:year', async (req, res) => {

    try {

        let holidays = await Holiday_DB.getAllFeestdagenInYear(req.params.year);

        holidays.length ? res.status(200).send(holidays) : res.status(204).send();

    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

router.delete('/:id', async (req, res) => {

    try {

        let rowsAffected = await Holiday_DB.removeFeestdagWithId(req.params.id);

        rowsAffected ? res.status(204).send() : res.status(404).send('holiday not found or nothing was deleted')

    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

router.post('/', async (req, res) => {

    try {

        const rowsAffected = await Holiday_DB.addFeestdag(req.body.naam, req.body.jaar, req.body.datum);
        rowsAffected ? res.status(204).send() : res.status(400).send("holiday not added");

    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

router.put('/:id', async (req, res) => {

    try {

        const rowsAffected = await Holiday_DB.updateFeestdag(req.params.id, req.body.naam, req.body.jaar, req.body.datum);
        rowsAffected ? res.status(204).send() : res.status(400).send("holiday not updated");




    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

export default router;