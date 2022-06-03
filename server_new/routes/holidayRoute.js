import Express from 'express';
import * as Holiday_DB from '../database/DB-Operations/holiday_dboperations.js';
import moment from 'moment';

const router = Express.Router();

const hostUrl = "http://localhost:3001/api/holiday";

router.get('/:id', async (req, res) => {

    try {



        res.status(200).send('ok');
    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

router.get('/custom/start/:date1/end/:date2', async (req, res) => {

    try {

        

        res.status(200).send('ok');
    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

router.get('/custom/year/:year', async (req, res) => {

    try {

        

        res.status(200).send('ok');
    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

router.delete('/:id', async (req, res) => {

    try {

        

        res.status(200).send('ok');
    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

router.post('/', async (req, res) => {

    try {

        

        res.status(200).send('ok');
    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

router.put('/:id', async (req, res) => {

    try {
        res.status(200).send('ok');
    } catch (e) {
        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);
    }

});

export default router;