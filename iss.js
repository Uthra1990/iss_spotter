const request = require('request');

const fetchMyIP = function(callback) {
    request('https://api.ipify.org?format=json', (error, response, body) => {
      if (error) return callback("There has been an error retieving IP address: " + error);
      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`));
        return;
      }
  
      const myIP = JSON.parse(body).ip;
      callback(myIP);
    });
  }
const fetchCoordsByIP = function(ip,callback) { 

    request('https://freegeoip.app/json/${ip}', (error,response,body) => {
        if (error) return callback("There has been an error retieving IP address: " + error, null);
        if (response.statusCode !== 200) {
            callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
            return;
          }
          const lat = JSON.parse(body).data.latitude;
          const lon = JSON.parse(body).data.longitude;
          const coords = {
            lat: lat,
            lon: lon
          };
          callback(null, coords);
        });
      };
      const fetchISSFlyOverTimes = (coords, callback) => {
        request(`http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.lon}`, (error, response, body) => {
          if (error) return callback("There has been an error retrieving flyover times: " + error, null);
      
          if (response.statusCode !== 200) {
            callback(Error(`Status Code ${response.statusCode} on fetching flyover times: ${body}`), null);
            return;
          }
      
          const flyover = JSON.parse(body).response;
          callback(null, flyover);
        });
      };

      const nextISSTimesForMyLocation = function(callback) {
        fetchMyIP((error, ip) => {
          if (error) {
            return callback(error, null);
          }
          fetchCoordsByIP(ip, (error, coords) => {
            if (error) {
              return callback(error, null);
            }
            fetchISSFlyOverTimes(coords, (error, flyover) => {
              if (error) {
                return callback(error, null);
              }
              callback(null, flyover);
            });
          });
        });
      };

  //module.exports = { fetchCoordsByIP };
  module.exports = { nextISSTimesForMyLocation };2