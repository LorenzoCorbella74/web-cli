export const CLI_TEMPLATE = `
<div class="webcli light-theme sm-size">
    <div class="webcli-output"></div>
    <div class="webcli-input">
        <div class="symbol"> > </div>
        <div> <input type="text"></div>
        <div class="webcli-loader"></div>
    </div>
    <div class="copy">
        <span class="before-cursor"></span>
        <span class="cursor">&nbsp</span>
    </div>
    <!-- DOWNLOAD -->
    <a id="downloadAnchorElem" style="display:none"></a>
</div>`;

export const CLI_STYLE = `
<style>
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@100;300;400;600;700&display=swap");
/* @import url(require("style.css")); */

*, *::before, *::after {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    font-family: "Inconsolata", monospace;
    font-size: 1rem;
}

web-cli {
    --color: #3442e2;
    --background: rgba(255, 255, 255);
    --color-cmd: rgb(66, 66, 66);
    --color-error: red;
    --color-warning: orange;
    --color-ok: #3D9970;
    --color-border: rgb(175, 175, 175);
}

.light-theme {
    --color: #3442e2;
    --background: rgba(255, 255, 255);
    --color-cmd: rgb(66, 66, 66);
    --color-error: red;
    --color-warning: orange;
    --color-ok: #3D9970;
    --color-border: rgb(175, 175, 175);
}

.dark-theme {
    --color: #8ae234;
    --background: rgba(0, 0, 0, 0.95);
    --color-cmd: #aaa;
    --color-error: red;
    --color-warning: orange;
    --color-ok: #0ff;
    --color-border: #888;
}

.grey-theme {
    --color: #35D7BB;
    --background: #2b2f36;
    --color-cmd: #a0aabf;
    --color-error: rgb(245, 99, 91);
    --color-warning: rgb(253, 190, 72);
    --color-ok: #0ff;
    --color-border: #4A5261;
}

.blue-theme {
    --color: #FFDC00;
    --background: #001f3f;
    --color-cmd: white;
    --color-error: #FF4136;
    --color-warning: #FF851B;
    --color-ok: #01FF70;
    --color-border: #0074D9;
}

h1,h2,h3 {
    font-weight: 300;
    margin: 0.4em 0;
  }
  h3 { font-size: 2.5em; }

/* -----    SVG Icons - svgicons.sparkk.fr  ----- */
.svg-icon {
  width: 1.5em;
  height: 1.5em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: var(--color);
}

.svg-icon circle {
  stroke: var(--color);
  stroke-width: 1;
}

/* -----    scrollbar  ----- */
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--color);
}

/* -----    WEBCLI  ----- */
.webcli {
    background: var(--background);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 14px;
    border: solid 1px var(--color-border);
    display: flex;
    flex-direction: column;
}

.sm-size{
    height: 300px;
}
.md-size{
    height: 50%;
}
.lg-size{
    height: 100%;
}

.webcli-output {
    height: 92%;
    overflow: auto;
}

/*  Input   -----------------------------------------------------*/
.webcli-input {
    position: absolute;
    bottom: 14px;
    left: 0px;
    right: 0px;
    padding: 0 14px;
    overflow: hidden;
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.webcli-input input {
    flex:1;
    background: transparent;
    border: none;
    overflow: hidden;
    outline: none; /*Chrome*/
    color: transparent;
    text-shadow: 0 0 0 var(--color);
    z-index: 2;
}
.webcli-input::-ms-clear {
    display: none;
} /*Clear button in Edge*/
.webcli-input .symbol {
    color: var(--color);
    margin-right: 8px;
}
.copy {
    position: absolute;
    bottom: 14px;
    left: 31px;
    display: flex;
}
.before-cursor {
    color: transparent;
    border-right: 6px;
    z-index: 1;
}
.cursor {
    background: var(--color);
    z-index: 1;
    animation: blink 1s linear 0s infinite;
}

/* Output text   -----------------------------------------------------*/
.webcli-cmd {
    color: var(--color-cmd);
    margin-bottom: 3px;
    margin-top: 3px;
    padding:6px 0px;
}
.webcli-error {
    color: var(--color-error);
    margin-bottom: 0.5rem;
}
.webcli-ok {
    color: var(--color-ok);
    margin-bottom: 0.5rem;
}
.webcli-warning {
    color: var(--color-ok);
    margin-bottom: 0.5rem;
}

/* Table    -----------------------------------------------------*/
.webcli-tbl {
    color: var(--color-cmd);
}
.webcli-tbl td {
    padding: 2px 5px;
}
.webcli-tbl td:first-child {
    padding-left: 0;
}
.webcli-lbl {
    color: #d3d7cf;
}
.webcli-val {
    color: #525753;
}

/*Busy animation    ----------------------------------------------------*/
.webcli-loader {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border-top: 2px solid var(--color);
    border-right: 2px solid transparent;
    margin: 4px 0;
    animation: spin 0.6s linear infinite;
}

.deletable-div > .header {
    display:flex;
    justify-content:flex-end;
    margin-bottom:0.5rem;
    margin-top:0.5rem;
}

/* .deletable-divhover {
    border-top: 1px solid var(--color-border);
} */

.delete-btn, .save-btn, .toggle-btn {
    opacity:0;
    color: var(--color-border);
    margin:0px 6px;
    transition:opacity 250ms;
}

.header .title {
    flex-grow:1;
    text-align:left;
    overflow: none;
    text-overflow: ellipsis;
    width:100%;
    color: var(--color-cmd);
}

.header:hover > .delete-btn, .header:hover > .save-btn, .header:hover > .toggle-btn {
    opacity:1;
    cursor:pointer;
}

.content{
    position:relative;
    left:1rem;
    width:90%;
}

hr{
    color:--color-border;
}

@keyframes blink {
    0% {
        background: var(--color);
    }
    50% {
        background: transparent;
    }
    100% {
        background: var(--color);
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

</style>`;

export const notRecognized = 'is not recognized as command.';

export const DELETABLE_DIV = (title) => `
    <div class="deletable-div">
        <div class="header">
            <div class="title"><h4>${title}</h4></div> 
            <div class="save-btn">
            <svg class="svg-icon" viewBox="0 0 20 20">
                <path d="M17.064,4.656l-2.05-2.035C14.936,2.544,14.831,2.5,14.721,2.5H3.854c-0.229,0-0.417,0.188-0.417,0.417v14.167c0,0.229,0.188,0.417,0.417,0.417h12.917c0.229,0,0.416-0.188,0.416-0.417V4.952C17.188,4.84,17.144,4.733,17.064,4.656M6.354,3.333h7.917V10H6.354V3.333z M16.354,16.667H4.271V3.333h1.25v7.083c0,0.229,0.188,0.417,0.417,0.417h8.75c0.229,0,0.416-0.188,0.416-0.417V3.886l1.25,1.239V16.667z M13.402,4.688v3.958c0,0.229-0.186,0.417-0.417,0.417c-0.229,0-0.417-0.188-0.417-0.417V4.688c0-0.229,0.188-0.417,0.417-0.417C13.217,4.271,13.402,4.458,13.402,4.688"></path>
            </svg>
            </div>
            <div class="toggle-btn">
            <svg class="svg-icon" viewBox="0 0 20 20">
                <path d="M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"></path>
            </svg>
            </div>
            <div class="delete-btn">
            <svg class="svg-icon" viewBox="0 0 20 20">
                <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
            </svg>
            </div>
        </div>
        <div class="content"></div>
    </div>
`;