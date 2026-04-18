const SUPABASE_URL = "https://vkbhzywttqovpmgdcjtk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYmh6eXd0dHFvdnBtZ2RjanRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDc3MjcsImV4cCI6MjA4NjEyMzcyN30.B2mCbpViPLHT-XAbEkXCHBz1Fq1msRkTIO56wk6vbmU";
const BUCKET_NAME = "videos";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const titleInput = document.getElementById("title");
const detailInput = document.getElementById("detail_promt");
const emailInput = document.getElementById("email");
const sendBtn = document.getElementById("send");
const downloadBtn = document.getElementById("download");
const videoUrlDiv = document.getElementById("video_url");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = 300;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);


function parseDetailToObjects(detail) {
  const text = detail.toLowerCase();
  const clauses = text.split(/[.,;!]/).map(c => c.trim()).filter(Boolean);

  const objects = [];

  function addObject(base) {
    // spread base and add common defaults
    objects.push({
      x: base.x ?? canvas.width / 2,
      y: base.y ?? canvas.height / 2,
      vx: base.vx ?? 0,
      vy: base.vy ?? 0,
      t: 0,
      ...base,
    });
  }

  clauses.forEach((clause, index) => {
    const yBase = 80 + index * 60;

    const hasCat = clause.includes("cat");
    const hasDog = clause.includes("dog");
    const hasBall = clause.includes("ball");
    const hasCar = clause.includes("car");
    const hasRocket = clause.includes("rocket");
    const hasSun = clause.includes("sun");
    const hasHouse = clause.includes("house");
    const hasTree = clause.includes("tree");

    const jump = clause.includes("jump");
    const bounce = clause.includes("bounce");
    const drive = clause.includes("drive");
    const roll = clause.includes("roll");
    const launch = clause.includes("launch");
    const fly = clause.includes("fly");
    const move = clause.includes("move") || clause.includes("run");

    
    if (hasCat) {
      addObject({
        kind: "cat",
        x: 40,
        y: yBase,
        behavior: jump ? "jump" : move ? "run" : "idle",
      });
    }

    
    if (hasDog) {
      addObject({
        kind: "dog",
        x: 40,
        y: yBase + 20,
        behavior: move ? "run" : "idle",
      });
    }

    
    if (hasBall) {
      addObject({
        kind: "ball",
        x: 40,
        y: yBase,
        behavior: bounce || roll ? "bounce" : "move",
      });
    }

    
    if (hasCar) {
      addObject({
        kind: "car",
        x: -80,
        y: yBase + 40,
        behavior: drive || move ? "drive" : "idle",
      });
    }

    
    if (hasRocket) {
      addObject({
        kind: "rocket",
        x: canvas.width / 2,
        y: canvas.height + 60,
        behavior: launch || fly ? "launch" : "idle",
      });
    }

    
    if (hasSun) {
      addObject({
        kind: "sun",
        x: canvas.width - 80,
        y: 60,
        behavior: "pulse",
      });
    }

    
    if (hasHouse) {
      addObject({
        kind: "house",
        x: canvas.width / 2,
        y: canvas.height - 80,
        behavior: "idle",
      });
    }

    
    if (hasTree) {
      addObject({
        kind: "tree",
        x: 80,
        y: canvas.height - 80,
        behavior: "idle",
      });
    }

    
    if (
      !hasCat &&
      !hasDog &&
      !hasBall &&
      !hasCar &&
      !hasRocket &&
      !hasSun &&
      !hasHouse &&
      !hasTree
    ) {
      addObject({
        kind: "text",
        text: clause,
        x: -200,
        y: yBase,
        behavior: "slide",
      });
    }
  });

  
  if (objects.length === 0) {
    objects.push({
      kind: "text",
      text: detail,
      x: -200,
      y: canvas.height / 2,
      behavior: "slide",
    });
  }

  return objects;
}


function drawCat(obj) {
  const size = 20;
  ctx.fillStyle = "#ffcc88";
  
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, size, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(obj.x - size / 2, obj.y - size);
  ctx.lineTo(obj.x - size / 4, obj.y - size * 1.5);
  ctx.lineTo(obj.x, obj.y - size);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(obj.x + size / 2, obj.y - size);
  ctx.lineTo(obj.x + size / 4, obj.y - size * 1.5);
  ctx.lineTo(obj.x, obj.y - size);
  ctx.fill();
}

function drawDog(obj) {
  const w = 40;
  const h = 25;
  ctx.fillStyle = "#c28b5a";
  ctx.fillRect(obj.x - w / 2, obj.y - h / 2, w, h);
  
  ctx.fillRect(obj.x + w / 4, obj.y - h / 2 - 8, 8, 12);
}

function drawBall(obj) {
  const size = 15;
  ctx.fillStyle = "#4ade80";
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, size, 0, Math.PI * 2);
  ctx.fill();
}

