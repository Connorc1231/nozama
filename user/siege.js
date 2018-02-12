const siege = require('siege');

siege()
  .on(8000)
  .get('/user/1337').for(5000).times
  .attack()
