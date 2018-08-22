// server.js
// load the things we need
var express = require('express');
var app = express();
var path= require('path');
var mongo = require('mongodb');
var new_db = "mongodb://localhost:27017/esspl";;
var cookieParser = require('cookie-parser');
var session = require('express-session')
var crypto = require('crypto');
var mongoStore= require('connect-mongo')(session);
var fs=require('fs');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost:27017/esspl");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//variables to store sessionss 
var sess,ses;

// set the view engine to ejs
app.use(express.static(path.join(__dirname,'/public/stylesheets')));
app.use(express.static(path.join(__dirname,'/public/javascripts')));
app.use(express.static(path.join(__dirname,'/public')));
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

//create a schema for inserting data

var vehicleSchema = new mongoose.Schema({
  uid: String,
	registrationNumber: String,
	ownerName: String,
	yearOfPurchase: String,
});

var driverSchema = new mongoose.Schema({
  uid:String,
	name: String,
	mobile: String,
	email: String,
	dob:Date,
	aadharNumber: String,
	address: String,
	licenseNumber: String,
	bloodGroup: String
});


var driverVehicleAssignmentSchema = new mongoose.Schema({
  uid:String,
  name:String,
  registrationNumber:String,
  email:String

});

var profileSchema= new mongoose.Schema({
  uid:String,
  mobile:String,
  gender:String,
  name:String,
  CompnayName:String,
  address:String,
  foundingDate:Date
});

var routeSchema= new mongoose.Schema({
  uid:String,
  registrationNumber: String,
  source: String,
  destination:String,
  waypoints: [String]
})


var vehicle= mongoose.model("vehicle",vehicleSchema);
var driver= mongoose.model("driver",driverSchema);
var assign=mongoose.model("assign",driverVehicleAssignmentSchema);
var profile=mongoose.model("profile",profileSchema);
var routes=mongoose.model("routes",routeSchema);


app.use(cookieParser());
app.use(session({
  secret:'valarMorghulis'
}));

// A function to create a hash using the password enter
// by the user and the entered email id

var getHash = ( pass , email ) => {
        
        var hmac = crypto.createHmac('sha512', email);
        
        //passing the data to be hashed
        data = hmac.update(pass);
        //Creating the hmac in the required format
        gen_hmac= data.digest('hex');
        //Printing the output on the console
        console.log("hmac : " + gen_hmac);
        return gen_hmac;
}

// Sign-up function starts here. . .
app.post('/signup' ,function(req,res){
 sess=req.session;
 if(!sess.email){

  //creating an object that will store the user infoamtion
  var email= req.body.email.toString();
  var pass = req.body.password;
  var phone = req.body.phone;
  var password = getHash( pass , email );         

  
  var data = {
    "email":email,
    "password": password, 
    "phone" : phone
  }
  
  mongo.connect(new_db , function(error , db){
    if (error){
      throw error;
    }
    console.log("connected to database successfully");
    // console.log(res.se)
    //CREATING A COLLECTION IN MONGODB USING NODE.JS
    db.collection("transporter").insertOne(data, (err , collection) => {
      if(err) throw err;
      console.log("Record inserted successfully");
    });
  });
  sess.email=req.body.email;
  console.log("DATA is " + JSON.stringify(data) );
  // db.close();


 res.render('pages/profile_completion'); 
}
else{

    res.redirect('/');

}
});

//This will allow the user to fill in profile details after the 
// sign up page

app.post('/fillProfile',function(req,res){
  sess=req.session;
  if(sess.email){
    var newData= new profile(req.body);
    newData.uid=sess.email;
    newData.mobile=req.mobile;
    newData.save()
       .then(item =>{
        //res.send("item saved to database");
        return res.redirect('/');
        //console.log('item saved');
      })
      .catch(err=> {
        res.status(400).send("unable to save to database")
      });


  }
  else
  {
    res.redirect('/login');
  }
})

//Save the route set for each individual vehicle

