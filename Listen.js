const mysql = require('mysql');
//const time = require('timers');
global.fetch = require("node-fetch");
let cTemp='000';
let con = mysql.createConnection({
    host: "127.0.0.1",
    user: "prueba",
    password: "123456",
    database:"bd_HistoricWeather"
});  
const clientIdWeather = "65b4b079ea9713f18c751ab13470af86";
 
function apiUrlWeather(lon, lat){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&APPID="+clientIdWeather;
    //console.log(apiUrl);
    return apiUrl.toString();
   
  }
let objDatos = [];
/*{
    description:{},
    currenttemp:{},
    minTemp:{},
    maxtemp:{}
} ;*/
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
        //const timeoutObj = time.setInterval(getAllWeatherFomObject(ubication), 60000);
      let nu = setInterval(function(){getAllWeatherFomObject(ubication)},10000);
      
        function getAllWeatherFomObject (obj){
            var lim= Object.keys(obj).length;
            console.log('el limite es'+lim);
            for(let i=0;i<lim;i++){
               console.log('entro ' + obj[i.toString()].name);
              getWeatherForHistoric(obj[i.toString()].latitude, obj[i.toString()].longitude);
              // console.log('entro ' + aux);
               //console.log(cTemp);
            }
            console.log(objDatos);
           
        }
        
          
          function getWeatherForHistoric(latitude,longtitude) {
            let urlWeather =  apiUrlWeather(latitude,longtitude);
            let result='';
            console.log('fetch ' + urlWeather);
            fetch(urlWeather)
            .then(  
                function(response) { 
                    console.log('response'); 
                  if (response.status !== 200) {  
                    console.log('Looks like there was a problem. Status Code: ' +  
                      response.status);  
                    return;  
                  }
                  // Examine the text in the response  
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
                    //console.log(objData.description);
                    //console.log(objData.currenttemp);
                   objDatos.push(objData);
                   console.log(objDatos);
                });  
		    }  
		  )  
                .catch(function(error) {
                // If there is any error you will catch them here
                console.error('el error es:'+error);
                });   
                console.log('objDatos '+objDatos);
                guardarObjetoEnMysql(con, objDatos,ubication);
          }
          
          function guardarObjetoEnMysql( conexion, objWeather, ubicationW){
            for(let i=0;i<4;i++){  
                console.log(objWeather);
            let sql = "INSERT INTO Datos VALUES (0,'"+ubicationW[i.toString()].name+"','"+objWeather[i].description+"','"+objWeather[i].currenttemp+"',NOW(),'"+ubicationW[i.toString()].longitude+","+ubicationW[i.toString()].latitude+")";
            console.log(sql);
            conexion.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        }
        }