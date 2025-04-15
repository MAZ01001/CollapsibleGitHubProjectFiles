# Collapsible GitHub project files

A [Tampermonkey](https://www.tampermonkey.net/ "official tampermonkey website") userscript to make the project file lists on GitHub collapsible.

> [!IMPORTANT]
>
> Vote for community/community#109986
>
> If you want this to be a built-in feature on GitHub or generally argue about whether this is a good idea or not.

<img src="./preview.gif" width="600" alt="preview GIF" title="click to view full size">

Uses `localStorage` to be persistent on `github.com` domain when reloading page/browser:

- `github_collapse` stores _collapse state_ (`0` or `1`)
- `github_collapse_auto` stores _collapse type_ (`auto`, `expanded`, `collapsed`, or `last`)

Shows an extra row at the top of the files/folders list with two buttons `show NUM rows // DEFAULT`:

- `show/hide NUM rows` will toggle the list when clicked
  - `NUM` displays the number of files/folders in the list
- `DEFAULT` shows the _collapse type_ used and when clicked will cycle through them as follows
  - `auto` (default) only collapse when a README is displayed
  - `expanded` never collapse
  - `collapsed` allways collapse
  - `last` uses last _collapse state_ (starts collapsed)

Click [here](https://github.com/MAZ01001/CollapsibleGitHubProjectFiles/raw/main/github_collapse.user.js "GitHub raw URL to github_collapse.user.js file") to see this userscript in tampermonkey (if you have the plugin installed) to add it to your list of userscripts.
