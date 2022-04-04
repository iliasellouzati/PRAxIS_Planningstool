/* eslint-disable eqeqeq */
import React, { useState } from 'react'

const Step3 = ({ setStep, SelectedFilters, setSelectedFilters, employees, contracts,SeparateEmployees,setSeparateEmployees }) => {

    const [Filters] = useState([
        ["NACHT_WEEKEND_GEVULD", 'Nacht & weekend ingevuld', 'Enkel planningen met ontbrekende dagshiften'],
        ["MIN_1_OPERATOR_FRANSTALIG", 'Frans controle', 'Altijd min. 1 operator die frans goed beheerst (1u overdracht toegelaten)'],
        ["MIN_1_OPERATOR_ZONDER_OPLEIDING", 'Opleiding ops apart', 'Altijd min. 1 operator zonder opleiding (1u overdracht niet toegelaten)'],
    ]);
    const [CalendarEmployees] = useState(contracts.filter(x => ["YES", "PARTIAL"].includes(x.full_month_contract)).map(x => x.employeeId));
    const [ScheidingWerknemer1, setScheidingWerknemer1] = useState(contracts.filter(x => ["YES", "PARTIAL"].includes(x.full_month_contract)).map(x => x.employeeId)[0]);
    const [ScheidingWerknemer2, setScheidingWerknemer2] = useState(contracts.filter(x => ["YES", "PARTIAL"].includes(x.full_month_contract)).map(x => x.employeeId)[1]);

    return (

        <div className="row">
            <div className="col-6">
                <div class="card-body p-0">
                    <table class="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th style={{ width: '10px' }}>#</th>
                                <th style={{ width: '200px' }}>Naam</th>
                                <th>Extra Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Filters && Filters.map(filter =>
                                <tr key={filter[0]}>
                                    <td >
                                        <div class="custom-control custom-checkbox">
                                            <input
                                                class="custom-control-input custom-control-input-danger custom-control-input-outline"
                                                type="checkbox"
                                                id={`customCheckbox_${filter[0]}`}
                                                checked={SelectedFilters.some(x => x === filter[0])}
                                                onClick={() => {
                                                    SelectedFilters.some(x => x === filter[0]) ?
                                                        setSelectedFilters(SelectedFilters.filter(x => x !== filter[0])) :
                                                        setSelectedFilters([...SelectedFilters, filter[0]])
                                                }} />
                                            <label for={`customCheckbox_${filter[0]}`} class="custom-control-label"></label>

                                        </div>

                                    </td>
                                    <td>
                                        {filter[1]}
                                    </td>
                                    <td>
                                        {filter[2]}
                                    </td>

                                </tr>)}

                            <tr>
                                <td >
                                    <div class="custom-control custom-checkbox">
                                        <input
                                            class="custom-control-input custom-control-input-danger custom-control-input-outline"
                                            type="checkbox"
                                            id={`customCheckbox_OPERATORS_AFSCHEIDEN`}
                                            checked={SelectedFilters.some(x => x === "OPERATORS_AFSCHEIDEN")}
                                            onClick={() => {
                                                SelectedFilters.some(x => x === "OPERATORS_AFSCHEIDEN") ?
                                                    setSelectedFilters(SelectedFilters.filter(x => x !== "OPERATORS_AFSCHEIDEN")) :
                                                    setSelectedFilters([...SelectedFilters, "OPERATORS_AFSCHEIDEN"])
                                            }} />
                                        <label for={`customCheckbox_OPERATORS_AFSCHEIDEN`} class="custom-control-label"></label>

                                    </div>

                                </td>
                                <td>
                                    Operatoren scheiden
                                </td>
                                <td>
                                    (1u overdracht niet toegelaten, aflossing wel toegelaten)
                                </td>

                            </tr>
                            {CalendarEmployees && SelectedFilters.some(x => x === "OPERATORS_AFSCHEIDEN") &&
                                <tr>
                                    <td colSpan={3}>
                                        <div className="row">
                                            <div className="col-3">
                                                <div class="form-group">
                                                    <label>Selecteer nr.1</label>
                                                    <select class="form-control" value={ScheidingWerknemer1} onChange={(e) => setScheidingWerknemer1(e.target.value)}  >
                                                        {CalendarEmployees.filter(x => x != ScheidingWerknemer2).map(emp =>
                                                            <option key={emp + ScheidingWerknemer2} value={emp} >{employees.find(x => x.id === emp).voornaam} {employees.find(x => x.id === emp).familienaam}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div class="form-group">
                                                    <label>Selecteer nr.2</label>
                                                    <select class="form-control" value={ScheidingWerknemer2} onChange={(e) => setScheidingWerknemer2(e.target.value)}  >
                                                        {CalendarEmployees.filter(x => x != ScheidingWerknemer1).map(emp =>
                                                            <option key={emp + ScheidingWerknemer1} value={emp} >{employees.find(x => x.id === emp).voornaam} {employees.find(x => x.id === emp).familienaam}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-1" style={{ textAlign: 'center' }}>
                                                <div class="form-group">
                                                    <label>Add</label>
                                                    <button type="button" class="btn btn-block bg-gradient-success btn-flat"
                                                        onClick={() => {
                                                            setSeparateEmployees([...SeparateEmployees,[ScheidingWerknemer1,ScheidingWerknemer2]])
                                                        }}
                                                    ><b>+</b></button>
                                                </div>

                                            </div>
                                            <div className="col-5">
                                                <div class="form-group">
                                                    <label>Gescheiden koppels : </label>
                                                    {SeparateEmployees && SeparateEmployees.length === 0 ?
                                                        <p>!!!!Iedereen komt overeen!!!! :) :) :) :) :)</p> :
                                                        < table class="table table-striped table-sm" style={{textAlign:"center"}}>
                                                            <thead>
                                                                <tr>
                                                                    <th  style={{marginTop:"0px",marginBottom:"0px", paddingBottom:'0px',paddingTop:'0px'}} >Bitch 1</th>
                                                                    <th  style={{marginTop:"0px",marginBottom:"0px", paddingBottom:'0px',paddingTop:'0px'}}>Bitch 2</th>
                                                                    <th  style={{marginTop:"0px",marginBottom:"0px", paddingBottom:'0px',paddingTop:'0px'}}></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {SeparateEmployees.map(EchtScheiding =>
                                                                    <tr  style={{marginTop:"0px",marginBottom:"0px", paddingBottom:'0px',paddingTop:'0px'}}>
                                                                        <td  style={{marginTop:"0px",marginBottom:"0px", paddingBottom:'0px',paddingTop:'0px'}}>
                                                                            {employees.find(x => x.id == EchtScheiding[0]).voornaam}
                                                                        </td >
                                                                        <td  style={{marginTop:"0px",marginBottom:"0px", paddingBottom:'0px',paddingTop:'0px'}}>
                                                                            {employees.find(x => x.id == EchtScheiding[1]).voornaam}
                                                                        </td>
                                                                        <td  style={{marginTop:"0px",marginBottom:"0px", paddingBottom:'0px',paddingTop:'0px'}}>
                                                                            <button 
                                                                            type="button" 
                                                                            style={{width:"24px"}} 
                                                                            class="btn btn-block bg-gradient-danger btn-xs"
                                                                            onClick={()=>setSeparateEmployees(SeparateEmployees.filter(x=>x!==EchtScheiding))}
                                                                            >-</button>
                                                                        </td>
                                                                    </tr>)}
                                                            </tbody>
                                                        </table>}
                                                </div>
                                            </div>
                                        </div>




                                    </td>


                                </tr>}


                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-6">
                <div className="card">
                    <div className="card-header">
                        Overzicht:
                    </div>
                    <div className="card-body">
                        <p>Aantal geselecteerde filters: <b>{SelectedFilters.length}</b></p>


                        <div className="d-flex" style={{ justifyContent: 'space-around' }}>
                            <button type="button" className="btn btn-warning" onClick={() => setStep(1)} >Vorige stap</button>

                            <button type="button" className="btn btn-success" onClick={() => setStep(3)} >Volgende stap</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step3