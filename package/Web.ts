import {Vec2} from "../lib/model/math/Vec2";
import {Vec3} from "../lib/model/math/Vec3";
import {Sprite} from "../lib/model/rendering/Sprite";
import {Surface} from "../lib/model/rendering/Surface";
import {SHIPP} from "../lib/model/SHIPP";
import {RGB, RGBA} from "../lib/model/RGB";
import {AssetLoader} from "../lib/model/AssetLoader";
import {Camera} from "../lib/model/interactive/Camera";
import {Projection} from "../lib/model/math/Projection";
import {Face3, Mesh} from "../lib/model/rendering/Mesh";
import {Room} from "../lib/model/interactive/Room";
import {RoomObject} from "../lib/model/interactive/RoomObject";

export const Oak = {
    Math: {
        Vec2: Vec2,
        Vec3: Vec3,
        SHIPP: SHIPP
    },
    Rendering: {
        Surface: Surface,
        Sprite: Sprite,
        Camera: Camera,
        Projection: Projection,
        Mesh: Mesh,
        Face3: Face3,
        Room: Room,
        RoomObject: RoomObject,
    },
    Color: {
        RGB: RGB,
        RGBA: RGBA
    },
    Utils: {
        AssetLoader: AssetLoader,
        Object: {
            rollup: function (object) {
                for (var i in object) {
                    if (typeof object[i] == "object") {
                        for (var x in object[i]) {
                            object[x] = object[i][x];
                        }
                        delete object[i];
                    }
                }
                return object;
            }
        },
        Array: {
            max: function (array) {
                let m;
                array.forEach(function (v) {
                    if (!m || v > m) {
                        m = v;
                    }
                });
                return m;
            },
            normalizeProperties(array, precision = 2) {
                let maxes = [];
                let output = [];
                array.forEach(function (item) {
                    for (var p in item) {
                        if (!maxes[p]) {
                            maxes[p] = [];
                        }
                        maxes[p].push(item[p]);
                    }
                });

                array.forEach(function (item) {
                    let i = {};
                    for (var p in item) {
                        if (isNaN(item[p])) {
                            i[p] = item[p];
                        } else {
                            i[p] = (item[p] / window['Oak'].Utils.Array.max(maxes[p])).toFixed(precision);
                        }
                    }
                    output.push(i);
                });

                return output;
            }
        },
        HTML: {
            arrayToTable(array, options?) {

                options = options || {};

                function getProps(obj) {
                    let props = [];
                    for (var propt in obj) {
                        props.push(propt);
                    }
                    return props;
                }

                let output = [];
                let headers = options.headers !== undefined ? options.headers : [];

                if (!!headers) {
                    array.forEach(function (obj) {
                        let props = getProps(obj);
                        props.forEach(function (prop) {
                            if (headers.indexOf(prop) == -1) {
                                headers.push(prop);
                            }
                        });
                    });
                }

                output.push(`<table class='${options.class || ""}'>`);

                if (headers.length) {

                    output.push("<tr>");
                    headers.forEach(function (header) {
                        output.push("<td><strong><em>");
                        output.push(header);
                        output.push("</em></strong></td>");
                    });
                    output.push("</tr>");

                    array.forEach(function (item) {
                        output.push("<tr>");
                        headers.forEach(function (header) {
                            output.push("<td>");
                            output.push(typeof item[header] === 'number' ? item[header].toFixed(2) : item[header]);

                            output.push("</td>");
                        });
                        output.push("</tr>");
                    });
                } else {

                    array.forEach(function (item) {
                        output.push("<tr>");
                        output.push("<td>");
                        output.push(typeof item === 'number' ? item.toFixed(options.toFixed !== undefined ? options.toFixed : 2) : item);
                        output.push("</td>");
                        output.push("</tr>");
                    });
                }

                output.push("</table>");


                return output.join('');
            }
        }
    }
};

window['Oak'] = Oak;