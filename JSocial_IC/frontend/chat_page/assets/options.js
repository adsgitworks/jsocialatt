
(function(){
    const bt_user = getFromName('btopts',0)

    function div_opts(optstr,dad){
        let children = document.createElement('div')
        children.textContent = optstr
        children.className = 'children_options'
        dad.appendChild(children)
    }

    let c = 0

    function deletingThis(){
        id('float_parent').remove()
        c = 0
    }

    bt_user.onclick = function(){

        function animating(){
            let fontsize = 0;
            let speed = 8.25
            function Tamanho(alturaMax, LarguraMax,tmp){
                
                var obj=id('float_parent')
        
                if((obj.offsetHeight<=alturaMax)&&(obj.offsetWidth<=LarguraMax)){
                //setting left position
                obj.style.left = `${obj.offsetLeft - speed}px`
                //
                obj.style.width=((obj.offsetWidth+=10)+"px");
                obj.style.height=((obj.offsetHeight+=10)+"px");
                    if(obj.style.fontSize != '17px'){
                        fontsize += 1
                        obj.style.fontSize = `${fontsize}px`
                    }
                }
                else  clearInterval(tmp);
            }
            tmp= setInterval(() =>Tamanho(200,200,tmp), 5);
        }

        let dad = document.createElement('div')
        dad.id = 'float_parent'

        c ++

        if(c === 1) {
            
            div_opts('Adicionar amigo',dad)
            div_opts('Arquivadas',dad)
            div_opts('Perfil',dad)
            div_opts('configurações',dad)
            div_opts('Sair',dad)

            dad.style.left = `${bt_user.offsetLeft }px`
            dad.style.top = `${bt_user.offsetTop + bt_user.offsetHeight + 5}px`

            document.getElementsByTagName('main')[0].appendChild(dad)

            animating()

        }
        
        if(c > 1) deletingThis()

        doSomething( getArray(document.getElementsByClassName('children_options')),(e) => {
            e.addEventListener('click',deletingThis)
        })
        
    } 
    window.onresize = function () {
        if(id('float_parent')){
            id('float_parent').style.left = `${bt_user.offsetLeft - id('float_parent').offsetWidth + 30}px`
            id('float_parent').style.top = `${bt_user.offsetTop + bt_user.offsetHeight + 5}px`
        }
    }  
})()