app.post('/registerRoute',function(req,res){
  sess.req.session;
  if(sess.email){
    console.log("route details rea "+req.body);
    var newData= new routes(req.body);
    newData.uid=sess.email;
    newData.save()
      .then(item=>{
        return res.redirect('/');
      })
      .catch(err=> {
        res.status(400).send("unable to save to database")
      });
  }
  else{
    res.redirect('/login');
  }
})


app.get("/remove", function(req, res){
  sess = req.session;
  var rn = req.query.id;
  if(sess.email){
    mongo.connect(new_db,function(err, db){
      if(err){throw err};
      console.log(rn);
      db.collection("vehicles").deleteOne({uid:sess.email,registrationNumber: rn},function(err, obj){
        if(err){throw err};
        console.log(obj.result.n+"documents deleted");
      });
      db.close();
    });
    res.redirect('/viewVehicles');
  }
});


//post statement to add vehicles to a database

app.post('/addvehicle',function(req,res) {
  ses=req.session;
	var mydata= new vehicle(req.body);
  mydata.uid=ses.email;
	mydata.save()
	.then(item =>{
		//res.send("item saved to database");
		return res.redirect('/');
		//console.log('item saved');
	})
	.catch(err=> {
		res.status(400).send("unable to save to database")
	});
});


app.post('/adddriver',function(req,res){
  ses=req.session;
	var mydata = new driver(req.body);
  mydata.uid=ses.email;
	mydata.save()
	.then(item =>{
	//	return res.redirect('/');
		return res.redirect('/');
	})
})



// index page 
app.get('/', function(req, res) {
	sess=req.session;
	if(sess.email){
		res.render('pages/index');
	}
	else {
		res.redirect('/home');
	}
});


app.post('/log_in',function(req,res){
  var email= req.body.email;
  var pass = req.body.pass;
  sess = req.session;
  var password= getHash(pass,email);
  console.log('vehicle generated hash:'+password);

  mongo.connect(new_db , function(error , db){
    if (error){
      throw error;
    }
    db.collection('transporter').find({email:req.body.email},{password:1,_id:0}).toArray(function(err, result){
      db.close();
      if(err) {throw err
        res.redirect('/login');}
        if(result.length>0){
          console.log(result[0].password);
          if(password == result[0].password){
            //redirect to home and set session
            sess.email=email;
            console.log(sess.email);
            res.redirect('/');
          }
          else{
            console.log('passowrd is incorrect!!')
            res.redirect('/login');
          }
        } else{
            res.redirect('/login');
        }
      
    });
  }); 
});


app.get('/addnew',function(req,res){
	res.render('pages/add_drivers')
});

app.get('/add_vehicles',function(req,res){
  sess=req.session;
  if(sess.email)
    res.render('pages/add_vehicles');
  else
    res.redirect('/');
	
});

app.get('/add_drivers',function(req,res){
  sess=req.session;
  if(sess.email)
    res.render('pages/add_drivers');
  else
    res.redirect('/');
});


app.get('/plan_route',function(req,res){
	res.render('pages/plan_routes')
});

app.get('/signup',function(req,res){
  sess = req.session;
  if(!sess.email)
	 res.render('pages/signup');
  else
    res.redirect("/");
});

app.get('/login',function(req,res){
	sess = req.session;
  if(!sess.email)
   res.render('pages/login');
  else
    res.redirect("/");
});

app.get('/home', function(req,res){
  sess = req.session;
  if(!sess.email)
    res.render('pages/home');
  else
    res.redirect("/");
});

