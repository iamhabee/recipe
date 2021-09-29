
export const pushNotification = async (data) => {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic ZmFkMDUxMTAtMzhhNi00MDM1LWFhZDAtZDNlOTNiNjM3NWNm"
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  var https = require('https');
  var req = https.request(options, function (res) {
    res.on('data', function (data) {
      console.log(JSON.parse(data));

    });
  });

  req.on('error', function (e) {
    console.log("ERROR:");
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
  return req
}