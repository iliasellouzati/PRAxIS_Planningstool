import Express from "express";
import * as Shifttypes_DB from '../database/DB-Operations/shifttype_dboperations.js';
import {
    hex_color_validation,
    hour_minutes_validation
} from "../helpers/regex.js";
const router = Express.Router();

const hostUrl = "http://localhost:3001/api/shifttype";

router.get("/:name", async (req, res) => {
    try {

        if (req.params.name.trim() === '')
            return res.status(404).send(`GET on ${hostUrl}/:name with name "${req.params.name}" failed with because name is empty`);

        const shifttype = await Shifttypes_DB.getShifttypeWithName(req.params.name);
        shifttype.length ? res.status(200).send(shifttype) : res.status(404).send(`Shifttype with name:${req.params.name} was not found`);

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl}/:name  with name:"${req.params.name}" failed with error "${e.message}"`);

    }
});

router.put("/:name", async (req, res) => {
    try {

        if (req.body.name !== req.params.name)
            return res.status(400).send(`PUT on ${hostUrl}/:name  with name:"${req.params.name}" failed because this name is not equal to bodyname:${req.body.name}`);

        if (req.body.name.trim() === "")
            return res.status(400).send(`PUT on ${hostUrl}/:name  with name:"${req.body.name}" failed because "body name" is empty`);

        if (!hour_minutes_validation.test(req.body.startmoment))
            return res.status(400).send(`PUT on ${hostUrl}/:name  with startmoment:"${req.body.startmoment}" failed  because "startmoment" is not valid`);

        if (!hour_minutes_validation.test(req.body.endmoment))
            return res.status(400).send(`PUT on ${hostUrl}/:name  with endmoment:"${req.body.endmoment}" failed  because "endmoment" is not valid`);

        if (!hex_color_validation.test(req.body.colorcode))
            return res.status(400).send(`PUT on ${hostUrl}/:name  with colorcode:"${req.body.colorcode}" failed  because "colorcode" is not valid`);

        if (typeof req.body.obligated !== 'boolean')
            return res.status(400).send(`PUT on ${hostUrl}/:name  with obligated:"${req.body.obligated}" failed  because "obligated" is not valid`);

        if (typeof req.body.homework !== 'boolean')
            return res.status(400).send(`PUT on ${hostUrl}/:name  with homework:"${req.body.homework}" failed  because "homework" is not valid`);

        if (typeof req.body.changeablehours !== 'boolean')
            return res.status(400).send(`PUT on ${hostUrl}/:name  with changeablehours:"${req.body.changeablehours}" failed  because "changeablehours" is not valid`);

        if (req.body.category.trim() === "")
            return res.status(400).send(`PUT on ${hostUrl}/:name  with category:"${req.body.category}" failed because "category" is empty`);

        if (!hex_color_validation.test(req.body.textcolorcode))
            return res.status(400).send(`PUT on ${hostUrl}/:name  with textcolorcode:"${req.body.textcolorcode}" failed  because "textcolorcode" is not valid`);

        if (typeof req.body.border !== 'boolean')
            return res.status(400).send(`PUT on ${hostUrl}/:name  with border:"${req.body.border}" failed  because "border" is not valid`);

        if (req.body.standardtext.trim() === "" | req.body.standardtext.length > 3)
            return res.status(400).send(`PUT on ${hostUrl}/:name  with standardtext:"${req.body.standardtext}" failed because "standardtext" is not valid`);

        if (typeof req.body.standby !== 'boolean')
            return res.status(400).send(`PUT on ${hostUrl}/:name  with standby:"${req.body.standby}" failed  because "standby" is not valid`);

        if (typeof req.body.active !== 'boolean')
            return res.status(400).send(`PUT on ${hostUrl}/:name  with active:"${req.body.active}" failed  because "active" is not valid`);


        const rowsAffected = await Shifttypes_DB.updateShifttype(req.params.name, req.body.name, req.body.startmoment, req.body.endmoment, req.body.colorcode, req.body.obligated, req.body.homework, req.body.changeablehours, req.body.category, req.body.textcolorcode, req.body.border, req.body.standardtext, req.body.standby, req.body.active);
        rowsAffected ? res.status(204).send() : res.status(404).send(`Shifttype was not updated`);


    } catch (e) {
        res.status(500).send(`Put on ${hostUrl}/${req.params.name} failed with error "${e.message}"`);
    }
})

router.delete("/:name", async (req, res) => {
    try {
        if (req.params.name.trim() === '')
            return res.status(404).send(`DELETE on ${hostUrl}/:name with name "${req.params.name}" failed with because name is empty`);

        const rowsAffected = await Shifttypes_DB.deleteShifttypeWithName(req.params.name);
        rowsAffected ? res.status(204).send() : res.status(404).send(`Shifttype with name:${req.params.name} was not found`);

    } catch (e) {
        res.status(500).send(`DELETE on ${hostUrl}/:name with name:"${req.params.name}" failed with error "${e.message}"`);
    }


})

router.post("/", async (req, res) => {

    try {

        if (req.body.name.trim() === "")
            return res.status(400).send(`POST on ${hostUrl}/:name  with name:"${req.body.name}" failed because "body name" is empty`);

        if (!hour_minutes_validation.test(req.body.startmoment))
            return res.status(400).send(`POST on ${hostUrl}/:name  with startmoment:"${req.body.startmoment}" failed  because "startmoment" is not valid`);

        if (!hour_minutes_validation.test(req.body.endmoment))
            return res.status(400).send(`POST on ${hostUrl}/:name  with endmoment:"${req.body.endmoment}" failed  because "endmoment" is not valid`);

        if (!hex_color_validation.test(req.body.colorcode))
            return res.status(400).send(`POST on ${hostUrl}/:name  with colorcode:"${req.body.colorcode}" failed  because "colorcode" is not valid`);

        if (typeof req.body.obligated !== 'boolean')
            return res.status(400).send(`POST on ${hostUrl}/:name  with obligated:"${req.body.obligated}" failed  because "obligated" is not valid`);

        if (typeof req.body.homework !== 'boolean')
            return res.status(400).send(`POST on ${hostUrl}/:name  with homework:"${req.body.homework}" failed  because "homework" is not valid`);

        if (typeof req.body.changeablehours !== 'boolean')
            return res.status(400).send(`POST on ${hostUrl}/:name  with changeablehours:"${req.body.changeablehours}" failed  because "changeablehours" is not valid`);

        if (req.body.category.trim() === "")
            return res.status(400).send(`POST on ${hostUrl}/:name  with category:"${req.body.category}" failed because "category" is empty`);

        if (!hex_color_validation.test(req.body.textcolorcode))
            return res.status(400).send(`POST on ${hostUrl}/:name  with textcolorcode:"${req.body.textcolorcode}" failed  because "textcolorcode" is not valid`);

        if (typeof req.body.border !== 'boolean')
            return res.status(400).send(`POST on ${hostUrl}/:name  with border:"${req.body.border}" failed  because "border" is not valid`);

        if (req.body.standardtext.trim() === "" | req.body.standardtext.length > 3)
            return res.status(400).send(`POST on ${hostUrl}/:name  with standardtext:"${req.body.standardtext}" failed because "standardtext" is not valid`);

        if (typeof req.body.standby !== 'boolean')
            return res.status(400).send(`POST on ${hostUrl}/:name  with standby:"${req.body.standby}" failed  because "standby" is not valid`);

        if (typeof req.body.active !== 'boolean')
            return res.status(400).send(`POST on ${hostUrl}/:name  with active:"${req.body.active}" failed  because "active" is not valid`);


        const rowsAffected = await Shifttypes_DB.addShifttype(req.body.name, req.body.startmoment, req.body.endmoment, req.body.colorcode, req.body.obligated, req.body.homework, req.body.changeablehours, req.body.category, req.body.textcolorcode, req.body.border, req.body.standardtext, req.body.standby, req.body.active);
        rowsAffected ? res.status(204).send() : res.status(404).send(`Shifttype was not added`);


    } catch (e) {
        res.status(500).send(`POST on ${hostUrl} failed with error "${e.message}"`);
    }
})

router.get("/", async (req, res) => {

    try {

        const shifttypes = await Shifttypes_DB.getAllShiftTypes();

        shifttypes.length ? res.status(200).send(shifttypes) : res.status(204).send("No Shifttypes Found");

    } catch (e) {

        res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);

    }

});



export default router;