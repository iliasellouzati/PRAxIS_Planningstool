import React, { useEffect } from 'react'

const Step5 = ({ setStep, createConfigFile, Config }) => {


  useEffect(() => {

    createConfigFile();

  }, [])

  return (
    <div className="row">
      <div className="col-9">
        {Config.length !== 0 &&
          <React.Fragment>
            <p>Aantal werknemers te bepalen: <b>{Config.employeesSelectedIDs.length}</b></p>
            <p>Aantal geselecteerde filters: <b>{Config.filters.length}</b></p>
            <p>Aantal weken te bepalen: <b>{Config.selectedWeeks.length}</b></p>
            <p>Minimaal <b>{Config.logaritme.data.minWeeks}</b> en maximaal <b>{Config.logaritme.data.maxWeeks}</b> weken tussen omschakelingen </p>



          </React.Fragment>}

      </div>
      <div className="col-3">
        <div className="card">
          <div className="card-header">
            Overzicht:
          </div>
          <div className="card-body" style={{ textAlign: 'center', minHeight:'250px' }}>

            <div className="d-flex" style={{ justifyContent: 'space-around' }}>
              <button type="button" className="btn btn-warning" onClick={() => setStep(3)} >Vorige stap</button>

              <button type="button" className="btn btn-success" onClick={() => setStep(5)} >Start</button>



            </div>
            <b style={{ marginTop: '10px' }}>OPGELET:</b>
            <p style={{ margin: '0px', color: 'red' }}>Gelieve geen andere planningen te openen tot het einde!</p>
            <p style={{ margin: '0px', color: 'red' }} >Gelieve de pagina niet te herladen</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step5