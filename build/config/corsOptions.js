"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: [
        "https://mascotapp.vercel.app",
        "http://localhost:3000",
        "http://localhost:3000/home",
        "https://checkout.stripe.com",
        "https://dev-nxuk8wmn.us.auth0.com",
        "http://localhost:3001",
    ],
    headers: "*",
    methods: "*",
    credentials: true,
};
