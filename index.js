var fs = require('fs')
var path = require('path');
const express = require('express');
const myRequests = require('./routers/requests')
let rawdata = fs.readFileSync('manifest.json')
let manifest = JSON.parse(rawdata)

const app = express()
app.use(express.json({ limit: '50mb' }))
const port = manifest.port || 5000
let folderPath = manifest.folderPath


app.use(express.static('public'))
app.use('/css', express.static(__dirname + "/public/css"))
app.use('/js', express.static(__dirname + "/public/js"))
app.set('views', './public/views')
app.set('view engine', 'ejs')

app.get('/jsontree.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules/@lmenezes/json-tree/jsontree.js'))
})
app.get('/jsontree.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules/@lmenezes/json-tree/jsontree.css'))
})
app.get('/favicon',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public/images/favicon.ico'))
})
app.get('', async (req, res) => {
    var files = [];
    getFilesFromPath(folderPath, 'db').forEach(file=>{
        //console.log(folderPath)
        var content = fs.readFileSync(folderPath+"/"+file, 'utf8')
        if(!content.endsWith("\n")){content+="\n"}
        const data = JSON.parse("[" + content.replace(/\<\/?(\w*)\>/gm, ".$1.")
                    .split('\n').slice(0, -1).join(",")
                    + "]");
        //console.log(data)
        files.push({name:file, path:folderPath,content:data})
    })
    //console.log(files)
    res.render("index", { files: files })
    
})
app.use('/request', myRequests);
app.listen(port, () => {
    console.log("Listening to port " + port)

})
function getFilesFromPath(path, extension) {
    let files = fs.readdirSync(path);
    return files.filter(file => file.match(new RegExp(`.*\.(${extension})`, 'ig')));
}


