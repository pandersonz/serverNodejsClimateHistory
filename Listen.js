const mysql = require('mysql');
const objtime = require('timers');
var fetch = require("node-fetch");
let cTemp='000';
let con = mysql.createConnection({
    host: "127.0.0.1",
    user: "prueba",
    password: "123456",
    database:"bd_HistoricWeather"
});  
const clientIdWeather = "65b4b079ea9713f18c751ab13470af86";
 
function apiUrlWeather(lon, lat){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?"+lat+"&"+lon+"&units=metric&APPID="+clientIdWeather;
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
        const timeoutObj = setInterval(getAllWeatherFomObject(ubication), 60000);
       
        function getAllWeatherFomObject (obj){
            var lim= Object.keys(obj).length;
            console.log(obj['0']);
            for(let i=0;i<lim;i++){
                console.log('entro ' + obj[i.toString()].longitude);
               let aux=getWeatherForHistoric(obj[i.toString()].latitude, obj[i.toString()].longitude);
               console.log('entro ' + aux);
               console.log(cTemp);
            }
           
        }
        /*function getWeatherForHistoric(latitude,longtitude) {
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
          }*/
          
          function getWeatherForHistoric(latitude,longtitude) {
            let urlWeather =  apiUrlWeather(latitude,longtitude);
            let result='';
            console.log('fetch ' + urlWeather);
            fetch(urlWeather)
            .then(  
                function(response) {  
                  if (response.status !== 200) {  
                    console.log('Looks like there was a problem. Status Code: ' +  
                      response.status);  
                    return;  
                  }
                  // Examine the text in the response  
                  response.json().then(function(data) {  		        
                    // Parse data
                    description = data["weather"][0]["description"];
                    currenttemp = data["main"]["temp"];
                    mintemp = data["main"]["temp_min"];
                    maxtemp = data["main"]["temp_max"];
                    cTemp=currenttemp;
                });  
		    }  
		  )  
                .catch(function(error) {
                // If there is any error you will catch them here
                console.error(error);
                });   
                console.log(result);
          }
          /*fetch(api)  
		  .then(  
		    function(response) {  
		      if (response.status !== 200) {  
		        console.log('Looks like there was a problem. Status Code: ' +  
		          response.status);  
		        return;  
		      }
		      // Examine the text in the response  
		      response.json().then(function(data) {  		        
		        // Parse data
		        description = data["weather"][0]["description"];
		        currenttemp = data["main"]["temp"];
		        mintemp = data["main"]["temp_min"];
		        maxtemp = data["main"]["temp_max"]

		        sendHTML = "<ul>\n" + 
		        			"<li>Description: " + description + "</li>\n" + 
		        			"<li>Current temperature: " + currenttemp + "&deg;C</li>\n" + 
		        			"<li>Minimum temperature: " + mintemp + "&deg;C</li>\n" + 
		        			"<li>Maximum temperature: " + maxtemp + "&deg;C</li>\n" + 
		        			"</ul>";

		        weather.insertAdjacentHTML('afterbegin', sendHTML);

		      });  
		    }  
		  )  
		  .catch(function(err) {  
		    console.log('Fetch Error :-S', err); 
		  });*/
          function guardarObjetoEnMysql( conexion, objWeather){
            let sql = "INSERT INTO weather VALUES (0,"+objWeather.temperature+","+objWeather.date+","+objWeather.idUbication+")";
            console.log(sql);
            conexion.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        }