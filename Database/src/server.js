const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./db');

const pilotFinalAccuracyRoutes = require('./routes/pilotFinalAccuracies');
const pilotImageAccuracyRoutes = require('./routes/pilotImageAccuracies');
const pilotImageConfidenceRoutes = require('./routes/pilotImageConfidences');
const userIdCheckRoutes = require('./routes/userIdCheck');
const calibrationRoutes = require('./routes/calibration');
const calibrationRoutes_10 = require('./routes/calibration_10');
const calibrationRoutes_10_B  = require('./routes/calibration_10_B');
const calibrationRoutes_10_B_NoF  = require('./routes/calibration_10_B_NoF');
const calibrationRoutes_10_NoF  = require('./routes/calibration_10_NoF');
const experimentRoutes = require('./routes/experiment');

const cors = require('cors');

const app = express();

// Middlewares
// app.use(cors());

// Set up CORS
app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"]
}));

app.use(bodyParser.json());

// Routes
app.use('/api/pilotFinalAccuracies', pilotFinalAccuracyRoutes);
app.use('/api/pilotImageAccuracies', pilotImageAccuracyRoutes);
app.use('/api/checkUserId', userIdCheckRoutes);
app.use('/api/pilotImageConfidences', pilotImageConfidenceRoutes);

app.use('/api/calibration', calibrationRoutes);
app.use('/api/calibration_10', calibrationRoutes_10);
app.use('/api/calibration_10_B', calibrationRoutes_10_B);
app.use('/api/calibration_10_B_NoF', calibrationRoutes_10_B_NoF);
app.use('/api/calibration_10_NoF', calibrationRoutes_10_NoF);
app.use('/api/experiment', experimentRoutes);

// Sync database and start the server
sequelize.sync()
    .then(result => {
        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log(`Server is up and running on port ${port}`);
        });
    })
    .catch(err => {
        console.log(err);
    });
