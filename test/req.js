var request = require('request');

// 网页测速
function pageSpeed () {
    var opt = {
        method: 'GET',
        uri: 'http://127.0.0.1:3000/report/add',
        qs: {
            proj_id: '1',
            type: 'page_speed',
            sid: 'index',
            url: '/oc/v/index.html',
            cost: 1000
        }
    };

    request(opt, function (error, response) {
        if(error) {
            throw error;
        }else {
            console.log(response.body);
        }
    });
}

// pv/uv上报
function pageView () {
    var opt = {
        method: 'GET',
        uri: 'http://127.0.0.1:3000/report/add',
        qs: {
            proj_id: '1',
            type: 'page_view',
            url: '/oc/v/index.html',
            uid: '10086'
        }
    };

    request(opt, function (error, response) {
        if(error) {
            throw error;
        }else {
            console.log(response.body);
        }
    });
}

// CGI测速上报
function cgiSpeed () {
    var opt = {
        method: 'GET',
        uri: 'http://127.0.0.1:3000/report/add',
        qs: {
            proj_id: '1',
            type: 'cgi_speed',
            url: '/cgi/quote/query_option_detail_list',
            cost: 1000,
            error_code: '210000'
        }
    };

    request(opt, function (error, response) {
        if(error) {
            throw error;
        }else {
            console.log(response.body);
        }
    });
}

// pageSpeed();
// pageView();
cgiSpeed();