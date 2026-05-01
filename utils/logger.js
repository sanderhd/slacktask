function time() {
    return new Date().toISOString();
}

function log(message) {
    console.log(`[${time()}] [LOG] ${message}`);
};

function error(message) {
    console.log(`[${time()}] [ERROR] ${message}`);
};

function warn(message) {
    console.log(`[${time()}] [WARN] ${message}`);
};

module.exports = {
    time,
    log,
    error,
    warn,
};