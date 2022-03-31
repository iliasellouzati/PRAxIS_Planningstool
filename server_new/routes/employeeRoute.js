import Express from 'express';
import * as Employee_DB from '../database/DB-Operations/employee_dboperations.js';
import * as Employee_Contract_DB from '../database/DB-Operations/employeeContract_dboperations.js'
import {
  email_validation
} from '../helpers/regex.js';
import moment from 'moment';


const router = Express.Router();

const hostUrl = "http://localhost:3001/api/employee";

router.get('/', async (req, res) => {
  try {

    const employees = await Employee_DB.getAllEmployees();

    employees.length ? res.status(200).send(employees) : res.status(204).send("No Employees Found");

  } catch (e) {

    res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);

  }

})
router.post("/", async (req, res) => {
  try {
    const rowsAffected = await Employee_DB.addEmployee(
      req.body.voornaam,
      req.body.familienaam,
      req.body.contracttype_id,
      req.body.email,
      req.body.franstalig,
      req.body.opleiding,
      req.body.geboortedatum,
      req.body.geboortedatum_partner
    );

    rowsAffected ? res.status(204).send() : res.status(404).send(`Employee was not added`);


  } catch (e) {

    res.status(500).send(`POST on ${hostUrl} failed with error "${e.message}"`);

  }
})

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


    const rowsAffected = await Employee_DB.updateEmployee(
      req.params.id,
      req.body.voornaam,
      req.body.familienaam,
      req.body.contracttype_id,
      req.body.email,
      req.body.franstalig,
      req.body.opleiding,
      req.body.geboortedatum,
      req.body.geboortedatum_partner
    );

    rowsAffected ? res.status(204).send() : res.status(404).send(`Employee with id:${req.params.id} was not found in DB`);

  } catch (e) {

    res.status(500).send(`PUT on ${hostUrl}/:id with id "${req.params.id}" failed with error "${e.message}"`);

  }


});

router.delete("/:id", async (req, res) => {

  try {

    if (isNaN(req.params.id))
      return res.status(400).send(`DELETE on ${hostUrl}/:id with id "${req.params.id}" failed with because id is not a number`);

    const rowsAffected = await Employee_DB.deleteEmployeeWithId(req.params.id);
    rowsAffected ? res.status(204).send() : res.status(404).send(`Employee with id:${req.params.id} was not found`);

  } catch (e) {

    res.status(500).send(`DELETE on ${hostUrl}/:id with id "${req.params.id}" failed with error "${e.message}"`);

  }

});

router.get('/all/contracts', async (req, res) => {
  try {

    const contracts = await Employee_Contract_DB.getAllContractsForAllEmployees();

    contracts.length ? res.status(200).send(contracts) : res.status(204).send("No Contracts Found");

  } catch (e) {

    res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);

  }
});

router.get('/:employeeId/contract', async (req, res) => {
  try {

    const contracts = await Employee_Contract_DB.getAllContractsForEmployee(req.params.employeeId);

    contracts.length ? res.status(200).send(contracts) : res.status(204).send("No Contracts Found");

  } catch (e) {

    res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);

  }
});

router.post('/:employeeId/contract', async (req, res) => {
  try {

    const result = await Employee_Contract_DB.addIndividualContractForEmployee(req.params.employeeId, req.body.begindatum, req.body.einddatum);
    result ? res.status(204).send() : res.status(400).send("Contract not updated");

  } catch (e) {
    res.status(500).send(`PUT on ${hostUrl}/:employeeId/contract/:contractId failed with error "${e.message}"`);
  }
});

router.put('/:employeeId/contract/:contractId', async (req, res) => {
  try {

    if (parseInt(req.params.contractId) !== parseInt(req.body.Id))
      return res.status(400).send(`PUT on ${hostUrl}/:employeeId/contract/:contractId  with employeeId "${req.params.employeeId}" failed with because id is not equal to contract Id:${req.body.Id}`);

    const result = await Employee_Contract_DB.updateIndividualContractForEmployee(req.body.Id, req.body.begindatum, req.body.einddatum);
    result ? res.status(204).send() : res.status(400).send("Contract not added");

  } catch (e) {
    res.status(500).send(`PUT on ${hostUrl}/:employeeId/contract/:contractId failed with error "${e.message}"`);
  }
});

