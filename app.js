/**
 * NXA TALENT - INDUSTRIAL CLOUD ENGINE v1.2
 * Engineered for Real-Time Global Synchronization via Firebase Firestore.
 */

// --- 0. FIREBASE CLOUD INITIALIZATION ---
const firebaseConfig = {
    apiKey: "AIzaSyBgx4Wd2SdpLhAknjo61NU1HWyZZkm0ivM",
    authDomain: "nxa-talent.firebaseapp.com",
    projectId: "nxa-talent",
    storageBucket: "nxa-talent.firebasestorage.app",
    messagingSenderId: "129338661158",
    appId: "1:129338661158:web:0b2a3958668c22fd7189e7",
    measurementId: "G-NJT1R8H4LG"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log("NXA_CLOUD: NEURAL_UPLINK_ESTABLISHED");
    } catch (e) {
        console.warn("NXA_CLOUD_ERROR: Initialization failed.", e);
    }
} else {
    console.warn("NXA_CLOUD_CRITICAL: FIREBASE_SDK_NOT_LOADED. Falling back to local manifest.");
}

// Helper for Firestore Sync
const NXA_ELITE_QUESTIONS = [
    { q: "In a distributed system, what does the CAP theorem state regarding a network partition?", o: ["Availability and Consistency cannot both be guaranteed", "Consistency and Partition Tolerance are impossible", "Availability is prioritized over Latency", "Network speed determines Consistency"], a: 0 },
    { q: "Which Transformer architecture component allows it to handle long-range dependencies regardless of distance?", o: ["Recurrent hidden states", "Self-Attention Mechanism", "Backpropagation through time", "Convolutional kernels"], a: 1 },
    { q: "In Kubernetes, what is the primary purpose of an 'Admission Controller'?", o: ["To balance load across pods", "To intercept requests to the API server before object persistence", "To manage node-level hardware resources", "To encrypt traffic between services"], a: 1 },
    { q: "Which consensus algorithm is specifically designed for high-performance permissioned blockchains like Hyperledger Fabric?", o: ["Proof of Work", "Raft", "PBFT (Practical Byzantine Fault Tolerance)", "Proof of Stake"], a: 2 },
    { q: "In Zero Trust architecture, what is the 'Policy Decision Point' (PDP) responsible for?", o: ["Enforcing the connection", "Evaluating the access request against rules", "Storing user credentials", "Logging network traffic"], a: 1 },
    { q: "Which data structure is most efficient for implementing a 'Least Recently Used' (LRU) cache with O(1) operations?", o: ["B-Tree + Queue", "Hash Map + Doubly Linked List", "Binary Search Tree", "Skip List"], a: 1 },
    { q: "What is the time complexity of a 'Union-Find' operation with both Path Compression and Rank Optimization?", o: ["O(log N)", "O(N)", "O(α(N)) - Inverse Ackermann", "O(1)"], a: 2 },
    { q: "In modern CPU architecture, what is 'Spectre' primarily exploiting?", o: ["Buffer overflows", "Speculative execution and side-channel analysis", "Direct Memory Access (DMA)", "Kernel-level race conditions"], a: 1 },
    { q: "Which HTTP header is essential for preventing 'Clickjacking' attacks?", o: ["X-Content-Type-Options", "Content-Security-Policy (frame-ancestors)", "X-XSS-Protection", "Strict-Transport-Security"], a: 1 },
    { q: "In a 'Microservices' architecture, which pattern is used to handle cross-cutting concerns like logging and auth at the entry point?", o: ["Circuit Breaker", "Saga Pattern", "API Gateway", "Strangler Fig"], a: 2 },
    { q: "What is the primary difference between 'L1' and 'L2' Regularization in Machine Learning?", o: ["L1 produces sparse weights (zero-valued)", "L2 is only for classification", "L1 is faster to compute", "L2 prevents all overfitting"], a: 0 },
    { q: "In Docker, which namespace provides isolation for the process tree?", o: ["Network Namespace", "PID Namespace", "Mount Namespace", "User Namespace"], a: 1 },
    { q: "Which RAID level provides both mirroring and striping without using parity?", o: ["RAID 5", "RAID 10", "RAID 6", "RAID 1"], a: 1 },
    { q: "What is 'Throttling' in the context of API design?", o: ["Deleting old data", "Controlling the rate of incoming requests", "Compressing response body", "Encrypting database fields"], a: 1 },
    { q: "In Python, what does 'GIL' stand for and what is its primary effect?", o: ["Global Interlock Link - Speeds up I/O", "Global Interpreter Lock - Prevents multi-core CPU threading", "Garbage Internal Logic - Manages memory", "Generic Interface Layer - Connects to C++"], a: 1 },
    { q: "Which design pattern is used to provide a unified interface to a set of interfaces in a subsystem?", o: ["Singleton", "Adapter", "Facade", "Decorator"], a: 2 },
    { q: "In Database systems, what does 'Deadlock' refer to?", o: ["A database crash", "Two transactions waiting for each other to release locks", "A table with no primary key", "Data corruption in logs"], a: 1 },
    { q: "Which sorting algorithm is guaranteed O(N log N) even in the worst case?", o: ["Quick Sort", "Heap Sort", "Bubble Sort", "Insertion Sort"], a: 1 },
    { q: "What is the role of a 'Zookeeper' in a Hadoop/Kafka ecosystem?", o: ["Storing actual data", "Coordination and state management of distributed nodes", "Formatting hard drives", "Running SQL queries"], a: 1 },
    { q: "In React, what is the 'Virtual DOM' primarily used for?", o: ["Replacing the real DOM", "Improving performance by minimizing direct DOM manipulation", "Storing user passwords", "Connecting to the server"], a: 1 },
    { q: "Which AWS service is designed for serverless execution of code?", o: ["EC2", "S3", "Lambda", "RDS"], a: 2 },
    { q: "What is 'Idempotency' in REST API design?", o: ["Multiple identical requests have the same effect as one", "The API is always available", "The API uses JSON only", "The API requires no authentication"], a: 0 },
    { q: "In Networking, what is the purpose of 'BGP' (Border Gateway Protocol)?", o: ["Assigning IP addresses to home devices", "Routing data between different autonomous systems on the Internet", "Sending emails", "Managing local WiFi passwords"], a: 1 },
    { q: "Which encryption type uses a Public Key and a Private Key?", o: ["Symmetric Encryption", "Asymmetric Encryption", "Hashing", "Obfuscation"], a: 1 },
    { q: "In Git, what does 'Rebase' do compared to 'Merge'?", o: ["Deletes the history", "Moves or combines a sequence of commits to a new base commit", "Uploads code to GitHub", "Creates a new branch"], a: 1 },
    { q: "What is 'Cross-Site Scripting' (XSS)?", o: ["A server-side database attack", "Injecting malicious scripts into web pages viewed by other users", "Stealing a physical laptop", "Sending spam emails"], a: 1 },
    { q: "In Java, what is the purpose of the 'final' keyword on a class?", o: ["It makes the class abstract", "It prevents the class from being subclassed", "It makes all methods static", "It deletes the class on exit"], a: 1 },
    { q: "Which SQL command is used to combine rows from two or more tables based on a related column?", o: ["SELECT", "UNION", "JOIN", "GROUP BY"], a: 2 },
    { q: "What is 'Docker Swarm'?", o: ["A virus", "A native clustering tool for Docker containers", "A cloud storage service", "A code editor"], a: 1 },
    { q: "In Artificial Intelligence, what is 'Overfitting'?", o: ["The model is too small", "The model performs well on training data but poorly on unseen data", "The model is too fast", "The model uses too much RAM"], a: 1 }
];

const Cloud = {
    async set(col, id, data) {
        if (typeof firebase === 'undefined') return;
        try { await firebase.firestore().collection(col).doc(id).set(data, { merge: true }); } 
        catch(e) { console.warn("CLOUD_WRITE_FAIL:", e); }
    },
    async get(col, id) {
        if (typeof firebase === 'undefined') return null;
        try { const doc = await firebase.firestore().collection(col).doc(id).get(); return doc.exists ? doc.data() : null; }
        catch(e) { return null; }
    },
    async getAll(col) {
        if (typeof firebase === 'undefined') return [];
        try { const snap = await firebase.firestore().collection(col).get(); return snap.docs.map(d => d.data()); }
        catch(e) { return []; }
    }
};

// --- 1. STATE MANAGER ---
const AppState = {
    user: null,
    role: 'student',
    roleType: null,
    view: 'home',
    courses: [
        { id: 1, title: 'Quantum Frontend', domain: 'Eng', enrolled: false },
        { id: 2, title: 'Ethical AI Architecture', domain: 'AI', enrolled: false },
        { id: 3, title: 'Neural Security Core', domain: 'Defense', enrolled: false }
    ],
    listeners: [],
    
    init() {
        try {
            let savedUser = localStorage.getItem('nxa_active_session');
            // Cookie Fallback for WebView Persistence
            if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
                const match = document.cookie.match(new RegExp('(^| )nxa_active_session=([^;]+)'));
                if (match) savedUser = decodeURIComponent(match[2]);
            }
            if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
                this.user = JSON.parse(savedUser);
            }

            // EXTREME FAILSAFE: If no session exists but an account was registered locally, auto-login!
            if (!this.user) {
                const users = JSON.parse(localStorage.getItem('nxa_users')) || [];
                if (users.length > 0) {
                    this.user = users[users.length - 1];
                    this.role = this.user.role || 'student';
                    // Re-save session
                    localStorage.setItem('nxa_active_session', JSON.stringify(this.user));
                    document.cookie = `nxa_active_session=${encodeURIComponent(JSON.stringify(this.user))}; max-age=31536000; path=/`;
                }
            }
            
            let savedRole = localStorage.getItem('nxa_active_role');
            if (!savedRole) {
                const rMatch = document.cookie.match(new RegExp('(^| )nxa_active_role=([^;]+)'));
                if (rMatch) savedRole = decodeURIComponent(rMatch[2]);
            }
            this.role = savedRole || 'student';
            this.roleType = localStorage.getItem('nxa_active_role_type') || null;
        } catch (e) { console.warn("NXA_STATE_LOAD_FAIL:", e); }
    },
    
    addListener(callback) { this.listeners.push(callback); },
    setUser(user, role = 'student', roleType = null) { 
        this.user = user; 
        this.role = role || 'student';
        this.roleType = roleType || null;
        this.notify(); 
    },
    notify() { 
        try {
            this.listeners.forEach(cb => cb(this));
            
            const userStr = JSON.stringify(this.user);
            // Storage
            localStorage.setItem('nxa_active_session', userStr);
            localStorage.setItem('nxa_active_role', this.role || 'student');
            localStorage.setItem('nxa_active_role_type', this.roleType || '');
            
            // Cookie Persistence (1 Year)
            document.cookie = `nxa_active_session=${encodeURIComponent(userStr)}; max-age=31536000; path=/`;
            document.cookie = `nxa_active_role=${encodeURIComponent(this.role || 'student')}; max-age=31536000; path=/`;
        } catch (e) { console.warn("NXA_STORAGE: Local memory full/blocked."); }
    },
    setView(view) { 
        if (this.view && this.view !== view) {
            if (!this._history) this._history = [];
            this._history.push(this.view);
            if (this._history.length > 20) this._history.shift();
        }
        this.view = view; 
        this.notify(); 
    },
    goBack() {
        if (!this._history || this._history.length === 0) return;
        const prev = this._history.pop();
        this.view = prev;
        this.notify();
    },
    logout() { 
        this.user = null; 
        this.role = 'student';
        this.roleType = null;
        // Wipe cookies
        document.cookie = `nxa_active_session=; max-age=0; path=/`;
        document.cookie = `nxa_active_role=; max-age=0; path=/`;
        this.notify(); 
    },
    
    // Cross-Tab Synchronization Uplink
    syncExternal() {
        const sync = () => {
            this.init();
            this.notify();
        };
        window.addEventListener('storage', (e) => {
            if (!e.key || e.key.startsWith('nxa_')) sync();
        });
        window.addEventListener('nxa_internal_sync', sync);
    }
};
AppState.init();
AppState.syncExternal();

// --- 2. UI ORCHESTRATOR ---
const DOM = {
    get root() { return document.getElementById('root'); },
    getMask: () => document.getElementById('loading-mask')
};

window.NXASubmitDossier = async (e) => {
    if (e) e.preventDefault();
    const btn = document.getElementById('dossierSubmit');
    if (!btn) return;
    btn.innerText = 'UPLOADING_TO_CLOUD...';
    btn.disabled = true;

    try {
        const data = {
            fullname: document.getElementById('d_fullname').value,
            email: document.getElementById('d_email').value.toLowerCase().trim(),
            phone: document.getElementById('d_phone').value,
            dob: document.getElementById('d_dob').value,
            gender: document.getElementById('d_gender').value,
            address: document.getElementById('d_address').value,
            usn: document.getElementById('d_usn').value,
            branch: document.getElementById('d_branch').value,
            sem: document.getElementById('d_sem').value,
            college: document.getElementById('d_college').value,
            passingyear: document.getElementById('d_passingyear').value,
            marks10: document.getElementById('d_10th').value,
            marks12: document.getElementById('d_12th').value,
            cgpa: document.getElementById('d_cgpa').value,
            pname: document.getElementById('d_pname').value,
            pphone: document.getElementById('d_pphone').value,
            domain: document.getElementById('d_domain').value,
            linkedin: document.getElementById('d_linkedin').value,
            github: document.getElementById('d_github').value,
            skills: document.getElementById('d_skills').value,
            submittedAt: new Date().toLocaleString()
        };

        // 1. Local Persistence (Failsafe)
        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
        profiles[data.email] = data;
        localStorage.setItem('nxa_student_profiles', JSON.stringify(profiles));

        // 2. INDUSTRIAL CLOUD UPLINK
        await Cloud.set('nxa_student_profiles', data.email, data);

        if (navigator.vibrate) navigator.vibrate([30, 30, 30]);
        btn.innerText = 'DOSSIER_AUTHORIZED';
        
        // 3. FORCE CROSS-TAB SYNC
        window.dispatchEvent(new Event('nxa_internal_sync'));
        
        alert("Submitted successfully!");
        
        setTimeout(() => AppState.setView('self'), 500);
    } catch(err) {
        console.error(err);
        alert("Error submitting: Please make sure all fields are filled correctly.");
        btn.innerText = 'AUTHORIZE_IDENTITY_MANIFEST';
        btn.disabled = false;
    }
};

window.NXAStartLive = async () => {
    const topic = document.getElementById('live_topic').value;
    const link = document.getElementById('live_link').value;
    if(!topic || !link) return alert('Session Topic and Link required.');
    const liveData = { active: true, topic, link };
    localStorage.setItem('nxa_live_broadcast', JSON.stringify(liveData));
    if (typeof firebase !== 'undefined') await Cloud.set('nxa_broadcasts', 'live_class_state', liveData);
    window.dispatchEvent(new Event('nxa_internal_sync'));
    alert('Live Session Broadcasted Successfully!');
    AppState.setView('live');
};

window.NXAStopLive = async () => {
    if(!confirm('TERMINATE_UPLINK?')) return;
    const liveData = { active: false };
    localStorage.setItem('nxa_live_broadcast', JSON.stringify(liveData));
    if (typeof firebase !== 'undefined') await Cloud.set('nxa_broadcasts', 'live_class_state', liveData);
    window.dispatchEvent(new Event('nxa_internal_sync'));
    AppState.setView('live');
};

window.NXAAnchorSession = async () => {
    const time = document.getElementById('scheduled_time').value;
    const data = { active: true, time, date: new Date().toDateString() };
    localStorage.setItem('nxa_attendance_session', JSON.stringify(data));
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_broadcasts', 'attendance_session', data);
    }
    AppState.setView('attendance');
};

window.NXAStopSession = async () => {
    const data = { active: false };
    localStorage.setItem('nxa_attendance_session', JSON.stringify(data));
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_broadcasts', 'attendance_session', data);
    }
    AppState.setView('attendance');
};

window.NXAToggleScanner = (btn) => {
    const ui = document.getElementById('adminScannerUI');
    if (ui.style.display === 'none') {
        if (typeof Html5Qrcode === 'undefined') {
            alert('QR Scanner library not loaded. Check internet connection.');
            return;
        }
        ui.style.display = 'block';
        btn.innerText = '⛔ STOP SCANNER';
        window.html5QrCode = new Html5Qrcode('scanner-container');
        window.html5QrCode.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 240, height: 240 } },
            async (decoded) => {
                if (decoded.startsWith('ATT|') && decoded.endsWith('|NXA')) {
                    const parts = decoded.split('|');
                    const email = parts[1];
                    const todayStr = new Date().toISOString().split('T')[0];
                    const result = document.getElementById('scanner-result');
                    result.innerText = '✅ MARKING: ' + email;
                    
                    const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
                    if (!profiles[email]) profiles[email] = {};
                    if (!profiles[email].attendance) profiles[email].attendance = {};
                    profiles[email].attendance[todayStr] = true;
                    localStorage.setItem('nxa_student_profiles', JSON.stringify(profiles));
                    if (typeof firebase !== 'undefined') {
                        await Cloud.set('nxa_student_profiles', email, profiles[email]);
                    }
                    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
                    setTimeout(() => { result.innerText = '✅ ' + email + ' MARKED PRESENT'; }, 500);
                } else {
                    document.getElementById('scanner-result').innerText = '⚠️ Invalid QR';
                }
            }
        ).catch(err => alert('Scanner error: ' + err));
    } else {
        if (window.html5QrCode) window.html5QrCode.stop().catch(() => {});
        ui.style.display = 'none';
        btn.innerText = '📷 ACTIVATE QR SCANNER';
    }
};

window.NXASearchPunch = (term) => {
    const punchList = document.getElementById('punch_student_list');
    if (!punchList) return;
    const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
    const students = Object.values(profiles);
    const todayStr = new Date().toISOString().split('T')[0];

    const filtered = students.filter(s =>
        (s.fullname || '').toLowerCase().includes(term.toLowerCase()) ||
        (s.usn || '').toLowerCase().includes(term.toLowerCase())
    );
    punchList.innerHTML = filtered.map(s => {
        const att = (s.attendance || {});
        const done = att[todayStr] === true;
        return `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding: 8px 12px; border-radius:8px; border:1px solid var(--glass-border);">
            <div>
                <div style="font-size:0.65rem; color:#fff; font-weight:800;">${s.fullname || s.email}</div>
                <div style="font-size:0.45rem; color:var(--text-dim);">${s.usn || s.email}</div>
            </div>
            <button onclick="window.NXA_ATT_PUNCH('${s.email}', this)" style="background:${done ? 'rgba(0,255,106,0.2)' : 'var(--accent-primary)'}; color:${done ? '#00ff6a' : '#000'}; border:none; padding:5px 12px; border-radius:6px; font-size:0.5rem; font-weight:900; cursor:pointer;">
                ${done ? '✓ PRESENT' : 'PUNCH'}
            </button>
        </div>`;
    }).join('');
};

window.NXA_ATT_PUNCH = async (email, btn) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
    if (!profiles[email]) profiles[email] = {};
    if (!profiles[email].attendance) profiles[email].attendance = {};
    profiles[email].attendance[todayStr] = true;
    localStorage.setItem('nxa_student_profiles', JSON.stringify(profiles));
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_student_profiles', email, profiles[email]);
    }
    btn.innerText = '✓ PRESENT';
    btn.style.background = 'rgba(0,255,106,0.2)';
    btn.style.color = '#00ff6a';
    if (navigator.vibrate) navigator.vibrate(30);
};

