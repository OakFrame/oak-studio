#!/usr/bin/env bash
tsc --p tsconfig.json
webpack
#npx google-closure-compiler --js=./dist/bundle.js --js_output_file=./dist/bundle.min.js -O ADVANCED -W QUIET --language_out ECMASCRIPT_2018
cp ./dist/bundle.js ./dist/bundle.min.js
sass ./style/style.scss ./style/style.css
cp ./style/style.css ./dist/style.css
rm ./dist/bundle.js
rm ./app.js
rm ./app.js.map
find ./model -type f -name '*.js' -delete
find ./model -type f -name '*.js.map' -delete
find ./view -type f -name '*.js' -delete
find ./view -type f -name '*.js.map' -delete
find ./controller -type f -name '*.js' -delete
find ./controller -type f -name '*.js.map' -delete
find ./style -type f -name '*.css' -delete
find ./style -type f -name '*.css.map' -delete
