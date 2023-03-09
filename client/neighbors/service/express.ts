import {existsSync} from "fs";
import {Template} from "oak-studio/lib/model/Template";
import {StaticFileHandler} from "oak-studio/lib/model/endpoint/StaticFileHandler";

const fs = require('fs');
const ejs = require('ejs');
const bson = require('bson');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = parseInt(process.env.PORT) || 80;

const app = express();
const staticFileHandler = new StaticFileHandler();
require('express-ws')(app);
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');
app.use(express.static(`../client/dist`));

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({
    name: "_providerUUID",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(cors());
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.locals.environment = process.env.ENVIRONMENT || "development";
    next();
});

app.ws('*', async function (ws, req) { //route for checking user login
    //check for valid login

    //    socketClientsManager.add(ws, req); ///  TODO THIS

    ws.on('message', async (msg) => {
        //

        console.log(msg);

    });

});


const mimeTypes = {
    'ico': 'image/x-icon',
    'html': 'text/html',
    'js': 'text/javascript',
    'json': 'application/json',
    'css': 'text/css',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'wav': 'audio/wav',
    'mp3': 'audio/mpeg',
    'avi': 'video/avi',
    'mp4': 'video/mp4',
    'mov': 'video/mov',
    'webm': 'audio/webm',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'eot': 'appliaction/vnd.ms-fontobject',
    'ttf': 'x-font/ttf',
    'gif': 'image/gif',
    'manifest': 'text/cache-manifest'
};


app.get(/^([a-zA-Z0-9-/_)]+).(html|css|png|jpg|js|json|svg|mp3|wav|oft|ttf|gif|ico|manifest)/, function (req, res, next) {

    let filename = `../client/maag${req.params[0]}.${req.params[1]}`;

    if (fs.existsSync(filename)) {
        req.writeHead(200, {'Content-Type': mimeTypes[req.params[1]]});
        req.end(
            (new Template(filename)).apply({
                hostname: process.env.SITE_URL || app.getHostname(),
                port: process.env.SITE_PORT || app.getPort()
            }), 'binary'
        );
        //    resolve();
    } else {
        console.error('console lookup failed', filename);
        next();
    }
});


app.get('/', function (req, res) {
    staticFileHandler.serveStaticRequest(req, res, {
        filename: `../client/dist/app.html`,
        status: 200,
        headers: {'Content-Type': `text/html`}
    });
});


app.get('/?:page/?:folder/?:file', function (req, res) {
    let filename = `../client/dist/${req.params.page || ""}`;
    res.writeHead(200, {'Content-Type': `text/html`});

    if (existsSync(filename)) {
        res.end(
            (new Template(filename)).apply({
                hostname: (process.env.SITE_URL || "localhost"),//+":"+(process.env.PORT || app.getPort()),
                port: process.env.PORT || app.getPort()
            }), 'binary'
        );
    } else {
        console.error(`Unable to find AA ${filename}`);
        filename = `../client/dist/app.html`;
        res.end(
            (new Template(filename)).apply({
                hostname: (process.env.SITE_URL || "localhost"),//+":"+(process.env.PORT || app.getPort()),
                port: process.env.PORT || app.getPort()
            }), 'binary'
        );
    }
});

app.get('*', function (req, res) {
    console.log('A');
    staticFileHandler.serveStaticRequest(req, res, {
        filename: `../client/dist/app.html`,
        status: 404,
        headers: {'Content-Type': `text/html`}
    });
});


const server = app.listen(PORT, () => {
    console.log(`App up on port ${PORT}`);
});
