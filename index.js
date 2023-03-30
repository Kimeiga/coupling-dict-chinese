var _ = require('underscore');
var path = require('path');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  logging: false,
  storage: path.join(__dirname, './db/cc-cedict.sqlite')
});

var Word = sequelize.define('Word', {
  traditional: Sequelize.STRING,
  simplified: Sequelize.STRING,
  pronunciation: Sequelize.STRING,
  definitions: Sequelize.STRING
});

// Convert between traditional and simplified.
var cnchars = require('cn-chars');
// Prettify the pinyin default (letters + numbers) in CC-CEDICT.
var pinyin = require('prettify-pinyin');

module.exports.searchByChinese = function (str, cb) {
  var simplified = str.slice().split('');
  var traditional = str.slice().split('');
  for (var i = 0; i < str.length; i++) {
    simplified[i] = cnchars.toSimplifiedChar(str[i]);
    traditional[i] = cnchars.toTraditionalChar(str[i]);
  }
  simplified = simplified.join('');
  traditional = traditional.join('');

  // default search is simplified unless input string is traditional
  var query = {
    where: { simplified: simplified }
  };
  if (traditional === str) {
    query.where = { traditional: traditional };
  }

  Word
    .findAll(query)
    .then(function (words) {
      var results = [];
      _.each(words, function (word) {
        var pronunciation = word.pronunciation;
        var prettified = pinyin.prettify(pronunciation.slice(1, pronunciation.length - 1));
        results.push({
          traditional: word.traditional,
          simplified: word.simplified,
          pronunciation: prettified,
          definitions: word.definitions
        });
      });
      cb(results);
    });
};

module.exports.searchByChineseAsync = async function (str) {
  var simplified = str.slice().split('');
  var traditional = str.slice().split('');
  for (var i = 0; i < str.length; i++) {
    simplified[i] = cnchars.toSimplifiedChar(str[i]);
    traditional[i] = cnchars.toTraditionalChar(str[i]);
  }
  simplified = simplified.join('');
  traditional = traditional.join('');

  // default search is simplified unless input string is traditional
  var query = {
    where: { simplified: simplified }
  };
  if (traditional === str) {
    query.where = { traditional: traditional };
  }

  let words = await Word.findAll(query);


  var results = [];
  _.each(words, function (word) {
    var pronunciation = word.pronunciation;
    var prettified = pinyin.prettify(pronunciation.slice(1, pronunciation.length - 1));
    results.push({
      traditional: word.traditional,
      simplified: word.simplified,
      pronunciation: prettified,
      definitions: word.definitions
    });
  });

  return results;
};

module.exports.searchByPinyin = function (str, cb) {
  // Catches dead-tones or 5th tone
  var parts = str.split(" ");
  var newStr = [];
  _.each(parts, function (part) {
    var numeric = part.replace(/\D/g, '');

    if (numeric === "") {
      part += "5";
      newStr.push(part);
    } else {
      newStr.push(part);
    }
  });

  str = "[" + newStr.join(" ") + "]";

  var query = {
    where: { pronunciation: str }
  };

  Word
    .findAll(query)
    .then(function (words) {
      var results = [];

      _.each(words, function (word) {
        var pronunciation = word.pronunciation;
        var prettified = pinyin.prettify(pronunciation.slice(1, pronunciation.length - 1));
        results.push({
          traditional: word.traditional,
          simplified: word.simplified,
          pronunciation: prettified,
          definitions: word.definitions
        });
      });
      cb(results);
    });
}

module.exports.searchByPinyinAsync = async function (str) {
  // Catches dead-tones or 5th tone
  var parts = str.split(" ");
  var newStr = [];
  _.each(parts, function (part) {
    var numeric = part.replace(/\D/g, '');

    if (numeric === "") {
      part += "5";
      newStr.push(part);
    } else {
      newStr.push(part);
    }
  });

  str = "[" + newStr.join(" ") + "]";

  var query = {
    where: { pronunciation: str }
  };

  let words = await Word.findAll(query)

  var results = [];

  _.each(words, function (word) {
    var pronunciation = word.pronunciation;
    var prettified = pinyin.prettify(pronunciation.slice(1, pronunciation.length - 1));
    results.push({
      traditional: word.traditional,
      simplified: word.simplified,
      pronunciation: prettified,
      definitions: word.definitions
    });
  });

  return results;
}

module.exports.searchByEnglish = function (str, cb) {
  // TODO
};
