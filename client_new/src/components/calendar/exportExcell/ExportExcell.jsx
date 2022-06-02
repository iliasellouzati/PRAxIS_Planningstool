import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mapShiftsFromDbToCalendar } from '../../../mappers/calendar/DatabaseToReduxMapper';
import { makeObjectForIndividualStats } from '../../../mappers/statistics/DatabaseToStatisticsMapper';
import LoadingSpinner from '../../general/LoadingSpinner';
import { makeMonthWorkSheet, makeOverzichtSheet } from './excelExportHelpers';
import * as XLSX from 'xlsx-js-style';

const ExportExcell = ({ setShowExportExcell, Shifttypes, Employees }) => {

  const { month, year } = useParams();

  const [YearlyStats, setYearlyStats] = useState([]);
  const [Loading, setLoading] = useState(true);



  const handleOnExport = async (e) => {

    e.preventDefault();
    let WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(WorkBook, makeOverzichtSheet(), `Overzicht ${year}`);

    for (let index = 1; index <= 12; index++) {

      const DBshifts = await axios.get(`http://localhost:3001/api/calendar/global/year/${year}/calendarmonth/${index}`);
      const employees = await axios.get(`http://127.0.0.1:3001/api/employee/calendaremployees/${year}/${index}`);
      const calendar = mapShiftsFromDbToCalendar(`${index}-${year}`, DBshifts.data, employees.data);


      XLSX.utils.book_append_sheet(WorkBook, makeMonthWorkSheet(`${index}-${year}`, YearlyStats, calendar, Shifttypes,Employees), `${moment(index, "MM").format('MMMM')}`);
      // XLSX.utils.book_append_sheet(WorkBook, makeMonthWorkSheet(`${index}-${year}`, YearlyStats,null), `${moment(index, "MM").format('MMMM')}`);


    }

    XLSX.writeFile(WorkBook, `PLANNING_${year}_EXPORTED_${moment().format('DD_MM_YYYY_HH_mm')}.xlsx`);
  }

  const fetchData = async () => {

    await axios.get(`http://localhost:3001/api/calendar/global/custom/${moment(`${year}`, 'YYYY').startOf('year').subtract(1, 'day').format("DD-MM-YYYY")}/${moment(`${month}-${year}`, "MM-YYYY").endOf('year').format('DD-MM-YYYY')}`)
      .then(response => setYearlyStats(makeObjectForIndividualStats(response.data, Shifttypes, year))).finally(setLoading(false));


  }


  useEffect(() => {
    fetchData();

    return () => {

    }
  }, [])


  return (
    <React.Fragment>
      {Loading ? <LoadingSpinner /> :
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>

          <div >
            ExportExcell
          </div>

          <div >
            <button onClick={() => setShowExportExcell(false)}>Keer terug</button>
          </div>

          <div >
            <button onClick={(e) => handleOnExport(e)}>export</button>
          </div>

        </div>}
    </React.Fragment>
  )
}

export default ExportExcell