import Express from "express";
import * as Contracttype_DB from '../database/DB-Operations/contracttype_dboperations.js';

const router = Express.Router();

const hostUrl = "http://localhost:3001/api/contracttype";



router.get("/:id", async (req, res) => {

    try {


        const contracttype = await Contracttype_DB.getContracttypeWithName(req.params.id);
        contracttype.length ? res.status(200).send(contracttype) : res.status(404).send(`Contracttype with id:${req.params.id} was not found`);

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl}/:id  with name:"${req.params.id}" failed with error "${e.message}"`);

    }



});

router.put("/:id", async (req, res) => {

    try {
        // if (req.body.name !== req.params.name)
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with name:"${req.params.name}" failed because this name is not equal to bodyname:"${req.body.name}"`);

        // if (req.body.name.trim() === "")
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with name:"${req.body.name}" failed because "body name" is empty`);

        // if (isNaN( req.body.weeklyContractHours ))
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with weeklyContractHours:"${req.body.weeklyContractHours}" failed  because "weeklyContractHours" is not a number`);

        // if (isNaN(req.body.monthlyContractHours ))
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with monthlyContractHours:"${req.body.monthlyContractHours}" failed  because "monthlyContractHours" is not a number`);

        // if (isNaN( req.body.maxFollowingShifts ))
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with maxFollowingShifts:"${req.body.maxFollowingShifts}" failed  because "maxFollowingShifts" is not a number`);

        // if (isNaN( req.body.maxShiftsAWeek ))
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with maxShiftsAWeek:"${req.body.maxShiftsAWeek}" failed  because "maxShiftsAWeek" is not a number`);

        // if (isNaN( req.body.maxHoursAWeek ))
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with maxHoursAWeek:"${req.body.maxHoursAWeek}" failed  because "maxHoursAWeek" is not a number`);

        // if (typeof req.body.nightShiftsAllowed !== 'boolean')
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with nightShiftsAllowed:"${req.body.nightShiftsAllowed}" failed  because "nightShiftsAllowed" is not valid`);

        // if (typeof req.body.standbyAllowed !== 'boolean')
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with standbyAllowed:"${req.body.standbyAllowed}" failed  because "standbyAllowed" is not valid`);

        // if (isNaN(req.body.maxHoursAMonth ))
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with maxHoursAMonth:"${req.body.maxHoursAMonth}" failed  because "maxHoursAMonth" is not a number`);

        // if (isNaN(req.body.maxWeekendsAYear ))
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with maxWeekendsAYear:"${req.body.maxWeekendsAYear}" failed  because "maxWeekendsAYear" is not a number`);

        // if (isNaN( req.body.ideaalShiftsAWeek ))
        //     return res.status(400).send(`PUT on ${hostUrl}/:name  with ideaalShiftsAWeek:"${req.body.ideaalShiftsAWeek}" failed  because "ideaalShiftsAWeek" is not a number`);



        const rowsAffected = await Contracttype_DB.updateContracttypes(
            req.params.id,
            req.body.name,
            req.body.weeklyContractHours,
            req.body.nightShiftsAllowed,
            req.body.standbyAllowed,
            req.body.maxWeekendsAYear
        );
        rowsAffected ? res.status(204).send() : res.status(404).send(`Contracttype was not updated`);


    } catch (e) {
        res.status(500).send(`Put on ${hostUrl}/${req.params.name} failed with error "${e.message}"`);
    }
});


router.delete("/:id", async (req, res) => {
    try {
        // if (req.params.name.trim() === '')
        //     return res.status(404).send(`DELETE on ${hostUrl}/:name with name "${req.params.name}" failed with because name is empty`);

        const rowsAffected = await Contracttype_DB.deleteContracttypeWithName(req.params.id);
        rowsAffected ? res.status(204).send() : res.status(404).send(`Contracttype with id:${req.params.id} was not found`);

    } catch (e) {
        res.status(500).send(`DELETE on ${hostUrl}/:id with id:"${req.params.id}" failed with error "${e.message}"`);
    }
})


router.post("/", async (req, res) => {

    try {

    //     if (req.body.name.trim() === "")
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with name:"${req.body.name}" failed because "body name" is empty`);

    // if (isNaN(req.body.weeklyContractHours))
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with weeklyContractHours:"${req.body.weeklyContractHours}" failed  because "weeklyContractHours" is not a number`);

    // if (isNaN( req.body.monthlyContractHours ))
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with monthlyContractHours:"${req.body.monthlyContractHours}" failed  because "monthlyContractHours" is not a number`);

    // if (isNaN( req.body.maxFollowingShifts) )
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with maxFollowingShifts:"${req.body.maxFollowingShifts}" failed  because "maxFollowingShifts" is not a number`);

    // if (isNaN( req.body.maxShiftsAWeek))
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with maxShiftsAWeek:"${req.body.maxShiftsAWeek}" failed  because "maxShiftsAWeek" is not a number`);

    // if (isNaN(req.body.maxHoursAWeek) )
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with maxHoursAWeek:"${req.body.maxHoursAWeek}" failed  because "maxHoursAWeek" is not a number`);

    // if (typeof req.body.nightShiftsAllowed !== 'boolean')
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with nightShiftsAllowed:"${req.body.nightShiftsAllowed}" failed  because "nightShiftsAllowed" is not valid`);

    // if (typeof req.body.standbyAllowed !== 'boolean')
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with standbyAllowed:"${req.body.standbyAllowed}" failed  because "standbyAllowed" is not valid`);

    // if (isNaN( req.body.maxHoursAMonth))
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with maxHoursAMonth:"${req.body.maxHoursAMonth}" failed  because "maxHoursAMonth" is not a number`);

    
    // if (isNaN( req.body.maxWeekendsAYear) )
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with maxWeekendsAYear:"${req.body.maxWeekendsAYear}" failed  because "maxWeekendsAYear" is not a number`);

    // if (isNaN( req.body.ideaalShiftsAWeek ))
    //     return res.status(400).send(`PUT on ${hostUrl}/:name  with ideaalShiftsAWeek:"${req.body.ideaalShiftsAWeek}" failed  because "ideaalShiftsAWeek" is not a number`);




        const rowsAffected = await Contracttype_DB.addContracttype(
            req.body.name,
            req.body.weeklyContractHours,
            req.body.nightShiftsAllowed,
            req.body.standbyAllowed,
            req.body.maxWeekendsAYear
        );
        rowsAffected ? res.status(204).send() : res.status(404).send(`Contracttype was not added`);


    } catch (e) {
        res.status(500).send(`Post on ${hostUrl} failed with error "${e.message}"`);
    }
})


router.get("/", async (req, res) => {

    try {

        const contracttypes = await Contracttype_DB.getAllContracts();
        contracttypes.length ? res.status(200).send(contracttypes) : res.status(204).send("No Contracttypes Found");

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);

    }
})



export default router;