# Collapsible GitHub project files

A [Tampermonkey](https://www.tampermonkey.net/ "official tampermonkey website") userscript to make the project file lists on GitHub collapsible.

>
> Temporary solution to [`[Feature] Collapsible project files on Repository overview #109986`](https://github.com/orgs/community/discussions/109986 "open GitHub/community discussion 109986").
>
> And maybe also for [`toggle-files-button missing on "New Repository Overview" #6959`](https://github.com/refined-github/refined-github/issues/6959 "open GitHub/refined-github issue 6959")
> of [refined-github](https://github.com/refined-github/refined-github "GitHub: refined-github/refined-github").
>

Uses `localStorage` to be persistent on `github.com` domain when reloading page/browser.

Format: `show NUM rows // DEFAULT`

- `show/hide NUM rows` will show/hide the list when clicked
  - `NUM` displays the number of files/folders in the list
- `DEFAULT` show the current default _collapse state_ and when clicked will cycle through the following options
  - `auto` (default) only collapse when a README is displayed
  - `expanded` never collapse
  - `collapsed` allways collapse
  - `last` uses last collapse state (starts collapsed)

Click [here](https://github.com/MAZ01001/CollapsibleGitHubProjectFiles/raw/main/github_collapse.user.js "GitHub raw URL to github_collapse.user.js file") to see this userscript in tampermonkey (if you have the plugin installed).
