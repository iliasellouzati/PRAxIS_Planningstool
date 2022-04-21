import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const OperatorDagStats = ({ SelectedValue, stats }) => {

    let hulpValDays = [1, 2, 3, 4, 5, 6, 7];
    const { year } = useParams();
    const keys = [`01-${year}`,`02-${year}`,`03-${year}`,`04-${year}`,`05-${year}`,`06-${year}`,`07-${year}`,`08-${year}`,`09-${year}`,`10-${year}`,`11-${year}`,`12-${year}`];

    const [ValuesToShow, setValuesToShow] = useState("");

    useEffect(() => {
        switch (SelectedValue[0]) {
            case "maand":

                setValuesToShow([
                    Math.round((stats.maand[`${SelectedValue[1]}`].dag_operator.totaalUrenOpKalender + stats.maand[`${SelectedValue[1]}`].dag_operator.urenUitVorigeMaand) * 100) / 100,
                    Math.round(stats.maand[`${SelectedValue[1]}`].dag_operator.totaalAantalShiften * 100) / 100,
                    stats.maand[`${SelectedValue[1]}`].dag_operator[`1`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].dag_operator[`2`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].dag_operator[`3`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].dag_operator[`4`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].dag_operator[`5`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].dag_operator[`6`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].dag_operator[`7`].aantalShifts
                ])

                break;

            case "kwartaal":


                setValuesToShow([
                    Math.round((
                        stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].dag_operator.totaalUrenOpKalender + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].dag_operator.urenUitVorigeMaand +
                        stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].dag_operator.totaalUrenOpKalender + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].dag_operator.urenUitVorigeMaand +
                        stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].dag_operator.totaalUrenOpKalender + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].dag_operator.urenUitVorigeMaand

                    ) * 100) / 100,
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].dag_operator.totaalAantalShiften, stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].dag_operator.totaalAantalShiften, stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].dag_operator.totaalAantalShiften),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].dag_operator[`1`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].dag_operator[`1`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].dag_operator[`1`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].dag_operator[`2`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].dag_operator[`2`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].dag_operator[`2`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].dag_operator[`3`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].dag_operator[`3`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].dag_operator[`3`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].dag_operator[`4`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].dag_operator[`4`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].dag_operator[`4`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].dag_operator[`5`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].dag_operator[`5`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].dag_operator[`5`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].dag_operator[`6`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].dag_operator[`6`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].dag_operator[`6`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].dag_operator[`7`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].dag_operator[`7`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].dag_operator[`7`].aantalShifts)
                ])

                break;

            case "jaar":

                Object.keys(stats.maand).reduce((acc,curr)=>console.log(stats.maand[curr]),0);


                setValuesToShow([
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += Math.round((stats.maand[currVal].dag_operator.totaalUrenOpKalender + stats.maand[currVal].dag_operator.urenUitVorigeMaand) * 100) / 100, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].dag_operator.totaalAantalShiften, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].dag_operator[`1`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].dag_operator[`2`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].dag_operator[`3`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].dag_operator[`4`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].dag_operator[`5`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].dag_operator[`6`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].dag_operator[`7`].aantalShifts, 0),
                ])
                break;
            default:
                break;
        }


        return () => {

        }
    }, [SelectedValue])


    return (
        <React.Fragment>
            <table style={{ height: '100px', alignContent: "center" }}>
                <thead  >
                    <tr >
                        <th style={{ padding: "1px", width: "10%" }} >
                            <div >#Uren/maand</div>
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
                            <div>{ValuesToShow[0]}</div>
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

export default OperatorDagStats