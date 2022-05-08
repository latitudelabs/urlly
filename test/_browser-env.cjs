const browserEnv = require("browser-env");

browserEnv(["window", "location", "history"]);
// mock window.location
delete window.location
window.location = {
    href: '',
};

// mock window.history
delete window.history
window.history = {
    pushState: () => {},
    replaceState: () => {},
};

