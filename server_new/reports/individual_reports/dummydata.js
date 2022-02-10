const dummy = {

  employeeId: 1,
  calendarMonth: "10-2021",
  aantalUurInKwartaal: 24,
  voornaam: "Ilias",
  familienaam: "Ellouzati",
  employeeCalendar: [
    {
      day: '27-09-2021',
      shift: ''
    },
    {
      day: '28-09-2021',
      shift: '1806'
    },
    {
      day: '29-09-2021',
      shift: '1806'
    },
    {
      day: '30-09-2021',
      shift: ''
    },
    {
      day: '01-10-2021',
      shift: ''
    },
    {
      day: '02-10-2021',
      shift: '0618'
    },
    {
      day: '03-10-2021',
      shift: '0618'
    },
    {
      day: '04-10-2021',
      shift: '1907'
    },
    {
      day: '05-10-2021',
      shift: ''
    },
    {
      day: '06-10-2021',
      shift: 'standby'
    },
    {
      day: '07-10-2021',
      shift: ''
    },
    {
      day: '08-10-2021',
      shift: '1907'
    },
    {
      day: '09-10-2021',
      shift: '1907'
    },
    {
      day: '10-10-2021',
      shift: '1907'
    },
    {
      day: '11-10-2021',
      shift: ''
    },
    {
      day: '12-10-2021',
      shift: '1907'
    },
    {
      day: '13-10-2021',
      shift: '1907'
    },
    {
      day: '14-10-2021',
      shift: '1907'
    },
    {
      day: '15-10-2021',
      shift: ''
    },
    {
      day: '16-10-2021',
      shift: ''
    },
    {
      day: '17-10-2021',
      shift: 'standby'
    },
    {
      day: '18-10-2021',
      shift: '1907'
    },
    {
      day: '19-10-2021',
      shift: '1907'
    },
    {
      day: '20-10-2021',
      shift: ''
    },
    {
      day: '21-10-2021',
      shift: '1907'
    },
    {
      day: '22-10-2021',
      shift: ''
    },
    {
      day: '23-10-2021',
      shift: ''
    },
    {
      day: '24-10-2021',
      shift: 'standby'
    },
    {
      day: '25-10-2021',
      shift: ''
    },
    {
      day: '26-10-2021',
      shift: 'standby'
    },
    {
      day: '27-10-2021',
      shift: '1907'
    },
    {
      day: '28-10-2021',
      shift: '1907'
    },
    {
      day: '29-10-2021',
      shift: ''
    },
    {
      day: '30-10-2021',
      shift: ''
    },
    {
      day: '31-10-2021',
      shift: ''
    }
  ]
}

const shifts = [

  {
    naam: '0618',
    beginuur: '06:00',
    einduur: '18:00',
    vaste_uren: null,
    kleurcode: '#5452ff',
    verplicht: true
  },

  {
    naam: '0719',
    beginuur: '07:00',
    einduur: '19:00',
    vaste_uren: '',
    kleurcode: '#ffa200',
    verplicht: true
  },

  {
    naam: '1806',
    beginuur: '18:00',
    einduur: '06:00',
    vaste_uren: null,
    kleurcode: '#00ff1e',
    verplicht: true
  },

  {
    naam: '1907',
    beginuur: '19:00',
    einduur: '07:00',
    vaste_uren: null,
    kleurcode: '#ffff00',
    verplicht: true
  },

  {
    naam: 'Coopman 8u',
    beginuur: '08:00',
    einduur: '16:00',
    vaste_uren: '',
    kleurcode: '#d9d9d9',
    verplicht: false
  },

  {
    naam: 'standby',
    beginuur: null,
    einduur: null,
    vaste_uren: '00:00',
    kleurcode: '#03ffbb',
    verplicht: true
  }


]

export { dummy, shifts }