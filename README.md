# web-cli
![](https://img.shields.io/badge/type-JS_Library-brightgreen.svg "Project type")
![](https://img.shields.io/github/repo-size/LorenzoCorbella74/web-cli "Repository size")
![](https://img.shields.io/github/package-json/v/LorenzoCorbella74/web-cli)

![IMG](demo/web-cli.PNG)

My first attemp with __Web Components__ for creating a web development terminal like the console in FPS games (Quake, Unreal, etc....). 

Check the online demo [here](https://webcli-2020.netlify.app/). To toggle the __web-cli__ use   `ctrl + \`.

## Usage

```sh
# First install dependencies:
npm install

# To run a development server in hot module reloading mode:
npm start

# To create a production build:
npm run build-prod
```

# Commands
- [x] :help  -> Show the list of commands
- [x] :about -> Show **web-cli** version and version date
- [x] :exit  -> Close the web-cli
- [x] :theme __light|grey|blue|dark__ -> change themes 
- [x] :size __sm|md|lg__ -> change size of the **web-cli** window
- [x] :cls   -> Clean the **web-cli** window
- [x] :wipe  -> Clean the commands history
- [x] :open __URL__ -> Open an url in a new Browser tab
- [x] :group  -> Open selected bookmarks in new Browser tab
- [x] :see   -> Make a query with configured search engine (google|bing)
- [x] :get __URL__ -> Make a get request and show the json response
- [x] :jf __jsonStr__ -> Format a json string
- [x] :close  -> Close all blocks
- [x] :toggle  -> Toggle all blocks' visibility
- [x] :query  -> Parse an URl's query strings
- [ ] :jdiff __jsonStr__ -> Compare two json strings
- [ ] :track  -> Timetracker plugin
- [x] :meteo -> Weaver plugin based on the open
- [ ] :todo   -> Todo plugin
- [ ] :math   -> Math calculations
- [ ] :var    -> Set environment variables
- [ ] :cookie -> Get cookies
- [ ] :storage -> Get localstorage

# Input
Define configuration options by setting the **options** property to the web component:
```js
let webCli = document.querySelector('web-cli');

webCli.options = {
    user: "Name of the user",
    size: 'md',
    theme: 'dark',
    max_num_commands: 40,
    open: true,
    search_engine:'google',
    nation:'it',    // for places with the same name on openWeavermap
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
```

| Options | Allowed values | Description | Defaut value |
| ------- | -------------- | ----------- | ------------ |
| user | *string* | The user... | **"user"** |
| search_engine | **"google"**&#124;**"bing"** | Search engine... | **"google"** |
| open | *Boolean* | Open or closed | **"false"** |
| size | **"sm"**&#124;**"md"**&#124;**"lg"** | size of the terminal window |**"default"** |
| theme | **"dark"**&#124;**"light"**&#124;**"grey"**&#124;**"blue"** | The theme | **"light"** |
| max_num_commands | *number* | Max commands in history | **"50"** |
| nation | *string* | for places of the same name on [openWeathermap](https://openweathermap.org/api) | **"it"** |

# Outputs
The **web-cli** fires the following output events:
- [ ] TODO

## Built With
HTML5, CSS, Javascript, [Web Components](https://developer.mozilla.org/it/docs/Web/Web_Components), [json-formatter-js](https://github.com/mohsen1/json-formatter-js)


