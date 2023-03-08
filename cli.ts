#!/usr/bin/env ts-node

import path = require("path");
import {cwd} from 'process';

const fs = require("fs");

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
    case 'create':
        create(args);
        break;
    case 'run':
    case 'start':
    case 'build':
        console.log(run(cmd, args));
        break;

    case 'ip':
        require('dns').lookup(require('os').hostname(), function (err, add, fam) {
            console.log('addr: ' + add);
        });
        break;

    default:
        console.error(`oak: "${cmd}" is not a valid option.`);
        console.log(help(args));
        break;
}

function version(args?) {
    const version = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString()).version;
    return `Oak-Studio CLI v${version}`;
}

function help(args?) {
    let tabs = `                    `;
    return `Usage: oak [options]

Options:
help, -h              	                        display help information
version, -v                                     display Oak-Studio version
start <directory|file> <emulator>, -s           starts an Oak Studio project in an emulator (web|ios|android|osx|windows)
run <directory|file>, -r                        runs an Oak Studio project
build <directory>, -b	                        builds an Oak Studio project
deploy <directory|file> <cluster-fx:edge>, -d	deploys an Oak Studio project`;
}


function create(args?) {
    const version = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString()).version;
    //console.log(__dirname);
    //console.log(path.dirname(__filename));
    //console.log(`Current directory: ${cwd()}`);
    //console.log('args0', args);
    console.log(`Oak-Studio - Creating Project '${args[1]}'`);

    const source = `#!/usr/bin/env bash
OAK_DIR="${__dirname}"
PROJECT_DIR="${cwd()}"
PROJECT_NAME="${args[1]}"`;
    fs.writeFileSync(`${__dirname}/scripts/_config.sh`, source);

    const {exec} = require('child_process');
    var yourscript = exec(`cd ${__dirname}/scripts/ && sh create-project.sh`,
        (error, stdout, stderr) => {
        console.log(`Oak-Studio - Completed '${cwd()}/${args[1]}'`);
          //  console.log(stdout);
           // console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
                console.log(stdout);
                // console.log(stderr);
            }
        });

     return `Oak-Studio CLI v${version} CREATE PROJECT`;
}

function run(cmd, args?) {
    const version = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString()).version;
    if (cmd === "run") {
        let fileTest = args[1] || "./";
        let isFile = false;
        try {
            // Query the entry
            let stats = fs.lstatSync(fileTest);

            // Is it a directory?
            if (!stats.isDirectory()) {
                // Yes it is
                isFile = true;
            }
        } catch (e) {
            // ...
        }

        let existsTest = fs.existsSync(fileTest);
        if (!isFile && existsTest) {


        }
        console.log('existsSync', fileTest, existsTest);
    }
    return `Oak-Studio CLI v${version} RUN ${cmd}`;
}
