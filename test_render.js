const https = require('https');

const data = JSON.stringify({
    userId: "render-test-user",
    title: "Render Resume",
    content: { skills: ["Node", "MongoDB"] }
});

const options = {
    hostname: 'concepttoresume-backend.onrender.com',
    port: 443,
    path: '/resumes',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
