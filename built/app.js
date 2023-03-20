#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var io_js_1 = require("./io.js");
var pwdCracker_ts_1 = require("./pwdCracker.ts");
var state = {
    ON: true,
    OFF: false
};
var currentState = state.ON;
if (!currentState)
    process.exit(0);
var io = new io_js_1.TerminalInterface();
io.start();
io.chat('Welcome to PWD Cracker');
var urlDomain = await io.prompt('URL Domain: ');
var pwd = await io.prompt('Password: ');
await (0, pwdCracker_ts_1.keepPassword)(urlDomain, pwd);
io.stop();
currentState = state.OFF;
