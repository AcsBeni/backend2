const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
var cors = require('cors');
//middleware
app.use(cors());
app.use(express.json()); //json formátum megkövetelése
app.use(express.urlencoded({ extended: true })); // req.body használata



let users =[]
const USERS_FILE = path.join(__dirname,'users.json');
loadusers();

app.get("/",(req, res) => {
 
  res.send('Bajai SZ Türr István Technikum - 13.a Szoftverfejlesztő' );
});
app.get("/users",(req, res) => {
 
  res.send(users );
});
//http://127.0.0.1:3000/users/1

app.get("/users/:id",(req, res) => {
  let id = req.params.id;
  let idx = users.findIndex(user => user.id == id);
  
  if (idx>-1) {
    return res.send(users[idx]);
  }
  return res.status(400).send("Nincs ilyen id-jű user" );

});
//Rest client hf
//post new user

app.post("/users",(req, res) => {

  let data = req.body;
  if(isEmailValid(data.email)) {
    return res.status(400).send({msg: "Már létező email cím"});
  }
  data.id = getnextid();
  users.push(data);
  saveusers();
  res.send({msg: "Sikeres regisztráció"});
 
});
//Post check user login
app.post("/users/login",(req, res) => {

    let {email, password} = req.body;
    let loggeduser = {};
    users.forEach(user => {
    if(user.email == email && user.password == password) {
        loggeduser = user;
        return;
    }
  })
  res.send(loggeduser);
});

//modify user
app.patch("/users/profile",(req, res) => {
  let data = req.body;
  let idx = users.findIndex(user => user.email == data.email);
  if (idx>-1) {
    users[idx] = data;
    saveusers();
    return res.send(users[idx]);
  }
  

});



//update user by id
app.patch("/users/:id",(req, res) => {
  if(isEmailValid(data.email)) {
    return res.status(400).send({msg: "Már létező email cím"});
  }
  let id = req.params.id;
  let data = req.body;
  let idx = users.findIndex(user => user.id == id);
  if (idx>-1) {
    users[idx] = data;
    users[idx].id = Number(id);
    return res.send('A felhasználó adatai frissítve lettek' );
  }
  return res.status(400).send("Nincs ilyen id-jű user" );
});
/*
git add .
git commit -m "commit lett"
git push -u origin main      
*/


//delete user by id
app.delete("/users/:id",(req, res) => {
  let id = req.params.id;
  let idx = users.findIndex(user => user.id == id);  
  if (idx>-1) {
    users.splice(idx,1);
    saveusers();
    return res.send(users);
  }
})


app.listen(3000)
//other functions
function getnextid() {
  let nextid = 1;
  if(users.length==0) {
    
    return nextid;
  }
  let maxid = 0;
  for (let i=0; i<users.length; i++) {
    if(users[i].id>users[maxid].id) {
      maxid = i;
    }
    
  }
  return users[maxid].id+1;
}

function loadusers() {
  if(fs.existsSync(USERS_FILE)) {
    const raw = fs.readFileSync(USERS_FILE);
    try {
      users = JSON.parse(raw);
    }
    catch(err) {
      console.error(err);
      users = [];
    }
  }
  else {
    saveusers();
  }
}
function saveusers() {
  fs.writeFileSync(USERS_FILE,JSON.stringify(users));
}
function isEmailValid(email) {
  let exist = false;
  users.forEach(user => {
    if(user.email == email) {
      exist = true;
    }
  });
  return exist;
}