router.get('/calendaremployees/:year/:month', async (req, res) => {
  try {

    const contracts = await Employee_Contract_DB.getAllContractsForAllEmployees();
    const employees = await Employee_DB.getAllEmployees();

    if (!contracts.length || !employees.length) {
      res.status(404).send();
    }

    let inactiveEmpl = [];

    contracts.forEach(contract => {

      if (contract.einddatum === null && moment(contract.begindatum, "DD/MM/YYYY").isBefore(moment(`${req.params.month}-${req.params.year}`, "MM-YYYY").startOf('month').startOf('isoWeek'), "day")) {
        inactiveEmpl = inactiveEmpl.filter(x => x.employeeId !== contract.werknemer_id);
        inactiveEmpl.push({

          'employeeId': contract.werknemer_id,
          'full_month_contract': "YES",
          'begin': null,
          'eind': null

        })

        return;
      }

      //contract die eindigen voor start maand
      if (contract.einddatum !== null && moment(contract.einddatum, "DD/MM/YYYY").isBefore(moment(`${req.params.month}-${req.params.year}`, "MM-YYYY").startOf('month').startOf('isoWeek'), "day")) {
        if (inactiveEmpl.some(x => x.employeeId === contract.werknemer_id) && ["YES", "PARTIAL"].includes(inactiveEmpl.find(x => x.employeeId === contract.werknemer_id).full_month_contract)) {
          return;
        }

        inactiveEmpl = inactiveEmpl.filter(x => x.employeeId !== contract.werknemer_id);

        inactiveEmpl.push({
          'employeeId': contract.werknemer_id,
          'full_month_contract': "NO",
          'begin': null,
          'eind': null
        });
        return;
      }

      //contracten die starten na einde maand
      if (moment(contract.begindatum, "DD/MM/YYYY").isAfter(moment(`${req.params.month}-${req.params.year}`, "MM-YYYY").endOf('month').endOf('isoWeek'), "day")) {
        if (inactiveEmpl.some(x => x.employeeId === contract.werknemer_id) && ["YES", "PARTIAL"].includes(inactiveEmpl.find(x => x.employeeId === contract.werknemer_id).full_month_contract)) {
          return;
        }
        inactiveEmpl = inactiveEmpl.filter(x => x.employeeId !== contract.werknemer_id);
        inactiveEmpl.push({
          'employeeId': contract.werknemer_id,
          'full_month_contract': "NO", //true voor ja, false voor partial, null voor nee 
          'begin': null,
          'eind': null
        });
        return;
      }

      //contracten met startdatum in de maand
      if (
        moment(contract.begindatum, "DD/MM/YYYY").isAfter(moment(`${req.params.month}-${req.params.year}`, "MM-YYYY").startOf('month').startOf('isoWeek').subtract(1, 'day'), "day") &&
        moment(contract.begindatum, "DD/MM/YYYY").isBefore(moment(`${req.params.month}-${req.params.year}`, "MM-YYYY").endOf('month').endOf('isoWeek').add(1, 'day'), "day")
      ) {


        inactiveEmpl = inactiveEmpl.filter(x => x.employeeId !== contract.werknemer_id);
        inactiveEmpl.push({
          'employeeId': contract.werknemer_id,
          'full_month_contract': "PARTIAL", //true voor ja, false voor partial, null voor nee 
          'begin': contract.begindatum,
          'eind': contract.einddatum
        });
        return;
      }


      //contracten met einddatum in de maand
      if (
        contract.einddatum !== null &&
        moment(contract.einddatum, "DD/MM/YYYY").isAfter(moment(`${req.params.month}-${req.params.year}`, "MM-YYYY").startOf('month').startOf('isoWeek').subtract(1, 'day'), "day") &&
        moment(contract.einddatum, "DD/MM/YYYY").isBefore(moment(`${req.params.month}-${req.params.year}`, "MM-YYYY").endOf('month').endOf('isoWeek').add(1, 'day'), "day")
      ) {
        inactiveEmpl = inactiveEmpl.filter(x => x.employeeId !== contract.werknemer_id);
        inactiveEmpl.push({
          'employeeId': contract.werknemer_id,
          'full_month_contract': "PARTIAL", //true voor ja, false voor partial, null voor nee 
          'begin': contract.begindatum,
          'eind': contract.einddatum
        });
        return;
      }

      //contracten met startdatum voor de maand en einddatum na de maand
      if (
        moment(contract.begindatum, "DD/MM/YYYY").isBefore(moment(`${req.params.month}-${req.params.year}`, "MM-YYYY").startOf('month').startOf('isoWeek'), "day") &&
        moment(contract.einddatum, "DD/MM/YYYY").isAfter(moment(`${req.params.month}-${req.params.year}`, "MM-YYYY").endOf('month').endOf('isoWeek'), "day")
      ) {
        inactiveEmpl = inactiveEmpl.filter(x => x.employeeId !== contract.werknemer_id);
        inactiveEmpl.push({
          'employeeId': contract.werknemer_id,
          'full_month_contract': "YES",
          'begin': null,
          'eind': null
        });
        return;
      }
    });


    employees.forEach(x => {
      if (!contracts.some(y => y.werknemer_id === x.id)) {
        inactiveEmpl.push({
          'employeeId': x.id,
          'full_month_contract': "NO", //true voor ja, false voor partial, null voor nee 
          'begin': null,
          'eind': null

        })
      }
    })



    res.status(200).send(inactiveEmpl);

  } catch (e) {

    console.log(e.message);
    res.status(500).send(`GET on ${hostUrl} failed with error "${e.message}"`);

  }
});



export default router;