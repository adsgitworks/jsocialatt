(function(){
    var clicks = 1
    getFromName('btopts',0).addEventListener('click', function(){
       
            setTimeout(() => getFromClass('children_options',0).onclick = function(){
                id('user_pic').click()
                /*mudando o conteudo da div flutuante*/
                const innerHTML = id('main_container').innerHTML
                const parser = new DOMParser()
                const doc = parser.parseFromString(innerHTML,'text/html')

                id('pic_area').remove()
                id('name_area').style.height = (id('name_area').offsetHeight-80)+'px'
                getFromSelector('#name_area > div:nth-child(3)').remove()
                id('pencil').src = './correct.png'
                id('confirmChanges').remove()
              
                id('nameipt').value = ''
                id('nameipt').setAttribute('autofocus','')
                id('nameipt').removeAttribute('readonly')
                id('nameipt').placeholder = 'Nome ou id do usuario' 
                getFromSelector('#row > span').textContent = 'Adicionar amigo'
                getFromSelector('#name_area > div > span').textContent = 'Digite no campo abaixo'
                
                id('icback').addEventListener('click', function toNormal(){
                    setTimeout(() => {
                       id('user_infos').remove()
                       doc.getElementById('user_infos').style.left = '-100%'
                       /* adicionando os eventos novamente aos respectivos elementos */                
                       id('main_container').appendChild(doc.getElementById('user_infos'))
                       id('pencil').onclick = events[0]
                       getFromSelector('[sobrepor]').onclick = events[1]
                    },500)
                })
              
                /* fim */

                /*Criando o HTML dos usuários encontrados*/
                let searchedContainer = `<div id="searched">
                                            <div id="spcontainer"></div>
                                         </div>`
                
                searchedContainer = (new DOMParser).parseFromString(searchedContainer,'text/html').getElementById('searched')
                id('user_infos').appendChild(searchedContainer)
            },0)
            /* enviando o input para o servidor */
            id('pencil').removeEventListener('click',events[0])
        
            id('pencil').onclick = function(){
                
               function setUsers(){
                    let str = id('nameipt').value
        
                    JsonPostRequest('/searchuser',JSON.stringify( {infos: str} ))
                    .then( resp => {
                        //a resposta é um objeto que contém as informações do(s) usuários encontrado(s)
                        //container do usuário encontrado
                        let container = `<div class="pcontainer">
                                        <div class="user_pic_container">
                                            <img class="user-pic-min"/>
                                        </div>
                                        <span class="searchedname">Nome</span>
                                        <img class="adduser" src="./add-min.png"/>
                                    </div>`
                        
                        //setando caracteristicas dos usuarios encontrados
                        
                        let result = JSON.parse(resp)
                    
                        Object.keys(result).forEach( (e,i) => {
                           
                            let c = (new DOMParser).parseFromString(container,'text/html').getElementsByClassName('pcontainer')[0]
                            id('spcontainer').appendChild(c)
                            getFromClass('searchedname',i).textContent = `${result[e].name}`
                            getFromClass('user-pic-min',i).src = `./${result[e].pic}`
                            getFromClass('adduser',i).addEventListener('click',function(){
                                //code to add user
                                const data = {}
                                data[`${Date.now()}`] = {
                                    to: result[e].id,
                                    from: id('gid').getAttribute('idnumber'),
                                    accepted: false
                                }
                                JsonPostRequest('/adduser',JSON.stringify(data))
                            })
                        })
                        
                    })

                    

                }
                if(id('spcontainer').childNodes.length != 0){
                   id('spcontainer').remove()
                   let spcontainer = document.createElement('div')
                   spcontainer.id="spcontainer"
                   id('searched').appendChild(spcontainer)
                   setUsers()
                }else setUsers()
            } 
    })  
})()