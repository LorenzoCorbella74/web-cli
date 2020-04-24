import { CLI_TEMPLATE, CLI_STYLE, tableTemplate, notRecognized } from './templates';

import DomJsonTree from "dom-json-tree";

class WebCLI extends HTMLElement {

    constructor() {
        super();
        this.history = [];      // Command history
        this.cmdOffset = 0;     // Reverse offset into history
        this.isDark = false;
        this.isBig = false;
        this.version = '0.0.1';
        this.versionDate = '22/04/20'

        this.createTemplate();
        this.showWelcomeMsg();
        this.loader(false);
    }

    connectedCallback () {
        document.addEventListener('keydown', event => this.onKeyDown(event));
        this.ctrlEl.addEventListener('click', event => this.onClick(event));
        this.inputEl.addEventListener('paste', event => this.onPaste(event));
    }

    disconnectedCallback () {
        document.removeEventListener('keydown', event => this.onKeyDown(event));
        this.ctrlEl.removeEventListener('click', event => this.onClick(event));
        this.inputEl.removeEventListener('paste', event => this.onPaste(event));
    }

    onPaste(){
        setTimeout(this.updateCursor.bind(this), 150);
    }

    onClick () {
        this.focus();
    }

    setTheme (theme) {
        if (theme === 'default') {
            this.ctrlEl.classList.remove('dark-theme');
            this.ctrlEl.classList.add('default-theme');
            this.isDark = false;
        } else {
            this.ctrlEl.classList.remove('default-theme');
            this.ctrlEl.classList.add('dark-theme');
            this.isDark = true;
        }
    }

    setSize (size) {
        if (size === 'default') {
            this.ctrlEl.classList.remove('big-size');
            this.ctrlEl.classList.add('default-size');
            this.isBig = false;
        } else {
            this.ctrlEl.classList.remove('default-size');
            this.ctrlEl.classList.add('big-size');
            this.isBig = true;
        }
    }

    toggleTheme (e) {
        e.preventDefault();
        if (this.ctrlEl.classList.contains('dark-theme')) {
            this.ctrlEl.classList.remove('dark-theme');
            localStorage.removeItem('dark-theme');
            this.isDark = false;
        } else {
            this.ctrlEl.classList.add('dark-theme');
            localStorage.setItem('dark-theme', true);
            this.isDark = true;
        }
    }

    onKeyDown (e) {
        let ctrlStyle = this.ctrlEl.style;

        if (e.ctrlKey && e.keyCode == 220) {    // Ctrl + Backquote
            if (ctrlStyle.display == "none") {
                ctrlStyle.display = "";
                this.focus();
            } else {
                ctrlStyle.display = "none";
            }
            return;
        }

        if (this.isloader) { return; }

        //Other keys (when input has focus)//http://keycode.info/
        if (this._shadow.host === document.activeElement) {
            switch (e.keyCode) {
                case 13: this.runCmd(); break;// Enter
                case 38: // Up
                    if ((this.history.length + this.cmdOffset) > 0) {
                        this.cmdOffset--;
                        this.inputEl.value = this.history[this.history.length + this.cmdOffset];
                        e.preventDefault();
                    }
                    break;
                case 40: // Down
                    if (this.cmdOffset < -1) {
                        this.cmdOffset++;
                        this.inputEl.value = this.history[this.history.length + this.cmdOffset];
                        e.preventDefault();
                    }
                    break;
            }
            setTimeout(this.updateCursor.bind(this), 100);
        }
    }

    updateCursor () {
        this.hiddenInput.innerHTML = this.inputEl.value.replace(' ','x');   // hack per far avanzare il cursore anche con spazi
    }

