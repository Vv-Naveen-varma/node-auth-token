const express = require('express');
const req = require('express/lib/request');
const { json } = require('express/lib/response');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api',(req, res) => {
    res.json({
        message: "/get operation!"
    });
});

// verifyToken is a middleWare function
app.post('/api',verifyToken, (req,res)=>{
    // verify the token added to req in verifyToken mddleware function
    jwt.verify(req.token, 'secretkey', (err, authData)=>{
        // console.log(req);
        if(err){
            json.sendStatus(403);
        }else{
            res.json({
                message:"/post operation with authentication",
                authData
            });
        }
    });
});

app.post('/api/login', (req, res)=>{
    // Mock user
    const user = {
        id: 1,
        username: "Naveen",
        email: "nav@gmail.com"
    };
    
    jwt.sign({user}, 'secretkey', (err, token)=>{
        res.json({
            token
        });
    });
});

// Verify token function
function verifyToken(req, res, next){
    // Get auth header value
    // Structure of token will be
    // authorization: Bearer <access_token>, from this we have to get thte token.
    const bearerHeader = req.headers['authorization']
    // First check if the bearerHeader value is "undefined" or not.
    if(typeof bearerHeader == 'undefined'){
        res.sendStatus(403); // 403 = Forbidden
    }else{
        // To get token from "Bearer <access_token>" format
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // get token from the array bearer
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next Middleware
        next();
    }
}

app.listen(5000, ()=>console.log('Server started on port 5000...'))