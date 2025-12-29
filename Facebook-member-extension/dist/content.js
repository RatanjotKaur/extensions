console.log("FB Member Requests Script Loaded");function y(){const l=document.createElement("style");l.textContent=`
    .fbmr-approve-btn,
    .fbmr-decline-btn,
    .fbmr-bulk-approve,
    .fbmr-bulk-decline {
      padding: 8px 16px;
      margin: 4px 4px 0 0;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .fbmr-approve-btn,
    .fbmr-bulk-approve {
      background-color: #31a24c;
      color: white;
    }

    .fbmr-approve-btn:hover,
    .fbmr-bulk-approve:hover {
      background-color: #2a8c40;
      box-shadow: 0 2px 6px rgba(49, 162, 76, 0.3);
    }

    .fbmr-approve-btn:active,
    .fbmr-bulk-approve:active {
      transform: scale(0.98);
    }

    .fbmr-decline-btn,
    .fbmr-bulk-decline {
      background-color: #e4163a;
      color: white;
    }

    .fbmr-decline-btn:hover,
    .fbmr-bulk-decline:hover {
      background-color: #c01230;
      box-shadow: 0 2px 6px rgba(228, 22, 58, 0.3);
    }

    .fbmr-decline-btn:active,
    .fbmr-bulk-decline:active {
      transform: scale(0.98);
    }

    .fbmr-custom-actions {
      display: flex;
      gap: 4px;
      margin-top: 8px;
    }
  `,document.head.appendChild(l)}function x(){return Array.from(document.querySelectorAll('div[role="button"], button')).filter(r=>{var t;return/^Approve/i.test(((t=r.textContent)==null?void 0:t.trim())||"")}).map(r=>{var o;let t=r.parentElement;for(;t;){if(t.children,t.querySelectorAll('div[role="button"], button').length>=2&&((o=t.textContent)!=null&&o.includes("Requested")))return t;t=t.parentElement}return null}).filter(r=>r!==null)}function E(l){var m,p;let r=null,t="Unknown",o="";const i=Array.from(l.querySelectorAll('a[href*="/"]'));for(const a of i){const u=a.getAttribute("href")||"";if(/\/([\w.]+)\/?(\?|$)|\/profile\.php\?id=|\/pages\//.test(u)){const e=(m=a.innerText)==null?void 0:m.trim();if(e&&e.length>0&&!e.includes("Requested")&&!e.includes("said")){r=a,t=e,o=a.href;break}}}if(!r){const a=l.querySelector('a[href*="facebook.com"]');(p=a==null?void 0:a.innerText)!=null&&p.trim()&&(t=a.innerText.trim(),o=a.href)}if(t==="Unknown"){const u=(l.textContent||"").split(`
`).filter(e=>e.trim());for(const e of u){const n=e.trim();if(n&&n.length>2&&!n.includes("Requested")&&!n.includes("Approve")){t=n;break}}}const c=l.querySelector("abbr"),d=(c==null?void 0:c.getAttribute("title"))||new Date().toISOString();return console.debug(`Extracted card data: name="${t}", profileUrl="${o}"`),{name:t,profileUrl:o,requestDate:d}}function D(l){var u;if(l.querySelector(".fbmr-custom-actions")||l._fbmrProcessed)return;l._fbmrProcessed=!0;const{name:r,profileUrl:t,requestDate:o}=E(l),i=Array.from(l.querySelectorAll('div[role="button"], button')),c=i.find(e=>{var n;return/^Approve\b/i.test(((n=e.textContent)==null?void 0:n.trim())||"")}),d=i.find(e=>{var n;return/^Decline\b/i.test(((n=e.textContent)==null?void 0:n.trim())||"")});function m(e,n,b){var f;if(!e)return null;const s=document.createElement("button");return s.className=b==="APPROVED"?"fbmr-approve-btn":"fbmr-decline-btn",s.textContent=`${n} & Save`,s.addEventListener("click",()=>{s.disabled=!0;const k={name:r,profileUrl:t,requestDate:o,action:b};s.textContent="Saving...",chrome.runtime.sendMessage({type:"SAVE_MEMBER",payload:k},v=>{v&&v.success?s.textContent="Saved":(s.textContent="Error",console.error((v==null?void 0:v.error)||"Unknown error saving member")),setTimeout(()=>{try{s.textContent=`${n} & Save`}catch{}},1500),s.disabled=!1});try{e.click()}catch(v){console.error("Failed to trigger native button click",v)}}),(f=e.parentElement)==null||f.insertBefore(s,e),e.style.display="none",s}const p=m(c,"Approve","APPROVED"),a=m(d,"Decline","DECLINED");if(!p&&!a){const e=document.createElement("button");e.textContent="Approve & Save",e.className="fbmr-approve-btn",e.addEventListener("click",()=>{e.disabled=!0,e.textContent="Saving...",chrome.runtime.sendMessage({type:"SAVE_MEMBER",payload:{name:r,profileUrl:t,requestDate:o,action:"APPROVED"}},f=>{f&&f.success?(e.textContent="Saved",setTimeout(()=>e.textContent="Approve & Save",2e3)):(e.textContent="Error",setTimeout(()=>e.textContent="Approve & Save",2e3)),e.disabled=!1})});const n=document.createElement("button");n.textContent="Decline & Save",n.className="fbmr-decline-btn",n.addEventListener("click",()=>{n.disabled=!0,n.textContent="Saving...",chrome.runtime.sendMessage({type:"SAVE_MEMBER",payload:{name:r,profileUrl:t,requestDate:o,action:"DECLINED"}},f=>{f&&f.success?(n.textContent="Saved",setTimeout(()=>n.textContent="Decline & Save",2e3)):(n.textContent="Error",setTimeout(()=>n.textContent="Decline & Save",2e3)),n.disabled=!1})});const b=document.createElement("div");b.className="fbmr-custom-actions",b.style.marginTop="8px",b.appendChild(e),b.appendChild(n),(((u=i[0])==null?void 0:u.parentElement)??l).appendChild(b)}}function g(l){l.forEach(r=>D(r))}let C=!1;function S(){var t;if(C||document.querySelector(".fbmr-bulk-actions"))return;const l=Array.from(document.querySelectorAll('div[role="button"], button'));let r=null;for(const o of l){const i=((t=o.textContent)==null?void 0:t.trim())||"";if(/^Approve All/i.test(i)){r=o.parentElement;break}}if(r){r.querySelectorAll('div[role="button"], button').forEach(d=>{d.style.display="none"});const o=document.createElement("button");o.textContent="Approve All & Save",o.className="fbmr-bulk-approve",o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Processing...";const d=x();for(const m of d){const{name:p,profileUrl:a,requestDate:u}=E(m);chrome.runtime.sendMessage({type:"SAVE_MEMBER",payload:{name:p,profileUrl:a,requestDate:u,action:"APPROVED"}}),await new Promise(e=>setTimeout(e,1e3))}o.textContent="Approve All & Save",o.disabled=!1});const i=document.createElement("button");i.textContent="Decline All & Save",i.className="fbmr-bulk-decline",i.addEventListener("click",async()=>{i.disabled=!0,i.textContent="Processing...";const d=x();for(const m of d){const{name:p,profileUrl:a,requestDate:u}=E(m);chrome.runtime.sendMessage({type:"SAVE_MEMBER",payload:{name:p,profileUrl:a,requestDate:u,action:"DECLINED"}}),await new Promise(e=>setTimeout(e,1e3))}i.textContent="Decline All & Save",i.disabled=!1});const c=document.createElement("div");c.className="fbmr-bulk-actions",c.style.marginTop="6px",c.appendChild(o),c.appendChild(i),r.appendChild(c),C=!0}}let h,A=new WeakSet;const w=new MutationObserver(()=>{clearTimeout(h),h=setTimeout(()=>{const r=x().filter(t=>!A.has(t));r.length>0&&(r.forEach(t=>A.add(t)),g(r)),C||S()},300)});w.observe(document.body,{childList:!0,subtree:!0});y();setTimeout(()=>{g(x()),S()},1500);
