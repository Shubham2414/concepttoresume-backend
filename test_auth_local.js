const http = require('http');

// Helper to make requests
function makeRequest(path, method, body, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
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

async function runTests() {
    console.log("--- STARTIING AUTH TESTS ---");

    // 1. Register
    console.log("\n1. Testing Register...");
    const regRes = await makeRequest('/auth/register', 'POST', {
        email: `test${Date.now()}@example.com`, // Unique email
        password: 'password123'
    });
    console.log(`STATUS: ${regRes.statusCode}`);
    if (regRes.statusCode !== 201) {
        console.error("Register Failed:", regRes.body);
        process.exit(1);
    }

    const email = regRes.email || `test${Date.now()}@example.com`; // Fallback if not returned

    // 2. Login
    console.log("\n2. Testing Login...");
    const loginRes = await makeRequest('/auth/login', 'POST', {
        email: regRes.body.email || (JSON.parse(regRes.req?.body || '{}').email) || (await makeRequest('/auth/register', 'POST', { email: 'fixed@test.com', password: 'password123' })).req?.body?.email || 'fixed@test.com', // Simplify: just use fixed
        password: 'password123'
    });

    // Re-do logic simply
}

async function start() {
    const email = `user${Date.now()}@test.com`;
    const password = "password123";

    try {
        // 1. Register
        console.log(`\n[1] Registering ${email}...`);
        const reg = await makeRequest('/auth/register', 'POST', { email, password });
        console.log(`Status: ${reg.statusCode} (Expected 201)`);

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
            title: "Success",
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
