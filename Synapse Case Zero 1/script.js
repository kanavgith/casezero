// --- CONSTANTS & CONFIG ---
const STATE_HUB = 'HUB';
const STATE_WILSON = 'WILSON';
const STATE_KAPOOR = 'KAPOOR';
const STATE_SEISMIC = 'SEISMIC';

// Sub-states for Wilson
const WILSON_STATES = ['PROLOGUE', 'CHAPTER_1', 'CHAPTER_2', 'CHAPTER_3', 'CHAPTER_4', 'CLOSING'];
// Sub-states for Kapoor
const KAPOOR_STATES = ['BRIEFING', 'PHONE_LOCK', 'MESSAGES', 'OFFICE', 'MEETING_LOGS', 'CCTV_ELIMINATION', 'FOOTPRINTS', 'FINAL_REVEAL'];
// Sub-states for Seismic
const SEISMIC_STATES = ['BRIEFING', 'SITE_1', 'SITE_2', 'SITE_3', 'SITE_4', 'SITE_5_PREDICT', 'SITE_5', 'SITE_6_PREDICT', 'FINAL_QUESTION', 'CLOSING'];

const SOLUTIONS = {
    // Wilson Case
    WILSON_CH1: "NDAuNzQsIC03My45OA==", // "40.74, -73.98"
    WILSON_CH2: "VEhFIFJVU1RZIEFOQ0hPUg==", // "THE RUSTY ANCHOR"
    WILSON_CH3: "Tk9ERS1C", // "NODE-B"
    WILSON_CH4_URL: "RWxpX0NhY2hNYXN0ZXIuYmxvZw==", // "Eli_CachMaster.blog"
    WILSON_CH4_RADIUS: "NTAwTSBOT1JUSA==", // "500M NORTH"
    
    // Kapoor Case
    KAPOOR_PHONE: "MTEwNTQz", // "110543"
    KAPOOR_HEX: "T0ZGSUNF", // "OFFICE"
    KAPOOR_OFFICE_LOCK: "NDQzODc2", // "443876"
    KAPOOR_SUSPECT: "QU5JS0EgU0hBSA==", // "ANIKA SHAH"

    // Seismic Case
    SEISMIC_LINK: "Q0VSVEFJTiBJTkRVU1RSSUVTIEFSRSBTSU1JTEFS", // "CERTAIN INDUSTRIES ARE SIMILAR"
    SEISMIC_TYPE: "Uk5EIElORFVTVFJJRVM=", // "RND INDUSTRIES"
    SEISMIC_COMPANY: "Tk9WQVRFTCBSRVNFQVJDSA==", // "NOVATEL RESEARCH"
    SEISMIC_SITE5: "U09VVEggT0YgTUFSS0VU", // "SOUTH OF MARKET"
    SEISMIC_SITE6: "TUlTU0lPTiBCQVkgUkVTRUFSQ0ggUEFSSw==", // "MISSION BAY RESEARCH PARK"
    SEISMIC_MACHINE: "TEFSR0UgQkxBQ0sgU0VNSS1UUlVDSw==" // "LARGE BLACK SEMI-TRUCK"
};

let currentCase = null;
let currentStepIndex = 0;
let isTyping = false;
let notesData = [];

// --- DOM ELEMENTS ---
const homeScreen = document.getElementById('home-screen');
const appContainer = document.getElementById('app-container');
const viewport = document.getElementById('game-content');
const inputContainer = document.getElementById('input-container');
const terminalInput = document.getElementById('terminal-input');
const actionContainer = document.getElementById('action-container');
const glitchLayer = document.getElementById('glitch-overlay');
const notesArea = document.getElementById('notes-content');
const mapModal = document.getElementById('map-modal');
const mapToggleBtn = document.getElementById('map-toggle-btn');
const closeMapBtn = document.getElementById('close-map');
const certModal = document.getElementById('certificate-modal');
const errorToast = document.getElementById('error-toast');
const caseIdDisplay = document.getElementById('current-case-id');

// --- // --- HUB LOGIC ---
function launchCase(caseId) {
    triggerGlitch();
    homeScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
    
    currentCase = caseId;
    currentStepIndex = 0;
    notesData = [];
    notesArea.innerHTML = '<span class="placeholder">NO DATA RECOVERED...</span>';
    
    const mapMarkersContainer = document.getElementById('map-markers-container');
    mapMarkersContainer.innerHTML = '';

    if (caseId === 'wilson') {
        caseIdDisplay.textContent = 'CASE_FILE: #00-WILSON';
        renderWilsonMapMarkers();
        renderWilsonStep();
    } else if (caseId === 'kapoor') {
        caseIdDisplay.textContent = 'CASE_FILE: #01-KAPOOR';
        renderKapoorStep();
    } else if (caseId === 'seismic') {
        caseIdDisplay.textContent = 'CASE_FILE: #02-SEISMIC';
        renderSeismicMapMarkers();
        renderSeismicStep();
    }
}

function renderSeismicMapMarkers() {
    const container = document.getElementById('map-markers-container');
    container.innerHTML = `
        <div class="map-marker" id="marker-s1" title="Montgomery Street" style="top: 40%; left: 45%;"></div>
        <div class="map-marker" id="marker-s2" title="Salesforce Transit Center" style="top: 50%; left: 55%;"></div>
        <div class="map-marker" id="marker-s3" title="The Port" style="top: 30%; left: 70%;"></div>
        <div class="map-marker" id="marker-s4" title="Fed Reserve Bank" style="top: 35%; left: 63%;"></div>
        <div class="map-marker" id="marker-s5" title="SoMa" style="top: 65%; left: 40%;"></div>
        <div class="map-marker" id="marker-s6" title="Mission Bay" style="top: 75%; left: 75%;"></div>
        <div class="map-labels">
            <span style="top: 35%; left: 40%;">MONTGOMERY</span>
            <span style="top: 55%; left: 50%;">SALESFORCE</span>
            <span style="top: 25%; left: 70%;">PORT</span>
            <span style="top: 40%; left: 63%;">FED_RESERVE</span>
            <span style="top: 70%; left: 35%;">SoMa</span>
            <span style="top: 80%; left: 75%;">MISSION_BAY</span>
        </div>
    `;
}

