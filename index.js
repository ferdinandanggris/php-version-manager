// Node.js program to demonstrate the
// fs.symlink() method

// Import the filesystem module
var argv = require('minimist')(process.argv.slice(2));
var config = require('./config.json');
var help = require('./help.json');

const fs = require('fs');
let run = false;
Object.keys(argv).forEach(function(key,index){
  switch (key) {
    case 'storage':
          run = true;
          fs.access(argv.storage, function(error) {
            if (argv.storage == '') {
              console.log('storage value is required')
              return;
            }
              if (error) {
                config.directory = argv.storage;
                fs.writeFileSync(
                  "config.json",
                  JSON.stringify(config)
                );
                console.log('Update storage successfully');
              } else {
                console.log("Directory exists. check and remove first!")
                return;
              }
            });
            return;
      break;
    case 'set':
      run = true;
      if (argv.set == '') {
        console.log('set value is required')
        return;
      }
      if (argv._.length < 1) {
        console.log('Second parameter is required');
        return;
      }
        config.php_version[argv.set] = argv._[0];
        fs.writeFileSync(
          "config.json",
          JSON.stringify(config)
        );
        console.log(`Insert ${argv.set} successfully`);
           return;
      break;      
    case 'use':
      run = true;
      if (argv.use == '') {
        console.log('use value is required')
        return;
      }
        let state = false;
        Object.keys(config.php_version).forEach(function(key,index) {
            if (argv.use === key) {
              state = true;
            }
        })
        if (!state) {
          console.log('Versi tidak Tersedia');
          return;
        }

        fs.access(config.directory, function(error) {
          if (error) {
            console.log("Directory does not exist.")
          } else {
            console.log("Directory exists.")
            console.log("Removing directory.")
            fs.rmdirSync(config.directory, { recursive: true, force: true });
            console.log("Directory has been removed.")
          }

          try {
            fs.symlink(config.php_version[argv.use],
              config.directory,'dir', (err) => {
            if (err)
              console.log(err);
            else {
              console.log("Symlink created");
              console.log("Symlink is a directory:",
              // fs.statSync("symlinkToDir").isDirectory()
              );
              console.log(`Success to move ${argv.use}`);
              return;
            }
            });
            } catch (error) {
                console.log(error);
                return;
            }
          
        });
        return;
      break;   
    case 'list':
      run = true;
        console.table(config.php_version);
        return;
      break;   
    case 'help':
      run = true;
        console.table(help);
        return;
      break;      
  }
});
if (!run) {
  console.table(help);
}

return