    runCmd () {
        let txt = this.inputEl.value.trim();
        if (txt === "") { return; }  // If empty, stop processing
        this.hiddenInput.innerHTML = '';
        this.inputEl.value = '';     // Clear input
        this.cmdOffset = 0;         // Reset history index
        let index = this.history.findIndex(e => e === txt);
        if (index === -1) {
            this.history.push(txt);     // Add cmd to history
        }

        // Client command:
        let tokens = /* txt.match(/\S+/g);  //  */txt.split(/\s+/);
        let cmd = tokens[0].toLowerCase();
        let param1 = tokens[1] ? tokens[1].toLowerCase() : null;
        let param2 = tokens[2] ? tokens[2].toLowerCase() : null;
        let jsonStr;

        if (cmd === ':json') {
            tokens.shift();
            jsonStr = tokens.join('');
            jsonStr = JSON.stringify(JSON.parse(jsonStr)) // si rimuove gli spazi
        }

        if (cmd === ":clear") { this.outputEl.innerHTML = ""; return; }
        if (cmd === ":about") {
            this.writeHTML(`Version: <strong>${this.version}</strong> - <strong>${this.versionDate}</strong>`, "cmd"); return;
        }
        if (cmd === ":help") {
            this.writeHTML(`${tableTemplate}`);
            return;
        }
        if (cmd === ":theme") {
            if (param1 === 'default' || param1 === 'dark') {
                this.setTheme(param1);
                return;
            }
            this.writeHTML(`<strong>${param1}</strong> ${notRecognized}`, "error");
            return;
        }
        if (cmd === ":size") {
            if (param1 === 'default' || param1 === 'big') {
                this.setSize(param1);
                return;
            }
            this.writeHTML(`<strong>${param1}</strong> ${notRecognized}`, "error");
            return;
        }
        if (cmd === ":json") {
            if (jsonStr) {
                this.writeJson(jsonStr);
                return;
            }
            this.writeHTML(`Error parsing JSON data...`, "error");
            return;
        }

        this.writeHTML(`<strong>${cmd}</strong> ${notRecognized}`, "error");

        // Server commands TODO:
    }

    focus () {
        this.inputEl.focus();
    }

    scrollToBottom () {
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }

    newLine () {
        this.outputEl.appendChild(document.createElement("br"));
        this.scrollToBottom();
    }

    writeText (txt, cmdClass) {
        let div = document.createElement("div");
        cmdClass = cmdClass || "ok";
        div.className = "webcli-" + cmdClass;
        div.innerText = txt;
        this.outputEl.appendChild(div);
        this.scrollToBottom()
    }

    writeHTML (markup, cmdClass) {
        let div = document.createElement("div");
        cmdClass = cmdClass || "cmd";
        div.className = "webcli-" + cmdClass;
        div.innerHTML = markup;
        this.outputEl.appendChild(div);
        this.scrollToBottom()
    }

    writeJson (jsonStr) {
        let div = document.createElement("div");
        let name = `Json${Math.floor(Math.random() * 1000)}`;
        div.className = name;
        // div.innerHTML = markup;
        try {
            let data = JSON.parse(jsonStr);
            let djt = new DomJsonTree(data, div, {
                colors: {
                    key: "#008080",
                    type: "#546778",
                    typeNumber: "#000080",
                    typeString: "#dd1144",
                    typeBoolean: "#000080"
                }
            });
            djt.render();
            this.outputEl.appendChild(div);
            this.newLine();
            this.scrollToBottom()
        } catch (error) {
            this.writeHTML(`Error parsing JSON data...`, "error");
            this.newLine();
        }
    }

    showWelcomeMsg () {
        this.writeHTML("Use <strong>:help</strong> to show <strong>WebCLI</strong> commands", "cmd");
        this.newLine();
    }

    createTemplate () {
        let template = document.createElement("template");
        template.innerHTML = `${CLI_STYLE}${CLI_TEMPLATE}`;
        this._shadow = this.attachShadow({ mode: "open" });
        this._shadow.appendChild(template.content.cloneNode(true));

        this.ctrlEl = this._shadow.querySelector('.webcli');            // CLI control (outer frame)
        this.outputEl = this._shadow.querySelector(".webcli-output");   // Div holding console output
        this.inputEl = this._shadow.querySelector(".webcli-input input"); // Input control
        this.loaderEl = this._shadow.querySelector(".webcli-loader");     // loader animation
        this.hiddenInput = this._shadow.querySelector(".before-cursor"); // loader animation

        this.ctrlEl.style.display = "none"; // default is invisible!
    }

    loader (b) {
        this.isloader = b;
        this.loaderEl.style.display = b ? "block" : "none";
    }
}

customElements.define("web-cli", WebCLI);