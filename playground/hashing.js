const {SHA256} = require('crypto-js');
const jwt=require('jsonwebtoken');

/*var msg= "This is number 4";

var hashing = SHA256(msg).toString();

console.log(`The hashing of msg:${msg} is: ${hashing}`);
*/

var data={
    id:4
}

var token=jwt.sign(data,'secret');
console.log(token);

var decoded=jwt.verify(token,'secret');
console.log(decoded);