function renderWilsonMapMarkers() {
    const container = document.getElementById('map-markers-container');
    container.innerHTML = `
        <div class="map-marker" id="marker-a" title="Node-A (Trailhead)" style="top: 20%; left: 30%;"></div>
        <div class="map-marker" id="marker-b" title="Node-B (Boat Ramp)" style="top: 80%; left: 70%;"></div>
        <div class="map-marker" id="marker-c" title="Node-C (Watchtower)" style="top: 40%; left: 85%;"></div>
        <div class="map-labels">
            <span style="top: 15%; left: 25%;">NODE-A</span>
            <span style="top: 85%; left: 65%;">NODE-B</span>
            <span style="top: 35%; left: 80%;">NODE-C</span>
        </div>
    `;
}

function exitToHub() {
    triggerGlitch();
    homeScreen.classList.remove('hidden');
    appContainer.classList.add('hidden');
    certModal.classList.add('hidden');
    mapModal.classList.add('hidden');
    document.getElementById('case-nav-container').innerHTML = '';
    viewport.innerHTML = '';
}

// --- WILSON CASE ENGINE ---
async function renderWilsonStep() {
    viewport.innerHTML = '';
    actionContainer.innerHTML = '';
    inputContainer.classList.add('hidden');
    const step = WILSON_STATES[currentStepIndex];

    switch (step) {
        case 'PROLOGUE': await playWilsonPrologue(); break;
        case 'CHAPTER_1': await playWilsonCh1(); break;
        case 'CHAPTER_2': await playWilsonCh2(); break;
        case 'CHAPTER_3': await playWilsonCh3(); break;
        case 'CHAPTER_4': await playWilsonCh4(); break;
        case 'CLOSING': showWilsonClosing(); break;
    }
}

async function playWilsonPrologue() {
    const canvas = document.createElement('canvas');
    canvas.id = 'waveform';
    viewport.appendChild(canvas);
    startWaveform(canvas);
    await typewriter("Nate (Voiceover): \"Dad—uh—car just died. I think I’m near the woods by the old road… signal’s bad. Can you come get me? ... Yeah, I'm pretty sure it's—\"", "narrative-p");
    const alert = document.createElement('div');
    alert.className = 'system-alert-red';
    alert.textContent = 'SYSTEM ALERT: CONNECTION LOST. PACKET LOSS: 100%.';
    viewport.appendChild(alert);
    await typewriter("The Briefing: You are a Digital Forensics Intern. Nate Wilson never made it home. Find his digital footprint.", "narrative-p");
    createActionButton("START_INVESTIGATION", () => { currentStepIndex++; renderWilsonStep(); });
}

async function playWilsonCh1() {
    await typewriter("📍 CHAPTER 1: THE ACCIDENTAL SELFIE", "chapter-header");
    await typewriter("Detectives recovered Nate’s laptop. The last file synced was a photo. Metadata hides GPS pings in the hardware string: 40-74-N-W-73-98.", "narrative-p");
    
    const props = document.createElement('div');
    props.className = 'properties-window';
    props.innerHTML = `
        <div class="properties-row"><span>FILE_NAME:</span><span>IMG_8829.JPG</span></div>
        <div class="properties-row"><span>SIZE:</span><span>4.2 MB</span></div>
        <div class="properties-row"><span>DEVICE:</span><span>iPhone 15 Pro</span></div>
        <div class="properties-row"><span>SERIAL_CODE:</span><span>40-74-N-W-73-98</span></div>
        <p style="margin-top:15px; font-size: 0.75rem; opacity: 0.7;">Note from desk: "Nate hides GPS pings in the hardware string."</p>
    `;
    viewport.appendChild(props);

    showInput("ENTER COORDINATES (XX.XX, -XX.XX):", (val) => {
        if (validate(val, SOLUTIONS.WILSON_CH1)) {
            saveNote("COORD_LOCKED: 40.74, -73.98");
            currentStepIndex++; renderWilsonStep();
        } else triggerFailure();
    });
}

async function playWilsonCh2() {
    await typewriter("📸 CHAPTER 2: THE REFLECTION", "chapter-header");
    await typewriter("Dashboard photo reflection reveals blurry neon sign: \"TH_ RU_TY AN_HOR\".", "narrative-p");
    createActionButton("SEARCH_NEARBY_BUSINESSES", () => {
        const businesses = ["ANCHOR AUTOMOTIVE", "THE RUSTY ANCHOR", "BLUE ANCHOR CAFE"];
        const div = document.createElement('div');
        div.className = 'search-results';
        businesses.forEach(b => {
            const item = document.createElement('div');
            item.className = 'search-item';
            item.textContent = `[RESULT] ${b} - NEARBY_MATCH_CALC...`;
            item.onclick = () => {
                if (b === "THE RUSTY ANCHOR") { currentStepIndex++; renderWilsonStep(); }
                else triggerFailure();
            };
            div.appendChild(item);
        });
        viewport.appendChild(div);
        typewriter("SEARCH RESULTS RETURNED:", "narrative-p");
    });
}

async function playWilsonCh3() {
    await typewriter("📶 CHAPTER 3: THE GHOST HANDSHAKE", "chapter-header");
    await typewriter("We’ve intercepted 'Mesh Network Logs' from the local park. Triangulate Nate’s MAC Address (DE:AD:BE:EF:01).", "narrative-p");
    
    const table = document.createElement('table');
    table.className = 'wifi-table';
    table.innerHTML = `
        <thead><tr><th>TIME</th><th>ROUTER_ID</th><th>RSSI (STRENGTH)</th></tr></thead>
        <tbody>
            <tr><td>03:05 AM</td><td>Node-A (Trailhead)</td><td>-85 dBm</td></tr>
            <tr><td>03:12 AM</td><td>Node-B (Boat Ramp)</td><td>-42 dBm</td></tr>
            <tr><td>03:20 AM</td><td>Node-C (Watchtower)</td><td>-70 dBm</td></tr>
        </tbody>
    `;
    viewport.appendChild(table);
    await typewriter("Note: RSSI closer to 0 is stronger connection.", "narrative-p hint-text");

    showInput("IDENTIFY STRONGEST NODE ID:", (val) => {
        if (validate(val, SOLUTIONS.WILSON_CH3)) { currentStepIndex++; renderWilsonStep(); }
        else triggerFailure();
    });
}

