export function PlyPropertyTypeToValue(type, input) {
    switch (type) {
        case "float":
            return parseFloat(input)

        default:
            return parseInt(input, 10)
    }
}
