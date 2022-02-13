import express from 'express';
import expressStatusMonitor from 'express-status-monitor';
import monitorConfig from './helpers/monitor_config.js';
import cors from "cors";

import employeeRoute from './routes/employeeRoute.js';
import shifttypeRoute from './routes/shifttypeRoute.js';


const app = express();

app.use(cors());
app.use(expressStatusMonitor(monitorConfig));
app.use(express.json());
app.use( (req, res, next)=> {
    console.log(`API WAS HIT: ${req.method} on  ${req.protocol}://${req.get('host')}${req.originalUrl} `);
    return next();
});
app.use('/api/employee', employeeRoute);
app.use('/api/shifttype', shifttypeRoute);





app.get('/', (req, res) => {

    res.send('Server is ready');
});


app.listen(3001, () => {
    console.log('server is started at http://localhost:3001');
})