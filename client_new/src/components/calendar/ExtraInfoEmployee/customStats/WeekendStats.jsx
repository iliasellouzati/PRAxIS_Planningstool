import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const WeekendStats = ({ SelectedValue, stats }) => {

  const { year } = useParams();

  const [ValuesToShow, setValuesToShow] = useState("");

  useEffect(() => {
    switch (SelectedValue[0]) {
      case "maand":
        setValuesToShow([
          (
            stats.maand[`${SelectedValue[1]}`].weekends.volledig_vrij.length +
            stats.maand[`${SelectedValue[1]}`].weekends.gepland_met_standby.length +
            stats.maand[`${SelectedValue[1]}`].weekends.gepland_met_shifts.length
          ),
          stats.maand[`${SelectedValue[1]}`].weekends.volledig_vrij.length,
          stats.maand[`${SelectedValue[1]}`].weekends.gepland_met_standby.length,
          stats.maand[`${SelectedValue[1]}`].weekends.gepland_met_shifts.length
        ])
        break;
      case "kwartaal":
        setValuesToShow([
          (
            stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].weekends.volledig_vrij.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].weekends.volledig_vrij.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].weekends.volledig_vrij.length +
            stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].weekends.gepland_met_standby.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].weekends.gepland_met_standby.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].weekends.gepland_met_standby.length +
            stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].weekends.gepland_met_shifts.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].weekends.gepland_met_shifts.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].weekends.gepland_met_shifts.length
          ),

          (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].weekends.volledig_vrij.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].weekends.volledig_vrij.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].weekends.volledig_vrij.length),
          (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].weekends.gepland_met_standby.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].weekends.gepland_met_standby.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].weekends.gepland_met_standby.length),
          (stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 1)).slice(-2)}-${year}`].weekends.gepland_met_shifts.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 2)).slice(-2)}-${year}`].weekends.gepland_met_shifts.length + stats.maand[`${('0' + (parseInt(SelectedValue[1]) * 3 + 3)).slice(-2)}-${year}`].weekends.gepland_met_shifts.length)
        ])

        break;

      case "jaar":
        setValuesToShow([
          Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].weekends.volledig_vrij.length + stats.maand[currVal].weekends.gepland_met_standby.length + stats.maand[currVal].weekends.gepland_met_shifts.length),0),
          Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].weekends.volledig_vrij.length, 0),
          Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].weekends.gepland_met_standby.length, 0),
          Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].weekends.gepland_met_shifts.length, 0),
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
            <th style={{ padding: "1px", width: "25%" }} >
              <div >#Weekends</div>
            </th>
            <th style={{ padding: "1px", width: "25%" }}>Volledig vrij</th>
            <th style={{ padding: "1px", width: "25%" }}>Ingepland met SB</th>
            <th style={{ padding: "1px", width: "25%" }}>Ingepland met Shift(en)</th>
          </tr>
        </thead>
        <tbody>{ValuesToShow !== "" &&
          <tr>
            <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[0]}</td>
            <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[1]}</td>
            <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[2]}</td>
            <td rowSpan={2} style={{ padding: "1px", width: "10%" }}>{ValuesToShow[3]}</td>
          </tr>
        }
        </tbody>
      </table>

    </React.Fragment>
  )
}

export default WeekendStats