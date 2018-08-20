const mysql = require('mysql');
const fetch = require("node-fetch");
var express = require('express');
var bodyParser = require('body-parser'); 
var mysql = require('mysql');
var objExpress = express(); 
objExpress.use(bodyParser.json());
objExpress.use(bodyParser.urlencoded({ extended: true })); 
objExpress.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
//add ubication of the weather required
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
       
 //interval of time to obtains data of the weather       
        let nu = setInterval(function(){getAllWeatherFomObject(ubication)},10000);
 //obtains data of the weather for all points of the ubication     
        function getAllWeatherFomObject (obj){
            var lim= Object.keys(obj).length;
            console.log('el limite es'+lim);
            for(let i=0;i<lim;i++){            
              getWeatherForHistoric(obj[i.toString()].latitude, obj[i.toString()].longitude, obj[i.toString()].name);             
            }          
        }
        
//obtains data of the weather with latitude and longitude          
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
//save the object with the current weather in the mysql          
          function guardarObjetoEnMysql( conexion, objWeather, pLon, pLat, pName){
            let date = new Date();
            console.log(date);
            let sql = "INSERT INTO Datos VALUES (0,'"+pName+"','"+objWeather.description+"','"+objWeather.currenttemp+"','"+objWeather.mintemp+"','"+objWeather.maxtemp+"','"+date+"',"+pLon+","+pLat+")";
            conexion.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        
        }

//CRUD
    objExpress.get('/datos', function(req, res) {
    var query = "SELECT * FROM datos";
    con.query(query, function(err, rows, col) {
    if(err) {
        res.write(JSON.stringify({
        error: true,
        error_object: err         
       }));
       res.end();
     } else {
       res.write(JSON.stringify(rows));
       res.end();       
     }
   });
});
 
function CreateDatos(objDato,resp) {  
  console.log(objDato);
  var query = "INSERT INTO datos VALUES (";
  query += "'" + objDato.nombre + "','" +objDato.descriptionWeather+"','"+objDato.currentTemp+"','"+objDato.dateWeather+"','"+objDato.longitude+"','"+objDato.latitude+"','"+objDato.tempMin+"','"+objDato.tempoMax+"')";   
  con.query(query, function(err, rows, col) {
    if(err) {
     resp.write(JSON.stringify({
        error: true,
        error_object: err
      }));
     resp.end();
    } else {
      var iIDCreated = rows.insertId;
     resp.write(JSON.stringify({
        error: false,
        idCreated: iIDCreated
      }));
     resp.end();      
    }    
  });
} 
 
function ReadDatos(resp) {
  var query = "SELECT * FROM datos";
  con.query(query, function(err, rows, col) {
    if(err) {
     resp.write(JSON.stringify({
        error: true,
        error_object: err
      }));
     resp.end();
    } else {
     resp.write(JSON.stringify({
        error: false,
        data: rows
      }));
     resp.end();            
    }    
  });    
}
function UpdateDatos(objDato,resp) {
  var query = "UPDATE datos SET last_updated = NOW() ";
  if(objDato.hasOwnProperty('nombre')) {
    query += " AND nombre = '" + objDato.nombre + "' ";
  } 
  query = " WHERE id = '" + objDato.id + "'";
  
  con.query(query, function(oErrUpdate, rowsUpdate, colUpdate) {
    if(oErrUpdate) {
     resp.write(JSON.stringify({ 
        error: true,
        error_object: oErrUpdate
      }));
     resp.end();      
    } else {
     resp.write(JSON.stringify({
        error: false
      }));
     resp.end();
    }
  });
}
function DeleteDato(objDato,resp) {
  var query = "DELETE FROM datos WHERE id = '" + objDato.id + "'";
  con.query(query, function(oErrDelete, rowsDelete, colDelete) {
    if(oErrDelete) {
     resp.write(JSON.stringify({
        error: true,
        error_object: oErrDelete
      }));
     resp.end();
    } else {
     resp.write(JSON.stringify({
        error: false
      }));
     resp.end();      
    }    
  });  
}
 
 objExpress.post('/datos', function(req, res) {
   var oDataOP = {};
   var sOP = '';
   
   oDataOP = req.body.data_op;
   sOP = req.body.op;
   
   switch(sOP) {
     
     case 'CREATE':      
      CreateDatos(oDataOP, res);
     break;
     
     case 'READ':
      ReadDatos(res);
     break;
     
     case 'UPDATE':
      UpdateDatos(oDataOP, res);
     break;
     
     case 'DELETE':
      DeleteDato(oDataOP, res);
     break;
     
     default:
      res.write(JSON.stringify({ 
        error: true, 
        error_message: 'there has not been an operation ' 
      }));
      res.end();
     break;
     
   }   
 });
 
 