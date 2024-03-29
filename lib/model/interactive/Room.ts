import {RoomObject} from "./RoomObject";
import {Vec3} from "../math/Vec3";
import { Camera } from "./Camera";
import { TextField } from "../graph/TextField";

export class Room {
    private name: string;
    private objects: Array<RoomObject>;
    private position: Vec3;
    private size: Vec3;

    constructor(room?: Room) {
        let self = this;
        this.name = "Default Room";
        this.objects = [];
        this.position = new Vec3();
        this.size = new Vec3();
        this.size.x = 16;
        this.size.y = 8;

        if (room) {
            this.name = room.name;
            this.position.copy(room.position);
            this.size.copy(room.size);
            room.objects.forEach(function (ob) {
                self.objects.push(new RoomObject(ob));
            })
        }
    }

    public getName() {
        return this.name;
    }

    public getSize() {
       return this.size;
    }

    public setName(name) {
        this.name = name;
    }

    public getObjects() {
        return this.objects;
    }

    public addObject(ob: RoomObject) {
        this.objects.push(ob);
    }

    public createObject(ob?: RoomObject) {
        this.objects.push(new RoomObject(ob));
    }

    public findItems(tag) {
        let i = [];
        this.objects.forEach(function (e) {
            if (e.getTags().indexOf(tag) !== -1) {
                i.push(e);
            }
        });
        return i;
    }
    objectAtPosition(x, y, dist= 1, tags){
        let ob = null;
        for (var index = 0; index < this.objects.length; index++) {
            //_v1.x = this.objects[index].position.x;
            //this.objects[index].depth = _v1.dist(this.objects[index].position);

            let check_v = new Vec3();
            check_v.set(x,y,0);

            if (this.objects[index].getTags().indexOf('solid') !== -1 && check_v.dist(this.objects[index].getPosition()) < dist){
                return this.objects[index];

            }
            /*if (
                this.objects[index].getPosition().x - this.objects[index].getScale().x < x &&
                this.objects[index].getScale().x + this.objects[index].getPosition().x > x &&
                this.objects[index].getPosition().y - this.objects[index].getScale().y < y &&
                this.objects[index].getScale().y + this.objects[index].getPosition().y > y
            ){
               return this.objects[index];
            }*/
        }

        if (ob){
          //  this.surface.getContext().beginPath();
           // this.surface.getContext().rect(lower_x, lower_y, upper_x - lower_x, upper_y - lower_y);
            //this.surface.getContext().stroke();
        }
        return ob;
    }


    depthSort(camera?:Camera) {


        if (camera) {
            let _v1 = new Vec3();
            _v1.copy(camera.from);
            _v1.y = 9999;
            for (var index = 0; index < this.objects.length; index++) {
                _v1.x = this.objects[index].position.x;
                this.objects[index].depth = _v1.dist(this.objects[index].position);
                if (this.objects[index].decal) {
                    this.objects[index].depth += 1000000;
                    this.objects[index].depth += (this.objects[index].scale.mag());
                }
            }
        }else{
            for (var index = 0; index < this.objects.length; index++) {
                //_v1.x = this.objects[index].position.x;
                this.objects[index].depth = -this.objects[index].position.y;
                if (this.objects[index].decal) {
                    this.objects[index].depth -= 1000000;
                    this.objects[index].depth += (this.objects[index].scale.mag());
                }
            }
        }
        var loop = true;
        var times = 0;

        do {
            loop = false;

            for (var i = 0; i < this.objects.length - (1); i++) {

                if (this.objects[i].depth < this.objects[i + 1].depth) {
                    var val = null;
                    val = this.objects[i];
                    this.objects[i] = this.objects[i + 1];
                    this.objects[i + 1] = val;
                    loop = true;
                }

            }
            times++;
        } while (loop);
    }

    update(){

    }

    getElement() {
        let form = document.createElement('div');
        let name = new TextField(this.name,"Room Name");
        name.subscribe('update', (v) => {
            this.name = v;
        });

        form.appendChild(name.getElement());

        return form;
    }

}