function drawCar(obj) {
  const w = 60;
  const h = 25;
  ctx.fillStyle = "#60a5fa";
  ctx.fillRect(obj.x - w / 2, obj.y - h / 2, w, h);
  
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(obj.x - w / 3, obj.y + h / 2, 6, 0, Math.PI * 2);
  ctx.arc(obj.x + w / 3, obj.y + h / 2, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawRocket(obj) {
  const size = 20;
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(obj.x, obj.y - size * 1.5);
  ctx.lineTo(obj.x - size, obj.y + size);
  ctx.lineTo(obj.x + size, obj.y + size);
  ctx.closePath();
  ctx.fill();

  
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.moveTo(obj.x, obj.y + size);
  ctx.lineTo(obj.x - 8, obj.y + size + 15);
  ctx.lineTo(obj.x + 8, obj.y + size + 15);
  ctx.closePath();
  ctx.fill();
}

function drawSun(obj) {
  const r = 25;
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawHouse(obj) {
  const w = 60;
  const h = 40;
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(obj.x - w / 2, obj.y - h / 2, w, h);
  
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(obj.x, obj.y - h / 2 - 25);
  ctx.lineTo(obj.x - w / 2, obj.y - h / 2);
  ctx.lineTo(obj.x + w / 2, obj.y - h / 2);
  ctx.closePath();
  ctx.fill();
}

function drawTree(obj) {
  
  ctx.fillStyle = "#92400e";
  ctx.fillRect(obj.x - 8, obj.y - 30, 16, 30);
  
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(obj.x, obj.y - 45, 20, 0, Math.PI * 2);
  ctx.fill();
}

function drawText(obj) {
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "20px Arial";
  ctx.fillText(obj.text, obj.x, obj.y);
}


function updateObject(obj, frame, fps) {
  obj.t += 1 / fps;

  switch (obj.behavior) {
    case "jump": {
      obj.x += 2.5;
      const jumpHeight = 20;
      obj.y += Math.sin(obj.t * Math.PI * 2) * -jumpHeight * 0.2;
      break;
    }
    case "run": {
      obj.x += 4;
      break;
    }
    case "bounce": {
      obj.x += 3;
      const amp = 25;
      obj.y += Math.sin(obj.t * Math.PI * 2) * -amp * 0.2;
      break;
    }
    case "drive": {
      obj.x += 5;
      break;
    }
    case "launch": {
      obj.y -= 4;
      break;
    }
    case "pulse": {
      
      break;
    }
    case "slide": {
      obj.x += 3;
      break;
    }
    case "move": {
      obj.x += 3;
      break;
    }
    case "idle":
    default:
      
      break;
  }
}


function drawObject(obj) {
  switch (obj.kind) {
    case "cat":
      drawCat(obj);
      break;
    case "dog":
      drawDog(obj);
      break;
    case "ball":
      drawBall(obj);
      break;
    case "car":
      drawCar(obj);
      break;
    case "rocket":
      drawRocket(obj);
      break;
    case "sun":
      drawSun(obj);
      break;
    case "house":
      drawHouse(obj);
      break;
    case "tree":
      drawTree(obj);
      break;
    case "text":
      drawText(obj);
      break;
    default:
      break;
  }
}


async function generateVideo(detail) {
  const fps = 30;
  const durationSeconds = 6;
  const totalFrames = fps * durationSeconds;

  const objects = parseDetailToObjects(detail);

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  const chunks = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start();

  for (let frame = 0; frame < totalFrames; frame++) {
    ctx.fillStyle = "#050816";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = "#e5e7eb";
    ctx.font = "24px Arial";
    ctx.fillText(titleInput.value, 20, 40);

    
    objects.forEach((obj) => {
      updateObject(obj, frame, fps);
      drawObject(obj);
    });

    await new Promise((r) => setTimeout(r, 1000 / fps));
  }

  recorder.stop();

  return new Promise((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      resolve(blob);
    };
  });
}


async function uploadVideo(blob) {
  const filename = `clipforge_${Date.now()}.webm`;

  const { error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(filename, blob, {
      contentType: "video/webm",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabaseClient.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename);

  return data.publicUrl;
}


sendBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const detail = detailInput.value.trim();

  if (!title || !detail) {
    videoUrlDiv.textContent = "Please fill in all fields.";
    return;
  }

  sendBtn.disabled = true;
  videoUrlDiv.textContent = "Generating...";

  try {
    const videoBlob = await generateVideo(detail);

    videoUrlDiv.textContent = "Uploading...";
    const videoURL = await uploadVideo(videoBlob);

    downloadBtn.style.display = "block";
    downloadBtn.onclick = async () => {
      const response = await fetch(videoURL);
      const blob = await response.blob();

      const fileNameFromURL = videoURL.split("/").pop();

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileNameFromURL;
      a.click();

      URL.revokeObjectURL(a.href);
    };

    videoUrlDiv.textContent = `Done! ${videoURL}`;
  } catch (err) {
    console.error(err);

    videoUrlDiv.textContent = "Error.";
    sendBtn.disabled = false;
  }
});
