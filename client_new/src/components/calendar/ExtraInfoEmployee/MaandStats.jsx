import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const MaandStats = ({ stats }) => {
  const { month, year } = useParams();

  const [Selected, setSelected] = useState(month);
  const [Stats, setStats] = useState(false);
  const [Details, setDetails] = useState('operator');

  let HulpVal = [['01', '02', '03'], ['04', '05', '06'], ['07', '08', '09'], ['10', '11', '12']]
  let HulpVal2 = [['operator', 'Mario'], ['cumul', 'dag/nacht'], ['ziekte/verlof', 'stand-by']]
  let HulpVal3 = ['1', '2', '3', '4', '5', '6', '7']
  const over = (e) => {
    e.target.style.backgroundColor = "#A9A9A9";


  }
  const out = (e) => {
    e.target.style.backgroundColor = "#E5E4E2";
  }

  useEffect(() => {
    if (stats !== null) {
      setStats(stats[`${Selected}-${year}`])
    }


  }, [Selected])



  return (
    <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', padding: "0px", height: '100%' }}>

      <div style={{ width: '4%', height: '100%', display: "flex", flexDirection: 'column', justifyContent: 'space-around', cursor: 'pointer' }}>

        {HulpVal.map(row =>

          <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around', padding: "0px", height: "25%" }}>
            <div onMouseOver={Selected !== row[0] ? over : ''} onMouseOut={Selected !== row[0] ? out : ""} style={Selected === row[0] ? { outline: "1px solid black", backgroundColor: '#00FF00', fontWeight: 'Bold', width: "33%", height: "100%", margin: '0px' } : { outline: "1px solid black", backgroundColor: '#E5E4E2', width: "33%", height: "100%", margin: '0px' }} onClick={() => setSelected(row[0])}>
              {row[0]}
            </div>
            <div onMouseOver={Selected !== row[1] ? over : ''} onMouseOut={Selected !== row[1] ? out : ""} style={Selected === row[1] ? { outline: "1px solid black", backgroundColor: '#00FF00', fontWeight: 'Bold', width: "33%", height: "100%", margin: '0px' } : { outline: "1px solid black", backgroundColor: '#E5E4E2', width: "33%", height: "100%", margin: '0px' }} onClick={() => setSelected(row[1])}>
              {row[1]}
            </div>
            <div onMouseOver={Selected !== row[2] ? over : ''} onMouseOut={Selected !== row[2] ? out : ""} style={Selected === row[2] ? { outline: "1px solid black", backgroundColor: '#00FF00', fontWeight: 'Bold', width: "33%", height: "100%", margin: '0px' } : { outline: "1px solid black", backgroundColor: '#E5E4E2', width: "33%", height: "100%", margin: '0px' }} onClick={() => setSelected(row[2])}>
              {row[2]}
            </div>
          </div>
        )}

      </div>
      <div style={{ width: '10%', height: '100%', display: "flex", flexDirection: 'column', justifyContent: 'space-around', cursor: 'pointer', zIndex: 10 }}>

        {HulpVal2.map(row =>

          <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around', padding: "0px", height: "33%" }}>
            <div onMouseOver={Details !== row[0] ? over : ''} onMouseOut={Details !== row[0] ? out : ""} style={Details === row[0] ? { outline: "1px solid black", backgroundColor: '#00FF00', width: "50%", height: "100%", margin: '0px' } : { outline: "1px solid black", backgroundColor: '#E5E4E2', width: "50%", height: "100%", margin: '0px' }} onClick={() => setDetails(row[0])}>
              {row[0]}
            </div>
            <div onMouseOver={Details !== row[1] ? over : ''} onMouseOut={Details !== row[1] ? out : ""} style={Details === row[1] ? { outline: "1px solid black", backgroundColor: '#00FF00', width: "50%", height: "100%", margin: '0px' } : { outline: "1px solid black", backgroundColor: '#E5E4E2', width: "50%", height: "100%", margin: '0px' }} onClick={() => setDetails(row[1])}>
              {row[1]}
            </div>
          </div>
        )}

      </div>

      <div style={{ width: "86%", height: '100%', display: "flex", justifyContent: "space-around" }}>
        {Stats ?
          <table style={{ width: '100%', height: '100%', zIndex: 0, textAlign: 'center' }} >
            {
              {
                'operator':
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
                        <td style={{ padding: "1px", width: "10%" }}>{Math.round((Stats.operator.totaalUrenOpKalender + Stats.operator.nachtUrenUitVorigeMaand)*100)/100}</td>
                        <td style={{ padding: "1px", width: "10%" }}>{Math.round(Stats.operator.totaalAantalShiften*100)/100}</td>
                        {HulpVal3.map(day => 
                          <td style={{ padding: "0px", width: "10%" }}>
                            <p style={{ padding: '0px', margin: '0px' }}>{Math.round(Stats.operator[`${day}`].aantalUren *100)/100} uur</p>
                            <p style={{ padding: '0px', margin: '0px' }}>{Stats.operator[`${day}`].aantalShifts} shiften</p>
                            <p style={{ padding: '0px', margin: '0px' }}><b>{Math.round(Stats.operator[`${day}`].aantalUren * 10000 / (Stats.operator.totaalUrenOpKalender + Stats.operator.nachtUrenUitVorigeMaand)) / 100}</b>%</p>
                          </td>
                        )}

                        <td style={{ padding: "1px", width: "10%" }}>x </td>


                      </tr>

                    </tbody>
                  </React.Fragment>,
                'Mario': <p>custom</p>,
                'cumul': <p>Cumul</p>,
                'dag/nacht': <p>Dag en  nacht</p>,
                'ziekte/verlof': <p>ziekte und verloff</p>,
                'stand-by': <p>standby</p>

              }[Details]
            }
          </table> :
          <p>Niet beschikbaar</p>}
      </div>



    </div>
  )
}

export default MaandStats