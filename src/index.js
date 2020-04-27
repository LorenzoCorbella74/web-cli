import { CLI_TEMPLATE, CLI_STYLE, notRecognized, DELETABLE_DIV } from './templates';
import { commands } from './commands';

import DomJsonTree from "dom-json-tree";

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

class WebCLI extends HTMLElement {

    constructor() {
        super();
        this.history = [];      // Command history
        this.cmdOffset = 0;     // Reverse offset into history
        this.isDark = false;
        this.isBig = false;
        this.version = '0.0.2';
        this.versionDate = '28/04/20'

        this.createTemplate();
        this.showWelcomeMsg();
        this.loader(false);
    }

    connectedCallback() {
        document.addEventListener('keydown', event => this.onKeyDown(event));
        this.ctrlEl.addEventListener('click', event => this.onClick(event));
        this.inputEl.addEventListener('paste', event => this.onPaste(event));
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', event => this.onKeyDown(event));
        this.ctrlEl.removeEventListener('click', event => this.onClick(event));
        this.inputEl.removeEventListener('paste', event => this.onPaste(event));
    }

    onPaste(event) {

        /* let paste = (event.clipboardData || window.clipboardData).getData('text');
        paste = JSON.stringify(JSON.parse(paste)); // si rimuovono tutti gli spazi

        const selection = this._shadow.querySelector('.webcli-input input').getSelection();
        if (!selection.rangeCount) return false;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(paste));

        event.preventDefault(); */
        setTimeout(this.updateCursor.bind(this), 150);
    }

    onClick() {
        this.focus();
    }

    setTheme(theme) {
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

    setSize(size) {
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

    toggleTheme(e) {
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

    onKeyDown(e) {
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

    updateCursor() {
        this.hiddenInput.innerHTML = this.inputEl.value.replace(' ', 'x');   // hack per far avanzare il cursore anche con spazi
    }

    runCmd() {
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
        let cmd = tokens[0].toLowerCase().substring(1);


        if (cmd in commands) {
            commands[cmd].action(this, tokens);
        } else {
            this.writeHTML(`<strong>${cmd}</strong> ${notRecognized}`, "error");
        }
        // Server commands TODO:
    }

    focus() {
        this.inputEl.focus();
    }

    scrollToBottom() {
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }

    newBlankLine() {
        this.outputEl.appendChild(document.createElement("br"));
        this.scrollToBottom();
    }

    newLine() {
        this.outputEl.appendChild(document.createElement("hr"));
        this.scrollToBottom();
    }

    writeText(txt, cmdClass) {
        let div = document.createElement("div");
        cmdClass = cmdClass || "ok";
        div.className = "webcli-" + cmdClass;
        div.innerText = txt;
        this.outputEl.appendChild(div);
        this.scrollToBottom()
    }

    writeHTML(markup, cmdClass) {
        let div = document.createElement("div");
        cmdClass = cmdClass || "cmd";
        div.className = "webcli-" + cmdClass;
        div.innerHTML = markup;
        this.outputEl.appendChild(div);
        this.scrollToBottom()
    }

    writeJson(jsonStr) {
        let template = document.createElement("template");
        template.innerHTML = `${DELETABLE_DIV('Json formatter')}`;
        let div = template.content.cloneNode(true);
        let index = `JSON${Math.floor(Math.random() * 10000)}`;
        let a = div.children[0];
        a.classList.add(index);
        let jsonDiv = div.querySelector('.json-div');
        let data = JSON.parse(jsonStr);
        let djt = new DomJsonTree(data, jsonDiv, {
            colors: {
                key: this.getCssVariable('--color'),    /* "#008080" */
                type: this.getCssVariable('--color-cmd'), // "#546778",
                typeNumber: "#000080",
                typeString: this.getCssVariable('--color'),
                typeBoolean: "#000080"
            }
        });
        djt.render();
        this.outputEl.appendChild(a);
        a.querySelector('.delete-btn').addEventListener('click', event => this.delete(event, index));
        a.querySelector('.save-btn').addEventListener('click', event => this.save(event, jsonStr));
        a.querySelector('.toggle-btn').addEventListener('click', event => this.toggle(event, index));
        this.newBlankLine();
        this.scrollToBottom()
    }

    writeCommandsTable() {
        let rows = []
        for (const key in commands) {
            const command = commands[key];
            rows.push(`<tr><td><strong>${key}</strong></td><td>${command.info}</td></tr>`);
        }
        let tableTemplate = `<table class="webcli-tbl">${rows.join()}</table>`;
        this.writeHTML(tableTemplate, 'cmd');
    }

    delete(e, el) {
        let element = this._shadow.querySelector(`.${el}`);
        element.parentNode.removeChild(element);
    }

    // si salva solo in formato JSON ???
    save(e, jsonStr) {
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonStr));
        let dlAnchorElem = this._shadow.querySelector('#downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `sheet_${formatDate(new Date())}.json`); // ``
        dlAnchorElem.click();
    }

    toggle(e, el) {
        let element = this._shadow.querySelector(`.${el}`);
        let jsonDiv = element.querySelector('.json-div');
        if (jsonDiv.style.display === "none") {
            jsonDiv.style.display = "block";
        } else {
            jsonDiv.style.display = "none";
        }
    }


    // non funziona !!!
    getCssVariable(variableName) {
        let color = getComputedStyle(this._shadow.host).getPropertyValue(variableName);
        return color;
    }


    showWelcomeMsg() {
        this.writeHTML("Use <strong>:help</strong> to show <strong>web-cli</strong> commands", "cmd");
        this.newBlankLine();
    }

    createTemplate() {
        let template = document.createElement("template");
        template.innerHTML = `${CLI_STYLE}${CLI_TEMPLATE}`;
        this._shadow = this.attachShadow({ mode: "open" });
        this._shadow.appendChild(template.content.cloneNode(true));

        this.ctrlEl = this._shadow.querySelector('.webcli');            // CLI control (outer frame)
        this.outputEl = this._shadow.querySelector(".webcli-output");   // Div holding console output
        this.inputEl = this._shadow.querySelector(".webcli-input input"); // Input control
        this.loaderEl = this._shadow.querySelector(".webcli-loader");     // loader animation
        this.hiddenInput = this._shadow.querySelector(".before-cursor"); // loader animation

        this.ctrlEl.style.display = "none"; // the web-cli by default is invisible!
    }

    loader(b) {
        this.isloader = b;
        this.loaderEl.style.display = b ? "block" : "none";
    }
}

customElements.define("web-cli", WebCLI);