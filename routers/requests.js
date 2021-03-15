const express = require('express');
const router = express.Router()
const Datastore = require('nedb');
const fs = require('fs')

router.post('/addquery', (req,res)=>{
    try{
        const query = req.body.query
        const fileName = req.body.fileName
        const filePath = req.body.filePath
        const newDatabase = new Datastore(filePath+"/"+fileName) 
        newDatabase.loadDatabase()
        newDatabase.insert(JSON.parse(query), function(err,doc){
            if(err)
                res.send({status:400, message:"Erro"})
            res.send({status:200, message:"Done."})
        })
        
    }catch(err){
        res.send({status:400,message:err})
    }
})
router.post('/deletequery', (req,res)=>{
    try{
        const query = req.body.query
        const fileName = req.body.fileName
        const filePath = req.body.filePath
        const newDatabase = new Datastore(filePath+"/"+fileName) 
        newDatabase.loadDatabase()
        newDatabase.remove(JSON.parse(query), function(err,doc){
            if(err)
                res.send({status:400, message:"Erro"})
            res.send({status:200, message:"Done."})
        })
        
    }catch(err){
        res.send({status:400,message:err})
    }
})
router.post('/savecollection', (req,res)=>{
    console.log(req.body)
    try{
        const filePath = req.body.filePath
        const fileName = req.body.fileName
        const path = filePath+"/"+fileName
        const newfilecontent = req.body.fileContent
        fs.writeFile(path, newfilecontent,{encoding:'utf-8'}, function(err){
            if(err)
                return res.send({status:400, message:err})
            res.send({status:200, message:"Done."})
        })
       
    }catch(err){
        res.send({status:400,message:err})
    }
})
router.post('/emptycollection', (req,res)=>{
    try{
        const fileName = req.body.fileName
        const filePath = req.body.filePath
        const path = filePath+"/"+fileName
        fs.writeFile(path, "",{encoding:'utf-8'}, function(err){
            if(err)
                return res.send({status:400, message:err})
            res.send({status:200, message:"Done."})
        })
    }catch(err){
        res.send({status:400, message:err})
    }
})
router.post('/deletecollection', (req,res)=>{
    try{
        const fileName = req.body.fileName
        const filePath = req.body.filePath
        const path = filePath+"/"+fileName
        fs.unlink(path,function() {
            res.send({status:200, message:"Done."})
        })
    }catch(err){
        res.send({status:400, message:err})
    }
})
router.post('/addcollection', (req,res)=>{
    try{
        const fileName = req.body.fileName
        const filePath = req.body.filePath
        if(getFilesFromPath(filePath, fileName.replace(/(.+\.)/,"")).includes(fileName)){
            res.send({status:403, message:"There already is a file named like that."})
        }else{
            const newDatabase = new Datastore(filePath+"/"+fileName) 
            newDatabase.loadDatabase()
            res.send({status:200, message:"New collection created successfully"})
        }
    }catch(err){
        res.send({status:400, message:err})
    }
})
function getFilesFromPath(path, extension) {
    let files = fs.readdirSync(path);
    return files.filter(file => file.match(new RegExp(`.*\.(${extension})`, 'ig')));
}

module.exports=router