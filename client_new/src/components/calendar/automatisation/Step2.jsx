import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getCalendarMoments_ArrayWithMoments } from '../helpers'

const Step2 = ({ setStep }) => {
    let { year, month } = useParams();

    const hulpKal = getCalendarMoments_ArrayWithMoments(`${month}-${year}`);

    const [Weeks, setWeeks] = useState([]);
    const [SelectedWeeks, setSelectedWeeks] = useState([]);

    useEffect(() => {

            for (let index = 0; index < hulpKal.length; index += 7) {
                setWeeks(Weeks => [...Weeks, hulpKal[index]]);
        }

    }, [])


    return (
        <div className="row">
            <div className="col-6">
                <div class="card-body p-0">
                    <table class="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th style={{ width: '10px' }}>#</th>
                                <th>Week Nr.</th>
                                <th>Begin Datum</th>
                                <th>Eind Datum</th>
                                <th>Ontbrekende operatorshifts</th>
                                <th>Ontbrekende standby's</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Weeks.map((week, index) =>

                                <tr key={week.format("DD-MM-YYYY")}>
                                    <td >
                                        <div class="custom-control custom-checkbox">
                                            <input
                                                class="custom-control-input custom-control-input-danger custom-control-input-outline"
                                                type="checkbox"
                                                id={`customCheckbox_${week.format("DD-MM-YYYY")}`}
                                                checked={SelectedWeeks.includes(week)}
                                                onClick={() => { SelectedWeeks.includes(week) ? setSelectedWeeks(SelectedWeeks.filter(x => x !== week)) : setSelectedWeeks([...SelectedWeeks, week]) }} />
                                            <label for={`customCheckbox_${week.format("DD-MM-YYYY")}`} class="custom-control-label"></label>

                                        </div>

                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{week.format("DD-MM-YYYY")}</td>
                                    <td>{week.clone().endOf('isoWeek').format("DD-MM-YYYY")}</td>
                                    <td>0</td>
                                    <td>0</td>

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
                    <p>Aantal geselecteerde weken: <b>{SelectedWeeks.length}</b></p>


                        <div className="d-flex" style={{ justifyContent: 'space-around' }}>
                            <button type="button" className="btn btn-warning" onClick={() => setStep(0)} >Vorige stap</button>

                            <button type="button" className="btn btn-success" onClick={() => setStep(2)} >Volgende stap</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step2