import { CLI_TEMPLATE, CLI_STYLE, NOT_RECOGNIZED_COMMAND, DELETABLE_DIV } from './templates';
import { commands } from './commands';

import JSONFormatter from 'json-formatter-js'

window.onload = function runApp() {
    let web_cli = document.querySelector('web-cli');
    web_cli.options = {
        user: "Lorenzo",
        size: 'lg',
        theme: 'grey',
        max_num_commands: 40,
        search_engine: 'google',
        open: true,
        nation: 'it',
        groups: {
            dev: [
                'https://alligator.io/',
                'https://www.freecodecamp.org/news/tag/javascript/',
                'https://www.echojs.com/'
            ],
            start: [
                'https://jsoneditoronline.org/',
                'https://mail.google.com/'
            ]
        }
    };
}

// SOURCE: https://stackoverflow.com/questions/22180457/typewriter-effect-for-html-with-javascript
function makeTyping(element, string, cb, time = 45) {

    var str = string,
        i = 0,
        isTag,
        text;

    return function type() {
        text = str.slice(0, ++i);
        if (text === str) {
            element.innerHTML = text;
            cb();
            return;
        }
        element.innerHTML = text;
        var char = text.slice(-1);
        if (char === '<') isTag = true;
        if (char === '>') isTag = false;

        if (isTag) return type(cb);
        setTimeout(type, time);
    };
}

