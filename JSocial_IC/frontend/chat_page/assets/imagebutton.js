
(function onclick(){
    let bt = id('user_pic')

    bt.onclick = function(){

        //changing some properties
        setCssAttribute(id('user_infos'),'display','flex')

        let w = id('painel_user').offsetWidth
    
        
        setCssAttribute(id('user_infos'),'width',`${w}px`)
        //setting animation

        function animating(onleft,onright,d = 1,z = 1){
            //setting initial position
            let elem = id('user_infos')
            let speed = 30
            if(onleft) setCssAttribute(elem,'left',`${-w}px`)
            let initialPos = z*-w;
            //calling animation
            function moving(){
                expression = (onleft ? eval("getPropertie(elem,'offsetLeft') < 0") : eval("getPropertie(elem,'offsetLeft') > -w"))
                if(expression){
                    initialPos += speed*d
                    setCssAttribute(elem,'left',`${initialPos}px`)
                    requestAnimationFrame(moving)
                }else{
                    setCssAttribute(elem,'left',(onleft ? '0px' : -w && setCssAttribute(elem,'display','none')))
                    
                }
            }
            moving()
        }
        animating(true,false,1,1)
        
        //on back arrow click
        let ic = id('icback')

        ic.onclick = function(){
            if(!(ic.hasAttribute('freeze'))) animating(false,true,-1,0)
        }
        //
        window.onresize = function () {
            let w = id('painel_user').offsetWidth
            setCssAttribute(id('user_infos'),'width',`${w}px`)
        }
        
    }
})()