const { EventEmitter } = require('events');

const myEventEmitter = new EventEmitter();

const {
    requesting_real_resources,
    verify_resources,
    isFileType
} = require('../utils');

// 自定义中间件函数
const myMiddleware = async(req, res, next) => {
    // if (isFileType(req.url)) {
    const verify_data = verify_resources(req);
    if (verify_data) {
        next()
    } else {
        myEventEmitter.emit('message', await requesting_real_resources(req));
        next()
    }
    // } else {
    //   next()
    // }
};
module.exports = {
    myMiddleware,
    myEventEmitter
}
