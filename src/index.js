import DevServer from "./dev-server";
import {exec} from "child_process";
import fs from "fs";
import path from "path";
import opn from "opn";

// Templates
// import indexTemplate from "./templates/index-html";
// import mainJsTemplate from "./templates/index-js";
import indexJsTemplate from "./templates/index-js";
// import webpackConfigTemplate from "./templates/webpack.config-js";

const cc = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fgBlack: "\x1b[30m",
    fgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    fgYellow: "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgMagenta: "\x1b[35m",
    fgCyan: "\x1b[36m",
    fgWhite: "\x1b[37m",

    fgBrightBlack: "\x1b[90m",
    fgBrightRed: "\x1b[91m",
    FgBrightGreen: "\x1b[92m",
    fgBrightYellow: "\x1b[93m",
    fgBrightBlue: "\x1b[94m",
    fgBrightMagenta: "\x1b[95m",
    fgBrightCyan: "\x1b[96m",
    fgBrightWhite: "\x1b[97m",

    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m"
}

export async function cli(args) {
    if(args.length <= 2){
        printUsage();
    }
    else{
        let cmd = args[2].toLowerCase();
        switch(cmd){
            case "help":{
                printUsage(args[3]);
                break;
            }
            case "init":{
                // First, let's try to determine whether we should be creating a new folder, or just throwing an error.

                let name = args[3];
                
                if(name){
                    printError("Named projects aren't supported yet. Just create an empty folder and do dothtml init.");
                    return;
                    
                    // // Create a folder with this name, go into it, and create the directory structure.
                    // if(fs.existsSync("package.json")){
                    //     printError("Cannot initialize a named package while inside of an existing module. Remove package.json, or switch folders.");
                    //     return;
                    // }
                    // if(fs.existsSync(name)){
                    //     printError("A file or folder with the given name already exists.");
                    //     return;
                    // }
                    // fs.mkdirSync(name);
                    // fs.mkdirSync(path.join(name, "src"));
                    // // fs.openSync(path.join(name, "src", "index.html"));
                    // fs.writeFileSync(path.join(name, "src", "index.html"), template)
                    // await runCmd(`cd ${name}`);
                    // await runCmd(`npm init --yes`);
                    // await runCmd(`npm i dothtml`);
                    // await runCmd(`npm i require`);
                    // //runCmd(`cd ..`);
                    

                }
                else{
                    
                    if(!fs.existsSync("package.json")){
                        await runCmd(`npm init --yes`);
                    }

                    await runCmd(`npm install dothtml`);
                    
                    
                    // await runCmd(`npm install --save-dev html-loader`);
                    // await runCmd(`npm install --save-dev webpack-cli`);
                    // await runCmd(`npm install --save-dev webpack`);
                    // await runCmd(`npm install --save-dev webpack-dev-server`);
                    // await runCmd(`npm install --save-dev html-webpack-plugin`);

                    // if(!fs.existsSync("webpack.config.js")){
                    //     fs.writeFileSync("webpack.config.js", webpackConfigTemplate());
                    // }

                    fs.mkdirSync("src");
                    fs.mkdirSync(path.join("src", "components"));
                    // fs.writeFileSync(path.join("src", "index.html"), indexTemplate());
                    //fs.writeFileSync(path.join("src", "index.js"), indexJsTemplate());
                    fs.writeFileSync(path.join("src", "index.js"), indexJsTemplate());

                    // Configure package.json.
                    let packageJson = JSON.parse(fs.readFileSync("package.json").toString("utf-8"));
                    if(!packageJson.scripts) packageJson.scripts = {};
                    packageJson.scripts.serve = "dothtml serve";
                    packageJson.scripts.build = "dothtml build";
                    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
                }

                
                break;
            }
            case "serve":{
                //await runCmd(`npx webpack --watch`);
                await DevServer();
                opn("http://localhost:3055");
                break;
            }
            case "build":{
                await runCmd(`webpack`);
                break;
            }
            default: {
                printUsage();
            }
        }
    }
}

async function runCmd(cmd){
    return new Promise((resolve, reject)=>{

        console.log(`${cc.fgBrightBlue}${cmd}${cc.reset}`);

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                printError(`error: ${error.message}`);
                reject(error.message);
                return;
            }
            if (stderr) {
                printError(`${stderr}`, 2);
                // reject(stderr); // Npm uses stderr for warnings.......
            }
            console.log(`${stdout}`);
            resolve();
        });

    });
}

function printUsage(cmd){
    switch((cmd||"").toLowerCase()){
        case "help":{
            printTitle("HELP");
            console.log(" Prints detailed usage information.");
            console.log(` For advanced usage and arguments, use '${cc.fgBrightMagenta}dothtml ${cc.fgBrightWhite}help ${cc.fgYellow}command${cc.reset}' where ${cc.fgYellow}command${cc.reset} is the command you want details on.`);
            console.log(" For additional help, visit https://dothtml.org/.");
            break;
        }
        case "init":{
            printTitle("INIT");
            console.log(" Initializes a new dothtml project.");
            console.log(" Use this .");
            console.log("");
            console.log(" Arguments:");
            console.log(" name                - The name of the project. Required.");
            console.log("");
            console.log(" Example:");
            console.log(" dothtml init my-project");
            break;
        }
        case "build":{
            printTitle("BUILD");
            console.log(" Initializes a new dothtml project.");
            console.log("");
            console.log(" Arguments:");
            console.log(" -d                  - Builds in develop mode. Non-minified code.");
            console.log(" -o                  - Output file name. Default 'index.html'.");
            break;
        }
        case "serve":{
            printTitle("SERVE");
            console.log(" Serves a live version of the project for development.");
            break;
        }
        default: {
            printTitle("USAGE");
            printCommand("help", "cmd", "Help and documentation on the specified command.");
            printCommand("init","", "Initializes a new dothtml project.");
            printCommand("serve","","Serves a live version of the project for development.");
            printCommand("build","","Builds the app to a static output output file.");
            console.log(`For details on arguments, use '${cc.fgBrightMagenta}dothtml ${cc.fgBrightWhite}help ${cc.fgYellow}cmd${cc.reset}' where ${cc.fgYellow}cmd${cc.reset} is the command you want details on.`);
            break;
        }
    }
}

function printTitle(txt){
    console.log(` ${cc.fgBrightBlue}${txt.toUpperCase()}`);
    let underline = "";
    for(let i in txt){
        underline += "=";
    }
    console.log(` ${underline}${cc.reset}`);
}

function printCommand(command, args, description){
    let spaces = "                    ".substring(0, 20 - command.length);
    let line = ` ${cc.fgBrightMagenta}dothtml ${cc.fgBrightWhite}${command.toLowerCase()}${cc.fgBrightBlack}${spaces}- ${description}${cc.reset}`;
    console.log(line);
}

function printError(msg, level = 3){
    let color = {1: cc.fgBrightBlack, 2: cc.fgYellow, 3: cc.fgRed}[level] || cc.fgRed;
    console.error(`${color}${msg}${cc.reset}`);
}