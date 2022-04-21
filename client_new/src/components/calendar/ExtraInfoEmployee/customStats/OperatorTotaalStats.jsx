import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const OperatorTotaalStats = ({ SelectedValue, stats }) => {
    const { year } = useParams();


    const [ValuesToShow, setValuesToShow] = useState("");

    useEffect(() => {
        switch (SelectedValue[0]) {
            case "maand":
                setValuesToShow([
                    (
                        stats.maand[`${SelectedValue[1]}`].dag_operator.totaalUrenOpKalender + stats.maand[`${SelectedValue[1]}`].dag_operator.urenUitVorigeMaand +
                        stats.maand[`${SelectedValue[1]}`].nacht_operator.totaalUrenOpKalender + stats.maand[`${SelectedValue[1]}`].nacht_operator.urenUitVorigeMaand
                    ),
                    (stats.maand[`${SelectedValue[1]}`].dag_operator.totaalAantalShiften + stats.maand[`${SelectedValue[1]}`].nacht_operator.totaalAantalShiften),

                    (stats.maand[`${SelectedValue[1]}`].dag_operator[`1`].aantalShifts + stats.maand[`${SelectedValue[1]}`].nacht_operator[`1`].aantalShifts),
                    (stats.maand[`${SelectedValue[1]}`].dag_operator[`2`].aantalShifts + stats.maand[`${SelectedValue[1]}`].nacht_operator[`2`].aantalShifts),
                    (stats.maand[`${SelectedValue[1]}`].dag_operator[`3`].aantalShifts + stats.maand[`${SelectedValue[1]}`].nacht_operator[`3`].aantalShifts),
                    (stats.maand[`${SelectedValue[1]}`].dag_operator[`4`].aantalShifts + stats.maand[`${SelectedValue[1]}`].nacht_operator[`4`].aantalShifts),
                    (stats.maand[`${SelectedValue[1]}`].dag_operator[`5`].aantalShifts + stats.maand[`${SelectedValue[1]}`].nacht_operator[`5`].aantalShifts),
                    (stats.maand[`${SelectedValue[1]}`].dag_operator[`6`].aantalShifts + stats.maand[`${SelectedValue[1]}`].nacht_operator[`6`].aantalShifts),
                    (stats.maand[`${SelectedValue[1]}`].dag_operator[`7`].aantalShifts + stats.maand[`${SelectedValue[1]}`].nacht_operator[`7`].aantalShifts)
                ])
                break;
            case "kwartaal":
                setValuesToShow([
                    Object.keys(stats.maand).reduce((accumulator, currVal, currIndex) => accumulator += (currIndex >= (parseInt(SelectedValue[1]) * 3) && currIndex < (parseInt(SelectedValue[1]) * 3 + 3) ?(stats.maand[currVal].dag_operator.totaalUrenOpKalender + stats.maand[currVal].dag_operator.urenUitVorigeMaand + stats.maand[currVal].nacht_operator.totaalUrenOpKalender + stats.maand[currVal].nacht_operator.urenUitVorigeMaand):0), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal, currIndex) => accumulator += (currIndex >= (parseInt(SelectedValue[1]) * 3) && currIndex < (parseInt(SelectedValue[1]) * 3 + 3) ?(stats.maand[currVal].dag_operator.totaalAantalShiften + stats.maand[currVal].nacht_operator.totaalAantalShiften):0), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal, currIndex) => accumulator += (currIndex >= (parseInt(SelectedValue[1]) * 3) && currIndex < (parseInt(SelectedValue[1]) * 3 + 3) ? (stats.maand[currVal].dag_operator[`1`].aantalShifts + stats.maand[currVal].nacht_operator[`1`].aantalShifts) : 0), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal, currIndex) => accumulator += (currIndex >= (parseInt(SelectedValue[1]) * 3) && currIndex < (parseInt(SelectedValue[1]) * 3 + 3) ? (stats.maand[currVal].dag_operator[`2`].aantalShifts + stats.maand[currVal].nacht_operator[`2`].aantalShifts) : 0), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal, currIndex) => accumulator += (currIndex >= (parseInt(SelectedValue[1]) * 3) && currIndex < (parseInt(SelectedValue[1]) * 3 + 3) ? (stats.maand[currVal].dag_operator[`3`].aantalShifts + stats.maand[currVal].nacht_operator[`3`].aantalShifts) : 0), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal, currIndex) => accumulator += (currIndex >= (parseInt(SelectedValue[1]) * 3) && currIndex < (parseInt(SelectedValue[1]) * 3 + 3) ? (stats.maand[currVal].dag_operator[`4`].aantalShifts + stats.maand[currVal].nacht_operator[`4`].aantalShifts) : 0), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal, currIndex) => accumulator += (currIndex >= (parseInt(SelectedValue[1]) * 3) && currIndex < (parseInt(SelectedValue[1]) * 3 + 3) ? (stats.maand[currVal].dag_operator[`5`].aantalShifts + stats.maand[currVal].nacht_operator[`5`].aantalShifts) : 0), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal, currIndex) => accumulator += (currIndex >= (parseInt(SelectedValue[1]) * 3) && currIndex < (parseInt(SelectedValue[1]) * 3 + 3) ? (stats.maand[currVal].dag_operator[`6`].aantalShifts + stats.maand[currVal].nacht_operator[`6`].aantalShifts) : 0), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal, currIndex) => accumulator += (currIndex >= (parseInt(SelectedValue[1]) * 3) && currIndex < (parseInt(SelectedValue[1]) * 3 + 3) ? (stats.maand[currVal].dag_operator[`7`].aantalShifts + stats.maand[currVal].nacht_operator[`7`].aantalShifts) : 0), 0)

                ])

                break;

            case "jaar":
                setValuesToShow([
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].dag_operator.totaalUrenOpKalender + stats.maand[currVal].dag_operator.urenUitVorigeMaand + stats.maand[currVal].nacht_operator.totaalUrenOpKalender + stats.maand[currVal].nacht_operator.urenUitVorigeMaand), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].dag_operator.totaalAantalShiften + stats.maand[currVal].nacht_operator.totaalAantalShiften), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].dag_operator[`1`].aantalShifts + stats.maand[currVal].nacht_operator[`1`].aantalShifts), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].dag_operator[`2`].aantalShifts + stats.maand[currVal].nacht_operator[`2`].aantalShifts), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].dag_operator[`3`].aantalShifts + stats.maand[currVal].nacht_operator[`3`].aantalShifts), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].dag_operator[`4`].aantalShifts + stats.maand[currVal].nacht_operator[`4`].aantalShifts), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].dag_operator[`5`].aantalShifts + stats.maand[currVal].nacht_operator[`5`].aantalShifts), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].dag_operator[`6`].aantalShifts + stats.maand[currVal].nacht_operator[`6`].aantalShifts), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].dag_operator[`7`].aantalShifts + stats.maand[currVal].nacht_operator[`7`].aantalShifts), 0)
                ])
                break;
            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SelectedValue])

    return (
        <React.Fragment>
            <table style={{ height: '100px', width: '100%', alignContent: "center" }}>
                <thead  >
                    <tr >
                        <th style={{ padding: "1px", width: "10%" }} >
                            <div >#Uren</div>
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
                            <div>{Math.round(ValuesToShow[0] * 100) / 100}</div>
                        </td>
                        <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[1]}</td>
                        <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[2]}</td>
                        <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[3]}</td>
                        <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[4]}</td>
                        <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[5]}</td>
                        <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[6]}</td>
                        <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[7]}</td>
                        <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[8]}</td>
                        <td rowSpan={2} style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>

                    </tr>
                }

                </tbody>
            </table>

        </React.Fragment>
    )
}

export default OperatorTotaalStats