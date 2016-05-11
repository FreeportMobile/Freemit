require('dotenv').config();
var coluhelper = require('../helpers/colu.js');

console
/*
coluhelper.moveAsset("USD","USD",process.env.COLU_PRIVATE_SEED,process.env.COLU_PUBLIC_ADDRESS,'1KCZDRbwhpBh55NPf9mVUQyyCbLzMXopXG',5).then(function(result){
    console.log(result);
}).catch(function(result)
{
    console.log(result);
});
*/

coluhelper.addAsset("USD",6,'1KCZDRbwhpBh55NPf9mVUQyyCbLzMXopXG').then(function(result){
    console.log(result);
}).catch(function(result)
{
    console.log(result);
});
