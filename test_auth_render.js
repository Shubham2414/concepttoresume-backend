const https = require('https');

// Helper to make requests
function makeRequest(path, method, body, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'concepttoresume-backend.onrender.com',
            port: 443,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: data ? JSON.parse(data) : {}
                });
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function start() {
    const email = `render_user${Date.now()}@test.com`;
    const password = "password123";

    try {
        console.log(`--- TESTING AUTH ON RENDER ---`);

        // 1. Register
        console.log(`\n[1] Registering ${email}...`);
        const reg = await makeRequest('/auth/register', 'POST', { email, password });
        console.log(`Status: ${reg.statusCode} (Expected 201)`);
        if (reg.statusCode !== 201) {
            console.error("Register Failed:", reg.body);
            // If user exists, try login
            if (reg.statusCode !== 400 || reg.body.error !== "User already exists") return;
        }

        // 2. Login
        console.log(`\n[2] Logging in...`);
        const login = await makeRequest('/auth/login', 'POST', { email, password });
        console.log(`Status: ${login.statusCode} (Expected 200)`);
        const token = login.body.token;
        if (!token) throw new Error("No token received");

        // 3. Create Resume (No Token)
        console.log(`\n[3] Create Resume (No Token)...`);
        const fail = await makeRequest('/resumes', 'POST', { title: "Fail", content: {} });
        console.log(`Status: ${fail.statusCode} (Expected 401)`);

        // 4. Create Resume (With Token)
        console.log(`\n[4] Create Resume (With Token)...`);
        const success = await makeRequest('/resumes', 'POST', {
            title: "Render Auth Resume",
            content: {},
            userId: "malicious-user-id" // Should be ignored
        }, token);
        console.log(`Status: ${success.statusCode} (Expected 201)`);
        console.log(`Owner Check: ${success.body.userId !== "malicious-user-id" ? "PASSED" : "FAILED"}`);
        console.log(`Actual Owner: ${success.body.userId}`);

    } catch (e) {
        console.error("TEST FAILED", e);
    }
}

start();
