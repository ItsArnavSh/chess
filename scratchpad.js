let Long = require("long");

let longVal1 = Long.fromInt(1234567890, true);
let longVal2 = Long.fromInt(9876543210, true);

let andResult = longVal1.and(longVal2);
console.log(andResult.toString());

let orResult = longVal1.or(longVal2);
console.log(orResult.toString());

let xorResult = longVal1.xor(longVal2);
console.log(xorResult.toString());

let notResult = longVal1.not();
console.log(notResult.toString());

let shlResult = longVal1.shl(1);
console.log(shlResult.toString());

let shrResult = longVal1.shr(1);
console.log(shrResult.toString());

let shruResult = longVal1.shru(1);
console.log(shruResult.toString());