async function playWilsonCh4() {
    await typewriter("🕵️ CHAPTER 4: THE DELETED BLOG", "chapter-header");
    await typewriter("Eli claims he was at home. But we suspect he ran a geocaching blog 'CachMaster_99'. Search for 'Eli_CachMaster.blog' in the archive.", "narrative-p");
    
    const ui = document.createElement('div');
    ui.className = 'properties-window';
    ui.style.borderColor = '#B163FF';
    ui.innerHTML = `
        <div style="background:var(--purple); color:black; padding:5px; margin-bottom:15px; font-weight:bold;">WAYBACK_ARCHIVE_v4.2</div>
        <div style="display:flex; gap:10px;">
            <input type="text" id="wb-in" placeholder="URL..." style="background:black; border:1px solid var(--purple); color:var(--purple); padding:10px; flex-grow:1; font-family:var(--font-mono);">
            <button id="wb-btn" class="proceed-btn" style="padding:10px;">SEARCH</button>
        </div>
        <div id="wb-res" style="margin-top:20px; font-size:0.8rem; border-top:1px dashed var(--purple); padding-top:10px;">AWAITING_INPUT...</div>
    `;
    viewport.appendChild(ui);
    
    document.getElementById('wb-btn').onclick = () => {
        if (validate(document.getElementById('wb-in').value, SOLUTIONS.WILSON_CH4_URL)) {
            document.getElementById('wb-res').innerHTML = `<span style="color:cyan;">[SNAPSHOT_FOUND]</span><br><br>"Found the perfect spot. It's exactly 500 meters North of the Old Watchtower."`;
            triggerGlitch();
            showInput("ENTER RADIUS (E.G. '500M NORTH'):", (val) => {
                if (validate(val, SOLUTIONS.WILSON_CH4_RADIUS)) { currentStepIndex++; renderWilsonStep(); }
                else triggerFailure();
            });
        } else {
            document.getElementById('wb-res').innerHTML = `<span style="color:red;">[ERROR: 404]</span>`;
            triggerFailure();
        }
    };
}

function showWilsonClosing() {
    typewriter("CONCLUSION: CASE CLOSED. NATE RECOVERED.", "chapter-header").then(() => {
        document.getElementById('cert-id-val').textContent = "#00-WILSON-RECOVERED";
        certModal.classList.remove('hidden');
    });
}

// --- KAPOOR CASE ENGINE ---
async function renderKapoorStep() {
    viewport.innerHTML = '';
    actionContainer.innerHTML = '';
    inputContainer.classList.add('hidden');
    const step = KAPOOR_STATES[currentStepIndex];

    switch (step) {
        case 'BRIEFING': await playKapoorBriefing(); break;
        case 'PHONE_LOCK': await playKapoorPhoneLock(); break;
        case 'MESSAGES': await playKapoorMessages(); break;
        case 'OFFICE': await playKapoorOffice(); break;
        case 'MEETING_LOGS': await playKapoorMeetingLogs(); break;
        case 'CCTV_ELIMINATION': await playKapoorCCTV(); break;
        case 'FOOTPRINTS': await playKapoorFootprints(); break;
        case 'FINAL_REVEAL': await playKapoorFinalReveal(); break;
    }
}

async function playKapoorBriefing() {
    await typewriter("📁 CASE #01: FATAL ERR_OR", "chapter-header");
    await typewriter("VICTIM: Rohan Kapoor\nSTATUS: Found dead in kitchen.\nTOD: 23:30 - 00:00\nCAUSE: Gunshot to back, followed by two to head.", "narrative-p");
    
    const suspects = [
        { name: "Aarav Sethi", bio: "Colleague, introvert. Record of assault." },
        { name: "Anika Shah", bio: "Neighbor, artist. Amateur basketballer (currently on break due to leg injury)." },
        { name: "Dev Malhotra", bio: "Boss. Known hunter, owns several firearms." },
        { name: "Karan Mehta", bio: "Friend. Recently fired after workplace accident." }
    ];
    
    const div = document.createElement('div');
    div.className = 'suspect-profiles';
    suspects.forEach(s => {
        const card = document.createElement('div');
        card.className = 'suspect-card';
        card.innerHTML = `<h4>${s.name}</h4><p>${s.bio}</p>`;
        div.appendChild(card);
    });
    viewport.appendChild(div);
    
    createActionButton("START_STRUCTURED_ENQUIRY", () => { currentStepIndex++; renderKapoorStep(); });
}

