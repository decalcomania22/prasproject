const express=require('express');
const path=require('path');
const fs=require('fs');
const mongodb=require('mongodb');
const db=require('./data/database');

const app=express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
 

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));




app.get('/login',function(req,res){
    const pathtologinpage=path.join(__dirname,'views','login.html');

    res.sendFile(pathtologinpage);
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
    console.log(testpin);
    console.log(sym);
    
    const testdata=await db.getDb().collection('labtest').find({$and:[{pincode:testpin},{symptom:sym}]}).project({name:1,price:1,_id:0}).toArray();
    res.render('labtestgrid',{test:testdata}); 
     
    });

app.get('/medicines',function(req,res){
    const pathtomedpage=path.join(__dirname,'views','medicine.html');

    res.sendFile(pathtomedpage);
});

app.post('/searchmeds',async function(req,res){
const prod=req.body.productname;
console.log(prod);

const meddata=await db.getDb().collection('meds').find({$or:[{type:prod},{brandname:prod},{name:prod}]}).project({name:1,price:1,image:1,_id:0}).toArray();
res.render('productsgrid',{med:meddata}); 

});


db.connectToDatabase().then(function (){
app.listen(3000);
}); 