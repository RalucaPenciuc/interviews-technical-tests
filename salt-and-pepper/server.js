const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Character = require('./api/models/CharacterModels');
const routes = require('./api/routes/CharacterRoutes');
  
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/GoTDB', { useNewUrlParser: true }); 

app.set('json spaces', 5);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

app.use((req, res, next) => {
    const error = new Error("Invalid url");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status = error.status || 500;
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(port);

console.log('GoT RESTful API server started on: ' + port);