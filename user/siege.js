const siege = require('siege');

siege()
  .on(8000)
  .get('/user/analytics/100/wishlist').for(100).times
  .attack()