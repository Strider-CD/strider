# Create Your Own Plugin


You can extend Strider with custom functionality via plugins. Strider provides (at least) two ways to create your own plugin. Fist: via template. Second: via command line.

### Create a Plugin from Template
The [strider-template](https://github.com/bitwit/strider-template) repository on GitHub illustrates the basic structure for a strider plugin. The required plugin metadata information is located the `package.json` file.

Clone or fork this repository and add your desired functionality.


### Create a Plugin from Command Line
Strider ships with a command line tool located in `bin/strider`. To create a new plugin, run [`bin/strider init`](https://github.com/Strider-CD/strider/wiki/Managing-Plugins#creating-new-plugins=).

This will ask for the plugin name, description and author.

    plugin: name:  strider-new-plugin
    plugin: description: This will be cool stuff!
    plugin: author: marcus
    Cloning into …
    
    remote: Counting objects: 20, done.
    remote: Total 20 (delta 0), reused 0 (delta 0)
    Unpacking objects: 100% (20/20), done.
    Checking connectivity... done.

    …

Please note that all Strider plugins are named with **strider-** prepend. Of course you can use a name of your choice. It just would be good manner to lean on the official project style.


### Strider.json
Strider plugins require either a [`strider.json`](https://github.com/Strider-CD/strider-extension-loader#striderjson) file in the plugin base directory or a `strider` section in `package.json` file. The information defined is used by Strider to load the plugin code correctly and show users information about it. 

The schema looks like:

    {
      "id": "mycoolplugin", // must be unique.
      "title": "Human Readable Title",
      "icon": "icon.png", // relative to the plugin's `static` directory
      "type": "runner | provider | job | basic", // defaults to basic
      "webapp": "filename.js", // loaded in the webapp environment
      "worker": "filename.js", // loaded in the worker environment
      "templates": {
        "tplname": "<div>Hello {{ name }}</div>", // either HTML or a path to HTML file
        "tplname": "path/to/tpl.html"
      },
      "config": { // project-specific configuration
        "controller": // defaults to "Config.JobController" for job plugins, "Config.ProviderController", etc.
        "script":     // path where the js should be loaded from. Path defaults to "config/config.js"
        "style":      // defaults to "config/config.less". Can be less or css
        "template":   // defaults to "config/config.html"
      }
      // other configurations you need
    }

Static files located in a plugins `/static/` directory are available via url path `/ex/:pluginid`.
