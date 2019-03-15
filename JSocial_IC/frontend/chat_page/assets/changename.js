//global var que armazena os eventos dos elementos.

var events = [];

(function(){
    id('pencil').addEventListener('click', events[0] = function(){
        id('icback').setAttribute('freeze',true)

    id('nameipt').removeAttribute('readonly')
    id('nameipt').style.textDecoration = 'underline'
    id('confirmChanges').style.visibility = 'visible'

    id('confirmChanges').onclick = function(){
        //sending request

        let text = id('nameipt').value
        JsonPostRequest('/getname',JSON.stringify( {name: text, token: window.location.toString().split('=')[1]} ))
        
        //changing attributes

        id('icback').removeAttribute('freeze')
        id('nameipt').style.textDecoration = 'none'
        id('nameipt').setAttribute('readonly','readonly')
        id('confirmChanges').style.visibility = 'hidden'
    }
    })
})()

