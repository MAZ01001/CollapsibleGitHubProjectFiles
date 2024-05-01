// ==UserScript==
// @name         collapsible GitHub project files
// @version      2.0
// @description  make GitHub project files collapsible
// @author       MAZ / MAZ01001
// @source       https://github.com/MAZ01001/CollapsibleGitHubProjectFiles
// @updateURL    https://github.com/MAZ01001/CollapsibleGitHubProjectFiles/raw/main/github_collapse.user.js
// @downloadURL  https://github.com/MAZ01001/CollapsibleGitHubProjectFiles/raw/main/github_collapse.user.js
// @match        https://github.com/*
// ==/UserScript==

(async function(){
    "use strict";
    const
        READMEarticle=()=>document.querySelector("div#readme:has(h2>a[href=\\#readme]) div>article")!=null||document.querySelector("div:has(nav a>span[data-content=README])+div>article")!=null,
        RepoOverview=()=>document.querySelector("react-partial[partial-name=repos-overview]")!=null,
        /**@type {(table:HTMLTableElement,button:HTMLSpanElement,collapse:boolean)=>void} for {@linkcode button_toggle}*/
        Expand=(table,button,collapse)=>{
            "use strict";
            const rows=table.querySelectorAll("tr[id^=folder-row-]");
            if(collapse){
                for(const row of rows)row.style.display="none";
                button.textContent=`show ${rows.length} rows`;
            }else{
                for(const row of rows)row.style.display="";
                button.textContent=`hide ${rows.length} rows`;
            }
        },
        /**@type {(auto:string)=>boolean} use {@linkcode auto}*/
        LoadCollapse=auto=>{
            "use strict";
            let collapse=false;
            localStorage.setItem("github_collapse_auto",auto);
            switch(auto){
                case"auto":collapse=READMEarticle();break;
                case"expand":collapse=false;break;
                case"collapse":collapse=true;break;
                case"last":collapse=(localStorage.getItem("github_collapse")??"1")==="1";break;
            }
            localStorage.setItem("github_collapse",collapse?"1":"0");
            return collapse;
        };
    let
        table=document.querySelector("h2#folders-and-files+table>tbody"),
        /**
         * - `"auto"`: only collapse when a README is displayed
         * - `"expand"`: never collapse
         * - `"collapse"`: allways collapse
         * - `"last"`: uses last collapse state (_starts collapsed_)
         */
        auto=localStorage.getItem("github_collapse_auto")??"auto",
        collapse=LoadCollapse(auto),
        updatetimeout=NaN;
    const
        button_toggle=Object.assign(document.createElement("span"),{tabIndex:0,role:"button",title:"toggle list of files & folders"}),
        button_default=Object.assign(document.createElement("span"),{textContent:auto,tabIndex:0,role:"button",title:"select default collapse state: auto/expanded/collapsed/last"}),
        tr=document.createElement("tr"),
        td=Object.assign(document.createElement("td"),{colSpan:3}),
        tableObserver=new MutationObserver(()=>{
            "use strict";
            Expand(table,button_toggle,collapse);
        }),
        UpdateCallback=()=>{
            "use strict";
            if(!RepoOverview()&&!READMEarticle())return;
            tableObserver.disconnect();
            (table=document.querySelector("h2#folders-and-files+table>tbody")).querySelector("tr#folder-row-0").insertAdjacentElement("beforebegin",tr);
            Expand(table,button_toggle,collapse=LoadCollapse(auto));
            tableObserver.observe(table,{childList:true,subtree:true});
        },
        bodyObserver=new MutationObserver(mutations=>{
            "use strict";
            if(mutations.some(v=>table.contains(v.target)))return;
            clearTimeout(updatetimeout);
            updatetimeout=setTimeout(UpdateCallback,0);
        });
    button_toggle.style.cursor="pointer";
    button_toggle.classList.add("Link--muted");
    button_toggle.addEventListener("click",ev=>{
        "use strict";
        ev.preventDefault();
        localStorage.setItem("github_collapse",(collapse=!collapse)?"1":"0");
        Expand(table,button_toggle,collapse);
    },{passive:false});
    button_default.style.cursor="pointer";
    button_default.classList.add("Link--muted");
    button_default.addEventListener("click",ev=>{
        "use strict";
        ev.preventDefault();
        switch(auto){
            case"auto":auto="expand";break;
            case"expand":auto="collapse";break;
            case"collapse":auto="last";break;
            case"last":auto="auto";break;
        }
        localStorage.setItem("github_collapse_auto",button_default.textContent=auto);
    },{passive:false});
    td.style.textAlign="center";
    td.style.fontStyle="italic";
    td.style.paddingBlock=".2rem";
    td.style.borderTop="1px solid var(--borderColor-default, var(--color-border-default))";
    td.style.borderInline="4px solid var(--borderColor-default, var(--color-border-default))";
    td.append(button_toggle," // ",button_default);
    tr.appendChild(td);
    if(table!=null&&(RepoOverview()||READMEarticle())){
        table.querySelector("tr#folder-row-0").insertAdjacentElement("beforebegin",tr);
        Expand(table,button_toggle,collapse=LoadCollapse(auto));
        tableObserver.observe(table,{childList:true,subtree:true});
    }
    bodyObserver.observe(document.body,{childList:true,subtree:true});
})();
