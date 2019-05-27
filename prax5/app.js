var host = '193.40.252.80';
//var host = 'localhost';
var port = 7654;
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var head = '<!DOCTYPE html>\
            <html lang="en">\
            <head>\
            <meta charset="UTF-8">\
            <title>Wiki</title>\
            </head>';

function page(res, urlParts) {
    fs.readFile('data' + urlParts.pathname + '.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        var show = head;
        show += "<body>";
        var lines = data.split("\n");
        if (urlParts.query['mode'] === 'edit') {
            show += '<form method="post" action="'+urlParts.pathname+'" accept-charset="UTF-8"><textarea name="text" rows="'+(lines.length + 10)+'" cols="130">';
        }
        var fileData = '';
        for (var idx in lines) {
            fileData += lines[idx];
        }
        show += fileData;
        if (urlParts.query['mode'] === 'edit') {
            show += '</textarea><br><input type="submit" value="Save"></form>';
        } else if (urlParts.query['mode'] === 'append') {
            show += '<form method="post" action="'+urlParts.pathname+'" accept-charset="UTF-8"><input type="hidden" name="text" value="'+fileData+'"><textarea name="append" rows="'+12+'" cols="130"></textarea><br><input type="submit" value="Save"></form>';
        } else {
            show += '<br><input type="submit" value="Edit" onclick="window.location.replace(\''+urlParts.pathname+'?mode=edit\')"><input type="submit" value="Append" onclick="window.location.replace(\''+urlParts.pathname+'?mode=append\')">';
        }
        show += "</body>";
        res.end(show);
    });
}

function pageNonHTMLEntry(res, urlParts) {
    fs.readFile('data' + urlParts.pathname + '.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        var show = head;
        show += "<body>";
        var lines = data.split("\n");
        if (urlParts.query['mode'] === 'edit') {
            show += '<form method="post" action="'+urlParts.pathname+'" accept-charset="UTF-8"><textarea name="text" rows="'+(lines.length + 10)+'" cols="130">';
        }
        var fileData = '';
        var appendData = '';
        for (var idx in lines) {
            if (urlParts.query['mode'] !== 'edit' && urlParts.query['mode'] !== 'append') fileData += "<p>";
                fileData += lines[idx];
                appendData += "<p>" + lines[idx] + "</p>";
            if (urlParts.query['mode'] !== 'edit' && urlParts.query['mode'] !== 'append') fileData += "</p>";
        }
        if (urlParts.query['mode'] == 'append') {
            show += appendData;
        } else {
            show += fileData;
        }
        if (urlParts.query['mode'] === 'edit') {
            show += '</textarea><br><input type="submit" value="Save"></form>';
        } else if (urlParts.query['mode'] === 'append') {
            show += '<form method="post" action="'+urlParts.pathname+'" accept-charset="UTF-8"><input type="hidden" name="text" value="'+fileData+'"><textarea name="append" rows="'+12+'" cols="130"></textarea><br><input type="submit" value="Save"></form>';
        } else {
            show += '<br><input type="submit" value="Edit" onclick="window.location.replace(\''+urlParts.pathname+'?mode=edit\')"><input type="submit" value="Append" onclick="window.location.replace(\''+urlParts.pathname+'?mode=append\')">';
        }
        show += "</body>";
        res.end(show);
    });
}

function createFoldersAndFile(urlParts, res) {
    fs.writeFile('data' + urlParts.pathname + '.txt', '', function (err) {
        if (err) {
            var paths = urlParts.pathname.split('/');
            if (paths[paths.length - 1] == '') {
                res.end('Please enter file');
                return;
            }
            var path = 'data/';
            for (var idx in paths) {
                if (paths[idx] == '' || idx == paths.length - 1) continue;
                path += paths[idx] + '/';
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }
            }
            res.end('<!DOCTYPE html><head><script>window.location.replace(\'' + urlParts.href + '\')</script></head>');
            return;
        }
        res.end('<!DOCTYPE html><head><script>window.location.replace(\'/' + urlParts.query["create"] + '\')</script></head>');
    })
}

function saveToFile(req, urlParts) {
    var body = '';
    req.on('data', function (data) {
        body += data;
    })
    req.on('end', function () {
        var post = qs.parse(body);
        var data = post['text'];
        if (post['append']) {
            data += post['append'];
        }
        fs.writeFile('data' + urlParts.pathname + '.txt', data, function (err) {
            if (err) {
                console.log(err);
            }
        })
    });
}

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var urlParts = url.parse(req.url, true);

    if (urlParts.pathname == '/') {
        urlParts.pathname = '/main';
    }

    var show = head;


    if (urlParts.query["create"]) {
        createFoldersAndFile(urlParts, res);
    }

    if (req.method == 'POST') {
        saveToFile(req, urlParts);
    }
    fs.exists('data' + urlParts.pathname + '.txt', function (err) {
        if (!err) {
            show += '<body>';
            show += '<p>Page could not be found!</p>';
            show += '<p>Would you like to create it?</p>';
            show += '<input type="submit" value="create" onclick="window.location.replace(\'?create=' + urlParts.pathname.substring(1) + '\')">';
            show += '</body>';
            res.end(show);
            return;
        }
        page(res, urlParts);
    });
}).listen(port, host);
console.log('Server running @ ' + host + ':' + port);
