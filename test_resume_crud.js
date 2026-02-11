require("dotenv").config();

const API_URL = "https://concepttoresume-backend.onrender.com";
// const API_URL = "http://localhost:10000"; // Use for local test if needed

async function testBackend() {
    try {
        // 1. REGISTER A NEW USER
        const email = `test-${Date.now()}@example.com`;
        const password = "password123";

        console.log(`1. Registering new user (${email})...`);
        const registerRes = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!registerRes.ok) throw new Error(`Register failed: ${registerRes.statusText}`);
        console.log("   Registration success.");

        // 2. LOGIN
        console.log("2. Logging in...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("   Login success. Token obtained.");

        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        // 3. CREATE RESUME
        console.log("\n3. Creating a new resume...");
        const createRes = await fetch(`${API_URL}/resumes`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                title: "Backend Test Resume",
                content: { test: "initial" }
            })
        });

        if (!createRes.ok) throw new Error(`Create failed: ${createRes.statusText}`);
        const createData = await createRes.json();
        const resumeId = createData._id;
        console.log(`   Resume created: ${resumeId}`);

        // 4. GET RESUME
        console.log(`\n4. Fetching resume ${resumeId}...`);
        const getRes = await fetch(`${API_URL}/resumes/${resumeId}`, { headers });

        if (!getRes.ok) {
            const errBody = await getRes.text();
            throw new Error(`Fetch failed: ${getRes.status} ${getRes.statusText} - ${errBody}`);
        }
        const getData = await getRes.json();

        if (getData._id === resumeId) {
            console.log("   Fetch success.");
        } else {
            console.error("   Fetch failed or mismatch.");
        }

        // 5. UPDATE RESUME
        console.log(`\n5. Updating resume ${resumeId}...`);
        const updateRes = await fetch(`${API_URL}/resumes/${resumeId}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
                title: "Updated Backend Resume",
                content: { test: "updated" }
            })
        });

        if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.statusText}`);
        const updateData = await updateRes.json();

        if (updateData.title === "Updated Backend Resume") {
            console.log("   Update success.");
        } else {
            console.error("   Update mismatch.");
        }

    } catch (err) {
        console.error("TEST FAILED:", err.message);
    }
}

testBackend();
