const $=s=>document.querySelector(s),canvas=$("#canvas"),ctx=canvas.getContext("2d");
let doc={title:"Nova anotação",paper:"blank",pages:[[]],page:0},tool="pen",drawing=false,current=null,redo=[],penActive=false,saveTimer;
const DB="spenNotes",STORE="documents",KEY="current";
function dbOpen(){return new Promise((ok,no)=>{let r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
async function load(){let db=await dbOpen(),tx=db.transaction(STORE),r=tx.objectStore(STORE).get(KEY);r.onsuccess=()=>{if(r.result)doc=r.result;$("#title").value=doc.title;$("#paper").value=doc.paper||"blank";resize();render();info()}}
async function save(){doc.title=$("#title").value||"Sem título";doc.paper=$("#paper").value;$("#status").textContent="Salvando…";let db=await dbOpen(),tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put(doc,KEY);tx.oncomplete=()=>$("#status").textContent="Salvo"}
function queueSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,250)}
function resize(){let r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=Math.max(1,r.width*d);canvas.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0);render()}
function bg(){let w=canvas.clientWidth,h=canvas.clientHeight;ctx.fillStyle="white";ctx.fillRect(0,0,w,h);ctx.strokeStyle="#dbeafe";ctx.lineWidth=1;if(doc.paper==="lined")for(let y=32;y<h;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}if(doc.paper==="grid")for(let x=32;x<w;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}if(doc.paper==="grid")for(let y=32;y<h;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}}
function drawStroke(s){if(!s?.pts.length)return;ctx.strokeStyle=s.eraser?"white":s.color;ctx.lineCap="round";ctx.lineJoin="round";for(let i=1;i<s.pts.length;i++){let a=s.pts[i-1],b=s.pts[i],pressure=(a.p+b.p)/2||.5;ctx.lineWidth=s.eraser?s.size*2:s.size*(.55+pressure*.9);ctx.beginPath();ctx.moveTo(a.x*canvas.clientWidth,a.y*canvas.clientHeight);ctx.lineTo(b.x*canvas.clientWidth,b.y*canvas.clientHeight);ctx.stroke()}}
function render(){bg();doc.pages[doc.page]?.forEach(drawStroke);if(current)drawStroke(current)}
function point(e){let r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height,p:e.pressure||.5,t:Date.now()}}
canvas.addEventListener("pointerdown",e=>{if(e.pointerType==="touch"&&penActive)return;if(e.pointerType==="touch")return;e.preventDefault();if(e.pointerType==="pen")penActive=true;drawing=true;canvas.setPointerCapture(e.pointerId);current={color:$("#color").value,size:+$("#size").value,eraser:tool==="eraser",pts:[point(e)]};redo=[]});
canvas.addEventListener("pointermove",e=>{if(!drawing||!current)return;e.preventDefault();let events=e.getCoalescedEvents?e.getCoalescedEvents():[e];events.forEach(v=>current.pts.push(point(v)));render()});
function end(e){if(!drawing)return;drawing=false;if(current&&current.pts.length){doc.pages[doc.page].push(current);current=null;render();queueSave()}if(e?.pointerType==="pen")setTimeout(()=>penActive=false,350)}
canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);
document.querySelectorAll("[data-tool]").forEach(b=>b.onclick=()=>{tool=b.dataset.tool;document.querySelectorAll("[data-tool]").forEach(x=>x.classList.toggle("active",x===b))});
$("#undo").onclick=()=>{let p=doc.pages[doc.page];if(p.length){redo.push(p.pop());render();queueSave()}};
$("#redo").onclick=()=>{if(redo.length){doc.pages[doc.page].push(redo.pop());render();queueSave()}};
$("#paper").onchange=()=>{doc.paper=$("#paper").value;render();queueSave()};$("#title").oninput=queueSave;
$("#newPage").onclick=()=>{doc.pages.push([]);doc.page=doc.pages.length-1;redo=[];render();info();queueSave()};
$("#prev").onclick=()=>{if(doc.page>0){doc.page--;redo=[];render();info()}};
$("#next").onclick=()=>{if(doc.page<doc.pages.length-1){doc.page++;redo=[];render();info()}};
$("#deletePage").onclick=()=>{if(doc.pages.length===1){doc.pages[0]=[]}else{doc.pages.splice(doc.page,1);doc.page=Math.min(doc.page,doc.pages.length-1)}redo=[];render();info();queueSave()};
function info(){$("#pageInfo").textContent=(doc.page+1)+"/"+doc.pages.length}
$("#export").onclick=()=>{render();let a=document.createElement("a");a.download=(doc.title||"anotacao")+"-pagina-"+(doc.page+1)+".png";a.href=canvas.toDataURL("image/png");a.click()};
addEventListener("resize",resize);if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js");load();