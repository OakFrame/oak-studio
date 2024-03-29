Oak Studio
======
Serverless, Microservices and Client Based Application Platform based on Express

Try our online demos & documentation: https://oakframe.org/documentation/

Installing
------
Ensure your paths are set correctly
/etc/paths `~/.npm-global/bin` \
These steps will install ts-node ,typescript, mocha and chai globally `-g`. \
`npm install -g ts-node` \
`npm install -g typescript` \
`npm install mocha chai ts-node -g` \
`npm install mocha chai ts-node --save-dev` \
`npm install @types/node @types/chai @types/mocha --save-dev` \
`npm install webpack webpack-cli -g` \

Building
------
Ensure that your permissions are correct for executing scripts\
`chmod -R +x ./scripts/`\
\
The build process involves typescript compilation, google closure compilation, and concatenation and copying of resource files.\
`./scripts/build.sh`

Mocha Chai Test Suite
------
`npm run test` \
`./scripts/test.sh` \
or something like this if that doesn't work\
`node /usr/local/lib/node_modules/mocha/bin/_mocha -r ts-node/register --ui bdd */**/*.spec.ts`

There are some demos available (deprecated)
------
Web Server `./demo/http/HTTPServer.ts` \
Socket Server `./demo/http/SocketServer.ts`
---
MIT License \
With love, from OakFrame
