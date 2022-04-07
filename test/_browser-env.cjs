const browserEnv = require("browser-env");

browserEnv(["window", "location"]);
// mock window.location
delete window.location
window.location = {
    href: '',
};

