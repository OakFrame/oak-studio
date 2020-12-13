import {Vec2} from "../math/Vec2";

export function SVGConnectionGenerator(element_a, element_b){
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('width', '600');
    svg.setAttribute('height', '250');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    let attach_point_a = new Vec2();
    let attach_point_b = new Vec2();attach_point_b.x = element_b.offsetX;attach_point_b.y = element_b.offsetY;
    let control_point_a = (new Vec2()).copy(attach_point_a);control_point_a.x += 25;
    let control_point_b = (new Vec2()).copy(attach_point_b);control_point_b.x -= 25;

    path.setAttribute('d', `M${attach_point_a.x},${attach_point_a.y} C${control_point_a.x},${control_point_a.y} ${control_point_b.x},${control_point_b.y} ${attach_point_b.x},${attach_point_b.y}`);
    path.setAttribute('fill', 'none');


    svg.appendChild(path);
    return svg;
}