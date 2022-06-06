import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mapShiftsFromDbToCalendar } from '../../mappers/calendar/DatabaseToReduxMapper';
import { makeObjectForIndividualStats } from '../../mappers/statistics/DatabaseToStatisticsMapper';
import LoadingSpinner from '../general/LoadingSpinner';
import { makeMonthWorkSheet, makeOverzichtSheet } from './excelExportHelpers';
import * as XLSX from 'xlsx-js-style';

const ExportExcell = () => {

  const { year } = useParams();

  const [YearlyStats, setYearlyStats] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Employees, setEmployees] = useState([])
  const [Shifttypes, setShifttypes] = useState([]);
  const [MouseHovering, setMouseHovering] = useState(false);
  const [InProgress, setInProgress] = useState(false);
  const [Holidays, setHolidays] = useState([]);
  const handleOnExport = async (e) => {


    e.preventDefault();

    setInProgress(true);

    let WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(WorkBook, makeOverzichtSheet(), `Overzicht ${year}`);

    for (let index = 1; index <= 12; index++) {

      let month = ('0' + index).slice(-2);

      const DBshifts = await axios.get(`http://localhost:3001/api/calendar/global/year/${year}/calendarmonth/${month}`);
      const employees = await axios.get(`http://127.0.0.1:3001/api/employee/calendaremployees/${year}/${month}`);
      const calendar = mapShiftsFromDbToCalendar(`${month}-${year}`, DBshifts.data, employees.data);


      XLSX.utils.book_append_sheet(WorkBook, makeMonthWorkSheet(`${month}-${year}`, YearlyStats, calendar, Shifttypes, Employees, Holidays), `${moment(month, "MM").format('MMMM')}`);
    }

    XLSX.writeFile(WorkBook, `PLANNING_${year}_EXPORTED_${moment().format('DD_MM_YYYY_HH_mm')}.xlsx`);
    setInProgress(false);
  }

  const fetchData = async () => {

    let ST = [];
    await axios.get(`http://127.0.0.1:3001/api/holiday/custom/year/${year}`)
    .then(response => setHolidays(response.data));
    await axios.get('http://127.0.0.1:3001/api/shifttype')
      .then(response => { setShifttypes(response.data); ST = response.data; });
    await axios.get('http://127.0.0.1:3001/api/employee')
      .then(response => { setEmployees(response.data); })
    await axios.get(`http://localhost:3001/api/calendar/global/custom/${moment(`${year}`, 'YYYY').startOf('year').subtract(1, 'day').format("DD-MM-YYYY")}/${moment(`${year}`, "YYYY").endOf('year').format('DD-MM-YYYY')}`)
      .then(response => setYearlyStats(makeObjectForIndividualStats(response.data, ST, year))).finally(setLoading(false));
  }


  useEffect(() => {
    fetchData();

    return () => {

    }
  }, [year])



  return (
    <React.Fragment>
      {Loading ? <LoadingSpinner /> :

        <div style={{ display: 'flex', justifyContent: 'center' }}>

          {InProgress ?

            <div class="btn btn-app" style={{ backgroundColor: "#df0024", color: '#FFFFFF' }} >
              Even Geduld
            </div>
            :
            <div class="btn btn-app" onMouseOver={() => setMouseHovering(true)} onMouseOut={() => setMouseHovering(false)} onClick={(e) => handleOnExport(e)} style={MouseHovering ? { outline: '3px solid black', fontWeight: 'bold', backgroundColor: "#df0024", color: '#FFFFFF' } : { backgroundColor: "#df0024", color: '#FFFFFF' }} >
              <i class="fas fa-save"></i> Exporteer {year}
            </div>
          }

        </div>

      }
    </React.Fragment>
  )
}

export default ExportExcell