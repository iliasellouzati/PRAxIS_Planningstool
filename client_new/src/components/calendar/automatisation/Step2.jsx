import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCalendarMoments_ArrayWithMoments } from '../helpers'

const Step2 = ({ setStep, SelectedWeeks, setSelectedWeeks, setMissingShifts, MissingShifts }) => {
    let { year, month } = useParams();

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;

    const hulpKal = getCalendarMoments_ArrayWithMoments(`${month}-${year}`);

    const [Weeks, setWeeks] = useState([]);

    const checkOntbrekendeShiften = () => {

        let verplichteShiften = ['0618', '0719', '1806', '1907']
        let hulpCalenderMetOntbrekendeShiften = [];

        for (let index = 0; index < hulpKal.length; index += 7) {
            hulpCalenderMetOntbrekendeShiften.push(Array(7).fill(0).map(() => verplichteShiften));
        }

        calendar.forEach(empl => {
            empl.calendar.forEach((shiftDay, index) => {

                if (verplichteShiften.includes(shiftDay.shift)) {
                    let hulpVal = hulpCalenderMetOntbrekendeShiften[Math.floor(index / 7)][index % 7];
                    hulpVal = hulpVal.filter(x => x !== shiftDay.shift);
                    hulpCalenderMetOntbrekendeShiften[Math.floor(index / 7)][index % 7] = hulpVal;
                }
            })
        })
        let missingShifts = [];
        for (let index = 0; index < (hulpKal.length / 7); index++) {

            let hulpValOntbrekendeShiften = hulpCalenderMetOntbrekendeShiften[index][0].length + hulpCalenderMetOntbrekendeShiften[index][1].length +
                hulpCalenderMetOntbrekendeShiften[index][2].length + hulpCalenderMetOntbrekendeShiften[index][3].length +
                hulpCalenderMetOntbrekendeShiften[index][4].length + hulpCalenderMetOntbrekendeShiften[index][5].length +
                hulpCalenderMetOntbrekendeShiften[index][6].length;
            missingShifts.push(hulpValOntbrekendeShiften);
            ;

        }
        setMissingShifts(missingShifts);

    }
    useEffect(() => {

        for (let index = 0; index < hulpKal.length; index += 7) {
            setWeeks(Weeks => [...Weeks, hulpKal[index]]);
            if (index !== 0 && !SelectedWeeks.some(x=>hulpKal[index].isSame(x,'day'))) {
                setSelectedWeeks(SelectedWeeks => [...SelectedWeeks, hulpKal[index]]);
            }
        }
        checkOntbrekendeShiften();



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
                                                checked={SelectedWeeks.some(x=>week.isSame(x,'day'))}
                                                onClick={() => { SelectedWeeks.includes(week) ? setSelectedWeeks(SelectedWeeks.filter(x => x !== week)) : setSelectedWeeks([...SelectedWeeks, week]) }} />
                                            <label for={`customCheckbox_${week.format("DD-MM-YYYY")}`} class="custom-control-label"></label>

                                        </div>

                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{week.format("DD-MM-YYYY")}</td>
                                    <td>{week.clone().endOf('isoWeek').format("DD-MM-YYYY")}</td>
                                    <td>{MissingShifts[index]}</td>
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