async function playKapoorPhoneLock() {
    await typewriter("📱 STEP 1: PHONE_ENCRYPTION", "chapter-header");
    await typewriter("The victim's phone is locked. No visible hints. Interrogate the suspects to find a lead.", "narrative-p");
    
    const suspects = [
        { name: "Aarav Sethi", bio: "Colleague / Introvert", statement: "Rohan was a nice colleague but annoying around the office since his promotion." },
        { name: "Anika Shah", bio: "Neighbor / Artist", statement: "Quiet guy. Always kept to himself." },
        { name: "Dev Malhotra", bio: "Boss / Hunter", statement: "Hardworking, but careless. Nearly leaked company data once—he was a nightmare with security." },
        { name: "Karan Mehta", bio: "Friend / Unemployed", statement: "We met often. Nothing seemed off recently, he was even helping me get my job back." }
    ];

    const container = document.createElement('div');
    container.className = 'suspect-profiles';
    suspects.forEach(s => {
        const card = document.createElement('div');
        card.className = 'suspect-card';
        card.innerHTML = `<h4>${s.name}</h4><p>${s.bio}</p>`;
        card.onclick = () => {
            // Remove any existing dialog first to keep it clean
            const existing = viewport.querySelector('.active-dialog');
            if (existing) existing.remove();

            const dialog = document.createElement('div');
            dialog.className = 'properties-window active-dialog';
            dialog.style.marginTop = '10px';
            dialog.innerHTML = `<strong>${s.name.toUpperCase()}:</strong> "${s.statement}"`;
            
            if (s.name === "Dev Malhotra") {
                const askBtn = document.createElement('button');
                askBtn.className = 'proceed-btn';
                askBtn.style.marginTop = '10px';
                askBtn.style.display = 'block';
                askBtn.textContent = "[ ASK_ABOUT_PASSWORD_HABITS ]";
                askBtn.onclick = (e) => {
                    e.stopPropagation();
                    const resp = document.createElement('p');
                    resp.style.marginTop = '15px';
                    resp.innerHTML = `<strong>DEV:</strong> "Rohan? Careless. He used the same password for everything—laptop, phone, even his locker. It was <strong>110543</strong>. I told him a thousand times to change it."`;
                    dialog.appendChild(resp);
                    saveNote("DEV'S LEAD: Rohan used 110543 everywhere.");
                    triggerGlitch();
                    askBtn.remove(); // Only ask once
                };
                dialog.appendChild(askBtn);
            }
            
            viewport.appendChild(dialog);
            viewport.scrollTop = viewport.scrollHeight;
            triggerGlitch();
        };
        container.appendChild(card);
    });
    viewport.appendChild(container);
    
    showInput("ENTER 6-DIGIT PASSCODE (Uncovered via Interrogation):", (val) => {
        if (validate(val, SOLUTIONS.KAPOOR_PHONE)) {
            triggerGlitch();
            saveNote("SECURITY_BYPASSED: 110543");
            currentStepIndex++; renderKapoorStep();
        } else triggerFailure();
    });
}

async function playKapoorMessages() {
    await typewriter("📩 STEP 2: RECOVERED_MESSAGES", "chapter-header");
    await typewriter("Recovered deleted fragment in binary-hex form. Use the built-in 'HEX_SURGEON' tool to decode the fragment.", "narrative-p");
    
    const hex = document.createElement('div');
    hex.className = 'hex-display';
    hex.textContent = "4F 46 46 49 43 45";
    viewport.appendChild(hex);

    // Create Hex Decoder Interface
    const decoderUI = document.createElement('div');
    decoderUI.className = 'properties-window';
    decoderUI.style.borderColor = 'cyan';
    decoderUI.innerHTML = `
        <div style="background:cyan; color:black; padding:5px; margin-bottom:15px; font-weight:bold; font-size:0.7rem;">
            FORENSIC_TOOL // HEX_SURGEON_v1.0
        </div>
        <div style="display:flex; gap:10px;">
            <input type="text" id="hex-in" placeholder="PASTE_HEX..." 
                style="background:black; border:1px solid cyan; color:cyan; padding:10px; flex-grow:1; font-family:var(--font-mono); font-size:0.8rem;">
            <button id="hex-btn" class="proceed-btn" style="padding:10px; border-color:cyan; color:cyan;">DECODE</button>
        </div>
        <div id="hex-res" style="margin-top:15px; min-height:30px; border-top:1px dashed cyan; padding-top:10px; font-size:0.8rem; color:cyan;">
            AWAITING_INPUT...
        </div>
    `;
    viewport.appendChild(decoderUI);

    const hexInput = document.getElementById('hex-in');
    const hexBtn = document.getElementById('hex-btn');
    const hexRes = document.getElementById('hex-res');

    hexBtn.onclick = () => {
        const val = hexInput.value.trim().replace(/\s/g, '');
        try {
            let str = '';
            for (let i = 0; i < val.length; i += 2) {
                str += String.fromCharCode(parseInt(val.substr(i, 2), 16));
            }
            if (str && !str.includes('NaN')) {
                hexRes.innerHTML = `<span style="color:white;">DECODED_STRING:</span> <span style="letter-spacing:2px; font-weight:bold;">${str.toUpperCase()}</span>`;
                triggerGlitch();
            } else {
                hexRes.innerHTML = `<span style="color:red;">ERROR: INVALID_HEX_DATA</span>`;
            }
        } catch(e) {
            hexRes.innerHTML = `<span style="color:red;">ERROR: DECODING_FAILED</span>`;
        }
    };

    showInput("ENTER DECRYPTED LOCATION NAME:", (val) => {
        if (validate(val, SOLUTIONS.KAPOOR_HEX)) {
            saveNote("NEXT_LOC: OFFICE");
            currentStepIndex++; renderKapoorStep();
        } else triggerFailure();
    });
}

async function playKapoorOffice() {
    await typewriter("🏢 STEP 3: OFFICE_SEARCH", "chapter-header");
    await typewriter("You are at Rohan's desk. You find a sticky note and a locked file 'Meeting Logs'.", "narrative-p");
    
    const note = document.createElement('div');
    note.className = 'properties-window';
    note.innerHTML = `<strong>STICKY NOTE:</strong><br>"[shift 3 numbers. same password]"`;
    viewport.appendChild(note);
    
    saveNote("HINT: Add 3 to each digit of 110543 (e.g. 1+3=4).");
    
    showInput("ENTER FILE PASSCODE:", (val) => {
        if (validate(val, SOLUTIONS.KAPOOR_OFFICE_LOCK)) {
            currentStepIndex++; renderKapoorStep();
        } else triggerFailure();
    });
}

async function playKapoorMeetingLogs() {
    await typewriter("📄 STEP 4: MEETING_LOGS", "chapter-header");
    await typewriter("Accessing logs... Found audio file and image reference.", "narrative-p");
    
    const logs = document.createElement('div');
    logs.className = 'properties-window';
    logs.innerHTML = `
        22:10 – Aarav (In Office)<br>
        22:40 – Karan (Meeting Point: Back Entrance)<br>
        23:05 – Anika (Meeting Point: Back Entrance)
    `;
    viewport.appendChild(logs);
    
    const img = document.createElement('img');
    img.src = 'assets/crime_scene_clock.png';
    img.className = 'evidence-image';
    viewport.appendChild(img);
    
    await typewriter("Audio clip recovered: 'Back entrance. Fewer cameras.'", "narrative-p hint-text");
    
    createActionButton("RECON_BACK_ENTRANCE", () => { currentStepIndex++; renderKapoorStep(); });
}

