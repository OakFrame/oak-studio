module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.js'
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.html|.glsl|.ply|.ejs$/i,
                loader: 'raw-loader',
                options: {
                    esModule: true
                }
            }
        ],
    }
};
