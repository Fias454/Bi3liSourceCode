const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcrypt");
const cors = require("cors");
const session = require("express-session");
const crypto = require("crypto");
const path = require("path");
const port = 5000;
const app = express();
const fs = require("fs");

const folderPath = path.join(__dirname, "./Files/");

fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
        console.error("Error creating folder:", err);
    } else {
        console.log("Folder created successfully!");
    }
});
mongoose.connect("mongodb://localhost:27017/WhateverTheFuckTHisIS")
.then(()=>console.log("Mongodb connected")).catch((err)=>console.error(err));
//
function SecretGen(){
    const firstPart = crypto.randomBytes(64).toString("hex");
    const secondPart = crypto.randomBytes(64).toString("base64");
    return firstPart+secondPart;
}
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POS"],
    credentials: true
}));
app.use(session({
    secret:SecretGen(),
    resave:true,
    saveUninitialized: false,
  
}));
//
const storage = multer.diskStorage({
    filename:(req,file,cb)=>{
        cb(null, Date.now()+path.extname(file.originalname));
    },
    destination:(req,file,cb)=>{
        cb(null, "./Files");
    }
});
const upload = multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        const allowedMimetype = /png|jpeg|jpng/;
        const extname = allowedMimetype.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedMimetype.test(file.mimetype);
        if(mimeType && extname){
            cb(null, true);
        }else{
            cb(null, false);
        }
    }
})
//
const userSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    userName:{
        type:String
    },
    userGmail:{
        type:String
    },
    userPassword:{
        type:String
    }
});
const productSchema = new mongoose.Schema({
    productId:{
        type:String
    },
    productImg:{
        type:String
    },
    productName:{
        type:String
    },
    productDescription:{
        type:String
    },
    productPrice:{
        type:String
    },
    productLocation:{
        type:String
    },
    productType:{
        type:String
    },
    productFacebookLink:{
        type:String
    },
    productInstaLink:{
        type:String
    },
    productWhatsUpLink:{
        type:String
    },
    productCellPhoneNumber:{
        type:String
    },
});
const user = mongoose.model("user", userSchema);
const product = mongoose.model("product", productSchema);
//
app.post("/SignUp", async(req,res)=>{
    const {name,gmail,password} = req.body;
    try{
        const isName = await user.findOne({userName:name});
        if(!isName){
            const isGmail = await user.findOne({userGmail:gmail});
            if(!isGmail){
                    let dynUserNewDoc= `dynUserNewDoc_:${name}`;
                    const hashedPassword = await bcrypt.hash(password, 12);
                    const userId = await bcrypt.hash(name, 5);
                    dynUserNewDoc = new user({
                        userId:userId,
                        userName:name,
                        userGmail:gmail,
                        userPassword:hashedPassword
                    });
                    await dynUserNewDoc.save();
                    req.session.currentUserId = userId;
                    res.json({success:true});
            }else{
                res.json({isGmail:true});
            }
        }else{
            res.json({isName:true});
        }
    }catch(err){
        console.error(err);
    }
});
app.post("/LogIn", async(req,res)=>{
    const {name,gmail,password} = req.body;
    try{
        if(name.length >4 && gmail.length >4 && password.length >4){
            const isName = await user.findOne({userName: name});
            if(isName){
                const isPassword = await bcrypt.compare(password, isName.userPassword);
                if(isPassword){
                    req.session.currentUserId = isName.userId;
                    res.json({success:true});
                }else{
                    res.json({success:false});
                }
            }else{
                res.json({notName: true});
            }
        }else{
            res.json({notValid:true});
        }
    }catch(err){
        console.error(err);
    }
});
app.post("/SubmitProduct", upload.single("imgValue"),async(req,res)=>{
    const {nameValue, descriptionValue,location, price, facebookLink, instaLink, whatsUpLink, number, category} = req.body;
    const imgValue = req.file;
    console.log(nameValue, descriptionValue,location, price, facebookLink, instaLink, whatsUpLink, number, category)
    try{
        console.log("HERE");
        console.log(req.session.currentUserId);
        if(req.session.currentUserId){
            console.log("HEREV2");
                console.log("HEREV3");
                        let productDocName = `productDocName:${nameValue}`;
                        productDocName = new product({
                            productImg: imgValue.path.replace(/\\/, "/"),
                            productName: nameValue,
                            productDescription: descriptionValue,
                            productLocation: location,
                            productPrice: price,
                            productCellPhoneNumber: number,
                            productFacebookLink: facebookLink,
                            productInstaLink: instaLink,
                            productWhatsUpLink: whatsUpLink,
                            productType: category
                        });
                        console.log("OWOWW");
                        await productDocName.save();
                        res.json({sucess:true});
        }
    }catch(err){
        console.error(err);
    }
});
app.get("/NestMain", async(req,res)=>{
    try{
        req.session.currentScroll = 0;
        const content = await product.find().limit(2);
        if(content){
            req.session.currentScroll = 2;
            res.json({success:true, content:content});
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err);
    }
});
app.get("/ScrollForwardMain", async(req,res)=>{
    try{
        if(!req.session.currentScroll){
            req.session.currentScroll = 2;
            const content = await product.find().limit(2);
            if(content){
                console.log(content);
                res.json({success:true, content:content});
            }else{
                res.json({success:false});
            }
        }else{
            req.session.currentScroll+=2;
            const content = await product.find().skip(req.session.currentScroll).limit(2);
            if(content.length<=0){
                res.json({success:false});
            }else{
                res.json({success:true, content:content});
            }
        }
    }catch(err){
        console.error(err);
    }
});
app.get("/ScrollBackward", async(req,res)=>{
    try{
        if(!req.session.currentScroll){
            req.session.currentScroll = 0;
                res.json({success:false});
        }else{
            req.session.currentScroll-=2;
            const content = await product.find().sort({_id: -1}).skip(req.session.currentScroll).limit(2);
            if(content.length<=0){
                res.json({success:false});
            }else{
                res.json({success:true, content:content});
            }
        }
    }catch(err){
        console.error(err);
    }
});
app.post("/Search", async(req,res)=>{
    const {searchValue} = req.body;
    try{
        if(searchValue){
            const isRes = await product.find({productName:{$regex: searchValue}});
            if(isRes.length ===0){
                res.json({success:false});
                
            }else{
                console.log(isRes);
                res.json({success:true, content:isRes});
            }
        }
    }catch(err){
        console.error(err);
    }
});
app.post("/SaveMarker", async(req,res)=>{
    const {productName} = req.body;
    try{
        if(productName.length <= 30){
            const isProduct = await product.findOne({productName: productName});
            if(isProduct){
                req.session.marker = productName;
                res.json({success:true});
            }else{
                res.json({success:false});
            }
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err);
    }
});
app.get("/NestProductPage", async(req,res)=>{
    try{
        const isProduct = await product.findOne({productName:req.session.marker});
        if(isProduct){
            res.json({success:true, content:isProduct});
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err);
    }
});
app.get("/NestRecent", async(req,res)=>{
    try{
        const content = await product.find().limit(10);
        if(content.length >=0){
            res.json({success:true, content: content});
        }else{
            res.json({success:false});
        }
    }catch(err){
        res.json({success:false});
        console.error(err);
    }
});
app.post("/SaveCatMarker", async(req,res)=>{
    const {type} = req.body;
    try{
        if(type!==""){
            const isProduct = await product.findOne({productType: type});
            if(isProduct){
                req.session.productType = type;
                res.json({success:true});
            }else{
                res.json({success:false});
            }
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err);
    }
});
app.get("/NestCategory", async(req,res)=>{
    try{
        if(!req.session.currentScroll){
            req.session.currentScroll = 0;
        }
        if(req.session.productType){
            const content = await product.findOne({productType:req.session.productType}).limit(6);
            if(content){
                req.session.currentScroll = 6;
                res.json({success:true, content:content});
            }else{
                res.json({success:false});
            }
        }
    }catch(err){
        console.error(err);
    }
});
app.get("/CategoryForwards", async(req,res)=>{
    try{
        if(req.session.currentScroll && req.session.productType){
            if(req.session.currentScroll <6){
                req.session.currentScroll=+6;
            }else{
                req.session.currentScroll=0;
            }
            const content = await product.findOne({productType:req.session.productType}).skip(req.session.currentScroll).limit(6);
            if(content){
                res.json({success:true, content: content});
            }else{
                res.json({success:false});
            }
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err)
    }
});
app.get("/CategoryBackWards", async(req,res)=>{
    try{
        if(req.session.currentScroll && req.session.productType){
                if(req.session.currentScroll >6){
                    req.session.currentScroll=-6;
                }else{
                    req.session.currentScroll=0;
                }
                const content = await product.findOne({productType:req.session.productType}).sort({_id:-1}).limit(6);
                if(content){
                    res.json({success:true, content: content});
                }else{
                    res.json({success:false});
                }
            
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err)
    }
});
app.use("/Files/", express.static(path.join(__dirname, "/Files/")));
app.use("/", express.static(path.join(__dirname, "./my_app/build/")));
//
app.listen(port, (err)=>{
    (err)?console.error(err):console.log(`Server up and running at: ${port}`);
});