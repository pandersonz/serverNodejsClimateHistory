var dgram = require("dgram");
var server = dgram.createSocket("udp4");

let ubication = {
    0:{
        name:'Santa Cruz - Bolivia',
        longitude:-63.2918389,
        latitude:-17.7567898
    },
    1:{
        name:'Oruro - Bolivia',
        longitude:-67.157496,
        latitude:-17.9610768
    },
    2:{
        name:'La Paz - Bolivia',
        longitude:-68.2641665,
        latitude:-16.5203365
    },
    3:{
        name:'Trinidad - Bolivia',
        longitude:-64.9194423,
        latitude:-14.8299422
    }
}
    server.on("message", function (msg, rinfo) {
        getAllWeatherFomObject(ubication);
    });
       
    server.on("listening", function () {
       console.log('escuchando')
        });
        
        server.bind(20500);
        let dataWeather;
        function getAllWeatherFomObject (obj){
            var lim= Object.keys(obj).length;
            for(let i=0;i<lim;i++){
               dataWeather.push(getAllWeatherFomObject(obj[i].latitude,obj[i].longtitude));
            }
        }
        function getWeatherForHistoric(latitude,longtitude) {
            console.log("ejecuta el api clima")
            $.ajax({
              url: 'http://api.openweathermap.org/data/2.5/weather',
              data: {
                lat: latitude,
                lon: longtitude,
                units: 'metric',
                APPID: clientIdWeather
              },
              success: data => {
                 console.log(data["main"]["temp"] + " C"+" id"+ data["name"]);
                 var 
                return 
              }
              
            })
          }