import Express from "express";
import { createExcelFile } from "../rapporten/individueleRapporten/index2.js";


const router = Express.Router();


router.get("/:id", async (req, res) => {
    console.log("get received");

    res.download('backend/temp_rapporten/' + req.params.id, (err) => {
        if (err) console.log(err);
    });
    console.log("get finished");

    

})

router.post("/", async (req, res) => {
    console.log("post received");

    await createExcelFile(req.body.calendar, req.body.shifts);
    console.log("post finished");

    res.status(200).send({ message: true });
});


export default router;
