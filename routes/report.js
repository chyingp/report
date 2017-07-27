var express = require('express');
var router = express.Router();
var bunyan = require('bunyan');
var path = require('path');

// 日志输出配置
var logger = bunyan.createLogger({
    name: "myapp",
    streams: [{
        type: 'rotating-file',
        path: path.join(__dirname, '../logs/speed-report.log'),
        period: '1d',   // daily rotation
        count: 3        // keep 3 back copies
    }]
});

// TODO 上报过滤器 - P0
var filters = {
    'page_view': {},
    'cgi_speed': {},
    'page_speed': {}
};

// TODO 过滤无效的请求（比如恶意请求？）- P1

// TODO hostname 改成ip（结合nginx）- P1

// TODO 时间戳改成本地时间（当前用的是格林威治时间）- P1 -- done

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

var addSpeedRouter = function (req, res, next) {
    var opt = req.method === 'GET' ? req.query : req.body;
    opt.time = fmDate(new Date());
    logger.info(opt);
    res.end('ok');    
};

router.get('/add', addSpeedRouter);
router.get('/post', addSpeedRouter);

module.exports = router;