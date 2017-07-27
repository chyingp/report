var express = require('express');
var router = express.Router();
var bunyan = require('bunyan');
var path = require('path');

// TODO 是否把CGI ERROR 打印到独立的文件里，方便统计错误数？
// 上报类型
var TYPE_CGI_SPEED = 'cgi_speed';
var TYPE_PAGE_SPEED = 'page_speed';
var TYPE_PAGE_VIEW = 'page_view';
var TYPE_DEFAULT = 'default';

// 日志文件名
var LOG_FILE_NAME_CGI_SPEED = 'cgi-speed.log';
var LOG_FILE_NAME_PAGE_SPEED = 'page-speed.log';
var LOG_FILE_NAME_PAGE_VIEW = 'page-view.log';
var LOG_FILE_NAME_DEFAULT = 'default.log';

var createLogger = function (type) {
    // var type = item.type;
    var filename;
    switch(type) {
        case TYPE_CGI_SPEED: filename = LOG_FILE_NAME_CGI_SPEED; break;
        case TYPE_PAGE_SPEED: filename = LOG_FILE_NAME_PAGE_SPEED; break;
        case TYPE_PAGE_VIEW: filename = LOG_FILE_NAME_PAGE_VIEW; break;
        default: filename = LOG_FILE_NAME_DEFAULT; break;
    }
    
    var logger = bunyan.createLogger({
        name: "myapp",
        streams: [{
            type: 'rotating-file',
            path: path.join(__dirname, '../logs/', filename),
            period: '1d',   // daily rotation
            count: 3        // keep 3 back copies
        }]
    });

    return logger;
};

var pageViewLogger = createLogger(TYPE_PAGE_VIEW);
var pageSpeedLogger = createLogger(TYPE_PAGE_SPEED);
var cgiSpeedLogger = createLogger(TYPE_CGI_SPEED);
var defaultLogger = createLogger(TYPE_DEFAULT);

var getLogger = function (type) {
    var logger;
    switch(type) {
        case TYPE_CGI_SPEED: logger = cgiSpeedLogger; break;
        case TYPE_PAGE_SPEED: logger = pageSpeedLogger; break;
        case TYPE_PAGE_VIEW: logger = pageViewLogger; break;
        default: filename = logger = defaultLogger; break;
    }
    return logger;
};

// 日志输出配置
// var logger = bunyan.createLogger({
//     name: "myapp",
//     streams: [{
//         type: 'rotating-file',
//         path: path.join(__dirname, '../logs/speed-report.log'),
//         period: '1d',   // daily rotation
//         count: 3        // keep 3 back copies
//     }]
// });

// TODO 上报过滤器 - P0
var filters = {
    'page_view': {},
    'cgi_speed': {},
    'page_speed': {}
};

// TODO 过滤无效的请求（比如恶意请求？）- P1
// TODO hostname 改成ip（结合nginx）- P1
// TODO 时间戳改成本地时间（当前用的是格林威治时间）- P1 -- done
// TODO 支持跨域 P1

var fmDate = function (date) {
    var arr = [
        date.getFullYear(), date.getMonth() + 1, date.getDate(), 
        date.getHours(), date.getMinutes(), date.getSeconds()
    ].map(function (s) {
        return s >= 10 ? '' + s : '0' + s;
    });
    return `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}:${arr[4]}`;
    // return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');    
};

var addReportRouter = function (req, res, next) {
    var opt = req.method === 'GET' ? req.query : req.body;
    opt.time = fmDate(new Date());

    var logger = getLogger(opt.type);
    logger.info(opt);

    res.end('ok');    
};

router.get('/add', addReportRouter);
router.get('/post', addReportRouter);

module.exports = router;