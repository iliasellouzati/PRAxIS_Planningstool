import React from 'react'

const OperatorStats = ({HulpVal3, Stats}) => {
  return (
    <React.Fragment>
      <thead >
        <tr >
          <th style={{ padding: "1px", width: "10%" }}>#Uren/maand</th>
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
      <tbody>
        <tr>
          <td style={{ padding: "1px", width: "10%" }}>{Math.round((Stats.operator.totaalUrenOpKalender + Stats.operator.nachtUrenUitVorigeMaand) * 100) / 100}</td>
          <td style={{ padding: "1px", width: "10%" }}>{Math.round(Stats.operator.totaalAantalShiften * 100) / 100}</td>
          {HulpVal3.map(day =>
            <td style={{ padding: "0px", width: "10%" }}>
              <p style={{ padding: '0px', margin: '0px' }}>{Math.round(Stats.operator[`${day}`].aantalUren * 100) / 100} uur</p>
              <p style={{ padding: '0px', margin: '0px' }}>{Stats.operator[`${day}`].aantalShifts} shiften</p>
              <p style={{ padding: '0px', margin: '0px' }}><b>{Math.round(Stats.operator[`${day}`].aantalUren * 10000 / (Stats.operator.totaalUrenOpKalender + Stats.operator.nachtUrenUitVorigeMaand)) / 100}</b>%</p>
            </td>
          )}

          <td style={{ padding: "1px", width: "10%" }}>x </td>


        </tr>

      </tbody>
    </React.Fragment>
  )
}

export default OperatorStats