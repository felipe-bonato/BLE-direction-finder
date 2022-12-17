var axios = require('axios')
var qs = require('qs')

async function postRequest (statusDevice, deviceInfo, lat, lng) {

  var data = qs.stringify({
    lat: lat,
    lng: lng,
    status_device: statusDevice,
    deviceinfo: deviceInfo
  })
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
}

//postRequest(0,"device_name", "device_lat","device_lng")
