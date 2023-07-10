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

let groupselecter = (grpchat) => {
    msgtext.style.display = 'none'
    sender.style.display = 'none'
    grpmsgtext.style.display = ''
    grpsender.style.display = ''
    if( currentchatgroup != null && currentchatgroup[0] == grpchat[0]){
        return
    }
    currentchat = null
    currentchatgroup = grpchat
    msgarea.innerHTML = ''
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
        for(let i= 0; i<msgjson.messages.length; i++){
            msgarea.innerHTML += `<div style="color:white">${msgjson.messages[i].uname} : ${msgjson.messages[i].cont} | ${msgjson.messages[i].timing}</div>`
        }
        chatinfo.innerHTML = ``
        chatinfo.style.display = 'flex'
        chatinfo.style.width = '320px'
        msgarea1.style.width = 'calc(98% - 220px)'
        for(let i= 0; i<msgjson.members.length; i++){
            chatinfo.innerHTML += `<div style="color:white">${msgjson.members[i].uname} | ${msgjson.members[i].uid}</div>`
        }
    })
    let divarr = document.querySelectorAll('.groupchatname')
    for(let i=0; i<divarr.length; i++){
        if (divarr[i].textContent == grpchat[1]){
            divarr[i].parentElement.style.background = 'rgba(0,0,0,0.3)'
            continue
        }
        divarr[i].parentElement.style.background = 'rgba(0,0,0,0)'
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
    if(grpmsgtext.value.replace(" ", '') != '' && grpmsgtext.value.replace(" ", '') != '' && currentchatgroup != null){
        socket.emit('newgrpmsg', {
            'msgcont': grpmsgtext.value,
            'roomid': currentchatgroup[2]
        })
        currDate = new Date()
        msgarea.insertAdjacentHTML('beforeend', `
        <div style="color:white">${grpmsgtext.value} | ${currDate.getHours()}:${currDate.getMinutes()}</div>
        `)
    }
}

socket.on('recgrpmsg', (cont) => {
    console.log(cont)
})