const queue = [];

function addQueue(req, res, func) {
    res.write('');
    const user = req.clientIp + '_' + req.fingerprint.hash;
    queue[user] = { req, res, func };
}

function processQueue() {
    const queueKeys = Object.keys(queue);
    if (queueKeys.length == 0) return;
    const firstKey = queueKeys[0];
    const currentQueue = queue[firstKey];
    try { currentQueue.func(currentQueue.req, currentQueue.res, (output) => {
        currentQueue.res.write(output);
        currentQueue.res.end();
    }); } catch (e) { console.error("Server Error:", e) }
    delete queue[firstKey];
}

setInterval(processQueue, 2000);

module.exports = {
    addQueue
}