app.get('/logout',function(req,res){
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

function renderResult(res,records, msg){
  res.render('pages/all_vehicles',{message:msg, record:records},
    function(err,result) {
      if(!err) {res.end(result);}
      else {res.send('oops! it seems an error has occured');
      console.log(err);}
    });
}


function renderDriver(res,records,msg){
  res.render('pages/all_drivers',{message:msg,record:records},
    function(err,result) {
      if(!err) {res.end(result);}
      else {res.send('opps! it seems that an error has occured')
        console.log(err);}
    });
}


//function to recieve vehicle and driver data in one object and then render the assign driver page 
// using the datalist element
function renderDriverAssignment(res, record){
  // console.log(record.vehicle);
  console.log(record);
  res.render('pages/assign_driver',{driver: record.driver, vehicle: record.vehicle});
/*    function(err,result){
      if( !err) {res.end(result);}
      else {res.send('oops! it seems an error has occured')
      console.log(err);}
  })*/
};


function renderDriverVehicleAssignment(res, driverData, vehicleData,mail){
  console.log(driverData);
  console.log(vehicleData);
  var uid= mail;
  var driverName= driverData;
  var vehicleRegNo = vehicleData;
  var e; 
  driver.find({uid:mail,name:driverName},{email:1,_id:0},function(err,result){
      if(err){throw err;}
      console.log(result[0]);
      e=result[0].email;  
  
  
  
  
  var data = {
    "uid":uid,
    "name": driverName, 
    "registrationNumber" : vehicleRegNo,
    "email": result[0].email
  };
  console.log(data);
   mongo.connect( new_db, function(error , db){
    if (error){
      throw error;
    }
    console.log("connected to database successfully");
    //CREATING A COLLECTION IN MONGODB USING NODE.JS
    // replace update with insertOne, in case of doubt refer to '/login' post function
    db.collection("driverAssignmentList").insertOne(data, (err , collection) => {
      if(err) throw err;
      console.log("Record inserted successfully");
     // console.log(collection);
    });
    db.close();
  });

 res.redirect('/'); 

});

}


app.get('/viewVehicles',function(req,res){
  sess=req.session;
  if(sess.email){
  vehicle.find({uid:sess.email},function(err,records){
    console.log(records);
    renderResult(res,records,"list of all vehicles registered");
  });

  }
  else{
    res.redirect('/');
  }
});

app.get('/viewDrivers',function(req,res){
  sess=req.session;
  if(sess.email){
    driver.find({uid:sess.email},function(err,records){
      console.log(records);
      renderDriver(res,records,"list of all drivers registered");
    });
  }
  else{
    res.redirect('/');
  }

});



app.get('/assignDrivers',function(req,res){
  sess=req.session;
  if(sess.email){
    driver.find({uid:sess.email},function(err,records1){
     // console.log(records1);
       vehicle.find({uid:sess.email},function(err,records2){
       // console.log(records2);
          var data = {driver: records1, vehicle: records2};
          renderDriverAssignment(res,data);

      });
    });
    
  }else{
    res.redirect('/');
  }
});





function filterVehicleList(res,records,msg){
  console.log('enter the filter function');
  res.render('pages/all_vehicles',{message:msg, record:records},
    function(err,result){
      if(!err) {res.end(result);}
      else {res.send('oops! it seems that an error has occured')
        console.log(err);}
    });

};

app.post('/filterVehicles',function(req,res){
  sess=req.session;
  if(sess.email){
    console.log(req.body.val);
    vehicle.find({uid:sess.email, registrationNumber:req.body.val},function(err,records){
      console.log(records);
      filterVehicleList(res,records,"Searching for registraton number");
    });
  }
  else{
    res.redirect('/');
  }
});





function filterDriverList(res,records,msg){
  console.log('entering the filter function');
  res.render('pages/all_drivers',{message:msg, record:records},
    function(err,result){
      if(!err){res.end(result);}
      else {res.send('oops! it looks like something went wrong')
        console.log(err);}

     })
}



app.post('/filterDrivers',function(req,res){
  sess=req.session;
  if(sess.email){
    console.log(req.body.val);
    driver.find({uid:sess.email, name:req.body.val},function(err,records){
      console.log(records);
      filterDriverList(res,records,"Searching based on driver name");
    });
  }
    else{
      res.redirect('/');
    }
  
});


app.post('/registerVehicleDriver',function(req,res){
  sess=req.session;
  if(sess.email){
    // console.log(req.body.val);
    // console.log(req.body.veh);
    renderDriverVehicleAssignment(res,req.body.val,req.body.veh,sess.email);

  }
  else{
    res.redirect('/');
  }
});





app.listen(6060);
console.log('6060 is the magic port');