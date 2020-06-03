const https = require("https");
const url = require("url");

const API_BASE_URL = "https://en.wiktionary.org/w/api.php";

if (typeof(process.argv[2]) != "string" || process.argv[2].length == 0) {
	console.error("No input provided. Exiting...");
	process.exit(1);
}

var request = process.argv[2];

var request_url = new URL(API_BASE_URL);
request_url.search = new URLSearchParams({
	action: "query",
	format: "json",
	titles: request
});

//console.log(request_url);

https.get(request_url, (response) => {
	console.log(response.statusCode,response.statusMessage);

	response.on("data", (d) => onData(JSON.parse(d.toString())));
});

function onData(data) {
	//console.log(data);
	
	if (data.query.pages["-1"]) {
		console.error(`Entry "${request}" does not exist. Exiting...`);
		process.exit(1);
	}

	console.log("Page found:", data.query.pages[Object.keys(data.query.pages)[0]]);
}
