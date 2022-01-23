import express from 'express';
import shifttypeRoute from './routes/shifttypeRoute.js';
import werknemerRoute from './routes/werknemerRoute.js';
import overzichtRoute from './routes/overzichtRoute.js';
import calendarRoute from './routes/calendarRoute.js';
import rapportenRoute from './routes/rapportenRoute.js';
import contractRoute  from './routes/contractRoute.js';
import weekstructuurRoute from './routes/weekstructuurRoute.js';



const app = express();

app.use(express.json());
app.use('/api/shifttypes',shifttypeRoute);
app.use('/api/werknemers',werknemerRoute);
app.use('/api/contract',contractRoute);
app.use('/api/Planning', calendarRoute);
app.use('/api/overzicht', overzichtRoute );
app.use('/api/rapporten', rapportenRoute);
app.use('/api/weekstructuur',weekstructuurRoute);


app.get('/', (req, res) => {
    
    res.send('Server is ready');
});


app.listen(3001, () => {
    console.log('server is started at http://localhost:3001');
})