window.NXAInitAttendance = (email) => {
    // Wait for DOM to finish rendering
    setTimeout(() => {
        const qrEl = document.getElementById('qrcode');
        if (qrEl && typeof QRCode !== 'undefined') {
            qrEl.innerHTML = ''; // clear old
            new QRCode(qrEl, {
                text: `ATT|${email}|NXA`,
                width: 200, height: 200,
                colorDark: '#000000', colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }
        if (document.getElementById('student_punch_search')) {
            window.NXASearchPunch('');
        }
    }, 100);
};

window.NXADeployProject = async () => {
    const title = (document.getElementById('nxa_proj_title')?.value || '').trim();
    const image = (document.getElementById('nxa_proj_image')?.value || '').trim();
    const info = (document.getElementById('nxa_proj_info')?.value || '').trim();
    const source = (document.getElementById('nxa_proj_source')?.value || '').trim();
    const dataset = (document.getElementById('nxa_proj_dataset')?.value || '').trim();

    if(!title) return alert('Project Title is required.');

    const projects = JSON.parse(localStorage.getItem('nxa_industrial_projects')) || [];
    const newProj = { title, image, info, source, dataset, createdAt: new Date().toLocaleString() };
    projects.unshift(newProj);
    
    localStorage.setItem('nxa_industrial_projects', JSON.stringify(projects));
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_broadcasts', 'project_matrix', { list: projects });
    }
    
    AppState.setView('projects');
};

window.NXADeleteProject = async (idx) => {
    if(!confirm('TERMINATE_PROJECT_NODE?')) return;
    const projects = JSON.parse(localStorage.getItem('nxa_industrial_projects')) || [];
    projects.splice(idx, 1);
    localStorage.setItem('nxa_industrial_projects', JSON.stringify(projects));
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_broadcasts', 'project_matrix', { list: projects });
    }
    AppState.setView('projects');
};

window.NXAPostInternship = async () => {
    const title = (document.getElementById('nxa_int_title')?.value || '').trim();
    const desc = (document.getElementById('nxa_int_desc')?.value || '').trim();
    const req = (document.getElementById('nxa_int_req')?.value || '').trim();
    const link = (document.getElementById('nxa_int_link')?.value || '').trim();

    if(!title || !link) return alert('Title and Link are required.');

    const hubs = JSON.parse(localStorage.getItem('nxa_internship_matrix')) || [];
    hubs.unshift({ id: 'INT_' + Date.now(), title, desc, req, link });
    localStorage.setItem('nxa_internship_matrix', JSON.stringify(hubs));
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_broadcasts', 'internship_matrix', { list: hubs });
    }
    AppState.setView('internships');
};

window.NXADeleteInternship = async (idx) => {
    if(!confirm('TERMINATE_INTERNSHIP_NODE?')) return;
    const hubs = JSON.parse(localStorage.getItem('nxa_internship_matrix')) || [];
    hubs.splice(idx, 1);
    localStorage.setItem('nxa_internship_matrix', JSON.stringify(hubs));
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_broadcasts', 'internship_matrix', { list: hubs });
    }
    AppState.setView('internships');
};

window.NXAApplyInternship = (id, link) => {
    const apps = JSON.parse(localStorage.getItem(`nxa_apps_${AppState.user.email}`)) || [];
    if(!apps.includes(id)) apps.push(id);
    localStorage.setItem(`nxa_apps_${AppState.user.email}`, JSON.stringify(apps));
    window.open(link, '_blank');
    AppState.setView('internships');
};

window.NXA_START_ASSESSMENT = () => {
    window.NXA_ASSESSMENT_ANSWERS = new Array(NXA_ELITE_QUESTIONS.length).fill(null);
    AppState.setView('internship_assessment');
};

window.NXA_SUBMIT_ANS = (qIdx, ansIdx) => {
    window.NXA_ASSESSMENT_ANSWERS[qIdx] = ansIdx;
    const btn = document.querySelector(`[data-q="${qIdx}"][data-a="${ansIdx}"]`);
    const others = document.querySelectorAll(`[data-q="${qIdx}"]`);
    others.forEach(o => { o.style.background = 'rgba(255,255,255,0.05)'; o.style.color = '#fff'; });
    btn.style.background = 'var(--accent-primary)';
    btn.style.color = '#000';
};

window.NXA_FINISH_ASSESSMENT = () => {
    const answers = window.NXA_ASSESSMENT_ANSWERS;
    if (answers.includes(null)) return alert('PLEASE ANSWER ALL QUESTIONS BEFORE SUBMITTING.');
    
    let correct = 0;
    NXA_ELITE_QUESTIONS.forEach((q, idx) => {
        if (answers[idx] === q.a) correct++;
    });

    if (correct === NXA_ELITE_QUESTIONS.length) {
        localStorage.setItem(`nxa_cert_${AppState.user.email}`, 'ELIGIBLE');
        AppState.setView('internship_assessment_result_pass');
    } else {
        alert(`ASSESSMENT_FAILED: You scored ${correct}/${NXA_ELITE_QUESTIONS.length}. Requirement: 100% correct answers for Certificate.`);
        AppState.setView('internships');
    }
};

window.NXA_GEN_CERT = () => {
    const cert = document.getElementById('nxa_certificate_node');
    cert.style.display = 'flex';
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
};

window.NXASetPaymentConfig = async () => {
    const upi = (document.getElementById('nxa_pay_upi')?.value || '').trim();
    const fee = (document.getElementById('nxa_pay_fee')?.value || '').trim();
    const qr = (document.getElementById('nxa_pay_qr')?.value || '').trim();

    if(!upi || !fee) return alert('UPI ID and Access Fee are required.');

    const config = { upi, fee, qr, updatedAt: new Date().toISOString() };
    localStorage.setItem('nxa_payment_config', JSON.stringify(config));
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_broadcasts', 'payment_config', config);
    }
    alert('PAYMENT_MATRIX_CONFIGURED: Matrix updated across all nodes.');
    AppState.setView('course_admin');
};

window.NXAConfirmPayment = async (courseId) => {
    const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
    const s = profiles[AppState.user.email];
    if(!s) return alert('IDENTITY_SYNC_ERROR: Please re-login.');

    if (!s.paid_courses) s.paid_courses = [];
    if (!s.paid_courses.includes(courseId)) {
        s.paid_courses.push(courseId);
    }
    s.payment_date = new Date().toISOString();
    
    profiles[AppState.user.email] = s;
    localStorage.setItem('nxa_student_profiles', JSON.stringify(profiles));
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_student_profiles', AppState.user.email, s);
    }
    
    alert('PAYMENT_MANIFEST_SUCCESS: Course Node Unlocked.');
    AppState.setView('courses');
};

window.NXACreateCourse = async () => {
    const title = document.getElementById('new_c_title').value.trim();
    const domain = document.getElementById('new_c_domain').value.trim();
    const desc = document.getElementById('new_c_desc') ? document.getElementById('new_c_desc').value.trim() : '';
    const price = document.getElementById('new_c_price')?.value.trim() || '0';

    if(!title || !domain) return alert('Title and Domain required.');

    const courses = window.NXA.getCourses();
    const newCourse = { 
        id: 'NXA_' + Date.now(), 
        title, 
        domain, 
        desc, 
        price, 
        refs: [], 
        videos: [], 
        docs: [] 
    };
    courses.push(newCourse);
    window.NXA.saveCourses(courses);
    // Sync to Firebase so all devices see the new course
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_broadcasts', 'course_matrix', { list: courses });
    }
    AppState.setView('course_admin');
};

window.NXADeleteCourse = async (id) => {
    if(!confirm('TERMINATE COURSE?')) return;
    const filtered = window.NXA.getCourses().filter(c => c.id !== id);
    window.NXA.saveCourses(filtered);
    if (typeof firebase !== 'undefined') {
        await Cloud.set('nxa_broadcasts', 'course_matrix', { list: filtered });
    }
    AppState.setView('course_admin');
};

window.NXASaveCourseMeta = (id) => {
    const title = document.getElementById('edit_c_title').value.trim();
    const domain = document.getElementById('edit_c_domain').value.trim();
    const price = document.getElementById('edit_c_price').value.trim();

    if(!title || !domain) return alert('Title and Domain are required.');

    const courses = window.NXA.getCourses();
    const idx = courses.findIndex(c => c.id === id);
    if(idx === -1) return;

    courses[idx] = { ...courses[idx], title, domain, price };
    window.NXA.saveCourses(courses);
    alert('METADATA_SYNC_SUCCESS');
    AppState.setView('course_admin');
};

window.NXAOpenCourseEditor = (id) => {
    AppState.setView('course_editor_' + id);
};

window.NXAAddResource = (courseId, type) => {
    const courses = window.NXA.getCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    if (type === 'ref') {
        const title = document.getElementById('res_ref_title').value;
        const url = document.getElementById('res_ref_url').value;
        if (!title || !url) return alert('Reference title and URL required.');
        if (!course.refs) course.refs = [];
        course.refs.push({ title, url });
        document.getElementById('res_ref_title').value = '';
        document.getElementById('res_ref_url').value = '';
    } else if (type === 'yt') {
        const title = document.getElementById('res_yt_title').value;
        const url = document.getElementById('res_yt_url').value;
        if (!title || !url) return alert('Video title and YouTube URL required.');
        const ytId = url.match(/(?:youtu\.be\/|v=)([^&\s]+)/)?.[1] || url;
        if (!course.videos) course.videos = [];
        course.videos.push({ title, ytId });
        document.getElementById('res_yt_title').value = '';
        document.getElementById('res_yt_url').value = '';
    } else if (type === 'doc') {
        const title = document.getElementById('res_doc_title').value;
        const url = document.getElementById('res_doc_url').value;
        if (!title || !url) return alert('Document title and link required.');
        if (!course.docs) course.docs = [];
        course.docs.push({ title, url });
        document.getElementById('res_doc_title').value = '';
        document.getElementById('res_doc_url').value = '';
    } else if (type === 'file') {
        const title = document.getElementById('res_file_title').value;
        const fileInput = document.getElementById('res_file_input');
        const file = fileInput.files[0];
        if (!title || !file) return alert('File title and file required.');
        if (file.size > 5 * 1024 * 1024) return alert('File too large. Max 5MB. Use a Drive link for larger files.');
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!course.docs) course.docs = [];
            course.docs.push({ title, url: e.target.result, type: file.type, isFile: true });
            window.NXA.saveCourses(courses);
            alert('File uploaded successfully!');
            AppState.setView('course_editor_' + courseId);
        };
        reader.readAsDataURL(file);
        return;
    }

    window.NXA.saveCourses(courses);
    AppState.setView('course_editor_' + courseId);
};

window.NXADeleteResource = (courseId, type, idx) => {
    const courses = window.NXA.getCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    if (type === 'ref') course.refs.splice(idx, 1);
    else if (type === 'yt') course.videos.splice(idx, 1);
    else if (type === 'doc') course.docs.splice(idx, 1);
    window.NXA.saveCourses(courses);
    if (typeof firebase !== 'undefined') Cloud.set('nxa_broadcasts', 'course_matrix', { list: courses });
    AppState.setView('course_editor_' + courseId);
};

