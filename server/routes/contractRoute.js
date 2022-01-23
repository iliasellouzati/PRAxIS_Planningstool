import Express from "express";

import * as Contracttypes_DB from '../SQL/DB-Operations/contracttypes_dboperations.js';

const router = Express.Router();

router.get("/:naam", async (req, res) => {
    console.log("get received on "+ req.params.naam );

    const contracttype = await Contracttypes_DB.getContracttypeWithNaam(req.params.naam);
    if (contracttype) {
        res.send(contracttype);

    } else {
        res.status(404).send("contracttype Not Found.")
    }
});

router.put("/:naam", async (req, res) => {
    console.log("update received on "+ req.params.naam );
    const contracttypes = await Contracttypes_DB.updateContracttypes(
        req.params.naam,
        req.body.naam,
        req.body.wekelijkse_contract_uren,
        req.body.maandelijke_contract_uren,
        req.body.max_opeenvolgende_shifts,
        req.body.max_shifts_per_week,
        req.body.max_uur_per_week,
        req.body.nachtshiften_toegelaten,
        req.body.standby_toegelaten,
        req.body.max_uur_per_maand,
        req.body.max_weekends_per_jaar,
        req.body.ideaal_shifts_per_week,
        );
    if (contracttypes) {
        res.send(contracttypes);
    } else {
        res.status(404).send("contracttypes Not Found.")
    }
})


router.delete("/:naam", async (req, res) => {
    console.log("delete received on "+ req.params.naam );

    const contracttypes = await Contracttypes_DB.removeContracttypeWithNaam(req.params.naam);
    if (contracttypes) {
        res.send(contracttypes);
    } else {
        res.status(404).send("contracttype Not Found.")
    }
})


router.post("/", async (req, res) => {
    console.log("post received on "+req.body.naam);

    const contracttypes = await Contracttypes_DB.addContracttype(
        req.body.naam,
        req.body.wekelijkse_contract_uren,
        req.body.maandelijke_contract_uren,
        req.body.max_opeenvolgende_shifts,
        req.body.max_shifts_per_week,
        req.body.max_uur_per_week,
        req.body.nachtshiften_toegelaten,
        req.body.standby_toegelaten,
        req.body.max_uur_per_maand,
        req.body.max_weekends_per_jaar,
        req.body.ideaal_shifts_per_week,
    );
    if (contracttypes) {
        res.send(contracttypes);
    } else {
        res.status(404).send("contracttypes NOT ADDED")
    }
})


router.get("/", async (req, res) => {

    console.log("get received on all list " );

    const Contracttypes = await Contracttypes_DB.getAllContracts();

    if (Contracttypes) {
        res.send(Contracttypes);
    } else {
        res.status(404).send("No Contracttypes found");
    }
})


export default router;