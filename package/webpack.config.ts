export default {
    entry: './tmp/package/Web.js',
    output: {
        libraryTarget: "var",
        filename: 'bin.oakframe.js'
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.html|.glsl|.ejs$/i,
                loader: 'raw-loader',
                options: {
                    esModule: true
                }
            }
        ],
    }
};