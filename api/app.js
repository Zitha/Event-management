const express = require("express");
const mongoose = require('mongoose');
const app = express(); 
const cors = require('cors');
const routes = require('./routes/routes');
const restify = require('restify');
const Sentry = require("@sentry/node");
//const SentryTracing = require('@sentry/tracing');   
//const Integrations = require("@sentry/tracing");

const port = 4000;   
//Create LOGGER

/*
const { Sentry } = require('vod-npm-sentry');
const { createLogger, traceIdMiddleware } = require('vod-npm-console-logger');
const LOGGER = createLogger({
  name: 'vod-api-domain-poc',
  level: 'debug'
});

const app = restify.createServer({
  log: LOGGER
}); */

//SET UP SENTRY
//SentryTracing.addExtensionMethods();
Sentry.init({ 
  dsn: "https://a2edf325e49378b23fc49a88ed1c9783@o185340.ingest.sentry.io/4505668616519680",
  environment:'LOCAL',
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production! 
  //integrations: [ 
  //  new Integrations.Express() 
  //]
});
app.use(Sentry.Handlers.requestHandler()); 
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler()); 

//CORS
const corsOptions = {  origin: "http://localhost:3000", }; 

app.use(cors(corsOptions)); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

//SET UP EVENT 
app.use('/api', routes)

mongoose.connect('mongodb://127.0.0.1:27017/CustomerDb')
.then(() => {
  app.listen(port);
  console.log(`Running a API server at http://localhost:${port}`);
})
.catch(err => {
  console.log(err);
}); 