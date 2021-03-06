import { NOT_RECOGNIZED_COMMAND, NOT_RECOGNIZED_PARAMETER } from './templates';

const OPENWEATHER_API_KEY = 'ac69f910a6ed9bc9205273eb8b0bc553';

export const commands = {
    help: {
        action: (instance, parameters) => {
            if (!parameters[1]) {
                instance.writeBlock(`> :help -> list of commands`, 'list_commands', commands)
            } else {
                let command = parameters[1].substring(1);
                if (command in commands) {
                    instance.writeHTML(`> <strong>:${command}</strong> - ${commands[command].info}`, "cmd");
                    return;
                }
                instance.writeHTML(`> <strong>${command}</strong> ${NOT_RECOGNIZED_COMMAND}`, "error");
            }
        },
        info: 'List of available commands'
    },
    cls: {
        action: (instance) => {
            instance.outputEl.innerHTML = "";
        },
        info: 'Clean the screen'
    },
    about: {
        action: (instance) => {
            instance.writeHTML(`> :about -> Version: <strong>${instance.version}</strong> - <strong>${instance.versionDate}</strong>`, "cmd");
        },
        info: 'Web-cli info'
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
            if (theme === 'light' || theme === 'dark' || theme === 'grey' || theme === 'blue') {
                instance.setTheme(theme);
                instance.writeHTML(`> :theme ${theme}`, "ok");
                return;
            }
            instance.writeHTML(`> <strong>${theme}</strong> ${NOT_RECOGNIZED_PARAMETER}`, "error");
        },
        info: 'Set the theme of the web-cli: dark|light|grey|blue'
    },
    size: {
        action: (instance, parameters) => {
            let size = parameters[1];
            if (size === 'sm' || size === 'md' || size === 'lg') {
                instance.setSize(size);
                instance.writeHTML(`> :size ${size}`, "ok");
                return;
            }
            instance.writeHTML(`> <strong>${size}</strong> ${NOT_RECOGNIZED_PARAMETER}`, "error");
        },
        info: 'Set the size of the web-cli: sm|md|lg'
    },
    jf: {
        action: (instance, parameters) => {
            parameters.shift();
            let jsonStr = parameters.join('');
            try {
                jsonStr = JSON.stringify(JSON.parse(jsonStr)) // si rimuove gli spazi
                instance.writeBlock(`> :json --format`, 'json', jsonStr);
            } catch (error) {
                instance.writeHTML(`> Error parsing JSON data.`, "error");
                instance.newBlankLine();
            }
        },
        info: 'format a json string.'
    },
    get: {
        action: (instance, parameters) => {
            let url = parameters[1];
            if (url) {
                instance.loader(true);
                let headers = new Headers({ 'Content-Type': 'application/json' });
                fetch(url, { headers })
                    .then(response => response.json())
                    .then(data => {
                        instance.loader(false);
                        instance.writeBlock(`:get --url ${url}`, 'json', JSON.stringify(data));
                    })
                    .catch(error => {
                        console.error(error);
                        instance.writeHTML(`> Error getting data: ${error}`, "error");
                        instance.loader(false);
                    });
            } else {
                instance.writeHTML(`> <strong>${url}</strong> is missing!`, "error");
            }
        },
        info: 'HTTP GET request for json endpoints'
    },
    open: {
        action: (instance, parameters) => {
            let url = parameters[1];
            if (url) {
                window.open(url, '_blank');
            } else {
                instance.writeHTML(`> <strong>URL</strong> ${NOT_RECOGNIZED_PARAMETER}`, "error");
            }
        },
        info: 'Open a provided url'
    },
    see: {
        action: (instance, parameters) => {
            parameters.shift();
            let query = parameters.join('+');
            if (query) {
                // https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters
                window.open(`${instance.searchPath}${query}&oq=${query}&as_qdr=y`, '_blank');
            } else {
                instance.writeHTML(`> <strong>Query</strong> ${NOT_RECOGNIZED_PARAMETER}`, "error");
            }
        },
        info: `Make a query with the configured search engine`
    },
    group: {
        action: (instance, parameters) => {
            let group_name = parameters[1];
            if (group_name && group_name in instance._options.groups) {
                let links = instance._options.groups[group_name];
                links.forEach(e => {
                    window.open(e, '_blank');
                });
            } else {
                instance.writeHTML(`> <strong>Group name</strong> is missing!`, "error");
            }
        },
        info: 'Open a group of configured bookmarks'
    },
    query: {
        action: (instance, parameters) => {
            let url = parameters[1];
            if (url) {
                let queryParams = getUrlParams(url);
                instance.writeBlock(`> :query --url ${url}`, 'list_query', queryParams);
            } else {
                instance.writeHTML(`> <strong>URL</strong> ${NOT_RECOGNIZED_PARAMETER}`, "error");
            }
        },
        info: 'Open a group of configured bookmarks'
    },
    close: {
        action: (instance) => {
            instance.outputEl.querySelectorAll('.deletable-div').forEach(e => instance.close(null, e));
        },
        info: 'Close all blocks'
    },
    toggle: {
        action: (instance) => {
            instance.outputEl.querySelectorAll('.deletable-div').forEach(e => instance.close(null, e));
        },
        info: 'Toggle visibility for all blocks'
    },
    exit: {
        action: () => {
            if (confirm("Close Web-cli?")) {
                window.close();
            }
        },
        info: 'Close the web-cli'
    },
    meteo: {
        action: (instance, parameters) => {
            parameters.shift();
            let city = parameters.join(' ');
            if (city) {
                instance.loader(true);
                let headers = new Headers({ 'Content-Type': 'application/json' }); // cors-anywhere.herokuapp.com/ https://api.openweathermap.org
                fetch(`/api/data/2.5/weather?q=${city},${instance.nation}&APPID=${OPENWEATHER_API_KEY}&units=metric`, { headers })
                    .then(response => response.json())
                    .then(data => {
                        instance.loader(false);
                        instance.writeHTML((`<p> > :meteo  for ${city},${instance.nation.toUpperCase()}:${data.weather[0].main} - ${data.weather[0].description} - ${data.main.temp} <img class="icon" src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather icon"></p>`));
                    })
                    .catch(error => {
                        console.error(error);
                        instance.writeHTML(`> Error getting meteo for ${city}: ${error}`, "error");
                        instance.loader(false);
                    });
            } else {
                instance.writeHTML(`> <strong>City</strong> is missing!`, "error");
            }
        },
        info: 'Current weather for the provided city'
    },
    forecast: {
        action: (instance, parameters) => {
            parameters.shift();
            let city = parameters.join(' ');
            if (city) {
                instance.loader(true);
                let headers = new Headers({ 'Content-Type': 'application/json' });
                fetch(`/api/data/2.5/forecast?q=${city},${instance.nation}&APPID=${OPENWEATHER_API_KEY}&units=metric`, { headers })
                    .then(response => response.json())
                    .then(data => {
                        instance.loader(false);
                        instance.writeBlock(`> :meteo forecasts for ${city},${instance.nation.toUpperCase()}`, 'forecast', data.list);
                    })
                    .catch(error => {
                        console.error(error);
                        instance.writeHTML(`> Error getting meteo for ${city}: ${error}`, "error");
                        instance.loader(false);
                    });
            } else {
                instance.writeHTML(`> <strong>City</strong> is missing!`, "error");
            }
        },
        info: 'Weather forecasts for the provided city'
    },
    step: {
        action: (instance, info) => {
            console.log(JSON.stringify(instance), info);
        },
        steps: ['step1', 'step2', 'step3'],
        info: 'Test multistep'
    }

};

