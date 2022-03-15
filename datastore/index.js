const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// Use the unique id generated by getNextUniqueId to create a file path inside the dataDir

exports.create = (text, callback) => {
  counter.getNextUniqueId(function(err, counter) {
    if (err) {
      console.log('unknown error');
    } else {
      var id = counter;
      items[id] = text;
      //fs.write a new file
      //fs.writeFile(file, data, callback)
      // file name needs to be current `${id}.txt`

      //(path.join(`${exports.dataDir}`,`${id}.txt`))
      fs.writeFile((path.join(`${exports.dataDir}`, `${id}.txt`)), text, function(err) {
        if (err) {
          console.log('error writting new file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

};

// Next, refactor the readAll function by returning an array of todos to client app whenever a GET request to the collection route occurs. To do this, you will need to read the dataDir directory and build a list of files. Remember, the id of each todo item is encoded in its filename.

//filename: 00001.txt
//  want to seperate 00001 from .txt
// return id: id, text: id

// We would like to read the files from the ENTIRE directory:
// https://nodejs.org/api/fs.html#fsreaddirpath-options-callback
//fs.readdir(path,[options,] callback)

//readdir's callback function gets two args: err and files...files is the array of the NAMES of the files in the directory excluding '.' and '..'
//So I believe without parsing/slicing we will receive file names that look like "00001txt" and a files array like ['00001txt', '00002txt'].
//We may then need to slice each of the items in the array
//eventually end up with an array  of individual files where the id and text are both id value

//I think we should use the same path we used above: `${exports.dataDir}` ....maybe no ${}
// fs.readdir callback could be the if error first check...

exports.readAll = (callback) => {

  fs.readdir(`${exports.dataDir}`, function (err, data) {
    if (err) {
      console.log('error reading saved file');
    } else {
      //use map
      var todos = _.map(data, (name) => {
        var todo = { id: name.slice(0, -4), text: name.slice(0, -4) };
        return todo;
      });
      console.log('todos:', todos);
      callback(null, todos);
    }
  });


  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  // readFile passing in export.datadir id concat with .txt
  // set text equal to data we get back from readFile
  // follow existing pattern for our callback to server.js

  fs.readFile(path.join(`${exports.dataDir}`, `${id}.txt`), function (err, fileText) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var text = fileText.toString('utf8');
      callback(null, { id, text });
    }
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   console.log('text:::', text);
  //   callback(null, { id, text });
  // }
};

//readfrom file use: path.join(expo....,id.txt, )

exports.update = (id, text, callback) => {
  console.log('id:::', id);

  var fileName = path.join(`${exports.dataDir}`, `${id}.txt`);

  exports.readOne(id, function(err) {
    if (err) {
      callback(new Error(`Could not update id: ${id}`));
    } else {

      fs.writeFile(fileName, text, function(err) {
        if (err) {
          callback(new Error(`Could not update id: ${id}`));
          // console.log(`Could not update id: ${id}`);
        } else {
          callback(null, { id, text });
        }
      });

    }
  });



  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};


// sub-problem 1: save the current state of the counter to the hard drive, so it's persisted between server restarts
// 1A) rewrite getNextUniqueId to make use of the provided readCounter and writeCounter functions