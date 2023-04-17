const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/auth");
//HELL

const app = express();
app.disable('x-powered-by');
// - Body Parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

//log request
app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next();
});



app.use(routes);

app.listen(3000, () => console.log("Auth Server started at port : 3000"));

module.exports = app;