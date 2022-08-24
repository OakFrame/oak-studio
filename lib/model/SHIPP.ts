import {Vec2} from "./math/Vec2";
import {ErosionDrop} from "./shipp/ErosionDrop";

function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t
}

export function getDistance(x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;

    return Math.sqrt(x * x + y * y);
}

export  interface SHIPPOptionsInterface {
    map?:any[];
    width: number;
    height: number;
}

export class SHIPP<T> {

    private map: any[];
    private width: number;
    private height: number;

    constructor(shipp?:any) {
        this.map = [];
        this.width = Math.floor(32);
        this.height = Math.floor(32);
        if (shipp) {
            this.width = Math.floor(shipp.width);
            this.height = Math.floor(shipp.height);
            if (shipp.map) {
                this.map = shipp.map;
            } else {
                for (let i = 0; i < this.width * this.height; i++) {
                    this.map[i] = 0;
                }
            }
        } else {
            for (let i = 0; i < this.width * this.height; i++) {
                this.map[i] = 0;
            }
        }

    }

    erode(c: number) {

        let drop = new ErosionDrop();
        for (let i = 0; i < c; i++) {

            for (let x = 0; x < this.getWidth(); x++) {
                for (let y = 0; y < this.getHeight(); y++) {
                    drop.position.set(Math.random() * this.getWidth(), Math.random() * this.getHeight());
                    for (let z = 0; z < 500; z++) {
                        drop.simulate(this);
                        if (z > 100 && drop.velocity.mag() < 0.001) {
                            break;
                        }
                    }
                    drop.end(this);
                }
            }

        }
    }

    add(b) {
        for (let i = 0; i < b.getMap().length; i++) {
            this.map[i] += b.map[i];
        }
    }

    getMap() {
        return this.map;
    }

    getDimensionalMap() {
        let m = [];
        for (let i = 0; i < this.height; i++) {
            m.push(this.map.slice(this.width * i, this.width * (i + 1)));
        }
        return m;
    }
    toJSON():SHIPPOptionsInterface{
        return {
            map:this.map,
            width:this.width,
            height:this.height
        }
    }
    blur(amt) {
        if (amt == 0) {
            return;
        }
        let m = new SHIPP(this.toJSON());

        for (let x = 0; x <= this.getWidth(); x++) {
            for (let y = 0; y <= this.getHeight(); y++) {

                let v = 0;
                let samples = 0;
                let pool = [];
                let total_influence = 0;

                for (let ix = -amt; ix <= amt; ix++) {
                    for (let iy = -amt; iy <= amt; iy++) {
                        let inf = (amt * 1.45) - getDistance(0, 0, Math.abs(ix), Math.abs(iy));
                        if (inf <= amt * 1.45) {
                            total_influence += inf;
                            pool.push({
                                inf: inf,
                                value: this.getPosition(x + ix, y + iy)
                            })
                        }
                    }
                }

                let acc = 0;

                pool.forEach((sample) => {
                    acc += sample.value * (sample.inf / total_influence)
                })

                m.setPosition(x, y, acc)

            }
        }

        // m.normalize();

        this.setMap(m.getMap().concat());
        return this;
    }

    run(fn) {
        let self = this;
        let tmp = new SHIPP(this.toJSON());
        this.map.forEach(function (m, i) {
            let x = (i) % self.width;
            let y = (i / self.width) | 0;
            tmp.map[i] = fn(m, x, y);
        });
        this.map = tmp.map;
        return this;
    }

