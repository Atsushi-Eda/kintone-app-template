# kintone-app-template

Template kintone apps with records and attachments.

## Usage example

### When using only once

Using [npx](https://www.npmjs.com/package/npx) is better.
Kintone authentication configs can be specified with command options.

#### Export app template

```
> npx kintone-app-template e 1,2 -d example.cybozu.com -u username -p password
```

#### Import app template

```
> npx kintone-app-template i template.json -d example.cybozu.com -u username -p password
```

### When using multiple times

#### Installation

```
> npm install -g kintone-app-template
```

#### Configuration

```
> kintone-app-template c
Domain name (specify the FQDN): example.cybozu.com
User's log in name: username
User's password: password
Basic authentication user name:
Basic authentication password:
```

#### Export app template

```
> kintone-app-template e 1,2
```

#### Import app template

```
> kintone-app-template i template.json
```

## Sub commands

|sub command|parameter|description|
|-|-|-|
|e|appIds|Export app template. Parameter is app ids.(comma separated)|
|i|filePath|Import app template. Parameter is template file path.(URL or local path)|
|c|-|Configure kintone authentication.|

## Options

|option|description|sub commands supported|
|-|-|-|
|-d, --domain|Domain name (specify the FQDN)|e, i|
|-u, --user|User's log in name|e, i|
|-p, --pass|User's password|e, i|
|-U, --userBasic|Basic authentication user name|e, i|
|-P, --passBasic|Basic authentication password|e, i|
|-g, --guestSpaceId|Guest space id|e, i|
|-s, --spaceId|Space id|i|
|-f, --fileName|Export file name|e|
|-h, --help|display help for command|-, e, i, c|

## Notes
- Works only with Node.js version 12 and above.
- When exporting, apps referenced in lookup fields or reference tables are automatically added to template.
- Fields referenced in lookup fields must be unique.
- An error may occur if you are looking up lookup fields in lookup fields or an automatic calculation.