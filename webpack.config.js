const path = require("path");
import HtmlWebpackPlugin from "html-webpack-plugin";
// import htmlLoader from "html-loader";

module.exports = {
    mode: "development",
    entry: {
        index: "./src/index.js",
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Development",
            
        }),
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
        publicPath: "/",
    },
    // module: {
    //     rules: [
    //         {
    //             test: /\.html$/i,
    //             loader: "html-loader",
    //         },
    //     ],
    // }
};