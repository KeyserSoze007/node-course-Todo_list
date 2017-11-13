const {SHA256} = require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/*var password= '123abc';

bcrypt.genSalt(10,(err,salt) => {
    bcrypt.hash(password,salt, (err,hash) => {
        console.log(hash);
    });
});*/

var hashed= '$2a$10$EJXIGYocZQWBBifs8akv6uI731ylbVLFzUYG8E8Uyl/87VJ7jhmJ2';

bcrypt.compare('123abc',hashed, (err,res) => {
    console.log(res);
});

/*var msg= "This is number 4";

var hashing = SHA256(msg).toString();

console.log(`The hashing of msg:${msg} is: ${hashing}`);
*/

/*var data={
    id:4
}

var token=jwt.sign(data,'secret');
console.log(token);

var decoded=jwt.verify(token,'secret');
console.log(decoded);*/