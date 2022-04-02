import express from 'express';
import expressStatusMonitor from 'express-status-monitor';
import monitorConfig from './helpers/monitor_config.js';
import cors from "cors";


import employeeRoute from './routes/employeeRoute.js';
import shifttypeRoute from './routes/shifttypeRoute.js';
import contracttypeRoute from './routes/contracttypeRoute.js';
import weeklystructureRoute from './routes/weeklystructureRoute.js';
import calendarRoute from './routes/calendarRoute.js';
import statusCalendarRoute from './routes/statusCalendarRoute.js';



const app = express();

app.use(cors());
app.use(expressStatusMonitor(monitorConfig));


app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));

app.use((req, res, next) => {
    console.log(`API WAS HIT: ${req.method} on  ${req.protocol}://${req.get('host')}${req.originalUrl} `);
    return next();
});



app.use('/api/calendar', calendarRoute);
app.use('/api/weeklystructure', weeklystructureRoute);
app.use('/api/contracttype', contracttypeRoute);
app.use('/api/employee', employeeRoute);
app.use('/api/shifttype', shifttypeRoute);
app.use('/api/statuscalendar',statusCalendarRoute);



app.get('/', (req, res) => {

    res.send('Server is ready');
});



app.listen(3001, () => {
    console.log('server is started at http://localhost:3001');
})