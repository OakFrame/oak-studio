import {Vec3} from "../math/Vec3";
import {Sprite} from "../rendering/Sprite";
import {Component, HasComponent} from "./Component";
import {Mesh} from "../rendering/Mesh";
import {GameEventEmitter} from "./GameEvent";

export class RoomObject {
    private _tmp: number;
    public position: Vec3;
    public scale;
    public velocity;
    private game_object: number;
    public name;
    public depth;
    public decal: boolean;
    public mesh: Mesh;
    public path;
    public actions;
    public tags;
    public action;
    public bark;
    public timeline_index;
    public timeline;
    public task_manager;
    public entity_behavior;
    public sprite: Sprite;
    public rand: number = Math.random();
    public primary_color?: string;
    public components: Component[];
    public eventEmitter: GameEventEmitter;

    constructor(object?: RoomObject) {

        this.name = 'Default Object';
        this.position = new Vec3();
        this.scale = new Vec3();
        this.scale.set(1, 1, 1);
        this.velocity = new Vec3();
        this.game_object = null;

        this.decal = false;
        this.mesh = null;
        this.depth = 0;
        this.path = new Vec3();
        this.actions = [];
        this.tags = [];
        this.bark = "";
        this.action = null;
        this.timeline_index = 0;
        this.timeline = null;
        this.components = [];
        this.eventEmitter = new GameEventEmitter();
        //  this.task_manager = new TaskManager();
        //  this.entity_behavior = new EntityBehavior();

        this._tmp = (Math.random() * 1000000000) | 0;
        if (object) {
            // this.task_manager = object.task_manager||new TaskManager();
            //this.entity_behavior = object.entity_behavior||new EntityBehavior();
            this.bark = object.bark || "";
            this.action = object.action || null;
            this.actions = object.actions || [];
            this.decal = object.decal || false;
            this.mesh = object.mesh;
            this._tmp = object._tmp;
            this.tags = object.tags || [];
            this.name = object.name;
            this.timeline = object.timeline || null;
            this.components = object.components || [];
            object.position ? this.position.copy(object.position) : 0;
            object.scale ? this.scale.copy(object.scale) : 0;
            object.game_object ? (this.game_object = parseInt("" + object.game_object)) : 0;
            object.sprite ? (this.sprite = object.sprite) : null;
        }
    }

    setSprite(sprite) {
        this.sprite = sprite;
    }
    getBounds(){
        return [];
    }

    getTags() {
        return this.tags;
    }

    getSprite() {
        return this.sprite;
    }

    public getId() {
        return this._tmp;
    }

    public setNextInteraction(interaction) {
        this.task_manager.setNextInteraction(interaction);
    }

    public getBehavior() {
        return this.entity_behavior;
    }

    public getName() {
        return this.name;
    }

    public getPosition() {
        return this.position;
    }

    /* public render(state: any, updateCB?: any) {
          let self = this;
          let elem = document.createElement('div');

          let name_controls = new FormField({
              type: "text",
              placeholder: "Object Name",
              value: this.name,
              state: state
          }, function (n) {
              self.name = n;
              if (updateCB) {
                  updateCB()
              }
          });

          let object_controls = new FormField({
              type: "object",
              placeholder: "Object",
              value: this.game_object,
              state: state
          }, function (n) {
              self.game_object = n;
              if (updateCB) {
                  updateCB()
              }

              console.log('selected', n);
          });

          let position_controls = new FormField({
              type: "position",
              placeholder: "Position",
              value: this.position, state: state
          }, function (n) {
              self.position = n;
              if (updateCB) {
                  updateCB()
              }

          });

          let scale_controls = new FormField({
              type: "position",
              placeholder: "Scale",
              value: this.scale,
              min: 0.1,
              max: 20,
              step: 0.1, state: state
          }, function (n) {
              self.scale = n;
              if (updateCB) {
                  updateCB()
              }

          });


          elem.appendChild(name_controls.getElement());
          elem.appendChild(object_controls.getElement());

          elem.appendChild(position_controls.getElement());
          elem.appendChild(scale_controls.getElement());
         // elem.appendChild(image_controls.getElement());

          return elem;
      }
      */

    getBark() {
        return this.bark;
    }

    getScale() {
        return this.scale;
    }

    getTimelineEvent() {
        if (!this.timeline) {
            return false;
        }
        return this.timeline.getEvents()[this.timeline_index];
    }

    getTaskManager() {
        return this.task_manager;
    }

    addComponent(component: Component) {
        this.components.push(component);
    }

    getComponents(): Component[] {
        return this.components;
    }

    runComponents(): void {

        this.components.forEach((component) => {
            component.update(this);
        });
    }

    on(key, fn) {
        return this.eventEmitter.on(key, fn);
    }

    publish(key, data) {
        return this.eventEmitter.publish(key, data);
    }


}
