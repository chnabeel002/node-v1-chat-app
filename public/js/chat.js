const socket = io()

// Elements
const $messageForm = document.querySelector('#myForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector('#location-template').innerHTML
const $sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

// server (emit) -> client (recieve) --acknowlodgement--> server
// client (emit) -> server (recieved) --acknowledgement--> client

// Options
const {username,room}   = Qs.parse(location.search, {ignoreQueryPrefix:true})

const autoScroll = ()=>{
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the New message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin  = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $messages.offsetHeight + newMessageMargin

    // Visible Height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

   
}

// Recieve Message
socket.on('message',(message)=>{
        console.log(message)
        const html = Mustache.render($messageTemplate,{
            username:message.username,
            message:message.text,
            createdAt: moment(message.createdAt).format('h:mm:ss a') 
        })
        $messages.insertAdjacentHTML('beforeend',html)
        autoScroll()
})

// Recieve Location
socket.on('locationMessage',(locationUrl)=>{
    console.log(locationUrl)
    const html = Mustache.render($locationTemplate,{
        username:locationUrl.username,
        locationUrl:locationUrl.url,
        createdAt:moment(locationUrl.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('roomData',({room,users }) =>{
    const html = Mustache.render($sideBarTemplate,{
        room:room,
        users:users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener("submit", (e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    //disable

    var nameValue = e.target.elements.messageString.value

    socket.emit('sendmessage',nameValue,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        //enable 

        if(error){
           return console.log(error)
      }
      console.log('Message Delivered!')
    })

});

$sendLocationButton.addEventListener('click',(e)=>{
    if(!navigator.geolocation){
            return alert('Geolocation is not supported by your browser.')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
       console.log(position)
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})

// socket.on('countUpdated',(count)=>{
//     console.log('The count has been updated!',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked')
//     socket.emit('increment')
// })