    regionContains(tag, x1, y1, x2, y2) {
        let cnt = 0;
        let ttl = 0;
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                ttl++;
                if (this.getPosition(x, y) == tag) {
                    cnt++;
                }
            }
        }
        return cnt / ttl;
    }

    setMap(m: Array<any>) {
        this.map = m;
        return this;
    }

    setPosition(x, y, value) {
        x = (x + (this.width * 100000000)) % this.width;
        y = (y + (this.height * 100000000)) % this.height;
        this.map[(x | 0) + ((y | 0) * this.width)] = value;
        return this;
    }

    getPosition(x, y) {
        x = (x + (this.width * 100000000)) % this.width;
        y = (y + (this.height * 100000000)) % this.height;
        return this.map[(x | 0) + ((y | 0) * this.width)];
    }

    overlay(map) {
        let self = this;
        map.getMap().forEach(function (m, i) {
            if (m) {
                self.map[i] = m;
            }
        });
        return this;
    }

    growClusters(tag, size, lin, fn?) {
        let f = fn || function (value, x, y) {
            return tag;
        };
        let temp = new SHIPP(this.toJSON());
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.regionContains(tag, x - size, y - size, x + size, y + size)) {
                    if (Math.random() < lin) {
                        temp.setPosition(x, y, (this.getPosition(x, y) === tag) ? (tag) : f(this.getPosition(x, y), x, y));
                    }
                }
            }
        }
        this.overlay(temp);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    replace(search, replace) {
        let self = this;
        this.map.forEach(function (e, i) {
            if (e == search) {
                self.map[i] = replace;
            }
        })
    }

    renderHTML(options?) {
        if (!options) {
            options = {
                attr: "",
                transform: (value) => {
                    if (typeof value === 'number') {
                        let v = Math.floor(value * 255);
                        return [v, v, v];
                    }
                    let rgb = [0, 0, 0];
                    switch ((value + "").toLowerCase()) {
                        case 'f':
                            rgb = [254, 214, 255];
                            break;
                        case 'r':
                            rgb = [160, 160, 160];
                            break;
                        case 't':
                            rgb = [109, 175, 99];
                            break;
                        case 'd':
                            rgb = [247, 240, 203];
                            break;
                        case 'w':
                            rgb = [190, 236, 253];
                            break;
                        default:
                            rgb = [139, 230, 125];
                            break;
                    }
                    return rgb;
                }
            }
        }
        let table = "";
        table += `<table ${options.attr || ""}>`;

        this.getDimensionalMap().forEach(function (row) {
            table += "<tr>";
            row.forEach(function (col) {
                let rgb = [255, 255, 255];
                if (!isNaN(col)) {
                    rgb = [255 - (col * 255) | 0, 255 - (col * 255) | 0, 255 - (col * 255) | 0];
                }

                rgb = options.transform(col);
                table += `<td style='background-color:rgb(${rgb.join(",")})'>`;//style='background-color:rgb(${rgb.join(",")})'


                //table += col;
                // table += isNaN(col)?col:"&nbsp;";

                table += "</td>";
            });
            table += "</tr>";
        });

        table += "</table>";
        return table;
    }

    walkLine(x1, y1, x2, y2, value) {
        let v = new Vec2().set(x1, y1);
        let v2 = new Vec2().set(x2, y2);

        let dir = v.pointTo(v2).mulI(-1).toRad();
        let dist = v.set(x1, y1).dist(v2);

        for (let p2 = 1; p2 < dist; p2 += 0.5) {
            let dx = x1 + ((Math.sin(dir)) * p2) | 0;
            let dy = y1 + ((Math.cos(dir)) * p2) | 0;
            this.setPosition(dx, dy, value);
        }

    }

    placeCluster(x, y, width, height, value, real = 1) {
        let dox = x;// Math.floor((this.width * Math.random()) - width); //Math.floor(Math.random() * (( - (width * 2)) + width));
        let doy = y;// + Math.floor((this.height * Math.random()) - height);

        for (let oix = dox; oix < x + width; oix += 1) {

            for (let oiy = doy; oiy < y + height; oiy += 1) {

                // if (real >= Math.random()) {

              //  let x = (oix + this.width) % this.width;
              //  let y = (oiy + this.height) % this.height;

                this.setPosition(oix, oiy, value);
            }
            //  y

            // }

        }
    }

    selectPortion(x, y, width, height) {
        let map = new SHIPP({width: width, height: height});
        for (let ix = 0; ix < width; ix++) {
            for (let iy = 0; iy < height; iy++) {
                map.setPosition(ix, iy, this.getPosition(x + ix, y + iy))
            }
        }
        return map;
    }

    placeMap(map: SHIPP<any>, x, y) {
        for (let ix = 0; ix < map.getWidth(); ix++) {
            for (let iy = 0; iy < map.getHeight(); iy++) {
                this.setPosition(x + ix, y + iy, map.getPosition(ix, iy))
            }
        }
    }

    normalize() {
        let m = -1000000000;
        let u = 99999999999;
        this.map.forEach(function (v) {
            m = Math.max(m, v);
            u = Math.min(u, v);
        });
        u = Math.abs(u);

        for (let i = 0; i < this.map.length; i++) {

            this.map[i] = Math.max(0, (this.map[i] - u) / (m - u));
        }
    }


    multiply2(b) {
        let a = this.getDimensionalMap();
        b = b.getDimensionalMap();
        var aNumRows = a.length, aNumCols = a[0].length,
            bNumRows = b.length, bNumCols = b[0].length,
            m = new Array(aNumRows);  // initialize array of rows
        for (var r = 0; r < aNumRows; ++r) {
            m[r] = new Array(bNumCols); // initialize the current row
            for (var c = 0; c < bNumCols; ++c) {
                m[r][c] = 0;             // initialize the current cell
                for (var i = 0; i < aNumCols; ++i) {
                    m[r][c] += this.map[r][i] * b[i][c];
                }
            }
        }
        this.map = m;
    }

    multiply3(m2) {
        let m1 = this.getDimensionalMap();
        m2 = m2.getDimensionalMap();
        console.log(m1, m2);
        var result = [];
        for (var i = 0; i < m1.length; i++) {
            result[i] = [];
            for (var j = 0; j < m2[0].length; j++) {
                var sum = 0;
                for (var k = 0; k < m1[0].length; k++) {
                    sum += m1[i][k] * m2[k][j];
                }
                result[i][j] = sum;
            }
        }
        this.map = result;

    }

    multiply4(_b) {
        // Multiplies two matrices mat1[][]
// and mat2[][] and prints result.
// (m1) x (m2) and (n1) x (n2) are
// dimensions of given matrices.
        let res = [];
        let a = this.getDimensionalMap();
        let b = _b.getDimensionalMap();
        for (let i = 0; i < this.getWidth(); i++) {
            res[i] = [];
            for (let j = 0; j < _b.getHeight(); j++) {
                res[i][j] = 0;
                for (let x = 0; x < this.getHeight(); x++) {
                    res[i][j] += this.getPosition(i, x) *
                        _b.getPosition(x, j)
                }
            }
        }
        for (let i = 0; i < this.getWidth(); i++) {
            for (let j = 0; j < _b.getHeight(); j++) {
                //echo $res[$i][$j] . " ";
            }
            // echo "\n";
        }
        console.log("a", res);
        let m = [];
        res.forEach(function (row) {
            m = m.concat(row);
        })
        this.map = m;

    }

    multiply(b) {
        let a = this;

        let w = a.getWidth();
        let h = a.getHeight();

        let f = new SHIPP({width: w, height: h});

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {

                let cellaw = ((x + 0) / w) * a.getWidth();
                let cellah = ((y + 0) / h) * a.getHeight();
                let va1 = a.getPosition(cellaw, cellah);
                //let va2 = a.getPosition(cellaw + 1, cellah);
                //let pctw = (x % a.getWidth()) / a.getWidth();
                //let va = lerp(va1, va2, pctw);

                let cellbw = ((x + 0) / w) * b.getWidth();
                let cellbh = ((y + 0) / h) * b.getHeight();
                let vb1 = b.getPosition(cellbw, cellbh);
                // let vb2 = b.getPosition(cellbw, cellbh + 1);
                // let pcth = (y % a.getHeight()) / a.getHeight();
                // let vb = lerp(vb1, vb2, pcth);

                f.setPosition(x, y, va1 * vb1);

            }
        }

        this.width = w;
        this.height = h;
        this.map = f.getMap();


    }

    addWide = (b) => {
        let a = this;

        let w = this.getWidth();
        let h = this.getHeight();

        let f = new SHIPP({width: w, height: h});

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {

                let cellaw = ((x + 0) / w) * a.getWidth();
                let cellah = ((y + 0) / h) * a.getHeight();
                let va1 = a.getPosition(cellaw, cellah);
                //let va2 = a.getPosition(cellaw + 1, cellah);
                //let pctw = (x % a.getWidth()) / a.getWidth();
                //let va = lerp(va1, va2, pctw);

                let cellbw = ((x + 0) / w) * b.getWidth();
                let cellbh = ((y + 0) / h) * b.getHeight();
                let vb1 = b.getPosition(cellbw, cellbh);
                // let vb2 = b.getPosition(cellbw, cellbh + 1);
                // let pcth = (y % a.getHeight()) / a.getHeight();
                // let vb = lerp(vb1, vb2, pcth);

                f.setPosition(x, y, va1 + vb1);

            }
        }

        // this.width = w;
        // this.height = h;
        //this.map = f.getMap();
        return f;

    }


}