async function playKapoorCCTV() {
    await typewriter("📹 STEP 5: CCTV_ANALYSIS", "chapter-header");
    await typewriter("Footage reveals Karan Mehta arriving at 22:45, meeting Rohan, and leaving at 23:11. He was then at a restaurant until 00:15.", "narrative-p");
    
    const alert = document.createElement('div');
    alert.className = 'system-alert-red';
    alert.style.color = 'cyan';
    alert.style.borderColor = 'cyan';
    alert.textContent = "SUSPECT ELIMINATED: KARAN MEHTA (ALIBI CONFIRMED)";
    viewport.appendChild(alert);
    
    createActionButton("PROCEED_WITH_FORENSICS", () => { currentStepIndex++; renderKapoorStep(); });
}

async function playKapoorFootprints() {
    await typewriter("👣 STEP 6: PHYSICAL_EVIDENCE", "chapter-header");
    await typewriter("Forensics found footprints near the kitchen.", "narrative-p");
    
    const img = document.createElement('img');
    img.src = 'assets/killer_footprints.png';
    img.className = 'evidence-image';
    viewport.appendChild(img);
    
    await typewriter("ANALYSIS: Size 7 shoes. Left-leg limp detected. Refer to initial suspect notes to narrow down the killer.", "narrative-p");
    
    // Provide suspect reminders for the user
    const suspects = [
        { name: "Aarav Sethi", bio: "Colleague/Introvert. Record of assault." },
        { name: "Anika Shah", bio: "Neighbor/Artist. Basketballer on break due to LEG INJURY." }, // HINT: Leg injury = limp
        { name: "Dev Malhotra", bio: "Boss/Hunter. Owns several firearms." },
        { name: "Karan Mehta", bio: "Friend. Alibi confirmed via CCTV." }
    ];
    
    const div = document.createElement('div');
    div.className = 'suspect-profiles';
    suspects.forEach(s => {
        const card = document.createElement('div');
        card.className = 'suspect-card';
        card.style.fontSize = '0.7rem';
        card.innerHTML = `<h4>${s.name}</h4><p>${s.bio}</p>`;
        div.appendChild(card);
    });
    viewport.appendChild(div);
    
    showInput("IDENTIFY PRIME SUSPECT (Full Name):", (val) => {
        if (validate(val, SOLUTIONS.KAPOOR_SUSPECT)) {
            currentStepIndex++; renderKapoorStep();
        } else triggerFailure();
    });
}

async function playKapoorFinalReveal() {
    await typewriter("📡 STEP 7: GPS_TRIANGULATION", "chapter-header");
    await typewriter("Warrant approved. Accessing Anika Shah's device location history...", "narrative-p");
    
    await new Promise(r => setTimeout(r, 2000));
    
    const alert = document.createElement('div');
    alert.className = 'system-alert-red';
    alert.textContent = "LOCATION MATCH: Device was at Rohan's apartment during TOD.";
    viewport.appendChild(alert);
    
    await typewriter("TRANSCRIPT: 'He never appreciated my art. He thought my injury was a joke.'", "narrative-p hint-text");
    
    createActionButton("FINAL_REPORT", () => {
        document.getElementById('cert-id-val').textContent = "#01-KAPOOR-SOLVED";
        certModal.classList.remove('hidden');
    });
}

// --- SEISMIC CASE ENGINE ---
async function renderSeismicStep() {
    viewport.innerHTML = '';
    actionContainer.innerHTML = '';
    inputContainer.classList.add('hidden');
    const step = SEISMIC_STATES[currentStepIndex];
    const navContainer = document.getElementById('case-nav-container');
    navContainer.innerHTML = '';

    // Navigation: Back Button (Fixed in Sidebar)
    if (currentStepIndex > 0 && currentStepIndex < SEISMIC_STATES.length - 1) {
        const backBtn = document.createElement('button');
        backBtn.className = 'tool-btn';
        backBtn.style.padding = '8px 15px';
        backBtn.style.marginBottom = '12px';
        backBtn.style.width = '100%';
        backBtn.style.fontSize = '0.75rem';
        backBtn.textContent = '<< PREV_SITE_LOGS';
        backBtn.onclick = () => {
            currentStepIndex--;
            renderSeismicStep();
            triggerGlitch();
        };
        navContainer.appendChild(backBtn);
    }

    switch (step) {
        case 'BRIEFING': await playSeismicBriefing(); break;
        case 'SITE_1': await playSeismicSite1(); break;
        case 'SITE_2': await playSeismicSite2(); break;
        case 'SITE_3': await playSeismicSite3(); break;
        case 'SITE_4': await playSeismicSite4(); break;
        case 'SITE_5_PREDICT': await playSeismicSite5Predict(); break;
        case 'SITE_5': await playSeismicSite5(); break;
        case 'SITE_6_PREDICT': await playSeismicSite6Predict(); break;
        case 'FINAL_QUESTION': await playSeismicFinalQuestion(); break;
        case 'CLOSING': showSeismicClosing(); break;
    }
}

async function playSeismicBriefing() {
    await typewriter("🚨 CASE #02: SEISMIC_ASSAULT", "chapter-header");
    await typewriter("Location: National Seismic Monitoring Center (NSMC)\nTime: 4:55 PM, Saturday, April 4th, 2026\nStatus: EMERGENCY ALERT", "narrative-p");
    
    await typewriter("Lead Strategic Analyst: \"Teams, look at the data. We are no longer dealing with random natural disasters. We are looking at a calculated, man-made assault on this city.\"", "narrative-p");
    await typewriter("Within the last few hours, two micro-earthquake tremors (magnitude 3.2) have already struck. This city sits on a solid tectonic plate with no active fault lines. This isn't a coincidence.\"", "narrative-p");
    await typewriter("We’ve seen this pattern in London, Frankfurt, and Singapore: five smaller hits used to weaken the city's foundation before a final, massive sixth strike. Your mission is to find the connection between these hits and predict the 6th target before the market opens.\"", "narrative-p");
    
    const info = document.createElement('div');
    info.className = 'properties-window';
    info.innerHTML = `<strong>INTEL_LOG:</strong><br>- Machine Weight: 30+ Tons<br>- Deployment: Mobile Unit<br>- Pattern: 6 Total Hits`;
    viewport.appendChild(info);

    createActionButton("ACCESS_SITE_1_DATA", () => { currentStepIndex++; renderSeismicStep(); });
}

