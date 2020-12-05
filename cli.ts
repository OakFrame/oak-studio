#!/usr/bin/env ts-node

import * as fs from "fs";

const args = (process.argv.slice(2));
let cmd = args[0] || 'help';

if (cmd === "-v") {
    cmd = 'version';
}

if (cmd === "-h") {
    cmd = 'help';
}

switch (cmd) {
    case 'version':
        console.log(version(args));
        break;

    case 'help':
        console.log(help(args));
        break;

    case 'ip':
        require('dns').lookup(require('os').hostname(), function (err, add, fam) {
            console.log('addr: ' + add);
        });
        break;

    default:
        console.error(`Oak: "${cmd}" is not a valid option.`);
        console.log(help(args));
        break;
}

function version(args?) {
    const version = JSON.parse(fs.readFileSync('package.json').toString()).version
    return `Oak-Studio CLI v${version}`;
}

function help(args?) {
    return "Usage: oak [options]\n\nOptions:\nhelp, -h\t\t\tdisplay help information\nversion, -v\t\t\tdisplay oak-studio version";
}