"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const { WP_PUBLIC_KEY, WP_PRIVATE_KEY } = process.env;
const webPush = require("web-push");
webPush.setVapidDetails("mailto:service.mascotapp@gmail.com", WP_PUBLIC_KEY, WP_PRIVATE_KEY);
exports.default = webPush;
