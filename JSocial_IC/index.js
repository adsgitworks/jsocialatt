const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const search = require('./searchMethods')
const loops = require('./serverLoops')
const path = require('path')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const server = require('http').createServer(app)
const io = require('socket.io')(server)

//configurando o disk Storage
var storage;

function setStorage(dir){
    return multer.diskStorage({
        filename: function(req, file, callback){
            callback(null,`${Date.now()}_${file.originalname}`)
        },
        destination: function(req, file, callback){
            callback(null,dir)
        }
    })
}
//servindo todos os usuários
function serveAllUsers(){
    if(search.findFolder('./backend/users/user_0')){
        let id = 0
        var dir;
        search.getCurrentID('backend/database/data.txt').then(currentid => {
            while(id < currentid){
                dir = `./backend/users/user_${id}/uploads`
                app.use('/',express.static(dir))
                console.log(dir)
                id ++
            }
        })
    }
}
serveAllUsers()
//configurando dependencias da app
app.use(express.static(path.join(__dirname,'frontend/chat_page/assets')))
app.use('/send',bodyParser.urlencoded( {extended: true} ))
app.use('/verifying', bodyParser.urlencoded( {extended: true} ))
app.use('/getname',bodyParser.json( {extended: true} ))
app.use('/searchuser',bodyParser.json( {extended: true} ))
app.use('/adduser',bodyParser.json( {extended: true} ))
//setando as views como html
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
//pagina de login
app.get('/', (req,res) => {
    res.render(path.join(__dirname+'/frontend/login_page/public/index.html'))
})
//página de registro
app.get('/register', (req,res) => {
    res.render(path.join(__dirname,'frontend/login_page/public/register.html'))
})
//tratando requisição de login
app.post('/verifying', (req,res) => {
    let user = req.body.user
    let pass = req.body.pass
   
    search.readFile('backend/database/db.json')
          .then( response => {
              if(response){
                let parse = JSON.parse(response)
                let cf = search.correctInfos(parse,user,pass)
                let exists = cf[0]

                if(exists){
                    let id = cf[1]
                    var token = jwt.sign({id: id},'supersecret', {expiresIn: 36000})
                    res.send(token)
                }
            }
        })
})

app.get('/main',  (req,res,next) => {
    var token = req.query.token
    jwt.verify(token,'supersecret',async (error,decoded) => {
        if(!error){
            
                  let id = decoded.id.split('_')[1]
                  //setting user storage
                  storage = setStorage(`./backend/users/user_${id}/uploads`)
                  if(search.findFolder(`./backend/users/user_${id}`)){
                     //verificando se existe imagem e setando-a
                     var item = await search.readdir(`./backend/users/user_${id}/uploads`)
                     var datauser = await search.readFile(`./backend/users/user_${id}/infos.json`)
                     //enviando o HTML para o usuário
                     res.render('chatpage.ejs',{userid: id, username: (datauser ? JSON.parse(datauser).name : 'indefinido'), userpic: (item ? `./${item}` : './unknowuser.png')})                
                  }
            }
        } )
    
})

app.post('/getname', (req,res) => {

    var token = req.body.token
    let userid = jwt.verify(token,'supersecret', (err,decoded) => {
        return decoded.id.split('_')[1]
    })
    search.writeInFile(`./backend/users/user_${userid}/infos.json`,`{"name":"${req.body.name}"}`)
})

//tratando requisição de registro
app.post('/send', (req,res) => {

    let email = req.body.Email
    let user = req.body.Usuario
    let pass = req.body.Senha
    
    search.getCurrentID('backend/database/data.txt')
    .then(currentid => {
        
        search.mkdir(`./backend/users/user_${currentid}`)
        search.mkdir(`./backend/users/user_${currentid}/uploads`)
        //servindo usuario novo
        app.use('/',express.static(`./backend/users/user_${currentid}/uploads`))
        search.writeInFile(`./backend/users/user_${currentid}/infos.json`,'')
        search.writeInFile(`./backend/users/user_${currentid}/solicitacoes.json`,'')

        search.exists('backend/database/data.txt',email,user)
        .then(exist => {
            if(!exist){
                let infos = `${(currentid ? ',' : '')}"id_${currentid}": {
                    "email":"${email}",
                    "usuario":"${user}",
                    "senha":"${pass}"
                }`
                search.appendInFile('backend/database/data.txt','\n'+infos)
                search.readFile('backend/database/data.txt','json')
                  .then( response => {
                      search.writeInFile('backend/database/db.json',response)
                  })
                res.send('1')
            }else res.send('0')
        })
    })
})
//configurando rota de upload de imagens
app.post('/upload', (req,res) => {
    upload = multer({ storage }).single('fileupload')
    upload( req,res,err => {
    if(err) res.end('error founded')
        res.end('uploaded')
    })
})

//configurando rota de pesquisa de usuário
async function getAllUsers(){
    let users = {}
    var currentid = await search.getCurrentID('./backend/database/data.txt')
    let initial = 0
    while(initial < currentid){
        let piclink = await search.readdir(`./backend/users/user_${initial}/uploads`)
        piclink = (piclink ? piclink : 'unknowuser.png')
        users[`user_${initial}`] = {name: require(`./backend/users/user_${initial}/infos.json`).name, id: initial,piclink}
        initial ++
    }
    return users
}

//rota para procurar usuários

app.post('/searchuser', async (req,res) => {
   //verificando se o usuário com tal ID ou nome está em nossa DB
    getAllUsers().then(users => {
     if(isNaN(req.body.infos)) res.send(search.searchUser('name',users,req.body.infos))
     else res.send(search.searchUser('id',users,req.body.infos))
    })
})

//rota para adicionar usuários

app.post('/adduser', async(req,res) => {
    search.readFile(`./backend/users/user_${req.body[Object.keys(req.body)[0]].to}/solicitacoes.json`)
    .then(data => {
        if(data){
            search.writeInFile(`./backend/users/user_${req.body[Object.keys(req.body)[0]].to}/solicitacoes.json`,JSON.stringify({...JSON.parse(data), ...req.body }))
        }else{
            search.writeInFile(`./backend/users/user_${req.body[Object.keys(req.body)[0]].to}/solicitacoes.json`, JSON.stringify({...req.body}))
        }
    })

})


        

/*
io.on('connection', socket => {
    console.log(`socket id conectado: ${socket.id}`)
}) 
*/
server.listen(3000, () => console.log('executando server...'))