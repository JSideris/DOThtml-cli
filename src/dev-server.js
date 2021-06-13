const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
import fs from "fs";

const app = express();
const config = require("../webpack.config.js");
const compiler = webpack(config);

export default async function DevServer(port, path){
    port = Number(port)||3055;
    // app.use(express.static(path||"src"));
    // return new Promise((resolve, reject) => {
    //     app.listen(port, ()=>{
    //         console.log(`dothtml development server listening at http://localhost:${port}.`);
    //         resolve();
    //     });
    // });

    return new Promise((resolve, reject) => {
        app.use(
            webpackDevMiddleware(compiler, {
                publicPath: config.output.publicPath,
            })
        );
        app.listen(port, function () {
            console.log(`dothtml development server listening at http://localhost:${port}.`);
            resolve();
        });
    });
}



