require('dotenv').config()
const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
const os = require('os')
const cluster = require('cluster')
const cpus = os.cpus()
const controllersdb = require('./database/database')
const argv = require('./config/yargs')

const iscluster = process.argv[3] == "cluster";
const app = express();
require('./passport/passport');



app.set('views', path.join(__dirname, './views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './views')))



app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'SecretJose',
  resave: false,
  saveUninitialized: false,
  rolling: true


}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.user = req.user;
  next();
});


if (iscluster && cluster.isPrimary) {
  cpus.map(() => {
    cluster.fork();
  });

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);

    cluster.fork();
  });
} else {
  app.use("/", rutas);
  
  controllersdb.conectarDB(process.env.URL, (err) => {
    if (err) return console.log("error en conexión de base de datos", err);
    console.log("BASE DE DATOS CONECTADA");
  })

  app.listen(PORT, () => {
    console.log("Server listening port 8084 server 4");
  });
}





