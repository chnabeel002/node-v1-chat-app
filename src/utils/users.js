const users = []


// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room})=>{
    // Clean the Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
     if(!username || !room){
         return{
             error:'Username & Room are required!'
             
         }

     }

     // Check for existing user
     const existingUser = users.find((user)=>{
            return user.room === room && user.username === username  
     })

     // Validate username
     if(existingUser){
         return{
             error:'Username is in use!'
         }
     }

     // Store User
     const user = { id, username, room}
     users.push(user)
     return { user }
}


const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id) 
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

addUser ({
    id:22,
    username:'Nabeel',
    room:'Just'
})

addUser ({
    id:23,
    username:'Waleed',
    room:'Just'
}) 

addUser ({
    id:24,
    username:'Amjad',
    room:'city'
})

const getUser = (id)=>{
    return user = users.find((user) => user.id == id)
   
}
const getUsersInRoom = (room)=>{
        return  users.filter((user)=>room==user.room)
}

//console.log(users)
//console.log(users)
// const res = addUser({
//     id:33,
//     username:'Nabeel',
//     room:'Just'
// })
// console.log(res)


//const removedUser = removeUser(22)
//console.log(removedUser)


// const userGet = getUser(22)

//console.log(userGet)

// const usersInRoom = getUsersInRoom('city')
// console.log(usersInRoom)

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

