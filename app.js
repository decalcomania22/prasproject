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
  

app.get('/doctorsapp',function(req,res){
    const pathtodocpage=path.join(__dirname,'views','doctors.html');

    res.sendFile(pathtodocpage);
});

app.post('/docgrid',async function(req,res){
    const entereddocspe=req.body.specialtiy;
    const entereddocpin=req.body.pin;
    
// const docdata=await db.getDb().collection('doctors').find({speciality:entereddocspe,pincode:entereddocpin},{name:1,yearsofexp:1,fee:1,qualification:1,_id:0}).toArray();
const docdata=await db.getDb().collection('doctors').find({}).toArray();  
for(doc of docdata){
    if(doc.speciality===entereddocspe&&doc.pin===entereddocpin){
        matchingdoc=doc;
    }
}    

res.render('docgrid',{docdata:matchingdoc});  
    });


app.get('/labtests',function(req,res){
    const pathtolabpage=path.join(__dirname,'views','labtests1.html');

    res.sendFile(pathtolabpage);
});

app.post('/labtestsgrid',function(req,res){


    //form reading
    
    
      res.render('labtestgrid');  
    });

app.get('/medicines',function(req,res){
    const pathtomedpage=path.join(__dirname,'views','medicine.html');

    res.sendFile(pathtomedpage);
});

app.post('/medicinesgrid',function(req,res){


//form reading


  res.render('productsgrid');  
});





db.connectToDatabase().then(function (){
app.listen(3000);
}); 