const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');

const logw = require('./logweather.js')
const htmlFormer = require('./html-former.js')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	htmlFormer.addTemp((data) => {
		//res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');
		res.write(data);
		res.end();

		const { pathname, query } = url.parse(req.url, true);
		//console.log(JSON.stringify(query));
		if (query.temp) {
			//console.log(`Street temperature append: ${query.temp}`);
			logw.toCSV('STREET', [query.temp])
		}
	});
})
server.listen(port, hostname, () => {
	console.log(`Logweather server running at http://${hostname}:${port}/`);
});

