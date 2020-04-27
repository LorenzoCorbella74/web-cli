import { notRecognized } from './templates';

export const commands = {
    help: {
        action: (instance, parameters) => {
            if (!parameters[1]) {
                instance.writeCommandsTable();
            } else {
                let command = parameters[1].substring(1);
                if (command in commands) {
                    instance.writeHTML(`<strong>:${command}</strong> - ${commands[command].info}`, "cmd");
                    return;
                }
                instance.writeHTML(`<strong>${command}</strong> ${notRecognized}`, "error");
            }
        },
        info: 'Show the list of available commands'
    },
    cls: {
        action: (instance) => {
            instance.outputEl.innerHTML = "";
        },
        info: 'Clean the screen'
    },
    open: {
        action: (instance, parameters) => {
            let url = parameters[1];
            if (url) {
                var win = window.open(url, '_blank');
                win.focus();
                return;
            }
            instance.writeHTML(`<strong>${url}</strong> ${notRecognized}`, "error");
        },
        info: 'Open a provided url'
    },
    about: {
        action: (instance) => {
            instance.writeHTML(`Version: <strong>${instance.version}</strong> - <strong>${instance.versionDate}</strong>`, "cmd");
        },
        info: 'Web cli info'
    },
    wipe: {
        action: (instance) => {
            instance.history = [];
        },
        info: 'Clean the command history'
    },
    theme: {
        action: (instance, parameters) => {
            let theme = parameters[1];
            if (theme === 'default' || theme === 'dark') {
                instance.setTheme(theme);
                return;
            }
            instance.writeHTML(`<strong>${theme}</strong> ${notRecognized}`, "error");
        },
        info: 'Set the theme of the web-cli (dark / default)'
    },
    size: {
        action: (instance, parameters) => {
            let size = parameters[1];
            if (size === 'default' || size === 'big') {
                instance.setSize(size);
                return;
            }
            instance.writeHTML(`<strong>${size}</strong> ${notRecognized}`, "error");
        },
        info: 'Set the size of the web-cli (big / default)'
    },
    jf: {
        action: (instance, parameters) => {
            parameters.shift();
            let jsonStr = parameters.join('');
            try {
                jsonStr = JSON.stringify(JSON.parse(jsonStr)) // si rimuove gli spazi
                instance.writeJson(jsonStr);
            } catch (error) {
                instance.writeHTML(`Error parsing JSON data.`, "error");
                instance.newBlankLine();
            }
        },
        info: 'format a json string.'
    }

};

