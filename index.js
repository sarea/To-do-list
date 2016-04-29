var fs = require('fs');

var args = process.argv.slice(2);
var command = args[0];
var item = args.slice(1).join(' ');


if (command == 'list') {
  list();
} else if (command == 'add') {
  add(item);
} else if (command == 'done'){
  done(item);
} else if(command == 'clear'){
  clear();
  process.stderr.write('Your to-do list is currently empty\n');
} else {
  showUsage();
}


function list() {
  fs.readFile('./To-do.txt', 'utf8', function(error, data) {
    if(!error) {
      if(data == ''){
        process.stderr.write('Your to-do list is currently empty\n');
      }else {
        var splitData = data.split('\n');
        for(var i = 0; i < splitData.length-1; i++ ){
          process.stdout.write(i+1 + '- ' + splitData[i] + '\n');
        }
      }
    } else if (error.code == 'ENOENT') {
       process.stderr.write('Your to-do list is currently empty\n');
    } else {
       process.stderr.write(error + '\n');
    }
  });
}

function add(item) {
  if(item == '') {
    process.stdout.write('you add nothing To-do\n');
  } else {
    fs.appendFile('./To-do.txt', item  + '\n', function (error) {
      if(error){
         process.stderr.write(error + '\n');
      }
       process.stdout.write(item + ' has been added' + '\n');
    });
  }
}

function done(itemNumber) {
  if(!isNaN(itemNumber)) {
    fs.readFile('./To-do.txt', 'utf8', function(error, data) {
      if(error){
        process.stderr.write(error);
      }else {
        var splitData = data.split('\n');
        splitData.splice(splitData.length-1, 1);
        if(itemNumber > splitData.length) {
          process.stdout.write('you dont have this number in you list please choose a number between 1 and '+
          splitData.length +' in this list:\n');
          list();
        }else {
          splitData.splice(itemNumber-1, 1);
          clear();
          for(var i = 0; i < splitData.length; i++){
            fs.appendFile('./To-do.txt', splitData[i] + '\n', function(error) {
              if(error){
                process.stderr.write(error);
              }
            });
          }
          if(itemNumber == 1){
            list();
          }else {
            process.stdout.write('Now your to-do list is:\n');
            list();
          }
        }
      }
    });
  } else {
    process.stdout.write(itemNumber + ' is not number!! please type number of task,'+
    ' you can see your list form here:\n');
    list();
  }
}

function clear() {
  fs.writeFile('./To-do.txt', '', function (error) {
    if(error) {
      process.stderr.write(error + '\n');
    }
  });
}

function showUsage() {
  process.stdout.write(args.join(' ') + ': Command not found.')
  fs.readFile('./usage.txt', 'utf8', function (error, usage) {
    process.stdout.write(usage + '\n');
  })
}
