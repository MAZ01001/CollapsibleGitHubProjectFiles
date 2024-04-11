// ==UserScript==
// @name         collapsible GitHub project files
// @version      1.2
// @description  make GitHub project files collapsible
// @author       MAZ / MAZ01001
// @source       https://github.com/MAZ01001/CollapsibleGitHubProjectFiles
// @updateURL    https://github.com/MAZ01001/CollapsibleGitHubProjectFiles/raw/main/github_collapse.user.js
// @downloadURL  https://github.com/MAZ01001/CollapsibleGitHubProjectFiles/raw/main/github_collapse.user.js
// @match        https://github.com/*
// ==/UserScript==

(async function(){
    "use strict";
    let table=document.querySelector("h2#folders-and-files+table>tbody"),
        updatetimeout=NaN,
        expand=localStorage.getItem("github_collapse",document.querySelector("div:has(nav a>span[data-content=README])+div>article")==null?"0":"1")==="0";
    localStorage.setItem("github_collapse",expand?"1":"0");
    const
        button=Object.assign(document.createElement("span"),{textContent:expand?"collapse project files":"expand project files",tabIndex:0,role:"button"}),
        tr=Object.assign(document.createElement("tr"),{title:"toggle list of project files"}),
        td=Object.assign(document.createElement("td"),{colSpan:3});
    button.style.cursor="pointer";
    button.style.fontStyle="italic";
    button.classList.add("Link--muted");
    button.addEventListener("click",ev=>{
        "use strict";
        ev.preventDefault();
        button.textContent=(expand=!expand)?"collapse project files":"expand project files";
        localStorage.setItem("github_collapse",expand?"1":"0");
        table.querySelectorAll("tr[id^=folder-row-]").forEach(v=>{v.style.display=expand?"":"none";});
    },{passive:false});
    td.style.textAlign="center";
    td.style.paddingBlock=".2rem";
    td.appendChild(button);
    tr.appendChild(td);
    const tableObserver=new MutationObserver(()=>table.querySelectorAll("tr[id^=folder-row-]").forEach(v=>{v.style.display=expand?"":"none";})),
        bodyObserver=new MutationObserver(mutations=>{
            "use strict";
            if(mutations.some(v=>v.target.contains(table)))return;
            clearTimeout(updatetimeout);
            updatetimeout=setTimeout(()=>{
                "use strict";
                if(document.querySelector("react-partial[partial-name=repos-overview]")==null)return;
                (table=document.querySelector("h2#folders-and-files+table>tbody")).querySelector("tr:first-of-type").insertAdjacentElement("afterend",tr);
                tableObserver.disconnect();
                tableObserver.observe(table,{childList:true,subtree:true});
            },0);
        });
    bodyObserver.observe(document.body,{childList:true,subtree:true});
    if(table!=null){
        table.querySelector("tr:first-of-type").insertAdjacentElement("afterend",tr);
        table.querySelectorAll("tr[id^=folder-row-]").forEach(v=>{v.style.display=expand?"":"none";});
        tableObserver.observe(table,{childList:true,subtree:true});
    }
})();
