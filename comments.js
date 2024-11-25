// Create web server and listen for comments
// Comments are sent to the server using POST requests and are stored in an array
// Comments are sent to the server using GET requests and are sent back to the client as a JSON array
// Comments are stored in the array as objects with the following properties:
// - name: the name of the commenter
// - comment: the comment itself
// - date: the date and time that the comment was posted

var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

var comments = [];

var server = http.createServer(function(req, res) {
    console.log("Request received: " + req.url);

    if (req.method == 'POST') {
        var body = "";

        req.on('data', function(data) {
            body += data;
        });

        req.on('end', function() {
            var comment = qs.parse(body);
            comment.date = new Date();
            comments.push(comment);
            console.log("New comment: " + comment.name + " - " + comment.comment);
            res.writeHead(200);
            res.end();
        });
    } else if (req.method == 'GET') {
        if (req.url == '/comments') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(comments));
        } else {
            fs.readFile('comments.html', function(err, data) {
                if (err) {
                    res.writeHead(404);
                    res.end('404 - File not found');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                }
            });
        }
    } else {
        res.writeHead(405);
        res.end('405 - Method not allowed');
    }
});

server.listen(3000, function() {
    console.log("Server listening on port 3000");
});