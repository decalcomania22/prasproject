const express=require('express');
const path=require('path');
const fs=require('fs');
const mongodb=require('mongodb');
const bcrypt=require('bcryptjs');
// const multer=require('multer');
const db=require('./data/database');
const upload=multer({dest:'presimages'});

const app=express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
 

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));


app.get('/signuppage',function(req,res){
    const pathtosignuppage=path.join(__dirname,'views','signup.html');

    res.sendFile(pathtosignuppage);


});



app.post('/signup',async function(req,res){
const givenemail=req.body.enteredemail;
const givenpassword=req.body.enteredpassword;

const hashedpassword=await bcrypt.hash(givenpassword,12);

const user={
email:givenemail,
password:hashedpassword
};

const userarray=await db.getDb().collection('users').find().project({email:1,_id:0}).toArray();
console.log(userarray);
for(a of userarray){
    if(a.email==givenemail){
        // alert('A user with this emailId already exists.');
       return res.redirect('/signuppage');
    }
}

await db.getDb().collection('users').insertOne(user);
return res.redirect('/login');

});



app.get('/login',function(req,res){
    const pathtologinpage=path.join(__dirname,'views','login.html');

    res.sendFile(pathtologinpage);
});





app.post('/loginform',async function(req,res){

const enteredloginemail=req.body.elogaddress;
const enteredloginpassword=req.body.elogpassword;

const boolvar=await db.getDb().collection('users').findOne({email:enteredloginemail});
if(!boolvar){
    console.log('Could not log in!unkonwn email');
    return res.redirect('/login');
}
const passwordsareequal=await bcrypt.compare(enteredloginpassword,boolvar.password);

if(!passwordsareequal){
    console.log('Could not log in! wrong password');
    return res.redirect('/login');
}
res.redirect('/');

});



app.get('/',function(req,res){
    const pathtoindexpage=path.join(__dirname,'views','index.html');

    res.sendFile(pathtoindexpage);
});

app.post('/search',function(req,res){
    const enteredtext=req.body.navsearch;
    console.log(enteredtext);
    if(enteredtext=='medicines'||enteredtext=='products'){
        const pathtomedpage=path.join(__dirname,'views','medicine.html');

        res.sendFile(pathtomedpage);
    }
    else if(enteredtext=='labtests'){
        const pathtotestpage=path.join(__dirname,'views','labtests1.html');
        res.sendFile(pathtotestpage);
    }
    else if(enteredtext=='doctors'||enteredtext=='appointment'||enteredtext=='doctor'){
        const pathtodoctorpage=path.join(__dirname,'views','doctors.html');
        res.sendFile(pathtodoctorpage);
    }
    
});
  

app.get('/doctorsapp',function(req,res){
    const pathtodocpage=path.join(__dirname,'views','doctors.html');

    res.sendFile(pathtodocpage);
});

app.post('/docgrid',async function(req,res){
    const entereddochos=req.body.hospitals;
    const entereddoccity=req.body.city; 
    console.log(entereddoccity);
    console.log(entereddochos);
const docdata=await db.getDb().collection('doctors').find({$and:[{hospitals:entereddochos},{city:entereddoccity}]}).project({name:1,yearsofexp:1,speciality:1,fee:1,qualification:1,_id:0}).toArray();
res.render('docgrid',{docdata:docdata});  
    });


app.post('/docgrid1',async function(req,res){
    const entereddocspe=req.body.speciality;
    const entereddocpin=req.body.pin; 
const docdata=await db.getDb().collection('doctors').find({$and:[{speciality:entereddocspe},{pincode:entereddocpin}]}).project({name:1,yearsofexp:1,fee:1,qualification:1,speciality:1,_id:0}).toArray();
res.render('docgrid1',{docdata:docdata});  
    });



app.get('/labtests',function(req,res){
    const pathtolabpage=path.join(__dirname,'views','labtests1.html');

    res.sendFile(pathtolabpage);
});

app.post('/labsearch',async function(req,res){
    const testpin=req.body.testplace;
    const sym=req.body.Symtest;
 
    
    const testdata=await db.getDb().collection('labtest').find({$and:[{pincode:testpin},{symptom:sym}]}).project({name:1,price:1,_id:0}).toArray();
    res.render('labtestgrid',{test:testdata}); 
     
    });

app.get('/medicines',function(req,res){
    const pathtomedpage=path.join(__dirname,'views','medicine.html');

    res.sendFile(pathtomedpage);
});

app.post('/searchmeds',async function(req,res){
const prod=req.body.productname;


const meddata=await db.getDb().collection('meds').find({$or:[{type:prod},{brandname:prod},{name:prod}]}).project({name:1,price:1,image:1,_id:0}).toArray();
res.render('productsgrid',{med:meddata}); 

});
// app.get('/uploadfile',function(req,res){
//     const pathtouploadpage=path.join(__dirname,'views','uploadpres.html');

//     res.sendFile(pathtouploadpage);

// });

app.post('/reviewsubmit',async function(req,res){
    const newreview=req.body.review;
    await  db.getDb().collection('reviews').insertOne({experience:newreview});
    res.redirect('/');
});


// app.post('/presupload',upload.single('prescription'),function(req,res){
//     const uploadedimg=req.file;
    

    
// });

db.connectToDatabase().then(function (){
app.listen(3000);
}); 