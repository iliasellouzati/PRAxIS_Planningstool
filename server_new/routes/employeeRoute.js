import Express from 'express';
import * as Employee_DB from '../database/DB-Operations/employee_dboperations.js';
import {
  email_validation
} from '../helpers/regex.js'


const router = Express.Router();

const hostUrl = "http://localhost:3001/api/employee";

router.get("/:id", async (req, res) => {

  try {

    if (isNaN(req.params.id))
      return res.status(400).send(`GET on ${hostUrl}/:id with id "${req.params.id}" failed with because id is not a number`);

    const employee = await Employee_DB.getEmployeeWithId(req.params.id);

    employee.length ? res.status(200).send(employee) : res.status(404).send(`Employee with id:${req.params.id} was not found`);

  } catch (e) {

    res.status(500).send(`GET on ${hostUrl}/:id with id "${req.params.id}" failed with error "${e.message}"`);

  }
});

router.put("/:id", async (req, res) => {

  try {
    if (isNaN(req.params.id))
      return res.status(400).send(`PUT on ${hostUrl}/:id with id "${req.params.id}" failed with because id is not a number`);

    if (parseInt(req.params.id) !== parseInt(req.body.id))
      return res.status(400).send(`PUT on ${hostUrl}/:id with id "${req.params.id}" failed with because id is not equal to employee Id:${req.body.id}`);

    if (req.body.name.trim() === "")
      return res.status(400).send(`PUT on ${hostUrl}/:id failed because name is empty`);

    if (!email_validation.test(req.body.email.toLowerCase().trim()))
      return res.status(400).send(`PUT on ${hostUrl}/:id failed  because email is not valid`);

    const rowsAffected = await Employee_DB.updateEmployee(req.params.id, req.body.name, req.body.email, req.body.contracttype);

    rowsAffected ? res.status(204).send() : res.status(404).send(`Employee with id:${req.params.id} was not found in DB`);

  } catch (e) {

    res.status(500).send(`PUT on ${hostUrl}/:id with id "${req.params.id}" failed with error "${e.message}"`);

  }


});

router.delete("/:id", async (req, res) => {

  try {

    if (isNaN(req.params.id))
      return res.status(400).send(`GET on ${hostUrl}/:id with id "${req.params.id}" failed with because id is not a number`);

    const rowsAffected = await Employee_DB.deleteEmployeeWithId(req.params.id);
    rowsAffected ? res.status(204).send() : res.status(404).send(`Employee with id:${req.params.id} was not found`);

  } catch (e) {

    res.status(500).send(`DELETE on ${hostUrl}/:id with id "${req.params.id}" failed with error "${e.message}"`);

  }

});

router.post("/", async (req, res) => {
  try {

    if (isNaN(req.body.id))
      return res.status(400).send(`POST on ${hostUrl} with id "${req.params.id}" failed with because id is not a number`);

    if (req.body.name.trim() === "")
      return res.status(400).send(`POST on ${hostUrl} failed because name is empty`);

    if (!email_validation.test(req.body.email.toLowerCase().trim()))
      return res.status(400).send(`POST on ${hostUrl} failed  because email is not valid`);



    const rowsAffected = await Employee_DB.addEmployee(req.body.id, req.body.name, req.body.email, req.body.contracttype);

    rowsAffected ? res.status(204).send() : res.status(404).send(`Employee was not added`);


  } catch (e) {

    res.status(500).send(`POST on ${hostUrl} failed with error "${e.message}"`);

  }
})

router.get('/', async (req, res) => {
  try {

    const employees = await Employee_DB.getAllEmployees();

    employees.length ? res.status(200).send(employees) : res.status(204).send("No Employees Found");

  } catch (e) {

    res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);

  }

})

export default router;