async function playSeismicSite1() {
    await typewriter("📍 SITE 1: MONTGOMERY STREET", "chapter-header");
    await typewriter("Analyzing seismic logs from the first impact zone...", "narrative-p");
    
    const data = document.createElement('div');
    data.className = 'properties-window';
    data.innerHTML = `
        <strong>INDUSTRIES IMPACTED:</strong><br>
        - Renewable Energy Research<br>
        - Telecom Network Infrastructure<br>
        - Advanced Materials<br>
        - Retail / Logistics<br><br>
        <strong>SEISMIC_WAVEFORM:</strong> LONG, SHORT, SHORT, SHORT, LONG<br>
        <strong>PULSE_TIMINGS:</strong> 36s, 18s, 7s, 10s, 26s
    `;
    viewport.appendChild(data);
    
    const canvas = document.createElement('canvas');
    canvas.id = 'waveform-s1';
    canvas.width = 400; canvas.height = 60;
    viewport.appendChild(canvas);
    startWaveform(canvas);

    createActionButton("PROCEED_TO_SITE_2", () => { currentStepIndex++; renderSeismicStep(); });
}

async function playSeismicSite2() {
    await typewriter("📍 SITE 2: SALESFORCE TRANSIT CENTER", "chapter-header");
    const alert = document.createElement('div');
    alert.className = 'system-alert-red';
    alert.textContent = "SIGNAL DETECTED: THIRD EARTHQUAKE HAS STRUCK. SPEED IS CRITICAL.";
    viewport.appendChild(alert);

    const data = document.createElement('div');
    data.className = 'properties-window';
    data.innerHTML = `
        <strong>INDUSTRIES IMPACTED:</strong><br>
        - Renewable Energy Research<br>
        - Metallurgy Lab<br>
        - Telecommunications<br>
        - Agriculture / Retail<br><br>
        <strong>SEISMIC_WAVEFORM:</strong> SHORT, LONG, LONG, SHORT, LONG<br>
        <strong>PULSE_TIMINGS:</strong> 2s, 39s, 36s, 3s, 34s
    `;
    viewport.appendChild(data);

    await typewriter("ESTABLISH A POSSIBLE LINK (Observation):", "narrative-p");
    
    const options = [
        "Certain industries are similar",
        "Seismic vibrations are identical",
        "Buildings are the same height",
        "Site coordinates follow a spiral",
        "Attacks only occur on weekends"
    ].sort(() => Math.random() - 0.5);

    const div = document.createElement('div');
    div.className = 'search-results';
    options.forEach(opt => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.textContent = opt;
        item.onclick = () => {
            if (validate(opt, SOLUTIONS.SEISMIC_LINK)) {
                saveNote("LINK_FOUND: Certain industries are similar across sites.");
                currentStepIndex++; renderSeismicStep();
            } else triggerFailure();
        };
        div.appendChild(item);
    });
    viewport.appendChild(div);

    createActionButton("ACCESS_HINT", () => {
        saveNote("HINT: Compare the industries of Site 1 and 2. Renewable Energy, Telecom, and Retail appear in both.");
        triggerGlitch();
    });
}

async function playSeismicSite3() {
    await typewriter("📍 SITE 3: THE PORT (THE EMBARCADERO)", "chapter-header");
    await typewriter("Analyzing data from the third impact site...", "narrative-p");

    const data = document.createElement('div');
    data.className = 'properties-window';
    data.innerHTML = `
        <strong>INDUSTRIES IMPACTED:</strong><br>
        - Marine Fuel & Energy Systems Research<br>
        - Advanced Materials & Structural Composites<br>
        - Shipping & Freight Logistics<br>
        - Port Infrastructure Engineering<br>
        - Industrial Equipment Manufacturing<br><br>
        <strong>SEISMIC_WAVEFORM:</strong> SHORT, SHORT, SHORT, LONG, LONG<br>
        <strong>PULSE_TIMINGS:</strong> 13s, 1s, 18s, 44s, 30s
    `;
    viewport.appendChild(data);

    // Create Waveform Decoder Interface
    const decoderUI = document.createElement('div');
    decoderUI.className = 'properties-window';
    decoderUI.style.borderColor = '#B163FF';
    decoderUI.innerHTML = `
        <div style="background:var(--purple); color:black; padding:5px; margin-bottom:15px; font-weight:bold; font-size:0.7rem;">
            FORENSIC_TOOL // WAVEFORM_INTERPRETER_v2.0
        </div>
        <div style="display:flex; gap:10px;">
            <input type="text" id="wave-in" placeholder="PASTE_WAVEFORM_STRING..." 
                style="background:black; border:1px solid var(--purple); color:var(--purple); padding:10px; flex-grow:1; font-family:var(--font-mono); font-size:0.8rem;">
            <button id="wave-btn" class="proceed-btn" style="padding:10px;">INTERPRET</button>
        </div>
        <div id="wave-res" style="margin-top:15px; min-height:40px; border-top:1px dashed var(--purple); padding-top:10px; font-size:0.8rem;">
            AWAITING_WAVEFORM_DATA...
        </div>
    `;
    viewport.appendChild(decoderUI);

    const waveInput = document.getElementById('wave-in');
    const waveBtn = document.getElementById('wave-btn');
    const waveRes = document.getElementById('wave-res');

    waveBtn.onclick = () => {
        const val = waveInput.value.trim().toUpperCase().replace(/AND /g, '').replace(/,/g, '');
        const target = "SHORT SHORT SHORT LONG LONG";
        if (val.includes(target) || val.replace(/\s/g, '') === target.replace(/\s/g, '')) {
            waveRes.innerHTML = `<span style="color:cyan;">[PATTERN_RECOGNIZED]</span><br>DECODED_INDUSTRY: <span style="font-weight:bold; letter-spacing:1px;">RND INDUSTRIES</span>`;
            saveNote("SITE_3_DECODE: 'Short Short Short Long Long' = RND INDUSTRIES");
            triggerGlitch();
        } else {
            waveRes.innerHTML = `<span style="color:red;">[ERROR: UNKNOWN_PATTERN]</span><br>Signature does not match known threat signatures.`;
            triggerFailure();
        }
    };

    showInput("IDENTIFY THE TYPE OF INDUSTRIES (Uncovered via Interpreter):", (val) => {
        if (validate(val, SOLUTIONS.SEISMIC_TYPE)) {
            saveNote("INDUSTRY_TYPE: RND Industries");
            currentStepIndex++; renderSeismicStep();
        } else triggerFailure();
    });

    createActionButton("ACCESS_HINT", () => {
        saveNote("HINT: Most industries at Site 3 focus on 'Research & Development'. The initials of that category are your answer.");
        triggerGlitch();
    });
}