window.NXAShowAssignModal = (courseId) => {
    const modal = document.getElementById('assignModal');
    const list = document.getElementById('studentAssignmentList');
    const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
    const students = Object.values(profiles);
    modal.style.display = 'flex';
    // Store courseId on modal for ASSIGN ALL
    modal.dataset.courseId = courseId;
    list.innerHTML = `
        <div style="display: flex; gap: 8px; margin-bottom: 1rem;">
            <button onclick="window.NXAAssignAll('${courseId}', true)" style="flex:1; padding: 10px; background: #00ff6a; color: #000; border: none; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">✅ ASSIGN ALL</button>
            <button onclick="window.NXAAssignAll('${courseId}', false)" style="flex:1; padding: 10px; background: rgba(255,69,69,0.1); color: #ff4545; border: 1px solid rgba(255,69,69,0.3); border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">✕ REMOVE ALL</button>
        </div>
        <div style="border-top: 1px solid var(--glass-border); padding-top: 1rem; display: grid; gap: 0.7rem;">
        ${students.map(s => {
            const isAssigned = (s.assigned_courses || []).includes(courseId);
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.8rem; border-radius: 10px; border: 1px solid var(--glass-border);">
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 800;">${s.fullname}</div>
                        <div style="font-size: 0.55rem; color: var(--text-dim);">${s.email}</div>
                    </div>
                    <button onclick="window.NXAToggleAssignment('${s.email}', '${courseId}', this)" style="background: ${isAssigned ? '#00ff6a' : 'transparent'}; color: ${isAssigned ? '#000' : '#fff'}; border: 1px solid ${isAssigned ? '#00ff6a' : 'var(--glass-border)'}; padding: 6px 12px; border-radius: 6px; font-size: 0.55rem; font-weight: 800;">
                        ${isAssigned ? '✓ YES' : 'ADD'}
                    </button>
                </div>
            `;
        }).join('')}
        </div>
    `;
};

window.NXAAssignAll = async (courseId, assign) => {
    const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
    Object.keys(profiles).forEach(email => {
        const s = profiles[email];
        if (!s.assigned_courses) s.assigned_courses = [];
        if (assign) {
            if (!s.assigned_courses.includes(courseId)) s.assigned_courses.push(courseId);
        } else {
            s.assigned_courses = s.assigned_courses.filter(id => id !== courseId);
        }
        profiles[email] = s;
    });
    localStorage.setItem('nxa_student_profiles', JSON.stringify(profiles));
    // Sync each student to Firebase
    if (typeof firebase !== 'undefined') {
        const saves = Object.entries(profiles).map(([email, s]) => Cloud.set('nxa_student_profiles', email, s));
        await Promise.all(saves);
    }
    alert(assign ? '✅ Course assigned to ALL students!' : '✕ Course removed from ALL students.');
    window.NXAShowAssignModal(courseId);
};

window.NXAToggleAssignment = async (email, courseId, btn) => {
    const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
    const s = profiles[email];
    if(!s) return;
    if(!s.assigned_courses) s.assigned_courses = [];
    const idx = s.assigned_courses.indexOf(courseId);
    if(idx > -1) {
        s.assigned_courses.splice(idx, 1);
        btn.innerText = 'ADD'; btn.style.background = 'transparent'; btn.style.color = '#fff';
        btn.style.border = '1px solid var(--glass-border)';
    } else {
        s.assigned_courses.push(courseId);
        btn.innerText = 'YES'; btn.style.background = '#00ff6a'; btn.style.color = '#000';
        btn.style.border = '1px solid #00ff6a';
    }
    profiles[email] = s;
    localStorage.setItem('nxa_student_profiles', JSON.stringify(profiles));
    if (typeof firebase !== 'undefined') await Cloud.set('nxa_student_profiles', email, s);
    window.dispatchEvent(new Event('nxa_internal_sync'));
};

class NXAEngine {
    constructor() {
        window.NXA = this;
        this.init();
    }

    init() {
        console.log("NXA CORE: INITIALIZING MODULES...");
        AppState.addListener((state) => this.render(state));

        // Pre-seed a default student account if none exist
        const users = JSON.parse(localStorage.getItem('nxa_users')) || [];
        if (users.length === 0) {
            users.push({ name: 'Student', email: 'student@nxa.com', pass: '123456' });
            localStorage.setItem('nxa_users', JSON.stringify(users));
        }

        // Fail-safe Mask Removal
        setTimeout(() => {
            this.clearMask();
            this.syncCloudState(); // INITIALIZE REAL-TIME UPLINK
            try { this.render(AppState); } catch(e) { console.error("NXA_RENDER_CRASH:", e); }
        }, 800);

        // Global Industrial Command Delegation
        document.addEventListener('click', (e) => {
            if (e.target.id === 'sendBroadcast') this.handleGlobalBroadcast();
            if (e.target.classList.contains('btn-delete')) this.handleDossierTermination(e.target.dataset.email);
        });
    }

    async handleGlobalBroadcast() {
        const msgInput = document.getElementById('broadcastMsg');
        const typeInput = document.getElementById('broadcastType');
        if (!msgInput || !typeInput) return;

        const msg = msgInput.value.trim();
        const type = typeInput.value;

        if (!msg) {
            alert('NXA_SIGNAL: Content required.');
            return;
        }

        const signal = { id: Date.now(), type, msg, time: 'Just Now', author: 'SUPER_ADMIN' };
        
        // 1. Local Failsafe
        const alerts = JSON.parse(localStorage.getItem('nxa_system_alerts')) || [];
        alerts.unshift(signal);
        localStorage.setItem('nxa_system_alerts', JSON.stringify(alerts));

        // 2. CLOUD DISPATCH
        await Cloud.set('nxa_broadcasts', String(signal.id), signal);

        // 3. FORCE LOCAL RE-RENDER & SYNC
        window.dispatchEvent(new Event('nxa_internal_sync')); 
        
        msgInput.value = '';
        alert('GLOBAL_SIGNAL_BROADCAST_SUCCESS');
    }

    showToastNotification(alertData) {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(-150px)';
        toast.style.background = 'rgba(10, 10, 15, 0.95)';
        toast.style.border = '1px solid var(--accent-primary)';
        toast.style.boxShadow = '0 10px 30px rgba(0,242,255,0.3)';
        toast.style.color = '#fff';
        toast.style.padding = '15px 25px';
        toast.style.borderRadius = '16px';
        toast.style.zIndex = '999999';
        toast.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        toast.style.width = '90%';
        toast.style.maxWidth = '400px';
        toast.style.backdropFilter = 'blur(10px)';
        
        toast.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 0.65rem; font-weight: 900; letter-spacing: 2px; color: var(--accent-primary);">NEW_SYSTEM_SIGNAL</span>
                <span style="font-size: 1rem; cursor: pointer;" onclick="this.parentElement.parentElement.remove()">✕</span>
            </div>
            <div style="font-size: 0.85rem; line-height: 1.4;">${alertData.msg}</div>
        `;
        
        document.body.appendChild(toast);
        
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        
        setTimeout(() => toast.style.transform = 'translateX(-50%) translateY(0)', 100);
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.transform = 'translateX(-50%) translateY(-150px)';
                setTimeout(() => { if (document.body.contains(toast)) toast.remove(); }, 400);
            }
        }, 6000);
    }

    syncCloudState() {
        if (typeof firebase === 'undefined') return;

        // IMMEDIATE COURSE FETCH on startup (don't wait for snapshot)
        firebase.firestore().collection('nxa_broadcasts').doc('course_matrix').get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data && data.list && Array.isArray(data.list) && data.list.length > 0) {
                    localStorage.setItem('nxa_system_courses', JSON.stringify(data.list));
                    this.render(AppState);
                }
            }
        });

        // IMMEDIATE PROJECT FETCH
        firebase.firestore().collection('nxa_broadcasts').doc('project_matrix').get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data && data.list) {
                    localStorage.setItem('nxa_industrial_projects', JSON.stringify(data.list));
                    if (AppState.view === 'projects') this.render(AppState);
                }
            }
        });

        // IMMEDIATE INTERNSHIP FETCH
        firebase.firestore().collection('nxa_broadcasts').doc('internship_matrix').get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data && data.list) {
                    localStorage.setItem('nxa_internship_matrix', JSON.stringify(data.list));
                    if (AppState.view === 'internships') this.render(AppState);
                }
            }
        });

        // IMMEDIATE STUDENT PROFILE FETCH (get latest assigned_courses)
        if (AppState.user && AppState.user.email) {
            firebase.firestore().collection('nxa_student_profiles').doc(AppState.user.email).get().then(doc => {
                if (doc.exists) {
                    const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
                    profiles[AppState.user.email] = doc.data();
                    localStorage.setItem('nxa_student_profiles', JSON.stringify(profiles));
                    this.render(AppState);
                }
            });
        }

        // SYNC IDENTITIES MATRIX
        firebase.firestore().collection('nxa_identities').onSnapshot(snap => {
            const localUsers = JSON.parse(localStorage.getItem('nxa_users')) || [];
            const cloudUsers = snap.docs.map(doc => doc.data());
            
            // Merge: Cloud takes priority for duplicates
            const userMap = {};
            localUsers.forEach(u => userMap[u.email] = u);
            cloudUsers.forEach(u => userMap[u.email] = u);
            
            const merged = Object.values(userMap);
            localStorage.setItem('nxa_users', JSON.stringify(merged));
            
            // Trigger local sync event for other tabs
            window.dispatchEvent(new Event('nxa_internal_sync')); 
            if (AppState.view === 'student_mgmt') this.render(AppState);
        });

        // SYNC BROADCAST MATRIX
        let firstAlertSync = true;
        let lastAlertId = 0;
        firebase.firestore().collection('nxa_broadcasts').onSnapshot(snap => {
            const alerts = snap.docs.map(doc => doc.data().id ? doc.data() : null).filter(a => a);
            alerts.sort((a,b) => b.id - a.id);
            localStorage.setItem('nxa_system_alerts', JSON.stringify(alerts));
            
            if (alerts.length > 0) {
                if (firstAlertSync) {
                    lastAlertId = alerts[0].id;
                    firstAlertSync = false;
                } else if (alerts[0].id > lastAlertId) {
                    lastAlertId = alerts[0].id;
                    if (AppState.user && AppState.role === 'student') {
                        this.showToastNotification(alerts[0]);
                    }
                }
            }
            if (AppState.view === 'notifications') this.render(AppState);
        });

        // SYNC MASTER PROFILES MATRIX (FULL DETAILS)
        firebase.firestore().collection('nxa_student_profiles').onSnapshot(snap => {
            const localProfiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
            const profiles = { ...localProfiles };
            snap.forEach(doc => { profiles[doc.id] = doc.data(); });
            localStorage.setItem('nxa_student_profiles', JSON.stringify(profiles));
            // Trigger local sync event for other tabs
            window.dispatchEvent(new Event('nxa_internal_sync')); 
            if (AppState.view === 'student_mgmt') this.render(AppState);
        });

        // SYNC LIVE CLASS MATRIX
        firebase.firestore().collection('nxa_broadcasts').doc('live_class_state').onSnapshot(doc => {
            if (doc.exists) {
                const liveData = doc.data();
                localStorage.setItem('nxa_live_broadcast', JSON.stringify(liveData));
                window.dispatchEvent(new Event('nxa_internal_sync'));
                if (AppState.view === 'live') this.render(AppState);
            }
        });

        // SYNC COURSE REPOSITORY (real-time for all devices)
        firebase.firestore().collection('nxa_broadcasts').doc('course_matrix').onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data && data.list && Array.isArray(data.list)) {
                    localStorage.setItem('nxa_system_courses', JSON.stringify(data.list));
                    if (AppState.view === 'courses' || AppState.view === 'course_admin' || (AppState.view && AppState.view.startsWith('course_editor_'))) {
                        this.render(AppState);
                    }
                }
            }
        });

        // SYNC ATTENDANCE SESSION (so students see QR window when admin starts)
        firebase.firestore().collection('nxa_broadcasts').doc('attendance_session').onSnapshot(doc => {
            if (doc.exists) {
                localStorage.setItem('nxa_attendance_session', JSON.stringify(doc.data()));
                if (AppState.view === 'attendance') this.render(AppState);
            }
        });

        // SYNC PROJECT MATRIX
        firebase.firestore().collection('nxa_broadcasts').doc('project_matrix').onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data && data.list) {
                    localStorage.setItem('nxa_industrial_projects', JSON.stringify(data.list));
                    if (AppState.view === 'projects') this.render(AppState);
                }
            }
        });

        // SYNC INTERNSHIP MATRIX
        firebase.firestore().collection('nxa_broadcasts').doc('internship_matrix').onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data && data.list) {
                    localStorage.setItem('nxa_internship_matrix', JSON.stringify(data.list));
                    if (AppState.view === 'internships') this.render(AppState);
                }
            }
        });

        // SYNC PAYMENT CONFIG
        firebase.firestore().collection('nxa_broadcasts').doc('payment_config').onSnapshot(doc => {
            if (doc.exists) {
                localStorage.setItem('nxa_payment_config', JSON.stringify(doc.data()));
                if (AppState.view === 'courses') this.render(AppState);
            }
        });
    }

    async handleDossierTermination(email) {
        if (!confirm(`CAUTION: Terminate identity dossier for ${email}?`)) return;
        
        // 1. Local Purge
        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
        delete profiles[email];
        localStorage.setItem('nxa_student_profiles', JSON.stringify(profiles));
        
        // 2. CLOUD PURGE
        try {
            await firebase.firestore().collection('nxa_student_profiles').doc(email).delete();
            await firebase.firestore().collection('nxa_identities').doc(email).delete();
            alert('DOSSIER_TERMINATED: Cloud record purged.');
        } catch(e) {
            console.error('TERMINATION_FAIL:', e);
            alert('LOCAL_PURGE_COMPLETE: Cloud sync pending...');
        }
        
        this.render(AppState);
    }

    clearMask() {
        const mask = document.getElementById('loading-mask');
        if (mask) {
            mask.style.opacity = '0';
            setTimeout(() => { if(mask.parentNode) mask.remove(); }, 600);
        }
    }

    render(state) {
        try {
            const root = DOM.root;
            if (!root) {
                console.error("NXA_FATAL: DOM ROOT NOT FOUND.");
                return;
            }

            if (!state.user) {
                this.mountAuth(state.view);
                return;
            }
            this.mountCore(state);
            
            if (state.view === 'attendance') {
                window.NXAInitAttendance(state.user.email);
            }
        } catch (error) {
            console.error('NXA_CORE_ERROR:', error);
            if (DOM.root) {
                DOM.root.innerHTML = `<div style="padding: 2rem; color: #ff4545; background: #000; height: 100vh;">
                    <h2>SYSTEM CRITICAL ERROR</h2>
                    <code>${error.message}</code>
                    <p>Please take a screenshot and tell the AI.</p>
                </div>`;
            }
        }
    }

    mountAuth(mode = 'login') {
        const root = DOM.root;
        if (!root) return;
        const isAdminMode = mode === 'admin';
        root.innerHTML = `
            <div class="auth-overlay ${isAdminMode ? 'admin-theme' : ''}">
                <div class="auth-card">
                    <div class="auth-header">
                        <span class="nx">NXA</span><span class="talent">TALENT</span>
                        <h2>${isAdminMode ? 'ADMIN COMMAND ACCESS' : (mode === 'login' ? 'IDENTITY ACCESS' : 'REGISTER CORE ID')}</h2>
                    </div>
                    
                    <form id="authForm">
                        ${mode === 'signup' ? `
                        <div class="input-block">
                            <label>FULL NAME</label>
                            <input type="text" id="name" required placeholder="Student Name">
                        </div>` : ''}
                        <div class="input-block">
                            <label>${isAdminMode ? 'ADMIN KEY' : 'CORE ID (EMAIL)'}</label>
                            <input type="${isAdminMode ? 'text' : 'email'}" id="email" required placeholder="${isAdminMode ? 'admin@nxa.core' : 'name@nxa.core'}">
                        </div>
                        <div class="input-block">
                            <label>ACCESS KEY</label>
                            <input type="password" id="pass" required placeholder="••••••••">
                        </div>
                        <button type="submit" id="submitBtn" class="btn-primary-lg ${isAdminMode ? 'btn-admin' : ''}">
                            ${isAdminMode ? 'SYSTEM ACCESS' : (mode === 'login' ? 'SIGN IN' : 'REGISTER ACCOUNT')}
                        </button>
                    </form>



                    <div class="auth-footer" style="margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 1.5rem; text-align: center;">
                        ${isAdminMode ? 
                            '<a href="#" id="toggleAuth" style="color: var(--accent-primary); font-size: 0.75rem; font-weight: 800; text-decoration: none; letter-spacing: 1px;">← RETURN TO STUDENT PORTAL</a>' : 
                            (mode === 'login' ? 
                                `<a href="#" id="toggleAuth" style="display: block; margin-bottom: 15px; color: var(--text-main); font-size: 0.75rem; text-decoration: none; font-weight: 800; letter-spacing: 1.5px;">CREATE NEW ACCOUNT</a>
                                 <div style="font-size: 0.6rem; opacity: 0.5;"><a href="#" id="toAdmin" style="color: var(--text-dim); text-decoration: none; letter-spacing: 2px;">ADMIN_ACCESS</a></div>` : 
                                `<a href="#" id="toggleAuth" style="display: block; color: var(--text-main); font-size: 0.75rem; text-decoration: none; font-weight: 800; letter-spacing: 1.5px;">ALREADY REGISTERED? SIGN IN</a>`)}
                    </div>
                </div>
            </div>
        `;

        const toggleBtn = document.getElementById('toggleAuth');
        if (toggleBtn) {
            toggleBtn.onclick = (e) => {
                e.preventDefault();
                this.mountAuth(isAdminMode ? 'login' : (mode === 'login' ? 'signup' : 'login'));
            };
        }

        const adminBtn = document.getElementById('toAdmin');
        if (adminBtn) {
            adminBtn.onclick = (e) => {
                e.preventDefault();
                this.mountAuth('admin');
            };
        }

        const self = this;
        const handleSubmit = (e) => {
            if (e) e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const emailInput = document.getElementById('email');
            const passInput = document.getElementById('pass');
            
            if (!emailInput || !passInput || !btn) return;
            
            const email = emailInput.value.trim().toLowerCase();
            const pass = passInput.value;
            
            if (!email || !pass) { 
                alert('NXA_SECURITY: Email and Access Key are required.'); 
                return; 
            }

            btn.innerText = 'SYNCHRONIZING...';
            btn.disabled = true;

            // Direct execution to prevent timeout context loss
            try {
                if (isAdminMode) {
                    self.handleAdminLogin(email, pass);
                } else if (mode === 'signup') {
                    const nameInput = document.getElementById('name');
                    const name = nameInput ? nameInput.value.trim() : 'Student';
                    self.handleRegister(name, email, pass);
                } else {
                    self.handleLogin(email, pass);
                }
            } catch (err) {
                console.error('HANDSHAKE_CRITICAL_FAILURE:', err);
                alert('CRITICAL: Handshake failed. Attempting force-boot...');
                AppState.setUser({ name: 'User', email: email }, 'student');
            }
        };

        const authForm = document.getElementById('authForm');
        const submitBtn = document.getElementById('submitBtn');
        if (authForm) authForm.onsubmit = (e) => handleSubmit(e);
        if (submitBtn) submitBtn.onclick = (e) => handleSubmit(e);
    }

    handleAdminLogin(key, pass) {
        const ADMIN_MATRIX = {
            'nxasupertalent@gmail.com': { pass: 'NXA1426', type: 'super', label: 'SUPER ADMIN' },
            'nxamaxtalent@gmail.com': { pass: 'NXA1526', type: 'max', label: 'MAX ADMIN' },
            'nxacentertalent@gmail.com': { pass: 'NXA1626', type: 'center', label: 'CENTER ADMIN' }
        };

        const admin = ADMIN_MATRIX[key];
        if (admin && admin.pass === pass) {
            alert(`${admin.label} VERIFIED. INITIALIZING TRI-ADMIN COMMAND CORE.`);
            AppState.setUser({ name: admin.label, email: key }, 'admin', admin.type);
        } else {
            alert("SECURITY BREACH: INVALID COMMAND CREDENTIALS.");
        }
    }

    showPaymentGateway(courseId, price) {
        const courses = this.getCourses();
        const course = courses.find(c => c.id === courseId);
        if(!course) return;

        const modal = document.getElementById('course_pay_gateway');
        const title = document.getElementById('pay_course_title');
        const priceLabel = document.getElementById('pay_course_price');
        const confirmBtn = document.getElementById('confirm_pay_btn');
        const qrContainer = document.getElementById('pay_qr_container');

        title.innerText = `FOR COURSE: ${course.title.toUpperCase()}`;
        priceLabel.innerText = `₹${price}`;
        confirmBtn.onclick = () => window.NXAConfirmPayment(courseId);
        
        // DYNAMIC QR GENERATION (UPI PROTOCOL)
        const payConfig = JSON.parse(localStorage.getItem('nxa_payment_config')) || { upi: '' };
        qrContainer.innerHTML = ''; // Reset
        
        if (payConfig.qr && payConfig.qr.startsWith('http')) {
            qrContainer.innerHTML = `<img src="${payConfig.qr}" style="width: 180px; height: 180px; background: #fff; padding: 10px; border-radius: 12px; margin-bottom: 10px;">`;
        } else {
            // Generate UPI QR
            const upiUrl = `upi://pay?pa=${payConfig.upi}&pn=NXA_TALENT&am=${price}&cu=INR`;
            const qrDiv = document.createElement('div');
            qrDiv.id = 'dynamic_upi_qr';
            qrDiv.style.background = '#fff';
            qrDiv.style.padding = '10px';
            qrDiv.style.borderRadius = '12px';
            qrDiv.style.display = 'inline-block';
            qrDiv.style.marginBottom = '10px';
            qrContainer.appendChild(qrDiv);
            
            setTimeout(() => {
                new QRCode(qrDiv, {
                    text: upiUrl,
                    width: 180,
                    height: 180,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            }, 100);
        }
        
        modal.style.display = 'flex';
    }

    async handleRegister(name, emailRaw, pass) {
        try {
            const email = emailRaw.toLowerCase().trim();
            const newUser = { name, email, pass, role: 'student', date: new Date().toISOString() };
            
            // 1. Local Persistence (Failsafe)
            const users = JSON.parse(localStorage.getItem('nxa_users')) || [];
            if (!users.find(u => u.email.toLowerCase() === email)) {
                users.push(newUser);
                localStorage.setItem('nxa_users', JSON.stringify(users));
            }

            // 2. CLOUD MANIFESTATION (Critical for Super Admin)
            // CLOUD SYNC
            await Cloud.set('nxa_identities', email, newUser);
            
            // FORCE CROSS-TAB SYNC
            window.dispatchEvent(new Event('nxa_internal_sync'));

            alert("REGISTRATION_SUCCESS: Core ID Manifested. Proceed to Sign In.");
            AppState.setUser(newUser);
        } catch (err) {
            console.error('REG_ERROR:', err);
            alert("HANDSHAKE_ERROR: Retrying local manifest...");
            AppState.setUser({ name: 'User', email: emailRaw }, 'student');
        }
    }

    handleLogin(emailRaw, pass) {
        try {
            const email = emailRaw.toLowerCase().trim();
            let users = [];
            try {
                users = JSON.parse(localStorage.getItem('nxa_users')) || [];
            } catch(e) { users = []; }

            const userByEmail = users.find(u => u.email.toLowerCase() === email);
            
            if (!userByEmail) {
                alert("IDENTITY NOT FOUND: Ensure Email is registered.");
                const btn = document.getElementById('submitBtn');
                if (btn) { btn.innerText = 'INITIALIZE SESSION'; btn.disabled = false; }
                return;
            }
            
            if (userByEmail.pass !== pass) {
                alert("PASSKEY ERROR: Incorrect password.");
                const btn = document.getElementById('submitBtn');
                if (btn) { btn.innerText = 'INITIALIZE SESSION'; btn.disabled = false; }
                return;
            }
            
            AppState.setUser(userByEmail);
        } catch (err) {
            console.error('LOGIN_ERROR:', err);
            AppState.setUser({ name: 'Emergency Identity', email: emailRaw }, 'student');
        }
    }

    mountCore(state) {
        const isSuper = state.role === 'admin' && state.roleType === 'super';
        const isMax = state.role === 'admin' && state.roleType === 'max';
        const isCenter = state.role === 'admin' && state.roleType === 'center';
        const isStudent = state.role === 'student';

        DOM.root.innerHTML = `
            <nav class="navbar" style="display: ${state.view === 'home' ? 'flex' : 'none'};">
                <div class="nav-container">
                    <div class="logo" onclick="AppState.setView('home')" style="cursor: pointer;">
                        <button id="menuToggle" class="btn-icon" style="background:none; border:none; color:white; font-size:1.5rem; margin-right:10px; cursor:pointer;">☰</button>
                        <span class="nx" style="margin-left: 5px;">NXA</span><span class="talent">TALENT</span>
                        <div style="font-size: 8px; color: var(--accent-primary); margin-left: 10px; font-weight: 900;">v5.8</div>
                    </div>
                    <div class="user-meta" style="display: flex; align-items: center; gap: 15px;">
                        <div onclick="AppState.setView('notifications')" style="cursor: pointer; position: relative; display: flex; align-items: center; color: var(--text-dim); transition: 0.3s; padding: 8px;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.7;"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                            <div style="position: absolute; top: 6px; right: 6px; width: 6px; height: 6px; background: #ff4545; border-radius: 50%; border: 1px solid #000;"></div>
                        </div>
                        <div class="user-display" style="border-left: 1px solid var(--glass-border); padding-left: 10px;">
                            <span class="name" style="font-size: 0.75rem;">${state.user.name.split(' ')[0]}</span>
                            <span class="status" style="font-size: 0.5rem; color: var(--accent-primary);">${state.role.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </nav>
            <nav class="sidebar-nav" id="sidebar">
                <div class="sidebar-item ${state.view === 'home' ? 'active' : ''}" data-view="home"><span class="icon">🏠</span> Home</div>
                ${isStudent ? `
                <div class="sidebar-item ${state.view === 'leetcode' ? 'active' : ''}" data-view="leetcode"><span class="icon">💻</span> Leet Code</div>
                <div class="sidebar-item ${state.view === 'attendance' ? 'active' : ''}" data-view="attendance"><span class="icon">📅</span> Attendance</div>
                <div class="sidebar-item ${state.view === 'projects' ? 'active' : ''}" data-view="projects"><span class="icon">📂</span> Projects</div>
                <div class="sidebar-item ${state.view === 'internships' ? 'active' : ''}" data-view="internships"><span class="icon">🤝</span> Internships</div>
                <div class="sidebar-item ${state.view === 'career' ? 'active' : ''}" data-view="career"><span class="icon">🚀</span> Career</div>
                ` : ''}
                
                ${isSuper || isMax || isCenter ? `
                <div class="sidebar-item ${state.view === 'home' ? 'active' : ''}" data-view="home"><span class="icon">📊</span> Admin Panel</div>
                <div class="sidebar-item ${state.view === 'student_mgmt' ? 'active' : ''}" data-view="student_mgmt"><span class="icon">⚙️</span> Student Dossiers</div>
                ` : ''}

                <div style="margin-top: auto; padding: 16px 20px; border-top: 1px solid var(--glass-border);">
                    <div style="font-size: 0.55rem; color: var(--text-dim); margin-bottom: 8px; letter-spacing: 1px;">${state.user.email}</div>
                    <button onclick="if(confirm('Are you sure you want to logout?')) AppState.logout()" style="width: 100%; padding: 12px; background: rgba(255,69,69,0.1); border: 1px solid rgba(255,69,69,0.4); color: #ff4545; border-radius: 10px; cursor: pointer; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px;">🚪 LOGOUT</button>
                </div>
            </nav>

            <main id="app-viewport">
                ${this.renderView(state)}
            </main>

            <div class="bottom-nav">
                <!-- HOME ICON -->
                <div class="bottom-nav-item ${state.view === 'home' ? 'active' : ''}" data-view="home">
                    <svg class="icon-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-10 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                </div>
                ${isStudent ? `
                    <!-- LIVE ICON -->
                    <div class="bottom-nav-item ${state.view === 'live' ? 'active' : ''}" data-view="live">
                        <svg class="icon-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5.337 5.337a8 8 0 0111.326 0M8.165 8.165a4 4 0 015.67 0M11 11a1 1 0 112 0 1 1 0 01-2 0m-3.924 3.924a4 4 0 01-5.67 0m11.326 1.402a8 8 0 01-11.326 0"/></svg>
                    </div>
                    <!-- COURSES ICON WITH LOCK STATUS -->
                    ${(() => {
                        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
                        const p = profiles[state.user.email] || {};
                        const config = JSON.parse(localStorage.getItem('nxa_payment_config')) || { fee: '0' };
                        const paid = p.payment_status === 'verified' || String(config.fee) === '0';
                        return `
                            <div class="bottom-nav-item ${state.view === 'courses' ? 'active' : ''}" data-view="courses">
                                ${paid ? `
                                    <svg class="icon-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                                ` : `
                                    <div style="position: relative;">
                                        <svg class="icon-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.4;"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                                        <span style="position: absolute; top: -5px; right: -5px; font-size: 10px;">🔒</span>
                                    </div>
                                `}
                            </div>
                        `;
                    })()}
                    <!-- SELF ICON -->
                    <div class="bottom-nav-item ${state.view === 'self' ? 'active' : ''}" data-view="self">
                        <svg class="icon-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                ` : `
                    ${(isSuper || isCenter || state.user.email === 'nxasupertalent@gmail.com') ? `
                    <div class="bottom-nav-item ${state.view === 'student_mgmt' ? 'active' : ''}" data-view="student_mgmt" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;">
                        <span style="font-size: 1.1rem;">📂</span>
                        <span style="font-size: 0.5rem; font-weight: 800; letter-spacing: 1px;">DOSSIERS</span>
                    </div>` : ''}
                    ${(isSuper || isMax || state.user.email === 'nxasupertalent@gmail.com') ? `
                    <div class="bottom-nav-item ${state.view === 'live' ? 'active' : ''}" data-view="live" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;">
                        <span style="font-size: 1.1rem;">📡</span>
                        <span style="font-size: 0.5rem; font-weight: 800; letter-spacing: 1px;">LIVE</span>
                    </div>` : ''}
                    ${(isSuper || isMax || state.user.email === 'nxasupertalent@gmail.com') ? `
                    <div class="bottom-nav-item ${state.view === 'courses' ? 'active' : ''}" data-view="courses" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;">
                        <span style="font-size: 1.1rem;">📚</span>
                        <span style="font-size: 0.5rem; font-weight: 800; letter-spacing: 1px;">COURSES</span>
                    </div>` : ''}
                    ${(isSuper || isCenter || state.user.email === 'nxasupertalent@gmail.com') ? `
                    <div class="bottom-nav-item ${state.view === 'notifications' ? 'active' : ''}" data-view="notifications" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;">
                        <span style="font-size: 1.1rem;">🔔</span>
                        <span style="font-size: 0.5rem; font-weight: 800; letter-spacing: 1px;">SIGNALS</span>
                    </div>` : ''}
                `}
            </div>
        `;

        document.querySelectorAll('.sidebar-item, .bottom-nav-item').forEach(item => {
            item.onclick = () => {
                const view = item.dataset.view;
                if (view) AppState.setView(view);
                document.getElementById('sidebar').classList.remove('open');
            };
        });

        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.onclick = () => {
                document.getElementById('sidebar').classList.toggle('open');
            };
        }
    }


    renderView(state) {
        if (state.view === 'home') return this.viewHome(state);
        if (state.view === 'register') return this.viewRegister(state);
        if (state.view === 'student_mgmt') return this.viewStudentManagement(state);
        if (state.view === 'attendance') return this.viewAttendance(state);
        if (state.view === 'projects') return this.viewProjects(state);
        if (state.view === 'internships') return this.viewInternships(state);
        if (state.view === 'internship_assessment') return this.viewInternshipAssessment(state);
        if (state.view === 'internship_assessment_result_pass') return this.viewAssessmentSuccess(state);
        if (state.view === 'leetcode') return this.viewLeetcode(state);
        if (state.view === 'notifications') return this.viewNotifications(state);
        if (state.view === 'live') return this.viewLive(state);
        if (state.view === 'courses') return (state.role === 'admin' || state.user.email === 'nxasupertalent@gmail.com') ? this.viewCourseAdmin(state) : this.viewCourses(state);
        if (state.view === 'self') return this.viewSelf(state);
        if (state.view === 'career') return this.viewCareer(state);
        if (state.view === 'course_admin') return this.viewCourseAdmin(state);
        if (state.view && state.view.startsWith('course_editor_')) {
            const courseId = state.view.replace('course_editor_', '');
            return this.viewCourseEditor(state, courseId);
        }
        if (state.view && state.view.startsWith('course_view_')) {
            const courseId = state.view.replace('course_view_', '');
            return this.viewCourseDetail(state, courseId);
        }
    }

    viewRegister(state, isEditing = false) {
        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
        const emailKey = state.user.email.toLowerCase().trim();
        const existing = profiles[emailKey];

        if (existing && existing.submittedAt && !isEditing) {
            return `<section class="section" style="display:flex; align-items:center; justify-content:center; height:80vh;">
                <div style="background: var(--glass-bg); border: 1px solid var(--accent-primary); border-radius: 24px; padding: 2.5rem; text-align: center; box-shadow: 0 0 30px rgba(0,242,255,0.1);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
                    <h2 class="glitch-text" style="font-size: 1.5rem; margin-bottom: 0.5rem;">IDENTITY_SYNCED</h2>
                    <p style="color: var(--text-dim); font-size: 0.8rem;">Core identity manifested on ${existing.submittedAt}</p>
                    <button onclick="AppState.setView('self')" class="btn-primary" style="margin-top: 2rem; padding: 12px 35px;">VIEW DOSSIER</button>
                </div>
            </section>`;
        }

        const f = (id, label, placeholder = '', type = 'text', val = '') => `
            <div class="input-block" style="margin-bottom: 0.6rem;">
                <label style="font-size: 0.5rem; letter-spacing: 1px; color: var(--accent-primary); font-weight: 800; margin-bottom: 4px;">${label}</label>
                <input id="${id}" type="${type}" value="${val}" placeholder="${placeholder}" style="background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border); padding: 0.5rem 0.8rem; font-size: 0.75rem; border-radius: 8px; width: 100%; color: #fff;">
            </div>
        `;

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow: hidden; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem;">
                    <div>
                        <h2 style="font-family: var(--font-heading); font-size: 1.3rem; margin:0; line-height:1;">${isEditing ? 'RE-SYNC' : 'IDENTITY_DOSSIER'}</h2>
                        <span style="font-size: 0.55rem; color: var(--text-dim); letter-spacing: 2px;">SEC_LEVEL_01 // CORE_REGISTRATION</span>
                    </div>
                </div>

                <form id="dossierForm" style="flex: 1; overflow-y: auto; padding-right: 5px;">
                    <!-- BLOCK 1: PERSONAL MATRIX -->
                    <div style="background: rgba(255,255,255,0.02); padding: 0.8rem; border-radius: 12px; margin-bottom: 1rem; border-left: 2px solid var(--accent-primary);">
                        <div style="font-size: 0.6rem; font-weight: 900; margin-bottom: 0.8rem; color: var(--text-dim);">[ 01_PERSONAL_CORE ]</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                            ${f('d_fullname', 'FULL NAME', 'Amit ...', 'text', existing?.fullname)}
                            ${f('d_email', 'CORE_ID (FIXED)', '', 'text', state.user.email)}
                            ${f('d_phone', 'PHONE_UPLINK', '+91...', 'tel', existing?.phone)}
                            ${f('d_dob', 'DATE_OF_BIRTH', '', 'date', existing?.dob)}
                            <div class="input-block">
                                <label style="font-size: 0.5rem; color: var(--accent-primary); font-weight:800;">GENDER</label>
                                <select id="d_gender" style="width:100%; background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border); padding: 0.5rem; color: white; border-radius: 8px; font-size: 0.75rem;">
                                    <option value="Male" ${existing?.gender === 'Male' ? 'selected' : ''}>MALE</option>
                                    <option value="Female" ${existing?.gender === 'Female' ? 'selected' : ''}>FEMALE</option>
                                </select>
                            </div>
                            ${f('d_address', 'IDENTITY_LOCATION', 'City, State', 'text', existing?.address)}
                        </div>
                    </div>

                    <!-- BLOCK 2: ACADEMIC PROTOCOLS -->
                    <div style="background: rgba(255,255,255,0.02); padding: 0.8rem; border-radius: 12px; margin-bottom: 1rem; border-left: 2px solid #00ff6a;">
                        <div style="font-size: 0.6rem; font-weight: 900; margin-bottom: 0.8rem; color: var(--text-dim);">[ 02_ACADEMIC_METRICS ]</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                            ${f('d_usn', 'USN_ID', 'University ID', 'text', existing?.usn)}
                            ${f('d_branch', 'DEPT_CORE', 'CSE/ECE', 'text', existing?.branch)}
                            ${f('d_sem', 'CURRENT_SEM', '1-8', 'number', existing?.sem)}
                            ${f('d_passingyear', 'EST_PASS_YEAR', '2027', 'number', existing?.passingyear)}
                            ${f('d_10th', '10TH_METRIC (%)', 'XX.X', 'text', existing?.marks10)}
                            ${f('d_12th', '12TH/DIP_METRIC (%)', 'XX.X', 'text', existing?.marks12)}
                            <div class="input-block" style="grid-column: span 2;">
                                ${f('d_college', 'INSTITUTE_NAME', 'Full College Name', 'text', existing?.college)}
                            </div>
                            ${f('d_cgpa', 'CORE_CGPA', '0.00', 'text', existing?.cgpa)}
                            ${f('d_domain', 'SKILL_DOMAIN', 'Web/AI', 'text', existing?.domain)}
                        </div>
                    </div>

                    <!-- BLOCK 3: GLOBAL UPLINKS -->
                    <div style="background: rgba(255,255,255,0.02); padding: 0.8rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 2px solid #ffcc00;">
                        <div style="font-size: 0.6rem; font-weight: 900; margin-bottom: 0.8rem; color: var(--text-dim);">[ 03_GLOBAL_UPLINKS ]</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                            ${f('d_linkedin', 'LINKEDIN_UPLINK', 'https://...', 'text', existing?.linkedin)}
                            ${f('d_github', 'GITHUB_CORE', 'https://...', 'text', existing?.github)}
                            <div class="input-block" style="grid-column: span 2;">
                                ${f('d_skills', 'SKILL_MATRIX (CSV)', 'JS, Java, Python...', 'text', existing?.skills)}
                            </div>
                            ${f('d_pname', 'PARENT_IDENTITY', 'Full Name', 'text', existing?.pname)}
                            ${f('d_pphone', 'PARENT_UPLINK', '+91...', 'tel', existing?.pphone)}
                        </div>
                    </div>

                    <div style="padding-bottom: 150px;">
                        <button type="button" onclick="window.NXASubmitDossier(event)" id="dossierSubmit" class="btn-primary" style="width: 100%; height: 50px; font-weight: 900; letter-spacing: 2px; margin-bottom: 2rem; box-shadow: 0 10px 20px rgba(0,242,255,0.2);">
                            AUTHORIZE_IDENTITY_MANIFEST
                        </button>
                    </div>
                </form>
            </section>
        `;
    }

    viewNotifications(state) {
        const isAdmin = state.role === 'admin' || state.user.email === 'nxasupertalent@gmail.com';
        const customAlerts = JSON.parse(localStorage.getItem('nxa_system_alerts')) || [];
        const defaultAlerts = [
            { id: 'def1', type: 'SYSTEM', msg: 'Core AI Matrix Updated to v1.2', time: 'SYSTEM' },
            { id: 'def2', type: 'FOUNDER', msg: 'Welcome to NXA Talent Industrial Portal.', time: 'NARENDRA' }
        ];
        const alerts = [...customAlerts, ...defaultAlerts];

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto; padding-bottom: 120px;">

                ${isAdmin ? `
                <!-- ADMIN BROADCAST PANEL -->
                <div style="background: rgba(0,242,255,0.04); border: 1px solid var(--accent-primary); border-radius: 20px; padding: 1.2rem; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 0.75rem; font-weight: 900; letter-spacing: 3px; color: var(--accent-primary);">📡 BROADCAST SIGNAL</h3>
                    <div style="display: grid; gap: 0.8rem;">
                        <textarea id="broadcastMsg" placeholder="Type your message to all students..." style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border); padding: 12px; border-radius: 12px; color: #fff; font-size: 0.85rem; outline: none; min-height: 80px; resize: none; box-sizing: border-box;"></textarea>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <select id="broadcastType" style="flex:1; background: #000; border: 1px solid var(--glass-border); color: #fff; padding: 10px; border-radius: 10px; font-size: 0.7rem; font-weight: 800;">
                                <option value="SIGNAL">📢 SIGNAL</option>
                                <option value="ALERT">🚨 ALERT</option>
                                <option value="FOUNDER">👑 FOUNDER</option>
                                <option value="SYSTEM">⚙️ SYSTEM</option>
                            </select>
                            <button id="sendBroadcast" style="background: var(--accent-primary); color: #000; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 900; font-size: 0.7rem; cursor: pointer; white-space: nowrap;">⚡ DISPATCH</button>
                        </div>
                    </div>
                </div>` : ''}

                <h2 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 1.5rem; letter-spacing: -1px;">SIGNAL_FEED</h2>
                <div style="display: grid; gap: 1rem;">
                    ${alerts.map(a => `
                        <div style="background: var(--glass-bg); padding: 1.2rem; border-radius: 16px; border: 1px solid var(--glass-border); position: relative; overflow: hidden;">
                            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${a.type === 'ALERT' ? '#ff4545' : a.type === 'FOUNDER' ? '#ffcc00' : 'var(--accent-primary)'};"></div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                                <span style="font-size: 0.5rem; font-weight: 900; letter-spacing: 2px; color: ${a.type === 'ALERT' ? '#ff4545' : a.type === 'FOUNDER' ? '#ffcc00' : 'var(--accent-primary)'};">[ ${a.type} ]</span>
                                <span style="font-size: 0.5rem; color: var(--text-dim);">${a.time || 'NOW'}</span>
                            </div>
                            <p style="color: #fff; font-size: 0.9rem; line-height: 1.6; margin: 0;">${a.msg}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }


    viewStudentManagement(state) {
        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
        const students = Object.values(profiles);
        const allUsers = JSON.parse(localStorage.getItem('nxa_users')) || [];
        
        const profileEmails = Object.keys(profiles).map(e => e.toLowerCase());
        const pending = allUsers.filter(u => u.email && !profileEmails.includes(u.email.toLowerCase()));

        const isSuper = state.role === 'admin' && state.roleType === 'super';
        const isMax = state.role === 'admin' && state.roleType === 'max';
        const isCenter = state.role === 'admin' && state.roleType === 'center';
        const activeTab = state.adminTab || 'dossiers';

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto; background: #000;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="font-family: var(--font-heading); font-size: 1.5rem; margin:0; letter-spacing: 1px; color: #fff;">COMMAND_CENTER_v4</h2>
                    <button onclick="window.location.reload()" style="background: rgba(255,255,255,0.05); color: var(--text-dim); border: 1px solid var(--glass-border); padding: 8px 15px; border-radius: 8px; font-size: 0.55rem; font-weight: 800; cursor: pointer;">
                        FORCE_SYNC
                    </button>
                </div>

                <!-- DASHBOARD TABS -->
                <div style="display: flex; gap: 10px; margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 10px;">
                    <button onclick="AppState.adminTab='dossiers'; NXA.render(AppState)" style="background: ${activeTab === 'dossiers' ? 'var(--accent-primary)' : 'transparent'}; color: ${activeTab === 'dossiers' ? '#000' : '#fff'}; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">DOSSIERS (${students.length})</button>
                    <button onclick="AppState.adminTab='pending'; NXA.render(AppState)" style="background: ${activeTab === 'pending' ? '#ffcc00' : 'transparent'}; color: ${activeTab === 'pending' ? '#000' : '#fff'}; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">PENDING (${pending.length})</button>
                </div>

                ${activeTab === 'dossiers' ? `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                        ${students.length === 0 ? `
                            <div style="grid-column:1/-1; padding: 5rem; text-align: center; color: var(--text-dim); border: 1px dashed var(--glass-border); border-radius: 20px;">ZERO_ACTIVE_DOSSIERS_IN_MATRIX</div>
                        ` : students.map(s => `
                            <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 24px; padding: 1.8rem; position: relative; animation: cardManifest 0.4s ease-out;">
                                <div style="position: absolute; left: 0; top: 2rem; bottom: 2rem; width: 4px; background: var(--accent-primary); border-radius: 0 4px 4px 0;"></div>
                                
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                                    <div>
                                        <h3 style="font-size: 1.2rem; color: #fff; margin:0; font-family: var(--font-heading);">${s.fullname}</h3>
                                        <span style="color: var(--accent-primary); font-size: 0.6rem; font-weight: 900; letter-spacing: 1px;">${s.email.toUpperCase()}</span>
                                        <div style="margin-top: 8px;">
                                            <span style="font-size: 0.5rem; background: ${s.payment_status === 'verified' ? 'rgba(0, 255, 106, 0.1)' : 'rgba(255, 69, 69, 0.1)'}; color: ${s.payment_status === 'verified' ? '#00ff6a' : '#ff4545'}; padding: 2px 8px; border-radius: 4px; font-weight: 800; border: 1px solid ${s.payment_status === 'verified' ? '#00ff6a' : '#ff4545'};">PAYMENT: ${s.payment_status === 'verified' ? 'VERIFIED ✓' : 'PENDING 🔒'}</span>
                                        </div>
                                    </div>
                                    <div style="background: rgba(0, 242, 255, 0.1); color: var(--accent-primary); padding: 4px 8px; border-radius: 4px; font-size: 0.5rem; font-weight: 900;">CGPA: ${s.cgpa || 'N/A'}</div>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.65rem; color: var(--text-dim);">
                                    <div><span style="display: block; font-size: 0.45rem; opacity: 0.5;">IDENTITY_USN</span><span style="color: #fff;">${s.usn || '-'}</span></div>
                                    <div><span style="display: block; font-size: 0.45rem; opacity: 0.5;">BRANCH</span><span style="color: #fff;">${s.branch || '-'}</span></div>
                                    <div><span style="display: block; font-size: 0.45rem; opacity: 0.5;">SEM</span><span style="color: #fff;">${s.sem || '-'}</span></div>
                                    <div><span style="display: block; font-size: 0.45rem; opacity: 0.5;">COLLEGE</span><span style="color: #fff;">${s.college || '-'}</span></div>
                                    <div><span style="display: block; font-size: 0.45rem; opacity: 0.5;">PHONE</span><span style="color: #fff;">${s.phone || '-'}</span></div>
                                    <div><span style="display: block; font-size: 0.45rem; opacity: 0.5;">PASS_YEAR</span><span style="color: #fff;">${s.passingyear || '-'}</span></div>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.65rem; color: var(--text-dim); margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed rgba(255,255,255,0.1);">
                                    <div style="grid-column: span 2;"><span style="display: block; font-size: 0.45rem; opacity: 0.5;">SKILL_MATRIX</span><span style="color: var(--accent-primary); font-weight: 800;">${s.skills || 'NO_SKILLS_MANIFESTED'}</span></div>
                                    <div><span style="display: block; font-size: 0.45rem; opacity: 0.5;">LINKEDIN</span><span style="color: #fff; word-break: break-all;">${s.linkedin || '-'}</span></div>
                                    <div><span style="display: block; font-size: 0.45rem; opacity: 0.5;">GITHUB</span><span style="color: #fff; word-break: break-all;">${s.github || '-'}</span></div>
                                    <div><span style="display: block; font-size: 0.45rem; opacity: 0.5;">PARENT_IDENTITY</span><span style="color: #fff;">${s.pname || '-'}</span></div>
                                    <div><span style="display: block; font-size: 0.45rem; opacity: 0.5;">PARENT_PHONE</span><span style="color: #fff;">${s.pphone || '-'}</span></div>
                                </div>

                                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px;">
                                    <button class="btn-delete" data-email="${s.email}" style="width: 100%; background: rgba(255, 69, 69, 0.1); color: #ff4545; border: 1px solid rgba(255, 69, 69, 0.2); padding: 10px; border-radius: 8px; font-size: 0.6rem; font-weight: 900; letter-spacing: 1px; cursor: pointer;">PURGE_DOSSIER</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${activeTab === 'pending' ? `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
                        ${pending.length === 0 ? `
                            <div style="grid-column:1/-1; padding: 5rem; text-align: center; color: var(--text-dim); border: 1px dashed var(--glass-border); border-radius: 20px;">ZERO_PENDING_REGISTRATIONS</div>
                        ` : pending.map(u => `
                            <div style="background: rgba(255, 204, 0, 0.03); border: 1px solid rgba(255, 204, 0, 0.1); border-radius: 16px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-size: 0.85rem; font-weight: 800; color: #fff;">${u.name}</div>
                                    <div style="font-size: 0.55rem; color: #ffcc00; letter-spacing: 1px;">${u.email}</div>
                                </div>
                                <span style="font-size: 0.45rem; font-weight: 900; background: rgba(255, 204, 0, 0.2); padding: 4px 8px; border-radius: 6px; color: #ffcc00;">ACCOUNT_ONLY</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}


            </section>
        `;
    }

    viewAttendance(state) {
        const isAdmin = state.role === 'admin' || state.user.email === 'nxasupertalent@gmail.com';
        const session  = JSON.parse(localStorage.getItem('nxa_attendance_session')) || { active: false };
        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
        const myProfile = profiles[state.user.email] || {};
        const myAttendance = myProfile.attendance || {};

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const monthDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();

        // Check if attendance window is open
        const isWindowActive = (() => {
            if (!session.active || !session.time) return false;
            const [h, m] = session.time.split(':');
            const target = new Date();
            target.setHours(parseInt(h), parseInt(m), 0, 0);
            const diffInMin = (now - target) / (1000 * 60);
            return diffInMin >= -15 && diffInMin <= 30;
        })();

        const alreadyMarked = myAttendance[todayStr] === true;

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto; padding-bottom: 120px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 0; letter-spacing: 2px;">ATTENDANCE_NEXUS</h2>
                        <span style="color: ${isWindowActive ? '#00ff6a' : 'var(--text-dim)'}; font-size: 0.55rem; font-weight: 800;">
                            ${isWindowActive ? '🟢 SESSION ACTIVE' : '⚫ STANDBY'}
                            ${session.time ? ' · ' + session.time : ''}
                        </span>
                    </div>
                    <div style="text-align: right; color: var(--text-dim); font-size: 0.5rem; font-weight: 800;">${now.toDateString().toUpperCase()}</div>
                </div>

                ${isAdmin ? `
                <!-- ═══ ADMIN PANEL ═══ -->
                <div style="background: var(--glass-bg); padding: 1.2rem; border-radius: 20px; border: 1px solid var(--accent-primary); margin-bottom: 1.5rem;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 0.75rem; letter-spacing: 2px; color: var(--accent-primary);">⚓ SESSION ANCHOR</h3>
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                        <input id="scheduled_time" type="time" value="${session.time || '10:00'}" style="flex:1; padding: 10px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(0,0,0,0.5); color: #fff; font-size: 0.9rem;">
                        <button onclick="window.NXAAnchorSession()" style="background: var(--accent-primary); color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">ANCHOR</button>
                        ${session.active ? `<button onclick="window.NXAStopSession()" style="background: rgba(255,69,69,0.1); color: #ff4545; border: 1px solid #ff4545; padding: 10px 16px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">STOP</button>` : ''}
                    </div>
                    <p style="font-size: 0.45rem; color: var(--text-dim); text-transform: uppercase;">QR window: 15 min before → 30 min after session time</p>

                    <!-- QR SCANNER -->
                    <div style="margin-top: 1rem; border-top: 1px dashed var(--glass-border); padding-top: 1rem;">
                        <button id="toggleScanner" onclick="window.NXAToggleScanner(this)" style="width:100%; background: rgba(0,242,255,0.07); border: 1px solid var(--accent-primary); color: var(--accent-primary); padding: 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">📷 ACTIVATE QR SCANNER</button>
                        <div id="adminScannerUI" style="display:none; margin-top: 1rem;">
                            <div id="scanner-container" style="width:100%; max-width:300px; margin: 0 auto; border-radius: 12px; overflow:hidden; border: 2px solid var(--accent-primary);"></div>
                            <div id="scanner-result" style="text-align:center; margin-top: 10px; font-size: 0.65rem; color: #00ff6a; min-height: 20px;"></div>
                        </div>
                    </div>

                    <!-- MANUAL PUNCH LIST -->
                    <div style="margin-top: 1rem; border-top: 1px dashed var(--glass-border); padding-top: 1rem;">
                        <h4 style="margin: 0 0 0.8rem 0; font-size: 0.6rem; color: var(--text-dim); letter-spacing: 1px;">✋ MANUAL PUNCH</h4>
                        <input id="student_punch_search" oninput="window.NXASearchPunch(this.value)" type="text" placeholder="Search by name or USN..." style="width:100%; padding: 9px 12px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); color: #fff; font-size: 0.7rem; margin-bottom: 10px; box-sizing: border-box;">
                        <div id="punch_student_list" style="max-height: 220px; overflow-y: auto; display: grid; gap: 6px;"></div>
                    </div>
                </div>` : ''}

                <!-- ═══ STUDENT QR PANEL ═══ -->
                ${!isAdmin ? `
                <div style="margin-bottom: 1.5rem;">
                    ${isWindowActive && !alreadyMarked ? `
                        <div style="background: white; padding: 1.5rem; border-radius: 20px; text-align: center; box-shadow: 0 0 40px rgba(0,242,255,0.25);">
                            <p style="color: #000; font-size: 0.55rem; font-weight: 900; letter-spacing: 2px; margin-bottom: 1rem;">SHOW THIS TO ADMIN SCANNER</p>
                            <div id="qrcode" style="display:flex; justify-content:center; margin-bottom: 1rem;"></div>
                            <span style="color: #666; font-size: 0.45rem;">${state.user.email}</span>
                        </div>
                    ` : alreadyMarked ? `
                        <div style="background: rgba(0,255,106,0.07); border: 1px solid #00ff6a; border-radius: 20px; padding: 2rem; text-align: center;">
                            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">✅</div>
                            <h3 style="color: #00ff6a; font-size: 1rem; margin: 0;">PRESENT TODAY</h3>
                            <p style="color: var(--text-dim); font-size: 0.6rem; margin-top: 5px;">${todayStr}</p>
                        </div>
                    ` : `
                        <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--glass-border); border-radius: 20px; padding: 2.5rem; text-align: center;">
                            <div style="font-size: 2.5rem; opacity: 0.2; margin-bottom: 10px;">🌑</div>
                            <h4 style="color: var(--text-dim); font-size: 0.8rem;">No Active Session</h4>
                            <p style="font-size: 0.55rem; color: var(--text-dim); margin-top: 5px;">Admin hasn't started attendance yet.</p>
                        </div>
                    `}
                </div>` : ''}

                <!-- ═══ MONTHLY CALENDAR ═══ -->
                <div style="background: var(--glass-bg); padding: 1.2rem; border-radius: 20px; border: 1px solid var(--glass-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h4 style="margin: 0; font-size: 0.65rem; letter-spacing: 2px; color: var(--text-dim);">${monthLabel}</h4>
                        <span style="font-size: 0.55rem; color: var(--accent-primary); font-weight: 800;">
                            ${Object.values(myAttendance).filter(Boolean).length}/${monthDays} DAYS
                        </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;">
                        ${Array.from({length: monthDays}, (_, i) => {
                            const day = i + 1;
                            const d = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                            const isPresent = myAttendance[d] === true;
                            const isToday   = d === todayStr;
                            return `<div style="aspect-ratio:1; display:flex; align-items:center; justify-content:center; background:${isPresent ? 'rgba(0,255,106,0.1)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isToday ? 'var(--accent-primary)' : isPresent ? '#00ff6a' : 'var(--glass-border)'}; border-radius: 6px; font-size: 0.65rem; font-weight: 700; color: ${isPresent ? '#00ff6a' : isToday ? 'var(--accent-primary)' : '#fff'};">${day}</div>`;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;
    }
    viewProjects(state) {
        const isSuper = state.role === 'admin' && state.roleType === 'super';
        const isMax = state.role === 'admin' && state.roleType === 'max';
        const isExecutive = isSuper || isMax || state.user.email === 'nxasupertalent@gmail.com';
        
        const projects = JSON.parse(localStorage.getItem('nxa_industrial_projects')) || [];

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 0; letter-spacing: 2px;">PROJECT_MATRIX</h2>
                        <span style="color: var(--accent-primary); font-size: 0.55rem; font-weight: 800;">ACTIVE_NODES: ${projects.length}</span>
                    </div>
                </div>

                ${isExecutive ? `
                    <!-- EXECUTIVE PROJECT DEPLOYMENT FORM -->
                    <div style="background: var(--glass-bg); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--accent-primary); margin-bottom: 2rem;">
                        <h3 style="margin: 0 0 1rem 0; font-size: 0.8rem; letter-spacing: 1px; color: var(--accent-primary);">DEPLOY_NEW_PROJECT</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="input-block"><label style="font-size: 0.5rem;">PROJECT_TITLE</label><input id="nxa_proj_title" type="text" placeholder="Project Name" style="padding: 10px; font-size: 0.8rem;"></div>
                            <div class="input-block"><label style="font-size: 0.5rem;">IMAGE_MANIFEST_URL</label><input id="nxa_proj_image" type="text" placeholder="https://..." style="padding: 10px; font-size: 0.8rem;"></div>
                            <div class="input-block" style="grid-column: span 2;"><label style="font-size: 0.5rem;">INDUSTRIAL_INFORMATION</label><textarea id="nxa_proj_info" placeholder="Detailed project description..." style="width: 100%; height: 60px; background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border); border-radius: 8px; color: #fff; padding: 10px; font-size: 0.75rem;"></textarea></div>
                            <div class="input-block"><label style="font-size: 0.5rem;">SOURCE_CODE_UPLINK</label><input id="nxa_proj_source" type="text" placeholder="Github/GitLab Link" style="padding: 10px; font-size: 0.8rem;"></div>
                            <div class="input-block"><label style="font-size: 0.5rem;">DATASET_ARCHIVE</label><input id="nxa_proj_dataset" type="text" placeholder="Dataset URL" style="padding: 10px; font-size: 0.8rem;"></div>
                        </div>
                        <button onclick="window.NXADeployProject()" style="width: 100%; margin-top: 1.5rem; background: var(--accent-primary); color: #000; border: none; padding: 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; cursor: pointer;">MANIFEST_PROJECT</button>
                    </div>
                ` : ''}

                <!-- PROJECT EXPLORER GRID -->
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; padding-bottom: 3rem;">
                    ${projects.length === 0 ? `
                        <div style="grid-column: 1/-1; text-align: center; padding: 4rem; background: rgba(255,255,255,0.02); border: 1px dashed var(--glass-border); border-radius: 20px; color: var(--text-dim);">
                            NO_PROJECTS_LOCATED_IN_MATRIX
                        </div>
                    ` : projects.map((p, idx) => `
                        <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 20px; overflow: hidden; position: relative; transition: transform 0.3s ease;">
                            <div style="height: 150px; background: url('${p.image || 'https://via.placeholder.com/400x200/000216/00F2FF?text=NXA_PROJECT'}'); background-size: cover; background-position: center; border-bottom: 1px solid var(--glass-border);"></div>
                            <div style="padding: 1.2rem;">
                                <h3 style="font-size: 1.1rem; color: #fff; margin: 0 0 0.5rem 0; font-family: var(--font-heading);">${p.title}</h3>
                                <p style="font-size: 0.7rem; color: var(--text-dim); line-height: 1.4; height: 38px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-bottom: 1.2rem;">${p.info}</p>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1.2rem;">
                                    <button onclick="window.open('${p.source}', '_blank')" style="background: rgba(0, 242, 255, 0.1); border: 1px solid var(--accent-primary); color: var(--accent-primary); padding: 8px; border-radius: 6px; font-size: 0.5rem; font-weight: 800; cursor: pointer;">SOURCE_CODE</button>
                                    <button onclick="window.open('${p.dataset}', '_blank')" style="background: rgba(0, 255, 106, 0.1); border: 1px solid #00ff6a; color: #00ff6a; padding: 8px; border-radius: 6px; font-size: 0.5rem; font-weight: 800; cursor: pointer;">DATASET</button>
                                </div>

                                ${state.role === 'admin' ? `<button onclick="window.NXADeleteProject(${idx})" style="width: 100%; height: 35px; background: rgba(255, 69, 69, 0.05); color: #ff4545; border: 1px solid rgba(255, 69, 69, 0.1); border-radius: 6px; font-size: 0.55rem; font-weight: 900; cursor: pointer;">TERMINATE_NODE</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    viewInternshipAssessment(state) {
        return `
            <section class="section" style="padding: 1.5rem; max-height: 100vh; overflow-y: auto; background: #050505;">
                <div style="text-align: center; margin-bottom: 3rem;">
                    <h2 style="font-family: var(--font-heading); color: var(--accent-primary); letter-spacing: 4px; margin-bottom: 5px;">NXA_EVALUATION_UNIT</h2>
                    <p style="font-size: 0.6rem; color: var(--text-dim);">30 TOUGH NODES | 100% ACCURACY REQUIRED</p>
                </div>

                <div style="display: grid; gap: 2rem;">
                    ${NXA_ELITE_QUESTIONS.map((q, qIdx) => `
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); padding: 1.5rem; border-radius: 15px;">
                            <div style="font-size: 0.6rem; color: var(--accent-primary); font-weight: 900; margin-bottom: 10px;">NODE_${qIdx + 1}</div>
                            <h4 style="font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.5;">${q.q}</h4>
                            <div style="display: grid; gap: 10px;">
                                ${q.o.map((opt, oIdx) => `
                                    <button data-q="${qIdx}" data-a="${oIdx}" onclick="window.NXA_SUBMIT_ANS(${qIdx}, ${oIdx})" style="text-align: left; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: #fff; padding: 12px; border-radius: 8px; font-size: 0.75rem; cursor: pointer; transition: 0.3s;">
                                        ${opt}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top: 4rem; padding-bottom: 5rem;">
                    <button onclick="window.NXA_FINISH_ASSESSMENT()" style="width: 100%; padding: 20px; background: #00ff6a; color: #000; border: none; border-radius: 15px; font-weight: 900; font-size: 1rem; letter-spacing: 2px; cursor: pointer; box-shadow: 0 10px 20px rgba(0,255,106,0.2);">FINALIZE_SUBMISSION</button>
                </div>
            </section>
        `;
    }

    viewAssessmentSuccess(state) {
        return `
            <section class="section" style="padding: 2rem; text-align: center; max-height: 100vh; overflow-y: auto;">
                <div style="margin-top: 3rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
                    <h2 style="font-family: var(--font-heading); color: #00ff6a; font-size: 2rem; margin: 0;">ASSESSMENT_PASSED</h2>
                    <p style="color: var(--text-dim); margin-top: 10px;">100% Accuracy Verified. You are now NXA Certified.</p>
                </div>

                <button onclick="window.NXA_GEN_CERT()" style="margin-top: 3rem; background: var(--accent-primary); color: #000; border: none; padding: 15px 30px; border-radius: 10px; font-weight: 900; cursor: pointer;">MANIFEST_CERTIFICATE</button>

                <!-- THE CERTIFICATE (HIDDEN UNTIL GENERATED) -->
                <div id="nxa_certificate_node" style="display: none; margin-top: 4rem; padding: 3rem; background: #fff; color: #000; border: 15px double #000; flex-direction: column; align-items: center; box-shadow: 0 0 50px rgba(255,255,255,0.2);">
                    <div style="font-size: 1.5rem; font-weight: 900; letter-spacing: 5px; color: #000;">NXA TALENT</div>
                    <div style="margin: 20px 0; width: 100px; height: 2px; background: #000;"></div>
                    <div style="font-size: 0.8rem; letter-spacing: 2px; font-weight: 800;">INDUSTRIAL CORE CERTIFICATION</div>
                    <div style="margin: 40px 0; font-size: 1rem;">This is to certify that</div>
                    <div style="font-size: 2.2rem; font-family: var(--font-heading); text-transform: uppercase; border-bottom: 2px solid #000; padding: 0 20px;">${state.user.name}</div>
                    <div style="margin: 30px 0; line-height: 1.6; max-width: 400px; font-size: 0.9rem;">
                        Has successfully manifested 100% accuracy in the <b>Industrial Talent Assessment</b> 
                        covering Distributed Systems, Neural Architectures, and Multi-Node Synchronization.
                    </div>
                    <div style="margin-top: 50px; display: flex; justify-content: space-between; width: 100%;">
                        <div style="text-align: center;">
                            <div style="font-weight: 900;">NXA_CORE_ID</div>
                            <div style="font-size: 0.6rem;">${state.user.email}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-weight: 900;">DATE_STAMP</div>
                            <div style="font-size: 0.6rem;">${new Date().toDateString()}</div>
                        </div>
                    </div>
                </div>

                <button onclick="AppState.setView('home')" style="margin-top: 4rem; background: none; border: 1px solid var(--glass-border); color: var(--text-dim); padding: 10px 20px; border-radius: 8px; font-size: 0.6rem; cursor: pointer;">RETURN_TO_DASHBOARD</button>
            </section>
        `;
    }

    viewInternships(state) {
        const isSuper = state.role === 'admin' && state.roleType === 'super';
        const internships = JSON.parse(localStorage.getItem('nxa_internship_matrix')) || [];
        const myApps = JSON.parse(localStorage.getItem(`nxa_apps_${state.user.email}`)) || [];

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 0; letter-spacing: 2px;">INTERNSHIP_HUBS</h2>
                        <span style="color: #ffcc00; font-size: 0.55rem; font-weight: 800;">ACTIVE_OPPORTUNITIES: ${internships.length}</span>
                    </div>
                </div>

                <!-- ELITE ASSESSMENT GATEWAY (FOR STUDENTS) -->
                ${state.role === 'student' ? `
                    <div style="background: linear-gradient(135deg, rgba(0, 242, 255, 0.1), rgba(0, 255, 106, 0.05)); border: 2px solid var(--accent-primary); border-radius: 20px; padding: 2rem; margin-bottom: 2.5rem; text-align: center; box-shadow: 0 0 30px rgba(0, 242, 255, 0.15);">
                        <div style="font-size: 0.6rem; color: var(--accent-primary); font-weight: 800; letter-spacing: 3px; margin-bottom: 10px;">INDUSTRIAL QUALIFICATION</div>
                        <h3 style="font-size: 1.5rem; margin: 0 0 10px 0; font-family: var(--font-heading);">ELITE_INTERNSHIP_ASSESSMENT</h3>
                        <p style="color: var(--text-dim); font-size: 0.75rem; margin-bottom: 1.5rem;">Solve 30 ultra-tough MCQ nodes to unlock the <b>NXA TALENT INDUSTRIAL CERTIFICATE</b>. 100% accuracy required.</p>
                        <button onclick="window.NXA_START_ASSESSMENT()" style="background: var(--accent-primary); color: #000; border: none; padding: 15px 40px; border-radius: 12px; font-weight: 900; font-size: 0.8rem; letter-spacing: 1px; cursor: pointer;">START_EVALUATION_CORE</button>
                    </div>
                ` : ''}

                ${isSuper ? `
                    <!-- SUPER ADMIN INTERNSHIP DEPLOYMENT -->
                    <div style="background: var(--glass-bg); padding: 1.5rem; border-radius: 20px; border: 1px solid #ffcc00; margin-bottom: 2rem;">
                        <h3 style="margin: 0 0 1rem 0; font-size: 0.8rem; letter-spacing: 1px; color: #ffcc00;">POST_NEW_INTERNSHIP</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="input-block"><label style="font-size: 0.5rem;">COMPANY_ROLE</label><input id="nxa_int_title" type="text" placeholder="e.g. Google - AI Research" style="padding: 10px; font-size: 0.8rem;"></div>
                            <div class="input-block"><label style="font-size: 0.5rem;">STIPEND_DURATION</label><input id="nxa_int_desc" type="text" placeholder="e.g. 50k/mo - 6 Months" style="padding: 10px; font-size: 0.8rem;"></div>
                            <div class="input-block" style="grid-column: span 2;"><label style="font-size: 0.5rem;">CORE_REQUIREMENTS</label><textarea id="nxa_int_req" placeholder="Python, TensorFlow, Neural Networks..." style="width: 100%; height: 60px; background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border); border-radius: 8px; color: #fff; padding: 10px; font-size: 0.75rem;"></textarea></div>
                            <div class="input-block" style="grid-column: span 2;"><label style="font-size: 0.5rem;">APPLICATION_UPLINK_URL</label><input id="nxa_int_link" type="text" placeholder="https://..." style="padding: 10px; font-size: 0.8rem;"></div>
                        </div>
                        <button onclick="window.NXAPostInternship()" style="width: 100%; margin-top: 1.5rem; background: #ffcc00; color: #000; border: none; padding: 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; cursor: pointer;">DEPLOY_OPPORTUNITY</button>
                    </div>
                ` : ''}

                <!-- INTERNSHIP LIST -->
                <div style="display: grid; gap: 1.5rem; padding-bottom: 3rem;">
                    ${internships.length === 0 ? `
                        <div style="text-align: center; padding: 4rem; background: rgba(255,255,255,0.02); border: 1px dashed var(--glass-border); border-radius: 20px; color: var(--text-dim);">
                            NO_INTERNSHIP_NODES_FOUND
                        </div>
                    ` : internships.map((inst, idx) => {
                        const hasApplied = myApps.includes(inst.id);
                        return `
                            <div style="background: var(--glass-bg); padding: 1.5rem; border-radius: 20px; border: 1px solid ${hasApplied ? '#00ff6a' : 'var(--glass-border)'}; position: relative; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
                                <div style="flex: 1; min-width: 200px;">
                                    <h3 style="font-size: 1.15rem; color: #fff; margin: 0 0 0.5rem 0;">${inst.title}</h3>
                                    <div style="display: flex; gap: 10px; margin-bottom: 0.8rem;">
                                        <span style="background: rgba(255, 204, 0, 0.1); color: #ffcc00; padding: 2px 8px; border-radius: 4px; font-size: 0.5rem; font-weight: 800;">${inst.desc}</span>
                                    </div>
                                    <p style="font-size: 0.7rem; color: var(--text-dim); line-height: 1.4;">REQ: ${inst.req}</p>
                                </div>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    ${state.role === 'admin' ? `<button onclick="window.NXADeleteInternship(${idx})" style="background: none; border: 1px solid #ff4545; color: #ff4545; padding: 8px 15px; border-radius: 8px; font-size: 0.55rem; font-weight: 900; cursor: pointer;">TERMINATE</button>` : ''}
                                    <button onclick="window.NXAApplyInternship('${inst.id}', '${inst.link}')" ${hasApplied ? 'disabled' : ''} style="background: ${hasApplied ? 'rgba(0, 255, 106, 0.1)' : 'var(--accent-primary)'}; color: ${hasApplied ? '#00ff66' : '#000'}; border: ${hasApplied ? '1px solid #00ff6a' : 'none'}; padding: 12px 25px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">
                                        ${hasApplied ? 'APPLIED ✅' : 'APPLY_NOW'}
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>
        `;
    }


    viewLive(state) {
        const isSuper = state.role === 'admin' && state.roleType === 'super';
        const isMax = state.role === 'admin' && state.roleType === 'max';
        const isExecutive = isSuper || isMax || state.user.email === 'nxasupertalent@gmail.com';
        
        const liveData = JSON.parse(localStorage.getItem('nxa_live_broadcast')) || { active: false };

        return `
            <section class="section" style="padding: 1.5rem; max-height: 100vh; overflow-y: auto; padding-bottom: 150px;">
                <!-- SLIM HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; margin: 0; letter-spacing: 2px;">LIVE_MATRIX</h2>
                        <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                            <span style="width: 8px; height: 8px; background: ${liveData.active ? '#ff4545' : '#444'}; border-radius: 50%; box-shadow: ${liveData.active ? '0 0 10px #ff4545' : 'none'};"></span>
                            <span style="color: ${liveData.active ? '#ff4545' : 'var(--text-dim)'}; font-size: 0.6rem; font-weight: 800; letter-spacing: 1px;">
                                ${liveData.active ? 'BROADCAST_ON_AIR' : 'SYSTEM_OFFLINE'}
                            </span>
                        </div>
                    </div>
                </div>

                ${isExecutive ? `
                    <!-- EXECUTIVE BROADCAST CONTROLS -->
                    <div style="background: var(--glass-bg); padding: 1.5rem; border-radius: 18px; border: 1px solid ${liveData.active ? '#ff4545' : 'var(--glass-border)'}; margin-bottom: 1.5rem;">
                        <h3 style="margin: 0 0 1rem 0; font-size: 0.9rem; font-family: var(--font-heading); letter-spacing: 1px;">${liveData.active ? 'SESSION_ACTIVE' : 'INITIATE_UPLINK'}</h3>
                        <div style="display: grid; gap: 1rem;">
                            <div class="input-block"><label style="font-size: 0.5rem;">SESSION_TOPIC</label><input id="live_topic" type="text" value="${liveData.topic || ''}" style="height: 45px; padding: 0 15px;" placeholder="Topic"></div>
                            <div class="input-block"><label style="font-size: 0.5rem;">MEET_LINK</label><input id="live_link" type="text" value="${liveData.link || ''}" style="height: 45px; padding: 0 15px;" placeholder="Link"></div>
                        </div>
                        <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem;">
                            <button type="button" onclick="window.NXAStartLive()" class="btn-primary-lg" style="flex: 1; padding: 10px; font-size: 0.65rem; background: #00ff6a; color: #000; font-weight: 900;">${liveData.active ? 'UPDATE' : 'START_LIVE'}</button>
                            ${liveData.active ? `<button type="button" onclick="window.open('${liveData.link}', '_blank')" class="btn-primary-lg" style="flex: 1; padding: 10px; font-size: 0.65rem; background: #00d2ff; color: #000; border: none; font-weight: 900;">JOIN</button>` : ''}
                            ${liveData.active ? `<button type="button" onclick="window.NXAStopLive()" class="btn-primary-lg" style="flex: 1; padding: 10px; font-size: 0.65rem; background: #ff4545; color: #fff; border: none; font-weight: 900;">TERMINATE</button>` : ''}
                        </div>
                    </div>
                ` : ''}

                <!-- CONDENSED BROADCAST CARD -->
                <div style="background: var(--glass-bg); padding: 2rem; border-radius: 20px; border: 1px solid var(--glass-border); text-align: center; position: relative; overflow: hidden;">
                    ${liveData.active ? `
                        <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: #ff4545; box-shadow: 0 0 20px rgba(255, 69, 69, 0.4);"></div>
                        <span style="background: #ff4545; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 0.55rem; font-weight: 900; letter-spacing: 1px;">LIVE_NOW</span>
                        <h3 style="font-size: 1.6rem; margin: 1.2rem 0 0.8rem 0; font-family: var(--font-heading); color: #fff;">${liveData.topic}</h3>
                        <p style="color: var(--text-dim); margin-bottom: 2rem; font-size: 0.8rem;">Mentor Uplink Active.</p>
                        <button onclick="window.open('${liveData.link}', '_blank')" class="btn-primary-lg" style="background: #ff4545; border: none; padding: 15px 40px; font-size: 0.9rem; border-radius: 30px; font-weight: 900; letter-spacing: 2px;">
                            JOIN_UPLINK
                        </button>
                    ` : `
                        <div style="padding: 2rem 0;">
                            <span style="font-size: 2.5rem; display: block; margin-bottom: 1rem; opacity: 0.2;">📡</span>
                            <h3 style="color: var(--text-dim); font-size: 1rem;">System Offline</h3>
                            <button disabled class="btn-primary-lg" style="margin-top: 2rem; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: #444; font-size: 0.7rem;">IDLE_STATE</button>
                        </div>
                    `}
                </div>
            </section>
        `;
    }

    viewSelf(state) {
        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
        const pd = profiles[state.user.email.toLowerCase().trim()];

        return `
            <section class="section" style="padding: 1.5rem; max-height: 100vh; overflow: hidden;">
                <!-- SLIM HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; margin: 0; letter-spacing: 2px; color: #fff;">IDENTITY_NEXUS</h2>
                        <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
                            <span style="width: 6px; height: 6px; background: #00ff6a; border-radius: 50%; box-shadow: 0 0 8px #00ff6a;"></span>
                            <span style="color: #00ff6a; font-size: 0.55rem; font-weight: 800; letter-spacing: 1px;">SYNC_STABLE</span>
                        </div>
                    </div>
                    <button onclick="window.NXA.viewRegister(AppState, true)" style="background: rgba(0, 242, 255, 0.1); color: var(--accent-primary); border: 1px solid var(--accent-primary); padding: 6px 14px; border-radius: 6px; font-size: 0.6rem; font-weight: 900; cursor: pointer;">
                        RE-SYNC
                    </button>
                </div>

                <!-- COMPACT PROFILE CARD -->
                <div style="background: var(--glass-bg); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--glass-border); position: relative; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                    <div style="display: flex; gap: 1.5rem; align-items: center;">
                        <div style="width: 80px; height: 80px; background: #000; border: 2px solid var(--accent-primary); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 3.5rem;">👤</div>
                        <div style="flex: 1;">
                            <h3 style="font-size: 1.8rem; margin: 0; font-family: var(--font-heading); color: #fff;">${state.user.name}</h3>
                            <p style="color: var(--accent-primary); font-size: 0.75rem; margin-top: 2px; font-weight: 600;">${state.user.email}</p>
                        </div>
                    </div>
                </div>

                <!-- GRID DATA (Condensed) -->
                ${!pd ? `
                    <div style="background: rgba(255, 204, 0, 0.05); padding: 3rem 2rem; border-radius: 24px; text-align: center; border: 1px dashed rgba(255, 204, 0, 0.3); margin-top: 1rem;">
                        <div style="font-size: 3rem; margin-bottom: 1.5rem; filter: grayscale(1); opacity: 0.5;">📄</div>
                        <h3 style="color: #fff; font-family: var(--font-heading); font-size: 1.2rem; margin-bottom: 0.5rem;">IDENTITY_MANIFEST_PENDING</h3>
                        <p style="color: var(--text-dim); font-size: 0.75rem; max-width: 250px; margin: 0 auto 2rem; line-height: 1.6;">Your industrial student dossier has not been synchronized with the core matrix.</p>
                        <button onclick="AppState.setView('register')" class="btn-primary" style="padding: 12px 30px; font-size: 0.7rem; border-radius: 12px;">
                            INITIALIZE_REGISTRATION
                        </button>
                    </div>
                ` : `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="background: var(--glass-bg); padding: 1.2rem; border-radius: 18px; border: 1px solid var(--glass-border);">
                            <span style="display: block; font-size: 0.5rem; color: var(--accent-primary); font-weight: 900; margin-bottom: 0.8rem;">ACADEMIC</span>
                            <div class="dossier-field" style="margin-bottom: 8px;"><span class="df-label" style="font-size: 0.6rem;">USN</span><span style="color: #fff; font-size: 0.8rem; font-weight: 800;">${pd.usn || '-'}</span></div>
                            <div class="dossier-field"><span class="df-label" style="font-size: 0.6rem;">CGPA</span><span style="color: #00ff6a; font-size: 0.8rem; font-weight: 800;">${pd.cgpa || '-'}</span></div>
                        </div>
                        <div style="background: var(--glass-bg); padding: 1.2rem; border-radius: 18px; border: 1px solid var(--glass-border);">
                            <span style="display: block; font-size: 0.5rem; color: var(--accent-primary); font-weight: 900; margin-bottom: 0.8rem;">METRICS</span>
                            <div class="dossier-field" style="margin-bottom: 8px;"><span class="df-label" style="font-size: 0.6rem;">YEAR</span><span style="color: #fff; font-size: 0.8rem;">${pd.passingyear || '-'}</span></div>
                            <div class="dossier-field"><span class="df-label" style="font-size: 0.6rem;">DEPT</span><span style="color: #fff; font-size: 0.7rem; opacity: 0.7;">${pd.branch || '-'}</span></div>
                        </div>
                    </div>
                `}

                <!-- ULTRA-SLIM SESSION ACTION -->
                <div style="display: none !important; background: rgba(255, 69, 69, 0.02); border: 1px solid rgba(255, 69, 69, 0.1); padding: 1rem; border-radius: 18px; justify-content: space-between; align-items: center;">
                    <span style="color: #ff4545; font-size: 0.55rem; font-weight: 900; letter-spacing: 1px;">CRITICAL_OVERRIDE</span>
                    <button id="perfLogoutBtn" style="background: #ff4545; color: #fff; border: none; padding: 10px 25px; border-radius: 30px; font-weight: 900; font-size: 0.75rem; cursor: pointer;">
                        TERMINATE_SESSION
                    </button>
                </div>
            </section>
            <script>
                setTimeout(() => {
                    const lbtn = document.getElementById('perfLogoutBtn');
                    if (lbtn) lbtn.onclick = () => {
                        if (confirm('NXA_SECURITY: Final confirmation to terminate matrix session?')) {
                            AppState.logout();
                        }
                    };
                }, 300);
            </script>
        `;
    }

    viewHome(state) {
        const liveData = JSON.parse(localStorage.getItem('nxa_live_broadcast')) || { active: false };
        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
        const pd = profiles[state.user.email.toLowerCase().trim()] || {};
        const myCourseIds = pd.assigned_courses || [];

        const thoughts = [
            "Your identity is manifested through code.",
            "Technology is the ultimate bridge to success.",
            "Algorithm is the logic of industrial progress.",
            "Manifest your universal potential today."
        ];
        const dailyThought = thoughts[new Date().getDate() % thoughts.length];
        
        return `
            <section class="section" style="padding: 1.5rem;">
                <div style="margin-bottom: 2rem;">
                    <h1 style="font-size: 2.2rem; margin: 0; font-family: var(--font-heading);">Welcome, ${state.user.name.split(' ')[0]}</h1>
                    <div style="margin-top: 10px; border-left: 3px solid var(--accent-primary); padding-left: 15px;">
                        <p style="color: var(--text-dim); font-size: 0.75rem; font-style: italic;">" ${dailyThought} "</p>
                    </div>
                </div>

                <div onclick="AppState.setView('live')" style="background: ${liveData.active ? 'rgba(255, 69, 69, 0.1)' : 'var(--glass-bg)'}; border: 1px solid ${liveData.active ? '#ff4545' : 'var(--glass-border)'}; padding: 1.5rem; border-radius: 20px; cursor: pointer; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-size: 0.6rem; color: var(--text-dim); font-weight: 800; letter-spacing: 1px;">LIVE SESSION</span>
                            <h3 style="margin: 5px 0; font-size: 1.1rem; color: #fff;">${liveData.active ? liveData.topic : 'System Standby'}</h3>
                        </div>
                        <div style="width: 10px; height: 10px; background: ${liveData.active ? '#ff4545' : '#444'}; border-radius: 50%;"></div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div onclick="AppState.setView('courses')" style="background: var(--glass-bg); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--glass-border); cursor: pointer;">
                        <span style="font-size: 0.6rem; color: var(--accent-primary); font-weight: 800;">COURSES</span>
                        <div style="font-size: 1.8rem; font-weight: 800; color: #fff; margin: 10px 0;">${myCourseIds.length}</div>
                        <span style="font-size: 0.5rem; color: var(--text-dim);">ASSIGNED</span>
                    </div>
                    <div onclick="AppState.setView('self')" style="background: var(--glass-bg); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--glass-border); cursor: pointer;">
                        <span style="font-size: 0.6rem; color: var(--accent-primary); font-weight: 800;">PROFILE</span>
                        <div style="font-size: 1.8rem; font-weight: 800; color: #00ff66; margin: 10px 0;">${pd.cgpa || '0.0'}</div>
                        <span style="font-size: 0.5rem; color: var(--text-dim);">CGPA</span>
                    </div>
                </div>

                <div style="background: var(--glass-bg); padding: 1rem; border-radius: 20px; border: 1px solid var(--glass-border); display: flex; justify-content: space-around;">
                    <button onclick="AppState.setView('attendance')" style="background: none; border: none; color: #fff; font-size: 0.65rem; font-weight: 700; cursor: pointer;">ATTENDANCE</button>
                    <button onclick="AppState.setView('projects')" style="background: none; border: none; color: #fff; font-size: 0.65rem; font-weight: 700; cursor: pointer;">PROJECTS</button>
                </div>
            </section>
        `;
    }

    // PERSISTENT COURSE REPOSITORY
    getCourses() {
        const defaultCourses = [
            { id: 'c1', title: 'Advanced Neural AI', domain: 'Artificial Intelligence', price: '499' },
            { id: 'c2', title: 'Full-Stack Nexus', domain: 'Web Engineering', price: '599' },
            { id: 'c3', title: 'Cyber Security Protocol', domain: 'Security', price: '699' }
        ];
        const saved = localStorage.getItem('nxa_system_courses');
        let courses = saved ? JSON.parse(saved) : defaultCourses;
        
        // MIGRATION: Ensure all courses have a price
        let migrated = false;
        courses = courses.map(c => {
            if (!c.price) { c.price = '999'; migrated = true; }
            return c;
        });
        if (migrated) this.saveCourses(courses);
        
        return courses;
    }

    saveCourses(courses) {
        localStorage.setItem('nxa_system_courses', JSON.stringify(courses));
    }

    viewCourses(state) {
        const allCourses = this.getCourses();
        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
        const myProfile = profiles[state.user.email] || {};
        const myCourseIds = myProfile.assigned_courses || [];
        const myCourses = allCourses.filter(c => myCourseIds.includes(c.id));
        
        const payConfig = JSON.parse(localStorage.getItem('nxa_payment_config')) || { upi: '' };
        
        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; margin: 0; letter-spacing: 2px;">COURSE_MATRIX</h2>
                        <span style="color: var(--accent-primary); font-size: 0.55rem; font-weight: 800;">TOTAL_ASSIGNED: ${myCourses.length}</span>
                    </div>
                    ${(state.role === 'admin' || state.user.email === 'nxasupertalent@gmail.com') ? `
                        <button onclick="AppState.setView('course_admin')" style="background: var(--accent-primary); color: #000; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.6rem; font-weight: 900; cursor: pointer;">MANAGE</button>
                    ` : ''}
                </div>

                ${myCourses.length === 0 ? `
                    <div style="background: rgba(255, 255, 255, 0.02); border: 1px dashed var(--glass-border); padding: 3rem; border-radius: 20px; text-align: center;">
                        <span style="font-size: 2.5rem; display: block; margin-bottom: 1rem;">📚</span>
                        <h4 style="color: var(--text-dim); font-size: 0.9rem;">No assigned courses.</h4>
                    </div>
                ` : `
                    <div style="display: grid; grid-template-columns: 1fr; gap: 1.2rem; padding-bottom: 5rem;">
                        ${myCourses.map(c => {
                            const coursePrice = c.price || '999';
                            const isPaid = (myProfile.paid_courses || []).includes(c.id) || String(coursePrice) === '0';
                            return `
                                <div style="background: var(--glass-bg); border: 1px solid ${isPaid ? 'var(--glass-border)' : 'rgba(255, 204, 0, 0.3)'}; padding: 1.5rem; border-radius: 16px; position: relative;">
                                    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${isPaid ? 'var(--accent-primary)' : '#ffcc00'}; border-radius: 4px 0 0 4px;"></div>
                                    
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div style="flex: 1;">
                                            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                                                <span style="font-size: 0.5rem; color: ${isPaid ? 'var(--accent-primary)' : '#ffcc00'}; font-weight: 800; letter-spacing: 1px;">${c.domain.toUpperCase()}</span>
                                                ${!isPaid ? `<span style="font-size: 10px;">🔒</span>` : ''}
                                            </div>
                                            <h3 style="margin: 0; font-size: 1.1rem; color: #fff;">${c.title}</h3>
                                            <p style="font-size: 0.55rem; color: var(--text-dim); margin: 6px 0;">📹 ${(c.videos||[]).length} · 🔗 ${(c.refs||[]).length} · 📄 ${(c.docs||[]).length}</p>
                                        </div>
                                        
                                        <div style="text-align: right;">
                                            <button onclick="${isPaid ? `AppState.setView('course_view_${c.id}')` : `NXA.showPaymentGateway('${c.id}', '${coursePrice}')`}" 
                                                    class="btn-primary-lg" 
                                                    style="padding: 10px 20px; font-size: 0.65rem; height: auto; width: auto; background: ${isPaid ? 'var(--accent-primary)' : '#ffcc00'}; color: #000; border: none;">
                                                ${isPaid ? 'OPEN_UNIT' : `OPEN_UNIT 🔒`}
                                            </button>
                                            ${!isPaid ? `<div style="font-size: 0.55rem; color: #ffcc00; font-weight: 900; margin-top: 4px; letter-spacing: 1px;">₹${coursePrice}</div>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}

                <!-- INDIVIDUAL COURSE PAYMENT GATEWAY -->
                <div id="course_pay_gateway" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; align-items: center; justify-content: center; padding: 1.5rem;">
                    <div style="background: var(--bg-dark); border: 2px solid #ffcc00; border-radius: 24px; padding: 2rem; width: 100%; max-width: 380px; text-align: center;">
                        <h3 style="color: #ffcc00; font-family: var(--font-heading); margin-bottom: 5px;">SECURE_ENROLLMENT</h3>
                        <p id="pay_course_title" style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 2rem;"></p>
                        
                        <div id="pay_qr_container" style="margin-bottom: 2rem;">
                            ${payConfig.qr ? `<img src="${payConfig.qr}" style="width: 180px; height: 180px; background: #fff; padding: 10px; border-radius: 12px; margin-bottom: 10px;">` : `
                                <div style="padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 10px;">
                                    <div style="font-size: 0.55rem; color: var(--text-dim);">UPI_ID</div>
                                    <div style="font-size: 1rem; font-weight: 800; color: #fff;">${payConfig.upi}</div>
                                </div>
                            `}
                            <div style="font-size: 1.8rem; font-weight: 900; color: #fff;" id="pay_course_price"></div>
                        </div>
                        
                        <div style="display: grid; gap: 10px;">
                            <button id="confirm_pay_btn" style="background: #00ff6a; color: #000; border: none; padding: 15px; border-radius: 12px; font-weight: 900; font-size: 0.8rem; cursor: pointer;">CONFIRM_SUCCESS</button>
                            <button onclick="document.getElementById('course_pay_gateway').style.display='none'" style="background: none; border: 1px solid var(--glass-border); color: var(--text-dim); padding: 10px; border-radius: 12px; font-size: 0.6rem; cursor: pointer;">CANCEL</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    viewCourseDetail(state, courseId) {
        const courses = this.getCourses();
        const course = courses.find(c => c.id === courseId);
        if (!course) return this.viewCourses(state);
        const refs   = course.refs   || [];
        const videos = course.videos || [];
        const docs   = course.docs   || [];
        const sectionStyle = 'background: var(--glass-bg); padding: 1.2rem; border-radius: 16px; border: 1px solid var(--glass-border); margin-bottom: 1rem;';
        const labelStyle   = 'color: var(--accent-primary); font-size: 0.55rem; font-weight: 900; letter-spacing: 2px; display: block; margin-bottom: 0.8rem;';

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto; padding-bottom: 120px;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <button onclick="AppState.setView('courses')" style="background: none; border: none; color: var(--accent-primary); font-size: 1.3rem; cursor: pointer;">←</button>
                    <div>
                        <h2 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 0; letter-spacing: 1px;">${course.title}</h2>
                        <span style="color: var(--accent-primary); font-size: 0.55rem; font-weight: 800;">${course.domain}</span>
                    </div>
                </div>

                ${course.desc ? `<p style="color: var(--text-dim); font-size: 0.8rem; line-height: 1.6; margin-bottom: 1.2rem; padding: 1rem; background: var(--glass-bg); border-radius: 12px; border: 1px solid var(--glass-border);">${course.desc}</p>` : ''}

                ${videos.length > 0 ? `
                <div style="${sectionStyle}">
                    <span style="${labelStyle}">📹 VIDEO CLASSES</span>
                    ${videos.map(v => `
                        <div style="margin-bottom: 1.2rem;">
                            <p style="font-size: 0.75rem; font-weight: 700; margin-bottom: 6px;">${v.title}</p>
                            <div style="position:relative; padding-bottom: 56.25%; height: 0; border-radius: 10px; overflow: hidden;">
                                <iframe src="https://www.youtube.com/embed/${v.ytId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe>
                            </div>
                        </div>
                    `).join('')}
                </div>` : ''}

                ${refs.length > 0 ? `
                <div style="${sectionStyle}">
                    <span style="${labelStyle}">🔗 REFERENCES</span>
                    ${refs.map(r => `
                        <a href="${r.url}" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(0,242,255,0.04); border: 1px solid rgba(0,242,255,0.12); border-radius: 10px; margin-bottom: 8px; text-decoration: none;">
                            <span style="font-size: 1rem;">🔗</span>
                            <span style="color: var(--accent-primary); font-size: 0.75rem; font-weight: 700;">${r.title}</span>
                        </a>
                    `).join('')}
                </div>` : ''}

                ${docs.length > 0 ? `
                <div style="${sectionStyle}">
                    <span style="${labelStyle}">📄 DOCUMENTS</span>
                    ${docs.map(d => `
                        <a href="${d.url}" target="_blank" ${d.isFile ? `download="${d.title}"` : ''} style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,204,0,0.04); border: 1px solid rgba(255,204,0,0.12); border-radius: 10px; margin-bottom: 8px; text-decoration: none;">
                            <span style="font-size: 1rem;">📎</span>
                            <span style="color: #ffcc00; font-size: 0.75rem; font-weight: 700;">${d.title}</span>
                        </a>
                    `).join('')}
                </div>` : ''}

                ${videos.length === 0 && refs.length === 0 && docs.length === 0 ? `
                    <div style="text-align: center; padding: 3rem; color: var(--text-dim); border: 1px dashed var(--glass-border); border-radius: 16px;">
                        <span style="font-size: 2rem;">📭</span>
                        <p style="margin-top: 1rem; font-size: 0.8rem;">No content added yet.</p>
                    </div>
                ` : ''}
            </section>
        `;
    }


    viewCourseAdmin(state) {
        if (state.role !== 'admin' && state.user.email !== 'nxasupertalent@gmail.com') return this.viewHome(state);
        const courses = this.getCourses();
        const payConfig = JSON.parse(localStorage.getItem('nxa_payment_config')) || { fee: '0', upi: '', qr: '' };

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto; padding-bottom: 120px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 0; letter-spacing: 2px;">COURSE_CONTROL</h2>
                    <button onclick="AppState.setView('courses')" style="background: none; border: 1px solid var(--glass-border); color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 0.6rem; cursor: pointer;">RETURN</button>
                </div>

                <!-- PAYMENT CONFIGURATION MODULE -->
                <div style="background: rgba(0, 229, 255, 0.03); border: 1px solid var(--glass-border); padding: 1.5rem; border-radius: 20px; margin-bottom: 2rem;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 0.75rem; letter-spacing: 2px; color: var(--accent-primary);">GATEWAY_UPLINK</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="input-block"><label style="font-size: 0.5rem;">UPI_ID</label><input id="nxa_pay_upi" type="text" value="${payConfig.upi}" placeholder="e.g. nxa@ybl" style="padding: 10px; font-size: 0.8rem;"></div>
                        <div class="input-block"><label style="font-size: 0.5rem;">QR_CODE_UPLINK</label><input id="nxa_pay_qr" type="text" value="${payConfig.qr}" placeholder="https://..." style="padding: 10px; font-size: 0.8rem;"></div>
                    </div>
                    <button onclick="window.NXASetPaymentConfig()" style="width: 100%; margin-top: 1.5rem; background: var(--accent-primary); color: #000; border: none; padding: 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 900; cursor: pointer;">INITIALIZE_UPLINK</button>
                    <p style="font-size: 0.45rem; color: var(--text-dim); margin-top: 10px; text-align: center;">Note: Prices are now managed individually per course module below.</p>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <h2 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 0; letter-spacing: 1px;">COURSE_MATRIX_DEPLOYMENT</h2>
                    <button onclick="document.getElementById('addCourseForm').style.display = document.getElementById('addCourseForm').style.display === 'none' ? 'block' : 'none'" style="background: #00ff6a; color: #000; border: none; padding: 6px 14px; border-radius: 6px; font-size: 0.6rem; font-weight: 900; cursor: pointer;">+ NEW</button>
                </div>

                <div id="addCourseForm" style="display:none; background: var(--glass-bg); padding: 1.2rem; border-radius: 16px; border: 1px solid var(--accent-primary); margin-bottom: 1.5rem;">
                    <p style="color: var(--accent-primary); font-size: 0.55rem; font-weight: 900; letter-spacing: 2px; margin-bottom: 1rem;">NEW COURSE MODULE</p>
                    <div style="display: grid; gap: 0.8rem;">
                        <input id="new_c_title" type="text" placeholder="Course Title" style="height: 40px; font-size: 0.8rem;">
                        <input id="new_c_domain" type="text" placeholder="Domain (e.g. Web Engineering)" style="height: 40px; font-size: 0.8rem;">
                        <input id="new_c_price" type="number" placeholder="Enrollment Price (₹)" style="height: 40px; font-size: 0.8rem;">
                        <textarea id="new_c_desc" placeholder="Course Description..." style="height: 80px; font-size: 0.8rem; padding: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 10px; color: #fff; resize: none;"></textarea>
                        <button type="button" onclick="window.NXACreateCourse()" class="btn-primary-lg" style="padding: 10px; font-size: 0.7rem;">AUTHORIZE COURSE</button>
                    </div>
                </div>

                <div style="display: grid; gap: 1rem;">
                    ${courses.length === 0 ? `<div style="text-align:center; color: var(--text-dim); padding: 3rem; border: 1px dashed var(--glass-border); border-radius: 16px;">No courses yet. Tap + NEW to create one.</div>` : ''}
                    ${courses.map(c => `
                        <div style="background: var(--glass-bg); border-radius: 16px; border: 1px solid var(--glass-border); overflow: hidden; position: relative;">
                            <div style="padding: 1.2rem; display: flex; justify-content: space-between; align-items: flex-start;">
                                <div style="flex:1;">
                                    <span style="color: var(--accent-primary); font-size: 0.5rem; font-weight: 800; letter-spacing: 1px;">${c.domain.toUpperCase()}</span>
                                    <h3 style="margin: 4px 0; font-size: 1rem; color: #fff;">${c.title}</h3>
                                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                                        <div style="font-size: 0.65rem; color: #ffcc00; font-weight: 900; background: rgba(255,204,0,0.1); padding: 2px 8px; border-radius: 4px;">₹${c.price || '999'}</div>
                                        <span style="font-size: 0.5rem; color: var(--text-dim);">ID: ${c.id}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; border-top: 1px solid var(--glass-border); background: rgba(255,255,255,0.02);">
                                <button onclick="window.NXAOpenCourseEditor('${c.id}')" style="flex:1; padding: 12px; background: none; border: none; color: var(--accent-primary); font-size: 0.6rem; font-weight: 800; cursor: pointer; border-right: 1px solid var(--glass-border);">✏️ EDIT_PRICE_AND_CONTENT</button>
                                <button onclick="window.NXAShowAssignModal('${c.id}')" style="flex:1; padding: 12px; background: none; border: none; color: #fff; font-size: 0.6rem; font-weight: 800; cursor: pointer; border-right: 1px solid var(--glass-border);">👥 ASSIGN</button>
                                <button onclick="window.NXADeleteCourse('${c.id}')" style="flex:1; padding: 12px; background: none; border: none; color: #ff4545; font-size: 0.6rem; font-weight: 800; cursor: pointer;">🗑 PURGE</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div id="assignModal" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.92); z-index: 1000; align-items: center; justify-content: center; padding: 1.5rem;">
                    <div style="background: var(--bg-dark); width: 100%; border: 1px solid var(--accent-primary); border-radius: 20px; padding: 2rem; max-height: 80vh; overflow-y: auto;">
                        <h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem; letter-spacing: 1px;">ASSIGN TO STUDENTS</h3>
                        <div id="studentAssignmentList" style="display: grid; gap: 0.8rem;"></div>
                        <button onclick="document.getElementById('assignModal').style.display='none'" class="btn-primary-lg" style="margin-top: 2rem; width: 100%; padding: 12px; font-size: 0.8rem;">DONE</button>
                    </div>
                </div>
            </section>
        `;
    }

    viewCourseEditor(state, courseId) {
        const courses = this.getCourses();
        const course = courses.find(c => c.id === courseId);
        if (!course) return this.viewCourseAdmin(state);
        const refs = course.refs || [];
        const videos = course.videos || [];
        const docs = course.docs || [];
        const sectionStyle = 'background: var(--glass-bg); padding: 1.2rem; border-radius: 16px; border: 1px solid var(--glass-border); margin-bottom: 1rem;';
        const labelStyle = 'color: var(--accent-primary); font-size: 0.55rem; font-weight: 900; letter-spacing: 2px; display: block; margin-bottom: 0.8rem;';
        const inputStyle = 'height: 40px; font-size: 0.75rem;';
        const delBtnStyle = 'background: rgba(255,69,69,0.1); color: #ff4545; border: 1px solid rgba(255,69,69,0.2); padding: 4px 8px; border-radius: 4px; font-size: 0.5rem; cursor: pointer;';

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto; padding-bottom: 120px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <button onclick="AppState.setView('course_admin')" style="background: none; border: none; color: var(--accent-primary); font-size: 1.2rem; cursor: pointer;">←</button>
                        <div>
                            <h2 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 0; letter-spacing: 2px;">EDITOR: ${course.title}</h2>
                        </div>
                    </div>
                    <button onclick="window.NXASaveCourseMeta('${course.id}')" style="background: #00ff6a; color: #000; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.6rem; font-weight: 900; cursor: pointer;">SAVE_CHANGES</button>
                </div>

                <div style="${sectionStyle}">
                    <span style="${labelStyle}">📍 CORE_IDENTIFIERS</span>
                    <div style="display: grid; gap: 10px;">
                        <input id="edit_c_title" type="text" value="${course.title}" placeholder="Title" style="${inputStyle}">
                        <input id="edit_c_domain" type="text" value="${course.domain}" placeholder="Domain" style="${inputStyle}">
                        <input id="edit_c_price" type="number" value="${course.price || '0'}" placeholder="Price (₹)" style="${inputStyle}">
                    </div>
                </div>

                <!-- REFERENCES -->
                <div style="${sectionStyle}">
                    <span style="${labelStyle}">🔗 REFERENCES</span>
                    ${refs.map((r, i) => `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px; background: rgba(0,242,255,0.04); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,242,255,0.1);">
                            <a href="${r.url}" target="_blank" style="color: var(--accent-primary); font-size: 0.7rem; font-weight: 700; text-decoration: none; flex:1;">${r.title}</a>
                            <button onclick="window.NXADeleteResource('${courseId}','ref',${i})" style="${delBtnStyle}">✕</button>
                        </div>
                    `).join('')}
                    <div style="display: grid; gap: 0.6rem; margin-top: ${refs.length ? '1rem' : '0'};">
                        <input id="res_ref_title" type="text" placeholder="Reference Title" style="${inputStyle}">
                        <input id="res_ref_url" type="url" placeholder="https://..." style="${inputStyle}">
                        <button type="button" onclick="window.NXAAddResource('${courseId}','ref')" style="background: rgba(0,242,255,0.1); color: var(--accent-primary); border: 1px solid var(--accent-primary); padding: 8px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">+ ADD REFERENCE</button>
                    </div>
                </div>

                <!-- YOUTUBE VIDEOS -->
                <div style="${sectionStyle}">
                    <span style="${labelStyle}">📹 YOUTUBE CLASSES</span>
                    ${videos.map((v, i) => `
                        <div style="margin-bottom: 1rem;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                                <span style="font-size: 0.75rem; font-weight: 700; color: #fff;">${v.title}</span>
                                <button onclick="window.NXADeleteResource('${courseId}','yt',${i})" style="${delBtnStyle}">✕</button>
                            </div>
                            <div style="position:relative; padding-bottom: 56.25%; height: 0; border-radius: 10px; overflow: hidden;">
                                <iframe src="https://www.youtube.com/embed/${v.ytId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe>
                            </div>
                        </div>
                    `).join('')}
                    <div style="display: grid; gap: 0.6rem; margin-top: ${videos.length ? '1rem' : '0'};">
                        <input id="res_yt_title" type="text" placeholder="Video Title" style="${inputStyle}">
                        <input id="res_yt_url" type="url" placeholder="YouTube URL or Video ID" style="${inputStyle}">
                        <button type="button" onclick="window.NXAAddResource('${courseId}','yt')" style="background: rgba(255,0,0,0.1); color: #ff4545; border: 1px solid rgba(255,0,0,0.3); padding: 8px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">+ ADD YOUTUBE VIDEO</button>
                    </div>
                </div>

                <!-- DOCUMENTS -->
                <div style="${sectionStyle}">
                    <span style="${labelStyle}">📄 DOCUMENTS & FILES</span>
                    ${docs.map((d, i) => `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px; background: rgba(255,204,0,0.04); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,204,0,0.1);">
                            <a href="${d.url}" target="_blank" download="${d.isFile ? d.title : undefined}" style="color: #ffcc00; font-size: 0.7rem; font-weight: 700; text-decoration: none;">📎 ${d.title}</a>
                            <button onclick="window.NXADeleteResource('${courseId}','doc',${i})" style="${delBtnStyle}">✕</button>
                        </div>
                    `).join('')}
                    <p style="color: var(--text-dim); font-size: 0.6rem; margin-bottom: 0.8rem;">Add a drive/cloud link (Google Drive, Dropbox) or upload a file directly (max 5MB).</p>
                    <div style="display: grid; gap: 0.6rem;">
                        <input id="res_doc_title" type="text" placeholder="Document Title" style="${inputStyle}">
                        <input id="res_doc_url" type="url" placeholder="Google Drive / Dropbox / Cloud Link">
                        <button type="button" onclick="window.NXAAddResource('${courseId}','doc')" style="background: rgba(255,204,0,0.1); color: #ffcc00; border: 1px solid rgba(255,204,0,0.3); padding: 8px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">+ ADD DOCUMENT LINK</button>
                        <div style="border-top: 1px solid var(--glass-border); padding-top: 0.8rem; margin-top: 0.3rem;">
                            <label style="color: var(--text-dim); font-size: 0.55rem; font-weight: 800; display: block; margin-bottom: 6px;">OR UPLOAD FROM DEVICE (PDF, Video, etc.)</label>
                            <input id="res_file_title" type="text" placeholder="File Title" style="${inputStyle} margin-bottom: 6px;">
                            <input id="res_file_input" type="file" accept=".pdf,.doc,.docx,.mp4,.ppt,.pptx" style="color: var(--text-dim); font-size: 0.65rem; margin-bottom: 8px; width:100%;">
                            <button type="button" onclick="window.NXAAddResource('${courseId}','file')" style="background: rgba(0,255,106,0.1); color: #00ff6a; border: 1px solid rgba(0,255,106,0.3); padding: 8px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer; width: 100%;">⬆ UPLOAD FILE</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    viewCareer(state) {
        return `
            <div class="career-scope">
                <style>
                    @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
                    .glitch-text { animation: glitch 0.2s infinite; }
                </style>
                <div class="career-terminal-header">
                    <span style="font-size: 0.6rem; color: var(--accent-primary); letter-spacing: 5px; font-weight: 900; opacity: 0.6;">MODULE: CAREER_COMMAND</span>
                    <h1 class="glitch-text">GROWTH_MANIFEST</h1>
                    <div style="margin-top: 1.5rem; color: var(--text-dim); font-size: 0.9rem; max-width: 500px; line-height: 1.8;">
                        Synchronizing your professional trajectory within the NXA Talent Ecosystem. Every node achieved is an industrial landmark.
                    </div>
                </div>

                <div class="trajectory-path">
                    <div class="trajectory-node">
                        <span style="font-size: 0.55rem; color: var(--accent-primary); font-weight: 900; letter-spacing: 2px;">LVL_01</span>
                        <h3 style="font-size: 1.4rem; color: #fff; margin: 5px 0;">FOUNDATIONAL_TRAINEE</h3>
                        <p style="color: var(--text-dim); font-size: 0.75rem;">Core synthesis of industrial logic and architectural basics.</p>
                    </div>
                    <div class="trajectory-node">
                        <span style="font-size: 0.55rem; color: var(--accent-primary); font-weight: 900; letter-spacing: 2px;">LVL_02</span>
                        <h3 style="font-size: 1.4rem; color: #fff; margin: 5px 0;">SYSTEMS_ARCHITECT</h3>
                        <p style="color: var(--text-dim); font-size: 0.75rem;">Advanced project deployment and multi-node synchronization.</p>
                    </div>
                    <div class="trajectory-node">
                        <span style="font-size: 0.55rem; color: var(--accent-primary); font-weight: 900; letter-spacing: 2px;">LVL_03</span>
                        <h3 style="font-size: 1.4rem; color: #fff; margin: 5px 0;">INDUSTRIAL_EXECUTIVE</h3>
                        <p style="color: var(--text-dim); font-size: 0.75rem;">Strategic command and high-fidelity project oversight.</p>
                    </div>
                </div>

                <div style="background: var(--glass-bg); padding: 2.5rem; border-radius: 30px; border: 1px solid var(--glass-border); margin-bottom: 3rem; position: relative; z-index: 5;">
                    <span style="font-size: 0.6rem; color: var(--accent-primary); letter-spacing: 2px; font-weight: 900;">ECOSYSTEM_OVERVIEW</span>
                    <h3 style="color: #fff; font-size: 1.1rem; margin-top: 10px;">NXA TALENT INDUSTRIAL NUCLEUS</h3>
                    <p style="color: var(--text-dim); font-size: 0.75rem; line-height: 1.8; margin-top: 1rem;">
                        NXA Talent is more than a platform; it is a high-performance industrial incubator designed to forge the next generation of engineers. Under the vision of our founder, we bridge the gap between academic theory and raw industrial application.
                    </p>
                </div>

                <div class="founder-uplink">
                    <div style="position: relative; z-index: 10;">
                        <span style="font-size: 0.6rem; color: var(--accent-primary); letter-spacing: 3px; font-weight: 900;">DIRECTOR_PROTOCOL</span>
                        <h2>Narendra Kumar</h2>
                        <p style="color: #fff; font-size: 0.85rem; margin-bottom: 2.5rem; line-height: 1.8; opacity: 0.8;">
                            "The code you write today is the architecture of the world tomorrow. Manifest your brilliance and lead the industrial evolution."
                        </p>
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <a href="tel:7795299386" style="background: var(--accent-primary); color: #000; text-decoration: none; padding: 15px 35px; border-radius: 12px; font-weight: 900; font-size: 0.8rem; letter-spacing: 1px; box-shadow: 0 0 30px rgba(0, 242, 255, 0.3);">
                                UPLINK: 7795299386
                            </a>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 5rem; padding: 2rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; opacity: 0.3;">
                    <span style="font-size: 0.5rem; letter-spacing: 5px; font-weight: 900;">NXA_TALENT_INDUSTRIAL_CORE_v1.2</span>
                </div>
            </div>
        `;
    }


    viewLeetcode(state) {
        const solved = JSON.parse(localStorage.getItem('nxa_leetcode_solved')) || [];
        const customProbs = JSON.parse(localStorage.getItem('nxa_leetcode_custom')) || [];
        const activeLang = localStorage.getItem('nxa_active_lang') || 'JAVASCRIPT';
        
        const generateBank = (lang) => {
            const banks = {
                'JAVASCRIPT': ['Async Logic', 'Event Loop', 'DOM Matrix', 'Promise Core', 'Closure Scope', 'Prototype Chain', 'ES6 Modules', 'Array Buffer', 'Web Workers', 'Intersection Obs'],
                'PYTHON': ['Data Frame', 'Neural Net', 'Automation', 'Tuple Logic', 'Dict Matrix', 'Iterator Core', 'Decorator Alt', 'List Comp', 'Boto3 Sync', 'Pandas Opt'],
                'JAVA': ['OOP Paradigm', 'Threads', 'JVM Memory', 'Spring Seed', 'Lambda Stream', 'Interface Flow', 'Hibernate Sync', 'Servlet Core', 'Generic Type', 'Annotation Matrix'],
                'CPP': ['Pointers', 'Malloc Core', 'Hardware', 'STL Vector', 'Template Meta', 'DirectX Logic', 'ASIO Network', 'Smart Ptrs', 'Recursion Opt', 'VTable Matrix'],
                'TYPESCRIPT': ['Type Alias', 'Generics', 'Decorators', 'Namespace', 'Union Types', 'Utility Types', 'Enum Logic', 'Exhaustive Check', 'Conditional Types', 'Mapped Types'],
                'GO': ['Goroutines', 'Channel Sync', 'Struct Opt', 'Interface', 'Panic Recovery', 'Select Logic', 'Defer Stack', 'Context Sync', 'Pointer Flow', 'Slices Opt'],
                'RUST': ['Borrowing', 'Ownership', 'Traits', 'Safety Core', 'Macros', 'Lifetimes', 'Enums Match', 'Cargo Sync', 'Zero Cost', 'Async Await'],
                'SWIFT': ['SwiftUI', 'ARC System', 'Protocols', 'Optionals', 'Closures', 'Error Handle', 'Generic Obj', 'Delegate Flow', 'Composability', 'Combine Sync']
            };
            
            let bank = [];
            const topics = banks[lang] || banks['JAVASCRIPT'];
            for (let i = 1; i <= 25; i++) {
                const topic = topics[i % topics.length];
                const variant = ['OPTIMIZED', 'SECURE', 'CONCURRENT', 'RECURSIVE', 'SCALABLE'][i % 5];
                bank.push({
                    id: `${lang.slice(0,2)}_${i}`,
                    lang: lang,
                    title: `${lang}_${topic.toUpperCase().replace(/ /g, '_')}_${variant}_${i}`,
                    diff: i < 8 ? 'EASY' : (i < 18 ? 'MEDIUM' : 'HARD'),
                    desc: `Mastering ${lang} ${topic} with ${variant} methodology. Analyze logic flow and manifest solution.`
                });
            }
            // Fisher-Yates Shuffle for Non-Repetitive Experience
            for (let i = bank.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [bank[i], bank[j]] = [bank[j], bank[i]];
            }
            return bank;
        };

        const currentBank = generateBank(activeLang);
        const allProblems = [
            { id: 'sandbox', title: 'NEURAL_SANDBOX', diff: 'FREE', desc: 'Open playground for unrestricted practice.' },
            ...currentBank,
            ...customProbs
        ];

        // Neural Reboot: Always update logic methods
        window.NXA_LC = {
            problems: allProblems,
            setLanguage: (lang) => {
                localStorage.setItem('nxa_active_lang', lang);
                AppState.setView('leetcode');
            },
            openProblem: (id) => {
                const p = window.NXA_LC.problems.find(x => x.id === id);
                if(!p) return;
                const lang = localStorage.getItem('nxa_active_lang') || 'JAVASCRIPT';
                document.getElementById('problem_list').style.display = 'none';
                document.getElementById('editor_interface').style.display = 'flex';
                document.getElementById('active_title').innerText = p.title;
                document.getElementById('active_desc').innerText = p.desc;
                
                let template = `// Language: ${lang}\nfunction solve(input) {\n  // Code logic here...\n}\n`;
                if (lang === 'PYTHON') template = `# Language: ${lang}\ndef solve(input):\n    # Core logic here...\n    pass\n`;
                if (lang === 'JAVA') template = `// Language: ${lang}\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here...\n    }\n}\n`;
                if (lang === 'CPP') template = `// Language: ${lang}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n`;
                if (lang === 'TYPESCRIPT') template = `// Language: ${lang}\ninterface Input { data: any }\nfunction solve(input: Input): void {\n  // Type-safe logic...\n}\n`;
                if (lang === 'GO') template = `// Language: ${lang}\npackage main\nimport "fmt"\n\nfunc main() {\n  // Goroutine logic here...\n}\n`;
                if (lang === 'RUST') template = `// Language: ${lang}\nfn main() {\n    let mut neural_core = String::from("ACTIVE");\n    // Ownership logic here...\n}\n`;
                if (lang === 'SWIFT') template = `// Language: ${lang}\nimport Foundation\n\nfunc solve() {\n    // Swift arc logic here...\n}\n`;
                
                document.getElementById('code_area').value = p.id === 'sandbox' ? `// --- NEURAL_SANDBOX (${lang}) ---\n\n` : template;
                document.getElementById('leetcode_container').dataset.activeId = id;
            },
            closeProblem: () => {
                document.getElementById('problem_list').style.display = 'grid';
                document.getElementById('editor_interface').style.display = 'none';
            },
            runTest: () => {
                const log = document.getElementById('console_output');
                log.innerHTML = `<span style="color:#ffcc00">[COMPILING...]</span> Verifying Logic...<br>`;
                setTimeout(() => {
                    log.innerHTML += `<span style="color:#00ff6a">[SUCCESS]</span> Environment Ready. Output: 200 OK\n`;
                }, 600);
            },
            submit: (e) => {
                const id = document.getElementById('leetcode_container').dataset.activeId;
                const solved = JSON.parse(localStorage.getItem('nxa_leetcode_solved')) || [];
                if(!solved.includes(id)) solved.push(id);
                localStorage.setItem('nxa_leetcode_solved', JSON.stringify(solved));
                e.target.innerText = 'SYNC_COMPLETE';
                if (navigator.vibrate) navigator.vibrate(20);
                setTimeout(() => AppState.setView('leetcode'), 1000);
            }
        };

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow: hidden; display: flex; flex-direction: column;">
                <div style="margin-bottom: 0.8rem;">
                    <h2 style="font-family: var(--font-heading); font-size: 1.1rem; margin: 0; letter-spacing: 2px;">MODERN_STACK_NEXUS</h2>
                    <div style="display: flex; gap: 6px; margin-top: 10px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
                        ${['JAVASCRIPT', 'TYPESCRIPT', 'PYTHON', 'GO', 'RUST', 'JAVA', 'CPP', 'SWIFT'].map(l => `
                            <button onclick="window.NXA_LC.setLanguage('${l}')" style="flex-shrink: 0; padding: 7px 14px; border-radius: 6px; border: 1px solid ${activeLang === l ? 'var(--accent-primary)' : 'var(--glass-border)'}; background: ${activeLang === l ? 'rgba(0, 242, 255, 0.1)' : 'transparent'}; color: ${activeLang === l ? 'var(--accent-primary)' : 'var(--text-dim)'}; font-size: 0.5rem; font-weight: 900; letter-spacing: 1px; transition: all 0.3s ease;">${l}</button>
                        `).join('')}
                    </div>
                </div>

                <div id="leetcode_container" style="flex: 1; overflow-y: auto;">
                    <div id="problem_list" style="display: grid; gap: 0.7rem; padding-bottom: 5rem;">
                        ${allProblems.map(p => `
                            <div onclick="window.NXA_LC.openProblem('${p.id}')" style="background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 0.8rem; border-radius: 10px; cursor: pointer; position: relative; border-left: 3px solid ${p.id === 'sandbox' ? 'var(--accent-primary)' : (solved.includes(p.id) ? '#00ff6a' : '#333')}; transition: transform 0.2s ease;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <span style="font-size: 0.4rem; color: var(--text-dim); font-weight: 800;">[ ${p.diff} ]</span>
                                        <h3 style="margin: 2px 0; font-size: 0.7rem; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px;">${p.title}</h3>
                                    </div>
                                    <div style="font-size: 0.45rem;">${solved.includes(p.id) ? '✅' : ''}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div id="editor_interface" style="display: none; height: 100%; flex-direction: column;">
                        <button onclick="window.NXA_LC.closeProblem()" style="background: none; border: none; color: var(--accent-primary); font-size: 0.65rem; font-weight: 800; cursor: pointer; margin-bottom: 0.5rem; text-align: left;">← EXIT_CORE</button>
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); padding: 0.6rem; border-radius: 10px; margin-bottom: 0.5rem;">
                            <h4 id="active_title" style="margin: 0; font-size: 0.75rem; color: var(--accent-primary);"></h4>
                            <p id="active_desc" style="font-size: 0.55rem; color: var(--text-dim); margin-top: 4px; line-height: 1.4;"></p>
                        </div>
                        <div style="flex: 1; min-height: 250px; background: #000; border: 1px solid var(--glass-border); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column;">
                            <div style="background: #111; padding: 4px 10px; border-bottom: 1px solid var(--glass-border); font-size: 0.45rem; color: var(--text-dim); display: flex; justify-content: space-between;">
                                <span>NXA_TERMINAL_v4.0</span>
                                <span>MODE: ${activeLang}</span>
                            </div>
                            <textarea id="code_area" spellcheck="false" style="flex: 1; width: 100%; background: transparent; border: none; color: #00ff66; font-family: 'Courier New', monospace; font-size: 0.65rem; padding: 0.8rem; outline: none; resize: none;"></textarea>
                            <div id="console_output" style="height: 40px; background: #050505; border-top: 1px solid var(--glass-border); padding: 6px; font-size: 0.5rem; color: var(--text-dim); font-family: 'Courier New', monospace;">// NEURAL_CONSOLE: READY...</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.8rem; margin-top: 1rem; margin-bottom: 2.5rem;">
                            <button onclick="window.NXA_LC.runTest()" style="background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: #fff; padding: 10px; border-radius: 8px; font-size: 0.6rem; font-weight: 800;">RUN_CORE</button>
                            <button onclick="window.NXA_LC.submit(event)" style="background: var(--accent-primary); border: none; color: #000; padding: 10px; border-radius: 8px; font-size: 0.6rem; font-weight: 900;">COMMIT_SYNC</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

// Boot the Matrix
document.addEventListener('DOMContentLoaded', () => {
    new NXAEngine();

    // ── FULL GESTURE SYSTEM v4 ──────────────────────────────────────
    const studentTabs = ['home', 'leetcode', 'attendance', 'live', 'courses', 'projects', 'internships', 'career', 'self'];
    const adminTabs   = ['home', 'student_mgmt', 'live', 'courses', 'notifications'];

    function getTabOrder() {
        if (AppState.role !== 'admin') return studentTabs;
        if (AppState.roleType === 'max')    return ['home', 'live', 'courses'];
        if (AppState.roleType === 'center') return ['home', 'student_mgmt', 'notifications'];
        return adminTabs;
    }

    let _x0 = 0, _y0 = 0, _t0 = 0, _locked = false;

    document.addEventListener('touchstart', (e) => {
        _x0 = e.touches[0].clientX;
        _y0 = e.touches[0].clientY;
        _t0 = Date.now();
        _locked = false;
    }, { passive: true });

    // Use non-passive so we can preventDefault on horizontal swipes
    document.addEventListener('touchmove', (e) => {
        if (_locked) { e.preventDefault(); return; }
        const dx = e.touches[0].clientX - _x0;
        const dy = e.touches[0].clientY - _y0;
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            _locked = true;
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - _x0;
        const dy = Math.abs(e.changedTouches[0].clientY - _y0);
        const dt = Date.now() - _t0;

        if (!_locked || Math.abs(dx) < 40 || dt > 600) return;

        // Left-edge swipe right → go back
        if (_x0 < 80 && dx > 0) { AppState.goBack(); return; }

        // Tab switching swipe
        const tabs = getTabOrder();
        const idx  = tabs.indexOf(AppState.view);
        if (idx === -1) return;

        if (dx < 0 && idx < tabs.length - 1) {
            AppState.setView(tabs[idx + 1]);
        } else if (dx > 0 && idx > 0) {
            AppState.setView(tabs[idx - 1]);
        }
    }, { passive: true });

    // Android Hardware Back Button
    history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
        history.pushState(null, '', window.location.href);
        AppState.goBack();
    });
});
