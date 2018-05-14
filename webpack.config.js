const path = require("path");

const BUILD_DIR = path.join(__dirname, "public");
const APP_DIR = path.join(__dirname, "client");

const config = {
    entry: path.join(APP_DIR + "/Main.jsx"),
    output: {
        path: BUILD_DIR,
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                }
            }
        ]
    }
};

module.exports = config;