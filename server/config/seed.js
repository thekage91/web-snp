/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

mongoose = require('mongoose');
console.log("E VABBE DAI QUA CI ARRIVA");

var User = mongoose.model('User');


User.findOne({ 'name': 'root' }, 'name occupation', function (err, user) {
  if(!user) {
        var admin = new User ( { name : 'root' ,
                         email : 'root@root.com',
                         username : 'root',
                         roles: ['Admin'],
                         password: 'rootadminasd'
                          });
        admin.save( function (err) { console.log("internal error") }); 
  }
  } );
