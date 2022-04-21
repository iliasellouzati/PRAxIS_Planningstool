import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StandbyStats = ({ SelectedValue, stats }) => {

    const { year } = useParams();

    const [ValuesToShow, setValuesToShow] = useState("");

    useEffect(() => {
        switch (SelectedValue[0]) {
            case "maand":
                setValuesToShow([
                    Math.round((stats.maand[`${SelectedValue[1]}`].standby.totaalUrenOpKalender + stats.maand[`${SelectedValue[1]}`].standby.urenUitVorigeMaand) * 100) / 100,
                    Math.round(stats.maand[`${SelectedValue[1]}`].standby.totaalAantalShiften * 100) / 100,
                    stats.maand[`${SelectedValue[1]}`].standby[`1`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].standby[`2`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].standby[`3`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].standby[`4`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].standby[`5`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].standby[`6`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].standby[`7`].aantalShifts
                ])
                break;
            case "kwartaal":
                setValuesToShow([
                    Math.round((
                        stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].standby.totaalUrenOpKalender + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].standby.urenUitVorigeMaand +
                        stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].standby.totaalUrenOpKalender + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].standby.urenUitVorigeMaand +
                        stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].standby.totaalUrenOpKalender + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].standby.urenUitVorigeMaand

                    ) * 100) / 100,
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].standby.totaalAantalShiften, stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].standby.totaalAantalShiften, stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].standby.totaalAantalShiften),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].standby[`1`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].standby[`1`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].standby[`1`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].standby[`2`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].standby[`2`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].standby[`2`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].standby[`3`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].standby[`3`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].standby[`3`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].standby[`4`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].standby[`4`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].standby[`4`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].standby[`5`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].standby[`5`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].standby[`5`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].standby[`6`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].standby[`6`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].standby[`6`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].standby[`7`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].standby[`7`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].standby[`7`].aantalShifts)
                ])

                break;

            case "jaar":
                setValuesToShow([
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].standby.totaalUrenOpKalender + stats.maand[currVal].standby.urenUitVorigeMaand), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].standby.totaalAantalShiften, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].standby[`1`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].standby[`2`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].standby[`3`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].standby[`4`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].standby[`5`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].standby[`6`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].standby[`7`].aantalShifts, 0),
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

        </React.Fragment>)
}

export default StandbyStats