async function playSeismicSite4() {
    await typewriter("📍 SITE 4: SF FED RESERVE BANK", "chapter-header");
    
    const data = document.createElement('div');
    data.className = 'properties-window';
    data.innerHTML = `
        <strong>INDUSTRIES IMPACTED:</strong><br>
        - Quantitative Finance & Risk Modeling Research<br>
        - Financial Data Infrastructure<br>
        - Cybersecurity & Cryptographic Systems Research<br>
        - Commercial Banking<br><br>
        <strong>SEISMIC_WAVEFORM:</strong> LONG, SHORT, SHORT, SHORT, LONG<br>
        <strong>PULSE_TIMINGS:</strong> 46s, 10s, 19s, 4s, 38s
    `;
    viewport.appendChild(data);

    await typewriter("INTEL: Pulse timings represent ASCII values when summed (S1=97, S2=114, S3=106, S4=117...). Match the name to the suspect company list.", "narrative-p hint-text");

    const table = document.createElement('div');
    table.className = 'properties-window';
    table.style.fontSize = '0.7rem';
    table.style.maxHeight = '200px';
    table.style.overflowY = 'scroll';
    table.innerHTML = `
        <table style="width:100%; border-collapse:collapse;">
            <thead><tr style="border-bottom:1px solid var(--purple);"><th>COMPANY</th><th>INDUSTRY</th><th>EXECUTIVE</th></tr></thead>
            <tbody>
                <tr><td>Helios Energy</td><td>Energy Production</td><td>Daniel Kline</td></tr>
                <tr><td>GridCore Systems</td><td>Infrastructure</td><td>Ethan Reed</td></tr>
                <tr style="color:cyan;"><td>NovaTel Research</td><td>Telecom R&D</td><td>Arjun Sethi</td></tr>
                <tr><td>AgriPlus</td><td>Agri Supply</td><td>Meera Dutt</td></tr>
                <tr><td>SignalWorks Research</td><td>RF Systems R&D</td><td>Vikram Shah</td></tr>
                <tr><td>VoltEdge Research</td><td>Energy Storage R&D</td><td>Daniel Rao</td></tr>
                <tr style="color:cyan;"><td>MetroRetail</td><td>Retail</td><td>Arjun Khanna</td></tr>
                <tr><td>TerraLogix</td><td>Logistics</td><td>Rohan Mehta</td></tr>
                <tr><td>FinSecure Labs</td><td>Cybersecurity R&D</td><td>Kavya Iyer</td></tr>
                <tr><td>UrbanGrid Corp</td><td>Power Dist.</td><td>Nikhil Bansal</td></tr>
                <tr><td>DataQuanta</td><td>Financial Analytics</td><td>Priya Nair</td></tr>
                <tr><td>BuildSphere</td><td>Construction</td><td>Suresh Pillai</td></tr>
                <tr><td>AeroLink Systems</td><td>Aviation Logistics</td><td>Farhan Qureshi</td></tr>
                <tr><td>Meditech Solutions</td><td>Healthcare</td><td>Ananya Bose</td></tr>
                <tr><td>OmniTrade</td><td>Commodity Trading</td><td>Rajiv Malhotra</td></tr>
            </tbody>
        </table>
    `;
    viewport.appendChild(table);

    showInput("WHAT COMPANY IS BEHIND THE ATTACKS?", (val) => {
        if (validate(val, SOLUTIONS.SEISMIC_COMPANY)) {
            saveNote("PERPETRATOR: NovaTel Research (Arjun Sethi)");
            currentStepIndex++; renderSeismicStep();
        } else triggerFailure();
    });

    createActionButton("ACCESS_HINT", () => {
        saveNote("HINT: Sum of pulse timings: 46+10+19+4+38=117 (ASCII: 'u'). Pattern: 97(a), 114(r), 106(j), 117(u). The target executive's name starts with ARJU.");
        triggerGlitch();
    });
}

async function playSeismicSite5Predict() {
    await typewriter("⚠️ WARNING: FIFTH ATTACK PENDING", "chapter-header");
    await typewriter("We have detected preparatory vibrations. Predict the 5th site based on the pattern of R&D and Financial hubs.", "narrative-p");
    
    const options = [
        "South of Market",
        "Mission Bay Research Park",
        "Golden Gate Ferry Terminal",
        "Civic Center Plaza",
        "Ocean Beach Pumping Station",
        "Twin Peaks Summit"
    ];

    const div = document.createElement('div');
    div.className = 'search-results';
    options.forEach(opt => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.textContent = opt;
        item.onclick = () => {
            if (validate(opt, SOLUTIONS.SEISMIC_SITE5)) {
                triggerGlitch();
                saveNote("BONUS_INTEL: A massive, black and gold semi with an unusually long cab roared past, sounding incredibly loud. Older, beat-up unit with a cracked grille, hauling at high speed.");
                currentStepIndex++; renderSeismicStep();
            } else {
                triggerFailure();
                typewriter("INCORRECT PREDICTION. Site 5 impact confirmed at SOUTH OF MARKET. Redirecting...", "narrative-p").then(() => {
                    setTimeout(() => { currentStepIndex++; renderSeismicStep(); }, 1500);
                });
            }
        };
        div.appendChild(item);
    });
    viewport.appendChild(div);

    createActionButton("ACCESS_HINT", () => {
        saveNote("HINT: South of Market (SoMa) is the primary tech and biotech hub of the city, fitting the 'Advanced Materials' and 'Telecom' pattern.");
        triggerGlitch();
    });
}

