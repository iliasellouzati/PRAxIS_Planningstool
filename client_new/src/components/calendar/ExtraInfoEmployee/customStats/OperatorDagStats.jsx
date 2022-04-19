import React, { useEffect, useState } from 'react'

const OperatorDagStats = ({ employeeId, Interval, SelectedValue, stats }) => {

    let hulpValDays = [1, 2, 3, 4, 5, 6, 7];

    const [ValuesToShow, setValuesToShow] = useState("")

    useEffect(() => {
        switch (Interval) {
            case "maand":

                setValuesToShow([
                    Math.round((stats.maand[`${SelectedValue}`].dag_operator.totaalUrenOpKalender + stats.maand[`${SelectedValue}`].dag_operator.urenUitVorigeMaand) * 100) / 100,
                    Math.round(stats.maand[`${SelectedValue}`].dag_operator.totaalAantalShiften * 100) / 100,
                    stats.maand[`${SelectedValue}`].dag_operator[`1`].aantalShifts,
                    stats.maand[`${SelectedValue}`].dag_operator[`2`].aantalShifts,
                    stats.maand[`${SelectedValue}`].dag_operator[`3`].aantalShifts,
                    stats.maand[`${SelectedValue}`].dag_operator[`4`].aantalShifts,
                    stats.maand[`${SelectedValue}`].dag_operator[`5`].aantalShifts,
                    stats.maand[`${SelectedValue}`].dag_operator[`6`].aantalShifts,
                    stats.maand[`${SelectedValue}`].dag_operator[`7`].aantalShifts
                ])

                break;

            case "kwartaal":



                break;

            case "jaar":



                break;
            default:
                break;
        }


        return () => {

        }
    }, [Interval, SelectedValue])


    return (
        <React.Fragment>
            <table>
                <thead style={{height:'max'}} >
                    <tr >
                        <th style={{ padding: "1px", width: "10%" }} >
                            <div title={`daguren uit vorige maand: ${stats.maand[`${SelectedValue}`].dag_operator.urenUitVorigeMaand}, uren in huidige maand: ${stats.maand[`${SelectedValue}`].dag_operator.totaalUrenOpKalender}`}>#Uren/maand</div>
                        </th>
                        <th style={{ padding: "1px", width: "10%" }}>#Shiften</th>
                        <th style={{ padding: "1px", width: "10%" }}>MA</th>
                        <th style={{ padding: "1px", width: "10%" }}>DI</th>
                        <th style={{ padding: "1px", width: "10%" }}>WO</th>
                        <th style={{ padding: "1px", width: "10%" }}>DO</th>
                        <th style={{ padding: "1px", width: "10%" }}>VR</th>
                        <th style={{ padding: "1px", width: "10%" }}>ZA</th>
                        <th style={{ padding: "1px", width: "10%" }}>ZO</th>
                        <th style={{ padding: "1px", width: "10%" }}>SEE</th>

                    </tr>
                </thead>
                <tbody>{ValuesToShow !== "" &&
                    <tr>
                        <td style={{ padding: "1px", width: "10%" }}>
                            <div title={`daguren uit vorige maand: ${stats.maand[`${SelectedValue}`].dag_operator.urenUitVorigeMaand}, uren in huidige maand: ${stats.maand[`${SelectedValue}`].dag_operator.totaalUrenOpKalender}`}>{ValuesToShow[0]}</div>
                        </td>
                        <td style={{ padding: "1px", width: "10%" }}>{ValuesToShow[1]}</td>
                        <td style={{ padding: "1px", width: "10%" }}>{ValuesToShow[2]}</td>
                        <td style={{ padding: "1px", width: "10%" }}>{ValuesToShow[3]}</td>
                        <td style={{ padding: "1px", width: "10%" }}>{ValuesToShow[4]}</td>
                        <td style={{ padding: "1px", width: "10%" }}>{ValuesToShow[5]}</td>
                        <td style={{ padding: "1px", width: "10%" }}>{ValuesToShow[6]}</td>
                        <td style={{ padding: "1px", width: "10%" }}>{ValuesToShow[7]}</td>
                        <td style={{ padding: "1px", width: "10%" }}>{ValuesToShow[8]}</td>
                        <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>

                    </tr>
                }

                </tbody>
            </table>

        </React.Fragment>
    )
}

export default OperatorDagStats