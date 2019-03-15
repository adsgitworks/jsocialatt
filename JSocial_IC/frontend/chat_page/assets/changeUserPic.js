(function(){
    const selector = getFromSelector('#pic_area > span')
    selector.addEventListener('click', events[1] = function(){
        let input = id('picChange')
        input.click()
        input.onchange = async e => {
            let file = input.files[0]
            //setting image on client side
            let newobj = URL.createObjectURL(file)
            id('user_pic_zoom').src = newobj
            id('user_pic').src = newobj
            id('initialpic').src = newobj
            //sending request
            let formData = new FormData()
            formData.append(input.name,file)
            let xhr = new XMLHttpRequest()
            xhr.open('POST','/upload',true)
            xhr.send(formData)
        }
    })
})()