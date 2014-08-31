/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

mongoose = require('mongoose');

var User = mongoose.model('User');


User.findOne({ 'name': 'root' }, 'name occupation', function (err, user) {
  if(!user) {
        var admin = new User ( { name : 'root' ,
                         firstName : 'root',
                         lastName : 'root',
                         email : 'root@root.com',
                         address : 'root street',
                         phone : '000',
                         username : 'root',
                         roles: ['admin','authenticated','licensed'],
                         password: 'rootadminasd'
                          });
        admin.save( function (err) { console.log("internal error "+err)  }); 
  }
  } );

function printArgs( x ) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    function getParamNames(func) {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '')
        var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
        if(result === null)
            result = []
        return result
    }

    console.log("Arguments of function " + x.name);
    for(var i=0; i < x.arguments.length; i++)
    {
        console.log(getParamNames(x)[i] + " = ");
        console.log(x.arguments[i]);
    }
}
