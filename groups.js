let dmselect = document.getElementById('dmselect')
let grpselect = document.getElementById('grpselect')
let dmSelected = true
let currentchatgroup = null

grpselect.addEventListener('click', async () => {
    if(dmSelected){
        groupsdiv.style.display = 'block' 
        chatsdiv.style.display = 'none'
        grpselect.style.borderBottom = "4px solid white"
        dmselect.style.borderBottom = "none"
        dmSelected = false   
    }
})

dmselect.addEventListener('click', async () => {
    if (!(dmSelected)){
        groupsdiv.style.display = 'none' 
        chatsdiv.style.display = 'block'
        dmselect.style.borderBottom = "4px solid white"
        grpselect.style.borderBottom = "none"
        dmSelected = true
    }
})

let grpmsgtext = document.getElementById('grpmsgtext')
let grpsender = document.getElementById('grpsender')

grpmsgtext.style.display = 'none'
grpsender.style.display = 'none'

let nullOrNot = (string) => {
    if(string == null || string == "null"){
        return ''
    }
    else{
        return string
    }
}

let idtoimg = {}
let lastmsger = null
let lastmsgdate = null

let groupselecter = (grpchat) => {
    msgtext.style.display = 'none'
    sender.style.display = 'none'
    grpmsgtext.style.display = ''
    grpsender.style.display = ''
    currentchat = null
    let media2 = window.matchMedia('(min-width: 900px)')
    if(media2.matches){
        chatinfo.style.display = 'flex'
        chatinfo.style.width = '270px'
        msgarea1.style.width = 'calc(98% - 270px)'
    }
    if(mediaQuery.matches){
        chatsouter.style.transform = 'translateX(-300px)'
        infodiv.style.display = 'none'
        opened = false
    }
    if( currentchatgroup != null && currentchatgroup[0] == grpchat[0]){
        return
    }
    currentchat = null
    currentchatgroup = grpchat
    msgarea.innerHTML = ''
    lastmsger = null
    lastmsgdate = null

    fetch('/getGroupMessages', {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        }, 
        'body': JSON.stringify({
            'grpid': grpchat[0]
        })
    }).then(messages => messages.json())
    .then(msgjson => {
        chatinfo.innerHTML = ``
        chatinfo.style.display = 'flex'
        chatinfo.style.width = '270px'
        msgarea1.style.width = 'calc(98% - 270px)'
        for(let i= 0; i<msgjson.members.length; i++){
            chatinfo.innerHTML += `<div class="grpmembers">
                <img src="${picornot(msgjson.members[i].profilepic)}" class = "profilePicture-G" />
                <div class="nameAndStatus">
                <span class="membername">${msgjson.members[i].uname}</span>
                <span class="memberstatus">${nullOrNot(msgjson.members[i].aboutme)}</span>
                </div>
            </div>`
            idtoimg[msgjson.members[i].uid] = msgjson.members[i].profilepic
        }
        for(let i= 0; i<msgjson.messages.length; i++){
            timedate = new Date(msgjson.messages[i].timing)
            let showdate = `${timedate.getFullYear()}/${timedate.getMonth() + 1}/${timedate.getDate()}`;
            let today = new Date()
            if(timedate - today < 24*3600*1000 && timedate.getDate() == today.getDate()){
                showdate = 'Today'
            }
            if(msgjson.messages[i].uid == user.userid){
                if(timedate - lastmsgdate < 24*3600*1000 && timedate.getDate() == lastmsgdate.getDate()){
                    if( lastmsger && lastmsger == msgjson.messages[i].uid){
                        lastmsgdate = timedate
                        msgarea.innerHTML += `<div class ="sentmsg-g"><div class="msgcont">${msgjson.messages[i].cont} </div><span class="msgtiming">${lastmsgdate.getHours()}:${lastmsgdate.getMinutes()}</span></div>`
                    }
                    else{
                        lastmsgdate = timedate
                        msgarea.innerHTML += `<div style="margin-top:10px;" class ="sentmsg-g"><div class="msgcont">${msgjson.messages[i].cont}</div> <span class="msgtiming"><span>${lastmsgdate.getHours()}:${lastmsgdate.getMinutes()}</span></div>`
                        lastmsger = msgjson.messages[i].uid
                    }
                }
                else{
                    lastmsgdate = timedate
                    msgarea.innerHTML += `<div class="daychange">${showdate}</div>`
                    msgarea.innerHTML += `<div class ="sentmsg-g"><div class="msgcont">${msgjson.messages[i].cont}</div> <span class="msgtiming"><span>${lastmsgdate.getHours()}:${lastmsgdate.getMinutes()}</span></div>`
                    lastmsger = msgjson.messages[i].uid
                }
            }
            else{
                if(timedate - lastmsgdate < 24*3600*1000 && timedate.getDate() == lastmsgdate.getDate()){
                    if( lastmsger && lastmsger == msgjson.messages[i].uid){
                        lastmsgdate = timedate
                        msgarea.innerHTML += `<div class ="receivedmsg-g"><div class="msgcont">${msgjson.messages[i].cont} </div><span class="msgtiming"><span>${lastmsgdate.getHours()}:${lastmsgdate.getMinutes()}</span></div>`
                    }
                    else{
                        lastmsgdate = timedate
                        msgarea.innerHTML += `<div class ="grpnamepic"><img class="profilePicture-G2" src="${picornot(idtoimg[msgjson.messages[i].uid])}"/><span>${msgjson.messages[i].uname}</span></div>
                        <div class ="receivedmsg-g"><div class="msgcont">${msgjson.messages[i].cont}</div> <span class="msgtiming"><span>${lastmsgdate.getHours()}:${lastmsgdate.getMinutes()}</span></div>`
                        lastmsger = msgjson.messages[i].uid
                    }
                }
                else{
                    lastmsgdate = timedate
                    msgarea.innerHTML += `<div class="daychange">${showdate}</div>`
                    msgarea.innerHTML += `<div class ="grpnamepic"><img class="profilePicture-G2" src="${picornot(idtoimg[msgjson.messages[i].uid])}"/><span>${msgjson.messages[i].uname}</span></div>
                    <div class ="receivedmsg-g"><div class="msgcont">${msgjson.messages[i].cont}</div> <span class="msgtiming"><span>${lastmsgdate.getHours()}:${lastmsgdate.getMinutes()}</span></div>`
                    lastmsger = msgjson.messages[i].uid
                }
            }
            
        }
        msgarea.scrollTop = 10000
    })
    let divarr = document.querySelectorAll('.groupchatname')
    for(let i=0; i<divarr.length; i++){
        if (divarr[i].textContent == grpchat[1]){
            divarr[i].parentElement.style.background = 'rgba(0,0,0,0.3)'
            continue
        }
        divarr[i].parentElement.style.background = 'rgba(0,0,0,0)'
    }
    let divarr1 = document.querySelectorAll('.chatname')
    for(let i=0; i<divarr1.length; i++){
        if(divarr1[i].textContent == user.name){
            return
        }
        divarr1[i].parentElement.style.background = 'rgba(0,0,0,0)'
    }
}

