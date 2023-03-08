export function arrayToTable(array, options?) {

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

    output.push(`<div class='table-helper'><div class='table-inner'><table class='${options.class || ""}'>`);

    if (headers.length) {

        output.push("<tr>");
        headers.forEach(function (header) {
            output.push("<th><div><strong><em>");
            output.push(header);
            output.push("</em></strong></div></th>");
        });
        output.push("</tr>");

        array.forEach(function (item) {
            output.push("<tr>");
            headers.forEach(function (header) {
                output.push("<td><div>");
                output.push(typeof item[header] === 'number' ? item[header].toFixed(2) : item[header]);

                output.push("</div></td>");
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

    output.push("</table></div></div>");


    return output.join('');
}
