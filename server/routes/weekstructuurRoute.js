import Express from 'express';
import * as WeekStructuren_DB from '../SQL/DB-Operations/weekstructuren_dboperations.js';

const router = Express.Router();

router.get("/:id", async (req, res) => {
    const weekstructuur = await WeekStructuren_DB.getWeekStructuurWithId(req.params.id);
    if (weekstructuur) {
      res.send(weekstructuur);
    } else {
      res.status(404).send("Weekstructuur Not Found.")
    }
  });
 
  router.put("/:id", async(req,res)=>{
   const weekstructuren = await WeekStructuren_DB.updateWeekStructuur(req.params.id,req.body.maandag ,req.body.dinsdag,req.body.woensdag,req.body.donderdag,req.body.vrijdag,req.body.zaterdag,req.body.zondag,req.body.score);
   if (weekstructuren) {
     res.send(weekstructuren);
   } else {
     res.status(404).send("Weekstructuur Not Found.")
   }
  })
 
  router.delete("/:id", async (req, res) => {
    const weekstructuren = await WeekStructuren_DB.removeWeekStructuurWithId(req.params.id );
    if (weekstructuren) {
      res.send(weekstructuren);
    } else {
      res.status(404).send("Weekstructuur Not Found.")
    }
  });
 
 router.post("/", async(req,res)=>{
   const weekstructuren = await WeekStructuren_DB.addWeekStructuur(req.body.id ,req.body.maandag ,req.body.dinsdag,req.body.woensdag,req.body.donderdag,req.body.vrijdag,req.body.zaterdag,req.body.zondag,req.body.score );
   if (weekstructuren) {
     res.send(weekstructuren);
   } else {
     res.status(404).send("Error")
   }
 })
 
 
 router.get('/', async(req,res)=>{
    const weekstructuren = await WeekStructuren_DB.getAllWeekStructuren();
 
    res.send(weekstructuren);
 })




export default router;