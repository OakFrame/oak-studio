import {Template} from "../Template";

const fs = require('fs');

export class StaticFileHandler {
    constructor() {
    }

    serveStaticRequest(req, res, data){
        console.log("serve", data.filename);
        if (fs.existsSync(data.filename)) {
            res.writeHead(data.status, {'Content-Type': `text/html`});
            res.end(
                (new Template(data.filename)).apply({
                    hostname: (process.env.SITE_URL || "localhost"),//+":"+(process.env.PORT || app.getPort()),
                    port: process.env.PORT || 80
                }), 'binary'
            );
        } else {
            console.error(`Unable to find ${data.filename}`);
            res.writeHead(500, {'Content-Type': `text/html`});
            res.end(
                (new Template(data.filename)).apply({
                    hostname: (process.env.SITE_URL || "localhost"),//+":"+(process.env.PORT || app.getPort()),
                    port: process.env.PORT || 80
                }), 'binary'
            );
        }
    }
}