/* 

const whenEnd = () => console.log('End!')

var test = makeTyping(
    document.getElementById('typewriter'),
    "<p>This is my <span style='color:red;'>special string</span> </p>", 
    whenEnd
    );
test(); 
*/


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
        this.history = [''];      // Command history
        this.cmdOffset = 0;     // Reverse offset into history
        this.version = '0.2.0';
        this.versionDate = '01/05/20'

        this.createTemplate();
        this.loader(false);
    }

    set options(input) {
        this._options = input;
        if (input.theme) {
            this.setTheme(input.theme);
        }
        if (input.size) {
            this.setSize(input.size);
        }
        if (input.open) {
            this.toggleCli();
        }
        this.searchPath = input.search_engine === 'bing' ? 'https://www.bing.com/search?q=' : 'http://www.google.com/search?q=';
        this.nation = input.nation ? input.nation : 'it';
        this.showWelcomeMsg();
    }

    get options() {
        return this._options;
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
        event.preventDefault();

        let paste = (event.clipboardData || window.clipboardData).getData('text');
        if (/:jf/g.test(this.inputEl.value)) {
            paste = JSON.stringify(JSON.parse(paste)); // si rimuovono tutti gli spazi
        }
        this.inputEl.value = this.inputEl.value + paste;

        const selection = this._shadow.querySelector('.webcli-input input');
        if (!selection.rangeCount) return false;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(paste));

        setTimeout(this.updateCursor.bind(this), 80);
    }

    onClick() {
        this.focus();
    }

    setTheme(theme) {
        let classes = this.ctrlEl.classList.value;
        let match = classes.match(/\w+-theme/g);
        this.ctrlEl.classList.remove(match);
        this.ctrlEl.classList.add(`${theme}-theme`);
    }

    setSize(size) {
        let classes = this.ctrlEl.classList.value;
        let match = classes.match(/\w+-size/g);
        this.ctrlEl.classList.remove(match);
        this.ctrlEl.classList.add(`${size}-size`);
    }

    toggleCli() {
        let ctrlStyle = this.ctrlEl.style;
        if (ctrlStyle.display == "none") {
            ctrlStyle.display = "";
            this.focus();
        } else {
            ctrlStyle.display = "none";
        }
    }

    onKeyDown(e) {
        if (e.ctrlKey && e.keyCode == 220) {    // Ctrl + Backquote
            this.toggleCli();
            return;
        }

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
        if (index === -1 && this.history.length <= (this._options.max_num_commands || 50)) {
            this.history.push(txt);     // Add cmd to history
        }
        let tokens = /* txt.match(/\S+/g);  //  */txt.split(/\s+/);
        let cmd = tokens[0].toLowerCase().substring(1);

        if (cmd in commands) {
            commands[cmd].action(this, tokens);
        } else {
            this.writeHTML(`> <strong>${tokens[0]}</strong> ${NOT_RECOGNIZED_COMMAND}`, "error");
        }
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
        let index = `output${Math.floor(Math.random() * 10000)}`;
        div.className = `webcli-${cmdClass} ${index}`;
        div.innerHTML = '';
        this.outputEl.appendChild(div);
        // let e = this.outputEl.querySelector(`.${index}`);
        makeTyping(div, markup, this.scrollToBottom.bind(this), 5)();
    }

    writeBlock(title, type, data) {
        let template = document.createElement("template");
        template.innerHTML = `${DELETABLE_DIV(title, type)}`;
        let container = template.content.cloneNode(true);
        let index = `block${Math.floor(Math.random() * 10000)}`;
        let block = container.children[0];
        block.classList.add(index);
        let titleDiv = block.querySelector('.header .title');
        makeTyping(titleDiv, title, this.createContent.call(this, container, type, data, block, index), 0.5)();
    }

    createContent(container, type, data, block, index) {
        let content = container.querySelector('.content');
        if (type === 'json') {
            this.createJsonTree(data, content);
        } else if (type === 'list_commands') {
            let table = this.writeTable(data, true);
            content.appendChild(table);
        } else if (type === 'list_query') {
            let table = this.writeTable(data);
            content.appendChild(table);
        } else if (type === 'forecast') {
            let table = this.writeTableForecast(data)
            content.appendChild(table);
        }
        this.outputEl.appendChild(block);
        // mantiene il riferimento all'elemento
        block.querySelector('.delete-btn').addEventListener('click', event => this.delete(event, index));
        block.querySelector('.save-btn').addEventListener('click', event => this.save(event, data));
        block.querySelector('.toggle-btn').addEventListener('click', event => this.toggle(event, index));
        this.newBlankLine();
        this.scrollToBottom();
    }

    createJsonTree(jsonStr, content) {
        let data = JSON.parse(jsonStr);
        const formatter = new JSONFormatter(data, 1, {
            hoverPreviewEnabled: false,
            hoverPreviewArrayCount: 10,
            hoverPreviewFieldCount: 5,
            theme: 'dark'
        });
        content.appendChild(formatter.render());
    }

    writeTable(commands, list) {
        let div = document.createElement("div");
        let index = `output${Math.floor(Math.random() * 10000)}`;
        div.className = `webcli-cmd ${index}`;
        div.innerHTML = '';
        this.outputEl.appendChild(div);
        let markup = ''
        for (const key in commands) {
            const command = commands[key];
            markup += `<p><span class="list-table"><strong>${list ? ':' : ''}${key}</strong ></span > ${command.info}</p > `;
        }
        makeTyping(div, markup, this.scrollToBottom.bind(this), 0.5)();
        return div;
    }

    writeTableForecast(forecasts) {
        let rows = []
        for (let i = 0; i < forecasts.length; i++) {
            const forecast = forecasts[i];
            rows.push(`<tr>
            <td>${forecast.dt_txt.split(':')[0]}</td>
            <td>${forecast.weather[0].main}</td>
            <td>${forecast.weather[0].description}</td>
            <td>${forecast.main.temp}</td>
            <td><img class="icon" src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather icon"></td>
            </tr>`);
        }
        let tableTemplate = `<table class="webcli-tbl">${rows.join('')}</table>`;
        let div = document.createElement("div");
        div.className = "webcli-cmd";
        div.innerHTML = tableTemplate;
        return div;
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
        let contentDiv = element.querySelector('.content');
        if (contentDiv.style.display === "none") {
            contentDiv.style.display = "block";
        } else {
            contentDiv.style.display = "none";
        }
    }
    close(e, el) {
        let contentDiv = el.querySelector('.content');
        if (contentDiv.style.display === "none") {
            contentDiv.style.display = "block";
        } else {
            contentDiv.style.display = "none";
        }
    }

    // non funziona !!!
    getCssVariable(variableName) {
        let color = getComputedStyle(this._shadow.host).getPropertyValue(variableName);
        return color;
    }

    showWelcomeMsg() {
        this.writeHTML(`<h3>Welcome <span class="emphasised">${this._options.user}</span></h3><p>Use <strong>:help</strong> to show <strong>web-cli</strong> commands</p>`, "cmd");
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