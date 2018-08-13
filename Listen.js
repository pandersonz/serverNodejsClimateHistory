const mysql = require('mysql');
const objtime = require('timers');

let con = mysql.createConnection({
    host: "127.0.0.1",
    user: "prueba",
    password: "123456",
    database:"bd_HistoricWeather"
});   
function apiUrlWeather(){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&APPID="+clientIdWeather;
    console.log(apiUrl);
    return apiUrl.toString();
   
  }
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
       
          let dataWeather=[];
        const timeoutObj = setInterval(getAllWeatherFomObject(ubication), 1500);
       
        function getAllWeatherFomObject (obj){
            var lim= Object.keys(obj).length;
            console.log(obj['0']);
            for(let i=0;i<lim;i++){
               getWeatherForHistoric(obj[i.toString()].latitude,obj[i.toString()].longtitude);
               console.log('entro');
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
                {
                   console.log(data["main"]["temp"] + " C"+" id"+ data["name"]);
                 }
              }
              
            })
          }
          function guardarObjetoEnMysql( conexion, objWeather){
            let sql = "INSERT INTO weather VALUES (0,"+objWeather.temperature+","+objWeather.date+","+objWeather.idUbication+")";
            console.log(sql);
            conexion.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        }