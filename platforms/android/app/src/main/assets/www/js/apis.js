// var axios = require('axios')
// var qs = require('qs')

/*async function postRequest(statusDevice, deviceInfo, lat, lng) {
  var data = JSON.stringify({
    lat: lat,
    lng: lng,
    status_device: statusDevice,
    deviceinfo: deviceInfo
  })

  /*
  var config = {
    method: 'post',
    url: 'http://18.231.176.65:8080/api/updateoculos',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  }

  
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data))
    })
    .catch(function (error) {
      console.log(error)
    })


  const options = {
    method: 'post',
    data: data,
    headers: { ContentType: 'application/x-www-form-urlencoded' }
  };

  cordova.plugin.http.post('https://google.com/', {
    test: 'testString'
  }, {
    Authorization: 'OAuth2: token'
  }, function (response) {
    console.log(response.status);
  }, function (response) {
    console.error(response.error);
  });
}*/

//postRequest(0,"device_name", "device_lat","device_lng")
