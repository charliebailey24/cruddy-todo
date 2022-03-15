const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  console.log('callback in writeCounter:::', callback);
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  console.log('callback in nextId', callback);
  //counter = counter + 1;
  // write the counter to the hard drive

  readCounter(function(err, data) {

    if (err) {
      console.log('unknown error');
    } else {
      //write to file
      writeCounter(data + 1, function(err, data) {
        if (err) {
          console.log('unknown error');
        } else {
          callback(null, data);
        }
      });
    }

  });

  // return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');


// writeCounter(counter, (err, data) => {
//   console.log('writeCounter triggering 1');
//   if (err) {
//     console.log('error in getNextUniqueId --> writeCounter:::', err);
//   } else {
//     console.log('the counterString:::', data);
//     readCounter((err, data) => {
//       if (err) {
//         console.log('error in getNextUniqueId --> writeCounter --> readCounter:::', err);
//       } else {
//         console.log('data after passing through hard drive:::', data);
//         return zeroPaddedNumber(data);
//       }
//     });
//   }
// });



  // counter();
  // 00001


  //read --> counter
  // increment
  //write

  // return the counter read from the hard drive
  // console.log('counter:::', counter);