async function playSeismicSite5() {
    await typewriter("📍 SITE 5: SOUTH OF MARKET", "chapter-header");
    
    const data = document.createElement('div');
    data.className = 'properties-window';
    data.innerHTML = `
        <strong>INDUSTRIES IMPACTED:</strong><br>
        - Biotech Research & Development<br>
        - FinTech Software Development<br>
        - Cloud Data Centers<br>
        - Specialty Manufacturing<br>
        - Art Galleries<br><br>
        <strong>SEISMIC_WAVEFORM:</strong> SHORT, LONG, LONG, SHORT, LONG<br>
        <strong>PULSE_TIMINGS:</strong> 1s, 36s, 39s, 1s, 39s
    `;
    viewport.appendChild(data);

    createActionButton("ANALYZE_FINAL_TARGET", () => { currentStepIndex++; renderSeismicStep(); });
}

async function playSeismicSite6Predict() {
    await typewriter("🌩️ FINAL PREDICTION: SITE 6", "chapter-header");
    await typewriter("The pattern is complete. Where will the final hammer fall?", "narrative-p");
    
    const options = [
        "Civic Center Plaza",
        "Mission Bay Research Park",
        "Golden Gate Ferry Terminal",
        "Berkeley Campus Area",
        "Ocean Beach Pumping Station",
        "Twin Peaks Summit"
    ].sort(() => Math.random() - 0.5);

    const div = document.createElement('div');
    div.className = 'search-results';
    options.forEach(opt => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.textContent = opt;
        item.onclick = () => {
            if (validate(opt, SOLUTIONS.SEISMIC_SITE6)) {
                currentStepIndex++; renderSeismicStep();
            } else triggerFailure();
        };
        div.appendChild(item);
    });
    viewport.appendChild(div);
}

async function playSeismicFinalQuestion() {
    await typewriter("🚚 OPERATION: INTERCEPT", "chapter-header");
    await typewriter("You have reached Mission Bay. The 6th machine is active. We expect the machine to be very large in size, weighing up to 30+ tons. However, it is important to note that the machine also had to be mobile, such that the attack can be carried out within the time frame in which they occurred. Where is the machine hidden?", "narrative-p");
    
    const options = [
        "Abandoned building",
        "Large black semi-truck",
        "White van",
        "Closed barber shop"
    ];

    const div = document.createElement('div');
    div.className = 'search-results';
    options.forEach(opt => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.textContent = opt;
        item.onclick = () => {
            if (validate(opt, SOLUTIONS.SEISMIC_MACHINE)) {
                currentStepIndex++; renderSeismicStep();
            } else triggerFailure();
        };
        div.appendChild(item);
    });
    viewport.appendChild(div);

    createActionButton("ACCESS_HINT", () => {
        saveNote("HINT: Review the initial briefing. The machine weighs over 30 tons but arrived within minutes of the previous strike. It must be mobile.");
        triggerGlitch();
    });
}function showSeismicClosing() {
    typewriter("CONCLUSION: ATTACK NEUTRALIZED. CITY SAVED.", "chapter-header").then(() => {
        document.getElementById('cert-id-val').textContent = "#02-SEISMIC-HERO";
        certModal.classList.remove('hidden');
    });
}

// --- UTILITIES ---
function typewriter(text, className) {
    return new Promise(resolve => {
        const p = document.createElement('div');
        p.className = className;
        p.style.whiteSpace = 'pre-wrap';
        viewport.appendChild(p);
        let i = 0;
        isTyping = true;
        function type() {
            if (i < text.length) {
                p.textContent += text.charAt(i);
                i++;
                viewport.scrollTop = viewport.scrollHeight;
                setTimeout(type, 15);
            } else { isTyping = false; resolve(); }
        }
        type();
    });
}

function createActionButton(text, callback) {
    const btn = document.createElement('button');
    btn.className = 'proceed-btn';
    btn.textContent = `[ ${text} ]`;
    btn.onclick = callback;
    actionContainer.appendChild(btn);
}

function showInput(promptText, callback) {
    inputContainer.classList.remove('hidden');
    terminalInput.placeholder = promptText;
    terminalInput.value = '';
    terminalInput.focus();
    terminalInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            const val = terminalInput.value.trim();
            if (val) callback(val);
        }
    };
}

function validate(input, encoded) {
    const decoded = atob(encoded).toUpperCase().replace(/\s/g, '');
    const normalInput = input.toUpperCase().replace(/\s/g, '');
    return normalInput === decoded;
}

function triggerFailure() {
    document.body.classList.add('screen-shake');
    errorToast.classList.remove('hidden');
    setTimeout(() => {
        document.body.classList.remove('screen-shake');
        errorToast.classList.add('hidden');
    }, 1500);
}

function triggerGlitch() {
    glitchLayer.classList.add('glitch-flash');
    setTimeout(() => glitchLayer.classList.remove('glitch-flash'), 150);
}

function saveNote(text) {
    const note = document.createElement('p');
    note.textContent = `> ${text}`;
    if (notesArea.querySelector('.placeholder')) notesArea.innerHTML = '';
    notesArea.appendChild(note);
    notesArea.scrollTop = notesArea.scrollHeight;
}

function startWaveform(canvas) {
    const ctx = canvas.getContext('2d');
    let frame = 0;
    function draw() {
        if (!appContainer.classList.contains('hidden')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#B163FF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x++) {
                const angle = (x + frame) * 0.1;
                const y = canvas.height / 2 + Math.sin(angle) * 15 * Math.random();
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
            frame += 2;
            requestAnimationFrame(draw);
        }
    }
    draw();
}

window.onload = () => { 
    triggerGlitch(); 
    // Global Map Handlers
    mapToggleBtn.onclick = () => mapModal.classList.toggle('hidden');
    closeMapBtn.onclick = () => mapModal.classList.add('hidden');
};
