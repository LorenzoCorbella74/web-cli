export const CLI_TEMPLATE = `
    <div class="webcli default-theme default-size">
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
    </div>`
    ;

export const CLI_STYLE = `
<style>
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@100;300;400;600;700&display=swap");

.default-theme {
    --color: #3442e2;
    --background: rgba(255, 255, 255);
    --color-cmd: rgb(66, 66, 66);
    --color-error: red;
    --color-ok: rgb(55, 255, 0);
    --color-border: rgb(175, 175, 175);
}
.dark-theme {
    --color: #8ae234;
    --background: rgba(0, 0, 0, 0.65);
    --color-cmd: #aaa;
    --color-error: red;
    --color-ok: #0ff;
    --color-border: rgb(40, 40, 40);
}

*, *::before, *::after {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    font-family: "Inconsolata", monospace;
    font-size: 0.8rem;
}

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

.default-size{
    height: 320px;
}
.big-size{
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
}
.webcli-ok {
    color: var(--color-ok);
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

</style>`
    ;

export const tableTemplate = `
    <table class="webcli-tbl">
        <tr><td><strong>:help</strong></td><td>List of commands</td></tr>
        <tr><td><strong>:theme (dark/default)</strong></td><td>change themes </td></tr>
        <tr><td><strong>:size (big/default)</strong></td><td>change size </td></tr>
        <tr><td><strong>:clean</strong></td><td>Clean the console</td></tr>
        <tr><td><strong>:about</strong></td><td>Console info</td></tr>
        <tr><td><strong>:json jsonStr</strong></td><td>Show a json tree</td></tr>
    </table>`
    ;

export const notRecognized = 'is not recognized as command.';