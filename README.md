# coupling-dict-chinese-updated

This is a fork of coupling-dict-chinese that updates all the packages, particularly sqlite3 to v5 so that it could be used with node versions beyond v14, and updates the cc-cedict.txt to March 30, 2023

--- 

> The following is the Readme of coupling-dict-chinese:

This is a fork of node-cc-cedict that updates some dependencies and the
database from 2014 to 2020.

coupling-dict-chinese provides a convenient asynchronous JavaScript API for the
popular [CC-CEDICT](http://cc-cedict.org/) Chinese-English dictionary. This is
a 'batteries-included' library and comes with a premade SQLite conversion of
the entire dictionary.

Single search method defaults to traditional if the entire word provided is in
traditional characters, otherwise converts everything to simplified and
performs that lookup instead.

## Usage

```
const cedict = require('coupling-dict-chinese');

cedict.searchByChinese('世界', words => {
  console.log(words);
});

```

## License

MIT
