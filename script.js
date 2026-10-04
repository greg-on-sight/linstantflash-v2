const btn=document.querySelector(".menu"),nav=document.querySelector("#nav");
if(btn){btn.addEventListener("click",()=>{const o=nav.classList.toggle("open");btn.setAttribute("aria-expanded",o)})}
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const LIKE_API="https://abacus.jasoncameron.dev";
const LIKE_NAMESPACE="linstantflash-oct2026-gos-7f3c91";

async function readLike(article){
  const response=await fetch(`${LIKE_API}/get/${LIKE_NAMESPACE}/${article}`);
  if(!response.ok) throw new Error("Lecture du compteur impossible");
  const data=await response.json();
  return Number(data.value)||0;
}
async function addLike(article){
  const response=await fetch(`${LIKE_API}/hit/${LIKE_NAMESPACE}/${article}`);
  if(!response.ok) throw new Error("Vote impossible");
  const data=await response.json();
  return Number(data.value)||0;
}
function label(button,count,voted=false){
  button.textContent=voted ? `👍 Merci ! · ${count}` : `👍 J’ai aimé · ${count}`;
}
document.querySelectorAll(".like").forEach(async button=>{
  const article=button.dataset.article;
  const localKey=`lif-like-${article}`;
  const voted=localStorage.getItem(localKey)==="1";

  button.disabled=true;
  button.textContent=voted ? "👍 Merci ! · …" : "👍 J’ai aimé · …";

  try{
    const count=await readLike(article);
    label(button,count,voted);
    button.disabled=voted;
    if(voted) button.classList.add("done");
  }catch{
    button.textContent=voted ? "👍 Merci !" : "👍 J’ai aimé";
    button.disabled=voted;
  }

  button.addEventListener("click",async()=>{
    if(localStorage.getItem(localKey)==="1") return;
    button.disabled=true;
    button.textContent="👍 Enregistrement…";
    try{
      const count=await addLike(article);
      localStorage.setItem(localKey,"1");
      button.classList.add("done");
      label(button,count,true);
    }catch{
      button.disabled=false;
      button.textContent="👍 J’ai aimé";
      alert("Le vote n’a pas pu être enregistré. Tu peux réessayer.");
    }
  });
});