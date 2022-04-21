import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ZiekteStats = ({ SelectedValue, stats }) => {
    
    const { year } = useParams();

    const [ValuesToShow, setValuesToShow] = useState("");

    useEffect(() => {
        switch (SelectedValue[0]) {
            case "maand":
                setValuesToShow([
                    Math.round((stats.maand[`${SelectedValue[1]}`].ziekte.totaalUrenOpKalender + stats.maand[`${SelectedValue[1]}`].ziekte.urenUitVorigeMaand) * 100) / 100,
                    Math.round(stats.maand[`${SelectedValue[1]}`].ziekte.totaalAantalShiften * 100) / 100,
                    stats.maand[`${SelectedValue[1]}`].ziekte[`1`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].ziekte[`2`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].ziekte[`3`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].ziekte[`4`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].ziekte[`5`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].ziekte[`6`].aantalShifts,
                    stats.maand[`${SelectedValue[1]}`].ziekte[`7`].aantalShifts
                ])
                break;
            case "kwartaal":
                setValuesToShow([
                    Math.round((
                        stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].ziekte.totaalUrenOpKalender + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].ziekte.urenUitVorigeMaand +
                        stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].ziekte.totaalUrenOpKalender + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].ziekte.urenUitVorigeMaand +
                        stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].ziekte.totaalUrenOpKalender + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].ziekte.urenUitVorigeMaand

                    ) * 100) / 100,
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].ziekte.totaalAantalShiften, stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].ziekte.totaalAantalShiften, stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].ziekte.totaalAantalShiften),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].ziekte[`1`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].ziekte[`1`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].ziekte[`1`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].ziekte[`2`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].ziekte[`2`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].ziekte[`2`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].ziekte[`3`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].ziekte[`3`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].ziekte[`3`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].ziekte[`4`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].ziekte[`4`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].ziekte[`4`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].ziekte[`5`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].ziekte[`5`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].ziekte[`5`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].ziekte[`6`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].ziekte[`6`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].ziekte[`6`].aantalShifts),
                    (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].ziekte[`7`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].ziekte[`7`].aantalShifts + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].ziekte[`7`].aantalShifts)
                ])

                break;

            case "jaar":
                setValuesToShow([
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].ziekte.totaalUrenOpKalender + stats.maand[currVal].ziekte.urenUitVorigeMaand), 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].ziekte.totaalAantalShiften, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].ziekte[`1`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].ziekte[`2`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].ziekte[`3`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].ziekte[`4`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].ziekte[`5`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].ziekte[`6`].aantalShifts, 0),
                    Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].ziekte[`7`].aantalShifts, 0),
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

</React.Fragment>  )
}

export default ZiekteStats