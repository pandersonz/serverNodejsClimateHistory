const mysql = require('mysql');
const fetch = require("node-fetch");

let con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database:"db_historicweather"
});  
const clientIdWeather = "65b4b079ea9713f18c751ab13470af86";
 
function apiUrlWeather(lon, lat){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&APPID="+clientIdWeather;
    return apiUrl.toString();
   
  }

let ubication = {
    0:{
        name:'Santa Cruz - Bolivia',
        longitude:-17.7567898,
        latitude:-63.2918389
    },
    1:{
        name:'Oruro - Bolivia',
        longitude:-17.9610768,
        latitude:-67.157496
    },
    2:{
        name:'La Paz - Bolivia',
        longitude:-16.5203365,
        latitude:-68.2641665
    },
    3:{
        name:'Trinidad - Bolivia',
        longitude:-14.8299422,
        latitude:-64.9194423
    }
}
       
        
        let nu = setInterval(function(){getAllWeatherFomObject(ubication)},10000);
      
        function getAllWeatherFomObject (obj){
            var lim= Object.keys(obj).length;
            console.log('el limite es'+lim);
            for(let i=0;i<lim;i++){            
              getWeatherForHistoric(obj[i.toString()].latitude, obj[i.toString()].longitude, obj[i.toString()].name);             
            }          
        }
        
          
          function getWeatherForHistoric(latitude,longtitude,pname) {
            let urlWeather =  apiUrlWeather(latitude,longtitude);
            fetch(urlWeather)
            .then(  
                function(response) { 
                    console.log('response'); 
                  if (response.status !== 200) {  
                    console.log('Looks like there was a problem. Status Code: ' +  
                      response.status);  
                    return;  
                  }
                  
                  response.json().then(function(data) {  		        
                    let objData={
                        description:'',
                        currenttemp:'',
                        maxtemp:''  
                    };
                    objData.description = data["weather"][0]["description"];
                    objData.currenttemp = data["main"]["temp"];
                    objData.mintemp = data["main"]["temp_min"];
                    objData.maxtemp = data["main"]["temp_max"]
                    
                    
                    guardarObjetoEnMysql(con, objData,longtitude,latitude,pname);
                    
                });  
		    }  
		  )  
                .catch(function(error) {
                    console.error('el error es:'+error);
                });   
                
          }
          
          function guardarObjetoEnMysql( conexion, objWeather, pLon, pLat, pName){
            let date = new Date();
            console.log(date);
            let sql = "INSERT INTO Datos VALUES (0,'"+pName+"','"+objWeather.description+"','"+objWeather.currenttemp+"','"+objWeather.mintemp+"','"+objWeather.maxtemp+"','"+date+"',"+pLon+","+pLat+")";
            conexion.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        
        }