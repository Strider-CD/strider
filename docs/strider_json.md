# strider.json

You can put a `strider.json` file in repositories that you are testing.

This file supports two different styles of usage: Simple Mode and Normal Mode. If your `strider.json` file does not meet the requirements for either mode, it is ignored.

Strider scans your `strider.json` file for the top-level keys and decides which mode to operate in.

## Simple Mode

In simple mode:

* You must define at least one top-level key, being `test`
* All branch plugin configuration done through the UI is ignored
* The Custom Script plugin is used under the hood and phases are mapped to your key value pairs

Example, using all possible keys:

```json
{
  "deploy_on_green": false,
  "environment": "npm set registry https://whatever",
  "prepare": "npm install",
  "test": "mocha --recursive test/unit",
  "deploy": "would not run in this case",
  "cleanup": "rm -f some stuff"
}
```

## Normal Mode

* You must define 
