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

// LOAD LOGS

async function loadLogs(){

    const { data,error } =
    await supabaseClient
    .from("device_logs")
    .select("*")
    .order("created_at",{
        ascending:false
    });

    if(error){

        console.error(error);

        return;
    }

    // VISITOR COUNT

    document.getElementById(
        "visitorCount"
    ).textContent = data.length;

    let logsHTML = "";

    const browsers = {};

    const os = {};

    data.forEach(log=>{

        logsHTML += `

        <div class="card">

            <p><b>Platform:</b>
            ${log.platform}</p>

            <p><b>Browser:</b>
            ${log.browser}</p>

            <p><b>Language:</b>
            ${log.language}</p>

            <p><b>Screen:</b>
            ${log.screen}</p>

            <p><b>Timezone:</b>
            ${log.timezone}</p>

            <p><b>Network:</b>
            ${log.network}</p>

            <p><b>Created:</b>
            ${log.created_at}</p>

        </div>

        `;

        browsers[log.browser] =
        (browsers[log.browser] || 0)+1;

        os[log.platform] =
        (os[log.platform] || 0)+1;
    });

    document.getElementById(
        "logs"
    ).innerHTML = logsHTML;

    // BROWSER STATS

    let browserHTML = "";

    for(let key in browsers){

        browserHTML += `

        <p>
        ${key.substring(0,40)}...
        : ${browsers[key]}
        </p>

        `;
    }

    document.getElementById(
        "browserStats"
    ).innerHTML = browserHTML;

    // OS STATS

    let osHTML = "";

    for(let key in os){

        osHTML += `

        <p>${key}: ${os[key]}</p>

        `;
    }

    document.getElementById(
        "osStats"
    ).innerHTML = osHTML;
}

loadLogs();

// REALTIME UPDATES

supabaseClient
.channel("logs-channel")

.on(
    "postgres_changes",
    {
        event:"INSERT",
        schema:"public",
        table:"device_logs"
    },

    payload=>{

        console.log(payload);

        loadLogs();
    }
)

.subscribe();