grpmsgtext.addEventListener('keypress', (event) => {
    if(event.key == 'Enter'){
        SendGroupMessage()
    }
})
grpsender.addEventListener('click', () => {
    SendGroupMessage()
})

const SendGroupMessage = () => {
    if(grpmsgtext.value.replace(" ", '') != '' && grpmsgtext.value.replace("  ", '') != '' && currentchatgroup != null){
        socket.emit('newgrpmsg', {
            'msgcont': grpmsgtext.value,
            'roomid': currentchatgroup[2],
            'grpid': currentchatgroup[0]
        })
        currDate = new Date()
        
        if (lastmsgdate == null || currDate - lastmsgdate > 24*3600*1000 || currDate.getDate() != lastmsgdate.getDate()){
            msgarea.innerHTML += `<div class="daychange">Today</div>`
        }
        if(lastmsger == user.userid){
            msgarea.insertAdjacentHTML('beforeend', `
            <div class="sentmsg-g"><div class="msgcont">${grpmsgtext.value} </div> <span class="msgtiming">${currDate.getHours()}:${currDate.getMinutes()}</span></div>
            `)
        }
        else{
            msgarea.insertAdjacentHTML('beforeend', `
            <div style="margin-top: 10px;" class="sentmsg-g"><div class="msgcont">${grpmsgtext.value} </div> <span class="msgtiming">${currDate.getHours()}:${currDate.getMinutes()}</span></div>
            `)
        }
        lastmsger = user.userid
        msgarea.scrollTop = 10000
        grpmsgtext.value = ''
    }
}

socket.on('recgrpmsg', (cont) => {
    currDate = new Date()
    if (lastmsgdate == null || currDate - lastmsgdate > 24*3600*1000 || currDate.getDate() != lastmsgdate.getDate()){
        msgarea.innerHTML += `<div class="daychange">Today</div>`
    }
    if(lastmsger == cont.sender.userid){
        msgarea.insertAdjacentHTML('beforeend', `
        <div class="receivedmsg-g"><div class="msgcont">${cont.msgcont} </div> <span class="msgtiming">${currDate.getHours()}:${currDate.getMinutes()}</span></div>
        `)
    }
    else{
        msgarea.insertAdjacentHTML('beforeend', `
        <div class ="grpnamepic"><img class="profilePicture-G2" src="${picornot(idtoimg[cont.sender.userid])}"/><span>${cont.sender.name}</span></div>
        <div class="receivedmsg-g"><div class="msgcont">${cont.msgcont} </div> <span class="msgtiming">${currDate.getHours()}:${currDate.getMinutes()}</span></div>
        `)
        lastmsger = cont.sender.userid
    }
    console.log(cont.msgcont)
    msgarea.scrollTop = 10000
})