import Express from 'express';
import * as Werknemers_DB from '../SQL/DB-Operations/werknemers_dboperations.js';
const router = Express.Router();



router.get("/:id", async (req, res) => {
   const werknemer = await Werknemers_DB.getWerknemerWithId(req.params.id);
   if (werknemer) {
     res.send(werknemer);
   } else {
     res.status(404).send("Employee Not Found.")
   }
 });

 router.put("/:id", async(req,res)=>{
  const werknemers = await Werknemers_DB.updateWerknemer(req.params.id,req.body.naam,req.body.email,req.body.contracttype);
  if (werknemers) {
    res.send(werknemers);
  } else {
    res.status(404).send("Employee Not Found.")
  }
 })

 router.delete("/:id", async (req, res) => {
   const werknemers = await Werknemers_DB.removeWerknemerWithId(req.params.id );
   if (werknemers) {
     res.send(werknemers);
   } else {
     res.status(404).send("Employee Not Found.")
   }
 });

router.post("/", async(req,res)=>{
  const werknemers = await Werknemers_DB.addWerknemer(req.body.id,req.body.naam,req.body.email, req.body.contracttype );
  if (werknemers) {
    res.send(werknemers);
  } else {
    res.status(404).send("Error")
  }
})


router.get('/', async(req,res)=>{
   const werknemers = await Werknemers_DB.getAllWerknemers();

   res.send(werknemers);
})
export default router;