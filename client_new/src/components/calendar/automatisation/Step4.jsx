/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'

const Step4 = ({ setStep, setLogaritme, Logaritme }) => {



  return (
    <div className="row">
      <div className="col-9">
        <p>Voorlopig is er maar 1 logaritme:</p>
        <div className="row">
          <div className="col-6">

            <div class="form-group">
              <label class="htmlForm-check-label" for="MinWeeks">Selecteer minimaal aantal weken tussen omschakelingen</label>
              <input class="form-control" id="MinWeeks" type={'number'} min={0} max={10} value={Logaritme["data"].minWeeks}
                onChange={(e) => { let logg = { ...Logaritme }; logg['data'].minWeeks = e.target.value; setLogaritme(logg); }} style={{ width: '100px' }} />
              <p style={{ margin: 0 }}>vb. 0: er kan na 1 dagweek direct een nachtweek komen</p>
              <p style={{ margin: 0 }}>vb. 1: er kan pas na 2 dagweken een nachtweek komen</p>
              <p style={{ margin: 0 }}>vb. 2: er kan pas na 3 dagweken een nachtweek komen</p>
              <p style={{ margin: 0 }}>Hetzelfde geld voor nachtweek naar dagweek</p>
              <p style={{ margin: 0 }}>Aangeraden: 3+</p>

            </div>

          </div>
          <div className="col-6">

            <div class="form-group">
              <label class="htmlForm-check-label" for="MaxWeeks">Selecteer maximaal aantal weken tussen omschakelingen</label>
              <input class="form-control" id="MaxWeeks" type={'number'} min={0} max={10} value={Logaritme["data"].maxWeeks}
                onChange={(e) => { let logg = { ...Logaritme }; logg['data'].maxWeeks = e.target.value; setLogaritme(logg); }} style={{ width: '100px' }} />
              <p style={{ margin: 0 }}>vb. 3: er kunnen maximaal 3 opeenvolgende dagweken zijn</p>
              <p style={{ margin: 0 }}>vb. 4: er kunnen maximaal 4 opeenvolgende dagweken zijn</p>
              <p style={{ margin: 0 }}>Hetzelfde geld voor nachtweek naar dagweek</p>
              <p style={{ margin: 0 }}>Aangeraden: 5+</p>
              
            </div>

          </div>

        </div>

      </div>
      <div className="col-3">
        <div className="card">
          <div className="card-header">
            Overzicht:
          </div>
          <div className="card-body">


            <div className="d-flex" style={{ justifyContent: 'space-around' }}>
              <button type="button" className="btn btn-warning" onClick={() => setStep(2)} >Vorige stap</button>

              <button type="button" className="btn btn-success" onClick={() => setStep(4)} >Volgende stap</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step4