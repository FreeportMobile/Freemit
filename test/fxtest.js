var fx = require('../helpers/fx.js');

fx.fxNow("USD","EUR").then(function(result){
    console.log(result);
}).catch(function(result)
{
    console.log(result);
});
