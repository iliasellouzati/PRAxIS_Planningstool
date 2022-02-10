import express from 'express';
import employeeRoute from './routes/employeeRoute.js';
import expressStatusMonitor  from 'express-status-monitor';



const app = express();

app.use(expressStatusMonitor());
app.use(express.json());
app.use('/api/employee',employeeRoute);




app.get('/', (req, res) => {
    
    res.send('Server is ready');
});


app.listen(3001, () => {
    console.log('server is started at http://localhost:3001');
})