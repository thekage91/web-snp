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
