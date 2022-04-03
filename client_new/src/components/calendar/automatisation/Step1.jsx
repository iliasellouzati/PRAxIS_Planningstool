import React from 'react'

const Step1 = ({ EmployeesContracts, SelectedEmployees, Employees, setSelectedEmployees, setStep }) => {
    return (
        <div className="row">
            <div className="col-6">
                <div class="card-body p-0">
                    <table class="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th style={{ width: '10px' }}>#</th>
                                <th>Naam</th>
                                <th>Opmerking</th>
                            </tr>
                        </thead>
                        <tbody>
                            {EmployeesContracts.map(empl =>
                                <tr style={{ padding: '0px', margin: '0px' }} key={empl.employeeId}>
                                    <td style={{ paddingTop: '0px', marginTop: '0px', paddingBottom: '0px', marginBottom: '0px' }}>
                                        <div class="custom-control custom-checkbox">
                                            <input
                                                class="custom-control-input custom-control-input-danger custom-control-input-outline"
                                                type="checkbox"
                                                id={`customCheckbox_${empl.employeeId}`}
                                                checked={SelectedEmployees.includes(empl.employeeId)}
                                                onClick={() => { SelectedEmployees.includes(empl.employeeId) ? setSelectedEmployees(SelectedEmployees.filter(x => x !== empl.employeeId)) : setSelectedEmployees([...SelectedEmployees, empl.employeeId]) }} />
                                            <label for={`customCheckbox_${empl.employeeId}`} class="custom-control-label"></label>
                                        </div>

                                    </td>
                                    <td style={{ paddingTop: '0px', marginTop: '0px', paddingBottom: '0px', marginBottom: '0px' }}>{`${Employees.find(x => x.id === empl.employeeId).voornaam} ${Employees.find(x => x.id === empl.employeeId).familienaam.substring(0, 3)}. `}</td>
                                    <td style={{ paddingTop: '0px', marginTop: '0px', paddingBottom: '0px', marginBottom: '0px' }}>{empl.full_month_contract === "PARTIAL" ?
                                        'Opgelet: werknemer staat niet de volledige maand onder contract' :
                                        [1, 5].includes(Employees.find(x => x.id === empl.employeeId).contracttype_id) ? "" : "Dit is geen operator"}</td>
                                </tr>

                            )}


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

                        <p>Aantal met operator contract: <b>{SelectedEmployees.filter(x => Employees.find(y => y.id === x).contracttype_id === 1).length}</b></p>
                        <p>Aantal met 4-5'en  contract:  <b>{SelectedEmployees.filter(x => Employees.find(y => y.id === x).contracttype_id === 5).length}</b></p>
                        <p>Aantal met andere contract:  <b>{SelectedEmployees.filter(x =>![1,5].includes(Employees.find(y => y.id === x).contracttype_id )).length}</b></p>
                        <div className="d-flex" style={{ justifyContent: 'space-around' }}>
                            <button type="button" className="btn btn-success" onClick={() => setStep(1)} >Volgende stap</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step1