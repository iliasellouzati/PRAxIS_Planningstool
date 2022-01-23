import Express from "express";
import * as Shifttypes_DB from '../SQL/DB-Operations/shifttypes_dboperations.js';
const router = Express.Router();

//not used in this project
router.get("/:naam", async (req, res) => {
    const shifttypes = await Shifttypes_DB.getShifttypeWithNaam(req.params.naam);
    if (shifttypes) {
        res.send(shifttypes);
        
    } else {
        res.status(404).send("Employee Not Found.")
    }
});

router.put("/:naam", async (req,res)=>{
    const shifttypes = await Shifttypes_DB.updateShifttype(req.params.naam,req.body.naam,req.body.beginuur,req.body.einduur,req.body.kleurcode, req.body.verplicht , req.body.thuiswerk, req.body.aanpasbare_uren, req.body.categorie, req.body.tekstkleurcode , req.body.border, req.body.standaardtekst  , req.body.standby , req.body.actief);
    if (shifttypes) {
        res.send(shifttypes);
    } else {
        res.status(404).send("SHIFTTYPE Not Found.")
    }
})


router.delete("/:naam", async (req, res) => {
    const shifttypes = await Shifttypes_DB.removeShifttypeWithNaam(req.params.naam);
    if (shifttypes) {
        res.send(shifttypes);
    } else {
        res.status(404).send("SHIFTTYPE Not Found.")
    }
})

router.post("/", async(req,res)=>{
    const shifttypes = await Shifttypes_DB.addShifttype(req.body.naam,req.body.beginuur,req.body.einduur,req.body.kleurcode, req.body.verplicht , req.body.thuiswerk, req.body.aanpasbare_uren, req.body.categorie, req.body.tekstkleurcode , req.body.border, req.body.standaardtekst, req.body.standby , req.body.actief );
    if (shifttypes) {
      res.send(shifttypes);
    } else {
      res.status(404).send("SHIFT NOT ADDED")
    }
  })

router.get("/", async (req, res) => {
    const shifttypes = await Shifttypes_DB.getAllShiftTypes();

    res.send(shifttypes);
});

export default router;