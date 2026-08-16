let selectedRole = "public";

function firebaseReady() {
    return Boolean(window.NagpurFirebase?.configured && window.NagpurFirebase?.auth);
}

function saveSession({ role, name, contact, uid = "demo" }) {
    localStorage.setItem("nagpurAI_loggedIn", "true");
    localStorage.setItem("nagpurAI_role", role);
    localStorage.setItem("trafficUserName", name || "Traffic Operator");
    localStorage.setItem("trafficUserEmail", contact || "");
    localStorage.setItem("nagpurAI_userName", name || "Traffic Operator");
    localStorage.setItem("nagpurAI_contact", contact || "");
    localStorage.setItem("nagpurAI_uid", uid);
}

function redirectForRole(role) {
    window.location.replace(role === "police" ? "police-dashboard.html" : "public-dashboard.html");
}

function selectRole(role) {
    selectedRole = role;
    document.getElementById("publicRole")?.classList.toggle("active", role === "public");
    document.getElementById("policeRole")?.classList.toggle("active", role === "police");
    document.getElementById("signupArea")?.classList.toggle("hidden", role !== "public");
    document.getElementById("policeNote")?.classList.toggle("hidden", role !== "police");
    if (role === "police") {
        document.getElementById("signupSection")?.classList.add("hidden");
        document.getElementById("loginSection")?.classList.remove("hidden");
    }
}

async function sendOTP() {
    const name = document.getElementById("name")?.value.trim();
    const contact = document.getElementById("contact")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    if (!name || !contact || !password) return alert("Please fill all details.");
    if (password.length < 6) return alert("Password must be at least 6 characters.");

    // Production Firebase mode uses email/password authentication.
    // SMS OTP needs a phone-number flow + reCAPTCHA and is intentionally not faked.
    if (firebaseReady() && contact.includes("@")) {
        try {
            const { signInWithEmailAndPassword } = window.NagpurFirebase;
            const result = await signInWithEmailAndPassword(window.NagpurFirebase.auth, contact, password);
            saveSession({ role: selectedRole, name, contact, uid: result.user.uid });
            redirectForRole(selectedRole);
            return;
        } catch (error) {
            alert(error.code === "auth/invalid-credential"
                ? "Invalid email or password. Create a public account first."
                : `Login failed: ${error.message}`);
            return;
        }
    }

    // Demo/offline fallback remains available when Firebase is not configured.
    localStorage.setItem("demoOTP", "123456");
    document.getElementById("loginSection")?.classList.add("hidden");
    document.getElementById("signupArea")?.classList.add("hidden");
    document.getElementById("otpSection")?.classList.remove("hidden");
    alert("Demo mode: OTP is 123456. Configure Firebase to enable real authentication.");
}

async function verifyOTP() {
    const otp = document.getElementById("otp")?.value.trim();
    if (otp !== "123456") return alert("Invalid OTP. Use 123456 in demo mode.");
    const name = document.getElementById("name")?.value.trim() || "Traffic Operator";
    const contact = document.getElementById("contact")?.value.trim() || "";
    saveSession({ role: selectedRole, name, contact });
    redirectForRole(selectedRole);
}

function showSignup() {
    document.getElementById("loginSection")?.classList.add("hidden");
    document.getElementById("signupArea")?.classList.add("hidden");
    document.getElementById("policeNote")?.classList.add("hidden");
    document.getElementById("signupSection")?.classList.remove("hidden");
}

async function createAccount() {
    const name = document.getElementById("signupName")?.value.trim();
    const contact = document.getElementById("signupContact")?.value.trim();
    const password = document.getElementById("signupPassword")?.value.trim();
    if (!name || !contact || !password) return alert("Please fill all details.");
    if (!contact.includes("@")) return alert("For a real Firebase account, use an email address.");
    if (password.length < 6) return alert("Password must be at least 6 characters.");

    if (!firebaseReady()) {
        localStorage.setItem("nagpurAI_user", JSON.stringify({ name, contact, role: "public" }));
        localStorage.setItem("trafficUserName", name);
        localStorage.setItem("trafficUserEmail", contact);
        alert("Demo account saved. Configure Firebase to create a real account.");
        backToLogin();
        return;
    }

    try {
        const { auth, db, createUserWithEmailAndPassword, doc, setDoc } = window.NagpurFirebase;
        const result = await createUserWithEmailAndPassword(auth, contact, password);
        await setDoc(doc(db, "users", result.user.uid), {
            name,
            email: contact,
            role: "public",
            createdAt: new Date().toISOString()
        });
        saveSession({ role: "public", name, contact, uid: result.user.uid });
        redirectForRole("public");
    } catch (error) {
        alert(`Account creation failed: ${error.message}`);
    }
}

function backToLogin() {
    document.getElementById("signupSection")?.classList.add("hidden");
    document.getElementById("otpSection")?.classList.add("hidden");
    document.getElementById("loginSection")?.classList.remove("hidden");
    if (selectedRole === "public") document.getElementById("signupArea")?.classList.remove("hidden");
}

window.selectRole = selectRole;
window.sendOTP = sendOTP;
window.verifyOTP = verifyOTP;
window.showSignup = showSignup;
window.createAccount = createAccount;
window.backToLogin = backToLogin;

selectRole("public");
