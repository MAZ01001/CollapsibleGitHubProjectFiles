// ==UserScript==
// @name         collapsible GitHub project files
// @version      2.3
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
        startTime=performance.now(),
        READMEarticle=()=>document.getElementById("folders-and-files")?.parentElement?.nextElementSibling?.querySelector("div#readme,nav span[data-content=README]")!=null,
        /**@type {(table:HTMLTableElement,button:HTMLSpanElement,collapse:boolean)=>void} for {@linkcode button_toggle}*/
        Expand=(table,button,collapse)=>{
            "use strict";
            const rows=table.querySelectorAll("tbody>tr[id^=folder-row-]");
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
        table=null,
        /**
         * - `"auto"`: only collapse when a README (or LICENCE or similar) is displayed
         * - `"expand"`: never collapse
         * - `"collapse"`: allways collapse
         * - `"last"`: uses last _collapse state_ (starts collapsed)
         */
        auto=localStorage.getItem("github_collapse_auto")??"auto",
        collapse=LoadCollapse(auto),
        updateTableLastPath="",
        updateBodyTimeout=NaN;
    const
        button_toggle=Object.assign(document.createElement("span"),{tabIndex:0,role:"button",title:"toggle list of files & folders"}),
        button_default=Object.assign(document.createElement("span"),{textContent:auto,tabIndex:0,role:"button",title:"select default collapse state: auto/expanded/collapsed/last"}),
        /**(non-passive) event handler callback for {@linkcode button_toggle}*/
        button_toggle_handler=/**@param {MouseEvent|KeyboardEvent} ev `click` or `keypress` event*/ev=>{
            "use strict";
            if(ev instanceof KeyboardEvent&&ev.key!=="Enter"&&ev.key!==" ")return;
            ev.preventDefault();
            localStorage.setItem("github_collapse",(collapse=!collapse)?"1":"0");
            Expand(table,button_toggle,collapse);
        },
        /**(non-passive) event handler callback for {@linkcode button_default}*/
        button_default_handler=/**@param {MouseEvent|KeyboardEvent} ev `click` or `keypress` event*/ev=>{
            "use strict";
            if(ev instanceof KeyboardEvent&&ev.key!=="Enter"&&ev.key!==" ")return;
            ev.preventDefault();
            switch(auto){
                case"auto":auto="expand";break;
                case"expand":auto="collapse";break;
                case"collapse":auto="last";break;
                case"last":auto="auto";break;
            }
            localStorage.setItem("github_collapse_auto",button_default.textContent=auto);
        },
        td=Object.assign(document.createElement("td"),{colSpan:3}),
        tr=document.createElement("tr"),
        UpdateTableCallback=()=>{
            "use strict";
            if(tr.parentElement?.parentElement!==table){
                table.querySelector("tbody>tr#folder-row-0").insertAdjacentElement("beforebegin",tr);
                Expand(table,button_toggle,collapse=LoadCollapse(auto));
            }else if(location.pathname===updateTableLastPath)Expand(table,button_toggle,collapse);
            else Expand(table,button_toggle,collapse=LoadCollapse(auto));
            updateTableLastPath=location.pathname;
        },
        tableObserver=new MutationObserver(UpdateTableCallback),
        UpdateBodyCallback=()=>{
            "use strict";
            const newTable=document.getElementById("folders-and-files")?.nextElementSibling;
            if(newTable===table)return;
            tableObserver.disconnect();
            table=newTable;
            if(table==null)return;
            UpdateTableCallback();
            tableObserver.observe(table,{childList:true,subtree:true});
        },
        bodyObserver=new MutationObserver(()=>{
            "use strict";
            clearTimeout(updateBodyTimeout);
            updateBodyTimeout=setTimeout(UpdateBodyCallback,10);
        });
    button_toggle.style.cursor="pointer";
    button_toggle.classList.add("Link--muted");
    button_toggle.addEventListener("click",button_toggle_handler,{passive:false});
    button_toggle.addEventListener("keypress",button_toggle_handler,{passive:false});
    button_default.style.cursor="pointer";
    button_default.classList.add("Link--muted");
    button_default.addEventListener("click",button_default_handler,{passive:false});
    button_default.addEventListener("keypress",button_default_handler,{passive:false});
    td.style.textAlign="center";
    td.style.fontStyle="italic";
    td.style.paddingBlock=".2rem";
    td.style.borderTop="1px solid var(--borderColor-default, var(--color-border-default))";
    td.style.borderInline="4px solid var(--borderColor-default, var(--color-border-default))";
    td.append(button_toggle," // ",button_default);
    tr.appendChild(td);
    updateBodyTimeout=setTimeout(UpdateBodyCallback,10);
    bodyObserver.observe(document.body,{childList:true,subtree:true});
    console.info(
        "%cCollapse GitHub project files: %cversion 2.3%c loaded in %o ms",
        "background:#000;color:#0f0;font-size:larger",
        "background:#000;color:#f90",
        "background:#000;color:#0f0",
        Number((performance.now()-startTime).toFixed(4))
    );
})();