function getUrlParams(search) {
    let hashes = search.slice(search.indexOf('?') + 1).split('&')
    return hashes.reduce((params, hash) => {
        let [key, val] = hash.split('=')
        return Object.assign(params, {
            [key]: {
                info: decodeURIComponent(val)
            }
        });
    }, {})
}

/*

TEST:

http://www.repubblica.it/er/fgsdgsdfg/?post=1234&action=edit&active=1

{
	"name": "Luke Skywalker",
	"height": "172",
	"mass": "77",
	"hair_color": "blond",
	"skin_color": "fair",
	"eye_color": "blue",
	"birth_year": "19BBY",
	"gender": "male",
	"homeworld": "https://swapi.dev/api/planets/1/",
	"films": [
		"https://swapi.dev/api/films/2/",
		"https://swapi.dev/api/films/6/",
		"https://swapi.dev/api/films/3/",
		"https://swapi.dev/api/films/1/",
		"https://swapi.dev/api/films/7/"
	],
	"species": [
		"https://swapi.dev/api/species/1/"
	],
	"vehicles": [
		"https://swapi.dev/api/vehicles/14/",
		"https://swapi.dev/api/vehicles/30/"
	],
	"starships": [
		"https://swapi.dev/api/starships/12/",
		"https://swapi.dev/api/starships/22/"
	],
	"created": "2014-12-09T13:50:51.644000Z",
	"edited": "2014-12-20T21:17:56.891000Z",
	"url": "https://swapi.dev/api/people/1/"
}


*/

