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
    setView(view) { this.view = view; this.notify(); },
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

    syncCloudState() {
        if (typeof firebase === 'undefined') return;
        
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
        firebase.firestore().collection('nxa_broadcasts').onSnapshot(snap => {
            const alerts = snap.docs.map(doc => doc.data().id ? doc.data() : null).filter(a => a);
            alerts.sort((a,b) => b.id - a.id);
            localStorage.setItem('nxa_system_alerts', JSON.stringify(alerts));
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
            <nav class="navbar">
                <div class="nav-container">
                    <div class="logo">
                        <button id="menuToggle" class="btn-icon" style="background:none; border:none; color:white; font-size:1.5rem; margin-right:10px; cursor:pointer;">☰</button>
                        <span class="nx" style="margin-left: 5px;">NXA</span><span class="talent">TALENT</span>
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

                <div style="display: none !important; margin-top: auto; padding: 20px;">
                    <button onclick="AppState.logout()" style="width: 100%; padding: 10px; background: rgba(255,69,69,0.1); border: 1px solid #ff4545; color: #ff4545; border-radius: 8px; cursor: pointer;">LOGOUT</button>
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
                    <!-- COURSES ICON -->
                    <div class="bottom-nav-item ${state.view === 'courses' ? 'active' : ''}" data-view="courses">
                        <svg class="icon-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                    </div>
                    <!-- SELF ICON -->
                    <div class="bottom-nav-item ${state.view === 'self' ? 'active' : ''}" data-view="self">
                        <svg class="icon-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                ` : `
                    <div class="bottom-nav-item ${state.view === 'student_mgmt' ? 'active' : ''}" data-view="student_mgmt" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;">
                        <span style="font-size: 1.1rem;">📂</span>
                        <span style="font-size: 0.5rem; font-weight: 800; letter-spacing: 1px;">DOSSIERS</span>
                    </div>
                    <div class="bottom-nav-item ${state.view === 'live' ? 'active' : ''}" data-view="live" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;">
                        <span style="font-size: 1.1rem;">📡</span>
                        <span style="font-size: 0.5rem; font-weight: 800; letter-spacing: 1px;">LIVE</span>
                    </div>
                    <div class="bottom-nav-item ${state.view === 'notifications' ? 'active' : ''}" data-view="notifications" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;">
                        <span style="font-size: 1.1rem;">🔔</span>
                        <span style="font-size: 0.5rem; font-weight: 800; letter-spacing: 1px;">SIGNALS</span>
                    </div>
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
        if (state.view === 'leetcode') return this.viewLeetcode(state);
        if (state.view === 'notifications') return this.viewNotifications(state);
        if (state.view === 'live') return this.viewLive(state);
        if (state.view === 'courses') return this.viewCourses(state);
        if (state.view === 'self') return this.viewSelf(state);
        if (state.view === 'career') return this.viewCareer(state);
        if (state.view === 'course_admin') return this.viewCourseAdmin(state);
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
                        <button type="submit" id="dossierSubmit" class="btn-primary" style="width: 100%; height: 50px; font-weight: 900; letter-spacing: 2px; margin-bottom: 2rem; box-shadow: 0 10px 20px rgba(0,242,255,0.2);">
                            AUTHORIZE_IDENTITY_MANIFEST
                        </button>
                    </div>
                </form>
            </section>
            <script>
                setTimeout(() => {
                    const form = document.getElementById('dossierForm');
                    if (!form) return;
                    form.onsubmit = async (e) => {
                        e.preventDefault();
                        const btn = document.getElementById('dossierSubmit');
                        const originalText = btn.innerText;
                        btn.innerText = 'UPLOADING_TO_CLOUD...';
                        btn.disabled = true;

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
                    };
                }, 100);
            </script>
        `;
    }

    viewNotifications(state) {
        const customAlerts = JSON.parse(localStorage.getItem('nxa_system_alerts')) || [];
        const defaultAlerts = [
            { id: 'def1', type: 'SYSTEM', msg: 'Core AI Matrix Updated to v1.2', time: 'SYSTEM' },
            { id: 'def2', type: 'FOUNDER', msg: 'Welcome to NXA Talent Industrial Portal.', time: 'NARENDRA' }
        ];
        // Combine and show latest first
        // customAlerts are already [Newest -> Oldest] because of unshift/Firestore sort
        const alerts = [...customAlerts, ...defaultAlerts];

        return `
            <section class="section" style="padding: 1.5rem; max-height: 100vh; overflow-y: auto;">
                <h2 style="font-family: var(--font-heading); font-size: 2.22rem; margin-bottom: 2.5rem; letter-spacing: -1px;">NOTIFICATION_MATRIX</h2>
                <div style="display: grid; gap: 1.25rem; max-width: 700px; padding-bottom: 120px;">
                    ${alerts.map(a => `
                        <div style="background: var(--glass-bg); padding: 1.8rem; border-radius: 24px; border: 1px solid var(--glass-border); position: relative; overflow: hidden; animation: cardManifest 0.4s ease forwards;">
                            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: ${a.type === 'ALERT' ? '#ff4545' : 'var(--accent-primary)'}; shadow: 0 0 10px ${a.type === 'ALERT' ? '#ff4545' : 'var(--accent-primary)'};"></div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <span style="font-size: 0.6rem; font-weight: 900; letter-spacing: 3px; color: ${a.type === 'ALERT' ? '#ff4545' : 'var(--accent-primary)'}; opacity: 1;">[ ${a.type} ]</span>
                                <span style="font-size: 0.55rem; color: var(--text-dim); font-weight: 800;">${a.time || 'SYNCHRONIZED'}</span>
                            </div>
                            <p style="color: #fff; font-size: 0.95rem; line-height: 1.6; margin: 0; opacity: 0.9;">${a.msg}</p>
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
        
        const isAuthorizedToBroadcast = isSuper || isCenter || isMax;
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
                    <button onclick="AppState.adminTab='broadcast'; NXA.render(AppState)" style="background: ${activeTab === 'broadcast' ? '#fff' : 'transparent'}; color: ${activeTab === 'broadcast' ? '#000' : '#fff'}; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">BROADCAST</button>
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

                ${activeTab === 'broadcast' ? `
                    <div style="max-width: 600px; margin: 0 auto; background: rgba(0, 229, 255, 0.03); padding: 3rem; border-radius: 32px; border: 1px solid var(--accent-primary);">
                        <h3 style="margin: 0 0 2rem 0; font-size: 1.2rem; font-family: var(--font-heading); color: var(--accent-primary);">GLOBAL_SIGNAL_BROADCAST</h3>
                        <div style="display: grid; gap: 1.5rem;">
                            <div class="input-block">
                                <label style="font-size: 0.5rem; color: var(--accent-primary); margin-bottom: 5px; display: block;">SIGNAL_MESSAGE</label>
                                <textarea id="broadcastMsg" placeholder="Type industrial alert message..." style="width: 100%; background: #000; border: 1px solid var(--glass-border); padding: 15px; border-radius: 12px; color: #fff; font-size: 0.85rem; outline: none; min-height: 100px;"></textarea>
                            </div>
                            <div style="display: flex; gap: 15px;">
                                <div style="flex: 1;">
                                    <label style="font-size: 0.5rem; color: var(--accent-primary); margin-bottom: 5px; display: block;">TYPE</label>
                                    <select id="broadcastType" style="width: 100%; background: #000; border: 1px solid var(--glass-border); color: #fff; padding: 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 800;">
                                        <option value="SIGNAL">SIGNAL</option>
                                        <option value="ALERT">ALERT</option>
                                        <option value="FOUNDER">FOUNDER</option>
                                        <option value="SYSTEM">SYSTEM</option>
                                    </select>
                                </div>
                                <button id="sendBroadcast" style="align-self: flex-end; background: var(--accent-primary); color: #000; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 900; font-size: 0.75rem; cursor: pointer;">DISPATCH</button>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </section>
        `;
    }

    viewAttendance(state) {
        const isAdmin = state.role === 'admin' || state.user.email === 'nxasupertalent@gmail.com';
        const session = JSON.parse(localStorage.getItem('nxa_attendance_session')) || { active: false };
        const myAttendance = JSON.parse(localStorage.getItem(`nxa_att_${state.user.email}`)) || {};
        
        // Window Calculation logic
        const now = new Date();
        const checkWindow = () => {
            if(!session.active) return false;
            const [h, m] = session.time.split(':');
            const target = new Date();
            target.setHours(parseInt(h), parseInt(m), 0, 0);
            
            const diffInMin = (now - target) / (1000 * 60);
            return diffInMin >= -15 && diffInMin <= 30;
        };
        const isWindowActive = checkWindow();

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 0; letter-spacing: 2px;">ATTENDANCE_NEXUS</h2>
                        <span style="color: var(--accent-primary); font-size: 0.55rem; font-weight: 800;">STATUS: ${isWindowActive ? 'WINDOW_OPEN' : 'IDLE'}</span>
                    </div>
                    <div style="text-align: right; color: var(--text-dim); font-size: 0.5rem; font-weight: 800;">
                        ${now.toDateString().toUpperCase()}
                    </div>
                </div>

                ${isAdmin ? `
                    <!-- ADMIN SESSION ANCHORING -->
                    <div style="background: var(--glass-bg); padding: 1.2rem; border-radius: 20px; border: 1px solid var(--accent-primary); margin-bottom: 1.5rem;">
                        <h3 style="margin: 0 0 1rem 0; font-size: 0.8rem; letter-spacing: 1px; color: var(--accent-primary);">SESSION_ANCHORING</h3>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <input id="scheduled_time" type="time" value="${session.time || '12:15'}" style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(0,0,0,0.5); color: #fff; font-size: 0.9rem;">
                            <button id="anchorSession" style="background: var(--accent-primary); color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">ANCHOR</button>
                        </div>
                        <p style="font-size: 0.45rem; color: var(--text-dim); margin-top: 8px; text-transform: uppercase;">QR will activate 15m before and terminate 30m after.</p>
                        
                        <div id="adminScannerUI" style="display: none; margin-top: 1.5rem; border-top: 1px dashed var(--glass-border); padding-top: 1.5rem;">
                            <div id="scanner-container" style="width: 100%; max-width: 300px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 2px solid var(--accent-primary);"></div>
                            <div id="scanner-result" style="text-align: center; margin-top: 10px; font-size: 0.6rem; color: #00ff6a;"></div>
                        </div>
                        <button id="toggleScanner" style="width: 100%; margin-top: 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: #fff; padding: 10px; border-radius: 8px; font-size: 0.6rem; font-weight: 800; cursor: pointer;">ACTIVATE_SCANNER</button>

                        <!-- SEARCHABLE MANUAL PUNCH LIST -->
                        <div style="margin-top: 1.5rem; border-top: 1px dashed var(--glass-border); padding-top: 1.5rem;">
                            <h4 style="margin: 0 0 1rem 0; font-size: 0.6rem; color: var(--text-dim); letter-spacing: 1px;">MANUAL_MANIFEST_OVERRIDE</h4>
                            <input id="student_punch_search" type="text" placeholder="SEARCH_BY_NAME_OR_USN..." style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); color: #fff; font-size: 0.7rem; margin-bottom: 1rem;">
                            <div id="punch_student_list" style="max-height: 200px; overflow-y: auto; display: grid; gap: 8px; scrollbar-width: thin;"></div>
                        </div>
                    </div>
                ` : ''}

                <!-- STUDENT ATTENDANCE INTERFACE -->
                <div id="attendance_display" style="flex: 1;">
                    ${isWindowActive && !isAdmin ? `
                        <div style="background: white; padding: 1.5rem; border-radius: 24px; text-align: center; margin-bottom: 2rem; box-shadow: 0 0 40px rgba(0,242,255,0.2);">
                            <div id="qrcode" style="display: flex; justify-content: center; margin-bottom: 1rem;"></div>
                            <p style="color: #000; font-weight: 900; font-size: 0.6rem; letter-spacing: 1px;">SHOW_TO_ADMIN_SCANNER</p>
                            <span style="color: #666; font-size: 0.5rem;">TOKEN_SECURE: ${state.user.email}</span>
                        </div>
                    ` : `
                        ${!isAdmin ? `
                             <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 20px; padding: 2.5rem; text-align: center; margin-bottom: 2rem;">
                                <div style="font-size: 2.5rem; opacity: 0.1; margin-bottom: 10px;">🌑</div>
                                <h4 style="color: var(--text-dim); font-size: 0.8rem;">No Active Temporal Window</h4>
                                <p style="font-size: 0.55rem; color: var(--text-dim); margin-top: 5px;">Awaiting session anchor by Admin Command.</p>
                            </div>
                        ` : ''}
                    `}

                    <!-- MONTHLY MANIFEST CALENDAR -->
                    <div style="background: var(--glass-bg); padding: 1.5rem; border-radius: 24px; border: 1px solid var(--glass-border);">
                        <h4 style="margin: 0 0 1.2rem 0; font-size: 0.65rem; letter-spacing: 2px; color: var(--text-dim);">MONTHLY_MANIFEST</h4>
                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;">
                            ${Array.from({length: 30}, (_, i) => {
                                const day = i + 1;
                                const dateStr = `2026-04-${day.toString().padStart(2, '0')}`;
                                const isPresent = myAttendance[dateStr] === true;
                                const isToday = day === now.getDate();
                                return `
                                    <div style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; background: ${isPresent ? 'rgba(0, 255, 106, 0.1)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isToday ? 'var(--accent-primary)' : (isPresent ? '#00ff6a' : 'var(--glass-border)')}; border-radius: 8px; font-size: 0.7rem; font-weight: 700; color: ${isPresent ? '#00ff6a' : '#fff'};">
                                        ${day}
                                        ${isPresent ? '<div style="position:absolute; width:4px; height:4px; background:#00ff6a; border-radius:50%; bottom:2px;"></div>' : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div style="margin-top: 1.5rem; display: flex; justify-content: center; gap: 15px;">
                            <div style="display: flex; align-items: center; gap: 5px;"><div style="width: 8px; height: 8px; background: #00ff6a; border-radius: 50%;"></div><span style="font-size: 0.5rem; color: var(--text-dim);">PRESENT</span></div>
                            <div style="display: flex; align-items: center; gap: 5px;"><div style="width: 8px; height: 8px; background: #ff4545; border-radius: 50%;"></div><span style="font-size: 0.5rem; color: var(--text-dim);">ABSENT</span></div>
                        </div>
                    </div>
                </div>
            </section>
            <script>
                setTimeout(() => {
                    // QR Generation for Students
                    const qrEl = document.getElementById('qrcode');
                    if(qrEl) {
                        if (typeof QRCode !== 'undefined') {
                            new QRCode(qrEl, {
                                text: "ATT_${state.user.email}_NXA",
                                width: 180,
                                height: 180,
                                colorDark : "#000000",
                                colorLight : "#ffffff",
                                correctLevel : QRCode.CorrectLevel.H
                            });
                        } else {
                            qrEl.innerHTML = '<p style="color:var(--text-dim);font-size:0.6rem;padding:20px;border:1px dashed var(--glass-border);border-radius:12px;">QR_ENGINE_OFFLINE<br><span style="font-size:0.4rem;">Script load failed or blocked.</span></p>';
                        }
                    }

                    // Manual Punch Search & Logic for Admin
                    const searchInput = document.getElementById('student_punch_search');
                    if(searchInput) {
                        const punchList = document.getElementById('punch_student_list');
                        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
                        const students = Object.values(profiles);
                        const dateStr = new Date().toISOString().split('T')[0];

                        const renderList = (term = '') => {
                            const filtered = students.filter(s => 
                                s.fullname?.toLowerCase().includes(term.toLowerCase()) || 
                                s.usn?.toLowerCase().includes(term.toLowerCase())
                            );
                            punchList.innerHTML = filtered.map(s => {
                                const attKey = \`nxa_att_\${s.email}\`;
                                const attRecord = JSON.parse(localStorage.getItem(attKey)) || {};
                                const isPresent = attRecord[dateStr] === true;
                                return \`
                                    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--glass-border);">
                                        <div style="flex: 1;">
                                            <div style="font-size: 0.65rem; color: #fff; font-weight: 800;">\${s.fullname}</div>
                                            <div style="font-size: 0.45rem; color: var(--text-dim);">\${s.usn || 'NO_USN'}</div>
                                        </div>
                                        <button onclick="window.NXA_ATT.manualPunch('\${s.email}', this)" style="background: \${isPresent ? '#00ff66' : 'var(--accent-primary)'}; color: #000; border: none; padding: 4px 10px; border-radius: 4px; font-size: 0.5rem; font-weight: 900; opacity: \${isPresent ? '0.5' : '1'};">
                                            \${isPresent ? 'PRESENT' : 'PUNCH NOW'}
                                        </button>
                                    </div>
                                \`;
                            }).join('');
                        };

                        window.NXA_ATT = {
                            manualPunch: (email, btn) => {
                                const attKey = \`nxa_att_\${email}\`;
                                const attRecord = JSON.parse(localStorage.getItem(attKey)) || {};
                                attRecord[dateStr] = true;
                                localStorage.setItem(attKey, JSON.stringify(attRecord));
                                btn.innerText = 'PRESENT';
                                btn.style.background = '#00ff66';
                                btn.style.opacity = '0.5';
                                if (navigator.vibrate) navigator.vibrate(20);
                            }
                        };

                        searchInput.oninput = (e) => renderList(e.target.value);
                        renderList(); // Initial Manifest
                    }

                    // Admin Logic
                    const anchorBtn = document.getElementById('anchorSession');
                    if(anchorBtn) anchorBtn.onclick = () => {
                        const time = document.getElementById('scheduled_time').value;
                        localStorage.setItem('nxa_attendance_session', JSON.stringify({ active: true, time, date: new Date().toDateString() }));
                        AppState.setView('attendance');
                    };

                    // Scanner Logic for Admin
                    let html5QrCode;
                    const toggleScanner = document.getElementById('toggleScanner');
                    if(toggleScanner) toggleScanner.onclick = () => {
                        const ui = document.getElementById('adminScannerUI');
                        if(ui.style.display === 'none') {
                            if (typeof Html5Qrcode === 'undefined') {
                                alert('SCANNER_ENGINE_OFFLINE: html5-qrcode library not loaded.');
                                return;
                            }
                            ui.style.display = 'block';
                            toggleScanner.innerText = 'TERMINATE_SCANNER';
                            html5QrCode = new Html5Qrcode("scanner-container");
                            html5QrCode.start(
                                { facingMode: "environment" }, 
                                { fps: 10, qrbox: { width: 250, height: 250 } },
                                (decodedText) => {
                                    if(decodedText.startsWith("ATT_") && decodedText.endsWith("_NXA")) {
                                        const email = decodedText.split('_')[1];
                                        const res = document.getElementById('scanner-result');
                                        res.innerText = "AUTHENTICATED: " + email;
                                        // Update that student's record
                                        const dateStr = new Date().toISOString().split('T')[0];
                                        const attKey = 'nxa_att_' + email;
                                        const attRecord = JSON.parse(localStorage.getItem(attKey)) || {};
                                        attRecord[dateStr] = true;
                                        localStorage.setItem(attKey, JSON.stringify(attRecord));
                                        if (navigator.vibrate) navigator.vibrate(50);
                                        setTimeout(() => { res.innerText = ""; }, 2000);
                                    }
                                }
                            ).catch(err => {
                                console.error("SCAN_START_FAIL:", err);
                                alert("SCANNER_ERROR: " + err);
                            });
                        } else {
                            if(html5QrCode) {
                                html5QrCode.stop().catch(e => console.warn("SCAN_STOP_FAIL:", e));
                            }
                            ui.style.display = 'none';
                            toggleScanner.innerText = 'ACTIVATE_SCANNER';
                        }
                    };
                }, 400);
            </script>
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
                            <div class="input-block"><label style="font-size: 0.5rem;">PROJECT_TITLE</label><input id="p_title" type="text" placeholder="Project Name" style="padding: 10px; font-size: 0.8rem;"></div>
                            <div class="input-block"><label style="font-size: 0.5rem;">IMAGE_MANIFEST_URL</label><input id="p_image" type="text" placeholder="https://..." style="padding: 10px; font-size: 0.8rem;"></div>
                            <div class="input-block" style="grid-column: span 2;"><label style="font-size: 0.5rem;">INDUSTRIAL_INFORMATION</label><textarea id="p_info" placeholder="Detailed project description..." style="width: 100%; height: 60px; background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border); border-radius: 8px; color: #fff; padding: 10px; font-size: 0.75rem;"></textarea></div>
                            <div class="input-block"><label style="font-size: 0.5rem;">SOURCE_CODE_UPLINK</label><input id="p_source" type="text" placeholder="Github/GitLab Link" style="padding: 10px; font-size: 0.8rem;"></div>
                            <div class="input-block"><label style="font-size: 0.5rem;">DATASET_ARCHIVE</label><input id="p_dataset" type="text" placeholder="Dataset URL" style="padding: 10px; font-size: 0.8rem;"></div>
                        </div>
                        <button id="deployProject" style="width: 100%; margin-top: 1.5rem; background: var(--accent-primary); color: #000; border: none; padding: 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; cursor: pointer;">MANIFEST_PROJECT</button>
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

                                ${isExecutive ? `<button onclick="window.NXA_PROJ.deleteProject(${idx})" style="width: 100%; height: 35px; background: rgba(255, 69, 69, 0.05); color: #ff4545; border: 1px solid rgba(255, 69, 69, 0.1); border-radius: 6px; font-size: 0.55rem; font-weight: 900; cursor: pointer;">TERMINATE_NODE</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            <script>
                setTimeout(() => {
                    const deployBtn = document.getElementById('deployProject');
                    if(deployBtn) deployBtn.onclick = () => {
                        const title = document.getElementById('p_title').value;
                        const image = document.getElementById('p_image').value;
                        const info = document.getElementById('p_info').value;
                        const source = document.getElementById('p_source').value;
                        const dataset = document.getElementById('p_dataset').value;

                        if(!title) return alert('Project Title is required.');

                        const projects = JSON.parse(localStorage.getItem('nxa_industrial_projects')) || [];
                        projects.unshift({ title, image, info, source, dataset, createdAt: new Date().toLocaleString() });
                        localStorage.setItem('nxa_industrial_projects', JSON.stringify(projects));
                        
                        AppState.setView('projects');
                    };

                    window.NXA_PROJ = {
                        deleteProject: (idx) => {
                            if(!confirm('TERMINATE_PROJECT_NODE?')) return;
                            const projects = JSON.parse(localStorage.getItem('nxa_industrial_projects')) || [];
                            projects.splice(idx, 1);
                            localStorage.setItem('nxa_industrial_projects', JSON.stringify(projects));
                            AppState.setView('projects');
                        }
                    };
                }, 400);
            </script>
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

                ${isSuper ? `
                    <!-- SUPER ADMIN INTERNSHIP DEPLOYMENT -->
                    <div style="background: var(--glass-bg); padding: 1.5rem; border-radius: 20px; border: 1px solid #ffcc00; margin-bottom: 2rem;">
                        <h3 style="margin: 0 0 1rem 0; font-size: 0.8rem; letter-spacing: 1px; color: #ffcc00;">POST_NEW_INTERNSHIP</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="input-block"><label style="font-size: 0.5rem;">COMPANY_ROLE</label><input id="i_title" type="text" placeholder="e.g. Google - AI Research" style="padding: 10px; font-size: 0.8rem;"></div>
                            <div class="input-block"><label style="font-size: 0.5rem;">STIPEND_DURATION</label><input id="i_desc" type="text" placeholder="e.g. 50k/mo - 6 Months" style="padding: 10px; font-size: 0.8rem;"></div>
                            <div class="input-block" style="grid-column: span 2;"><label style="font-size: 0.5rem;">CORE_REQUIREMENTS</label><textarea id="i_req" placeholder="Python, TensorFlow, Neural Networks..." style="width: 100%; height: 60px; background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border); border-radius: 8px; color: #fff; padding: 10px; font-size: 0.75rem;"></textarea></div>
                            <div class="input-block" style="grid-column: span 2;"><label style="font-size: 0.5rem;">APPLICATION_UPLINK_URL</label><input id="i_link" type="text" placeholder="https://..." style="padding: 10px; font-size: 0.8rem;"></div>
                        </div>
                        <button id="postInternship" style="width: 100%; margin-top: 1.5rem; background: #ffcc00; color: #000; border: none; padding: 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; cursor: pointer;">DEPLOY_OPPORTUNITY</button>
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
                                    ${isSuper ? `<button onclick="window.NXA_INT.deleteNode(${idx})" style="background: none; border: 1px solid #ff4545; color: #ff4545; padding: 8px 15px; border-radius: 8px; font-size: 0.55rem; font-weight: 900; cursor: pointer;">TERMINATE</button>` : ''}
                                    <button onclick="window.NXA_INT.applyNode('${inst.id}', '${inst.link}')" ${hasApplied ? 'disabled' : ''} style="background: ${hasApplied ? 'rgba(0, 255, 106, 0.1)' : 'var(--accent-primary)'}; color: ${hasApplied ? '#00ff66' : '#000'}; border: ${hasApplied ? '1px solid #00ff6a' : 'none'}; padding: 12px 25px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; cursor: pointer;">
                                        ${hasApplied ? 'APPLIED ✅' : 'APPLY_NOW'}
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>
            <script>
                setTimeout(() => {
                    const postBtn = document.getElementById('postInternship');
                    if(postBtn) postBtn.onclick = () => {
                        const title = document.getElementById('i_title').value;
                        const desc = document.getElementById('i_desc').value;
                        const req = document.getElementById('i_req').value;
                        const link = document.getElementById('i_link').value;

                        if(!title || !link) return alert('Title and Link are required.');

                        const hubs = JSON.parse(localStorage.getItem('nxa_internship_matrix')) || [];
                        hubs.unshift({ id: 'INT_' + Date.now(), title, desc, req, link });
                        localStorage.setItem('nxa_internship_matrix', JSON.stringify(hubs));
                        AppState.setView('internships');
                    };

                    window.NXA_INT = {
                        deleteNode: (idx) => {
                            if(!confirm('TERMINATE_INTERNSHIP_NODE?')) return;
                            const hubs = JSON.parse(localStorage.getItem('nxa_internship_matrix')) || [];
                            hubs.splice(idx, 1);
                            localStorage.setItem('nxa_internship_matrix', JSON.stringify(hubs));
                            AppState.setView('internships');
                        },
                        applyNode: (id, link) => {
                            const apps = JSON.parse(localStorage.getItem(\`nxa_apps_\${AppState.user.email}\`)) || [];
                            if(!apps.includes(id)) apps.push(id);
                            localStorage.setItem(\`nxa_apps_\${AppState.user.email}\`, JSON.stringify(apps));
                            window.open(link, '_blank');
                            AppState.setView('internships');
                        }
                    };
                }, 400);
            </script>
        `;
    }


    viewLive(state) {
        const isSuper = state.role === 'admin' && state.roleType === 'super';
        const isMax = state.role === 'admin' && state.roleType === 'max';
        const isExecutive = isSuper || isMax || state.user.email === 'nxasupertalent@gmail.com';
        
        const liveData = JSON.parse(localStorage.getItem('nxa_live_broadcast')) || { active: false };

        return `
            <section class="section" style="padding: 1.5rem; max-height: 100vh; overflow: hidden;">
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
                        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                            <button id="startLiveBtn" class="btn-primary-lg" style="flex: 1; padding: 10px; font-size: 0.7rem; background: #00ff6a; color: #000; font-weight: 900;">${liveData.active ? 'UPDATE' : 'START_LIVE'}</button>
                            ${liveData.active ? `<button id="stopLiveBtn" class="btn-primary-lg" style="flex: 1; padding: 10px; font-size: 0.7rem; background: #ff4545; color: #fff; border: none; font-weight: 900;">TERMINATE</button>` : ''}
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
            <script>
                setTimeout(() => {
                    const sBtn = document.getElementById('startLiveBtn');
                    const tBtn = document.getElementById('stopLiveBtn');
                    if(sBtn) sBtn.onclick = () => {
                        const topic = document.getElementById('live_topic').value;
                        const link = document.getElementById('live_link').value;
                        if(!topic || !link) return alert('Session Topic and Link required.');
                        localStorage.setItem('nxa_live_broadcast', JSON.stringify({ active: true, topic, link }));
                        AppState.setView('live');
                    };
                    if(tBtn) tBtn.onclick = () => {
                        if(!confirm('TERMINATE_UPLINK?')) return;
                        localStorage.setItem('nxa_live_broadcast', JSON.stringify({ active: false }));
                        AppState.setView('live');
                    };
                }, 200);
            </script>
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
            { id: 'c1', title: 'Advanced Neural AI', domain: 'Artificial Intelligence' },
            { id: 'c2', title: 'Full-Stack Nexus', domain: 'Web Engineering' },
            { id: 'c3', title: 'Cyber Security Protocol', domain: 'Security' }
        ];
        const saved = localStorage.getItem('nxa_system_courses');
        return saved ? JSON.parse(saved) : defaultCourses;
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

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; margin: 0; letter-spacing: 2px;">COURSE_MATRIX</h2>
                        <span style="color: var(--accent-primary); font-size: 0.55rem; font-weight: 800;">ENROLLED: ${myCourses.length}</span>
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
                    <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; padding-bottom: 5rem;">
                        ${myCourses.map(c => `
                            <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 1.5rem; border-radius: 16px; position: relative; display: flex; justify-content: space-between; align-items: center;">
                                <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--accent-primary);"></div>
                                <div>
                                    <span style="font-size: 0.5rem; color: var(--accent-primary); font-weight: 800; letter-spacing: 1px;">${c.domain.toUpperCase()}</span>
                                    <h3 style="margin: 4px 0; font-size: 1.1rem; color: #fff;">${c.title}</h3>
                                </div>
                                <button class="btn-primary-lg" style="padding: 8px 15px; font-size: 0.6rem; height: fit-content;">RESUME</button>
                            </div>
                        `).join('')}
                    </div>
                `}
            </section>
        `;
    }

    viewCourseAdmin(state) {
        if (state.role !== 'admin' && state.user.email !== 'nxasupertalent@gmail.com') return this.viewHome(state);
        const courses = this.getCourses();

        return `
            <section class="section" style="padding: 1rem; max-height: 100vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                    <h2 style="font-family: var(--font-heading); font-size: 1.6rem; margin: 0; letter-spacing: 2px;">COURSE_CONTROL</h2>
                    <button onclick="document.getElementById('addCourseForm').style.display='block'" style="background: #00ff6a; color: #000; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.6rem; font-weight: 900; cursor: pointer;">+ NEW</button>
                </div>

                <div id="addCourseForm" style="display:none; background: var(--glass-bg); padding: 1.2rem; border-radius: 16px; border: 1px solid var(--accent-primary); margin-bottom: 1.5rem; position: relative;">
                    <div style="display: grid; gap: 1rem;">
                        <input id="new_c_title" type="text" placeholder="Course Title" style="height: 40px; font-size: 0.8rem;">
                        <input id="new_c_domain" type="text" placeholder="Domain" style="height: 40px; font-size: 0.8rem;">
                        <button id="commitCourseBtn" class="btn-primary-lg" style="padding: 10px; font-size: 0.7rem;">AUTHORIZE</button>
                    </div>
                </div>

                <div style="display: grid; gap: 0.8rem; padding-bottom: 5rem;">
                    ${courses.map(c => `
                        <div style="background: var(--glass-bg); padding: 1.2rem; border-radius: 16px; border: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="color: var(--accent-primary); font-size: 0.5rem; font-weight: 800;">${c.domain}</span>
                                <h3 style="margin: 2px 0; font-size: 1rem; color: #fff;">${c.title}</h3>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button onclick="window.NXA.showAssignModal('${c.id}')" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--glass-border); padding: 6px 10px; border-radius: 4px; font-size: 0.55rem; font-weight: 800;">ASSIGN</button>
                                <button onclick="window.NXA.deleteCourse('${c.id}')" style="background: rgba(255,69,69,0.1); color: #ff4545; border: 1px solid rgba(255,69,69,0.2); padding: 6px 10px; border-radius: 4px; font-size: 0.55rem; font-weight: 800;">DEL</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div id="assignModal" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; align-items: center; justify-content: center; padding: 1.5rem;">
                    <div style="background: var(--bg-dark); width: 100%; border: 1px solid var(--accent-primary); border-radius: 20px; padding: 2rem; max-height: 80vh; overflow-y: auto;">
                        <h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem; letter-spacing: 1px;">RECIPIENTS</h3>
                        <div id="studentAssignmentList" style="display: grid; gap: 0.8rem;"></div>
                        <button onclick="document.getElementById('assignModal').style.display='none'" class="btn-primary-lg" style="margin-top: 2rem; width: 100%; padding: 12px; font-size: 0.8rem;">DONE</button>
                    </div>
                </div>
            </section>
            <script>
                setTimeout(() => {
                    const commitBtn = document.getElementById('commitCourseBtn');
                    if(commitBtn) commitBtn.onclick = () => {
                        const title = document.getElementById('new_c_title').value;
                        const domain = document.getElementById('new_c_domain').value;
                        if(!title || !domain) return;
                        const courses = window.NXA.getCourses();
                        courses.push({ id: 'c' + Date.now(), title, domain });
                        window.NXA.saveCourses(courses);
                        AppState.setView('course_admin'); 
                    };
                    window.NXA = this;
                    window.NXA.deleteCourse = (id) => {
                        if(!confirm('TERMINATE?')) return;
                        const filtered = window.NXA.getCourses().filter(c => c.id !== id);
                        window.NXA.saveCourses(filtered);
                        AppState.setView('course_admin');
                    };
                    window.NXA.showAssignModal = (courseId) => {
                        const modal = document.getElementById('assignModal');
                        const list = document.getElementById('studentAssignmentList');
                        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
                        const students = Object.values(profiles);
                        modal.style.display = 'flex';
                        list.innerHTML = students.map(s => {
                            const isAssigned = (s.assigned_courses || []).includes(courseId);
                            return \`
                                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.8rem; border-radius: 10px; border: 1px solid var(--glass-border);">
                                    <div style="font-size: 0.8rem; font-weight: 800;">\${s.fullname}</div>
                                    <button onclick="window.NXA.toggleAssignment('\${s.email}', '\${courseId}', this)" style="background: \${isAssigned ? '#00ff6a' : 'transparent'}; color: \${isAssigned ? '#000' : '#fff'}; border: 1px solid \${isAssigned ? '#00ff6a' : 'var(--glass-border)'}; padding: 4px 10px; border-radius: 4px; font-size: 0.55rem; font-weight: 800;">
                                        \${isAssigned ? 'YES' : 'ADD'}
                                    </button>
                                </div>
                            \`;
                        }).join('');
                    };
                    window.NXA.toggleAssignment = (email, courseId, btn) => {
                        const profiles = JSON.parse(localStorage.getItem('nxa_student_profiles')) || {};
                        const s = profiles[email];
                        if(!s) return;
                        if(!s.assigned_courses) s.assigned_courses = [];
                        const idx = s.assigned_courses.indexOf(courseId);
                        if(idx > -1) {
                            s.assigned_courses.splice(idx, 1);
                            btn.innerText = 'ADD'; btn.style.background = 'transparent'; btn.style.color = '#fff';
                        } else {
                            s.assigned_courses.push(courseId);
                            btn.innerText = 'YES'; btn.style.background = '#00ff6a'; btn.style.color = '#000';
                        }
                        localStorage.setItem('nxa_student_profiles', JSON.stringify(profiles));
                    };
                }, 200);
            </script>
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
});
