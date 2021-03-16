//import packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {mongoose}=require('./db/mongose');
const jwt = require('jsonwebtoken');

///////////////
const cors = require('cors');
app.use(cors());
app.options('*', cors());
//we dont need all that we made combination in models in index
const {list,todo,User} = require('./db/models');
const { JsonWebTokenError } = require('jsonwebtoken');
// const { User } = require('./db/models/user.model');
// const {list} = require('./db/models/list.model');
// const {todo} = require('./db/models/todo.model');

//////////////////middleware///////////////////
//load midleware
app.use(bodyParser.json());

// ////////////////////////
// app.use(function(req, res, next) {
//     var oneof = false;
//     if(req.headers.origin) {
//         res.header('Access-Control-Allow-Origin', req.headers.origin);
//         oneof = true;
//     }
//     if(req.headers['access-control-request-method']) {
//         res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
//         oneof = true;
//     }
//     if(req.headers['access-control-request-headers']) {
//         res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
//         oneof = true;
//     }
//     if(oneof) {
//         res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
//     }

//     // intercept OPTIONS method
//     if (oneof && req.method == 'OPTIONS') {
//         res.send(200);
//     }
//     else {
//         next();
//     }
// });



// const {list} = require('./db/models/list.model');
// const {todo} = require('./db/models/todo.model');
//cors headersmiddle aware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS,HEAD');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
    
//     res.header(
//         'Access-Control-Expose-Headers',
//         'x-access-token,x-refresh-token'
//     );


//     next();
// }
// /////////////////////verify refresh token middleware///////////////////////
// app.use();

////////////////////////////////////////////////////
//check wheatehrt the request have jwt token
// let authenticate = (req,res,next)=>{
//     let token = request.header('x-access-token');
//     //verify jwt 
//     JsonWebTokenError.verify(token,User.getJWTSecret(),(err,decoded)=>{
//         if(err){
//             //there an error
//             //invalid jwt .dont authenticate
//             res.status(401).send(err);
//         }else{
//             //continoue
//             req.user_id = decoded.user_id;
//             next();      
//          }
//     })
// }
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
}

let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}


///////////////////////////end middleware//////////////////////////////

 /**ROUTE HANDLERS */

    /** LIST ROUTES*/
    /**Get /lists */
    //purpose get all lists
    app.get('/lists',authenticate ,(req, res) => {
        const searchedField = req.query.title;
        // We want to return an array of all the lists that belong to the authenticated user 
        list.find({
            _userId: req.user_id
        }).sort([['updatedAt', 'ascending']]).then((lists) => {
            res.send(lists);
        }).catch((e) => {
            res.send(e);
        });
    })


//////////////////////////////////تجربه
app.get('/lists/search',authenticate ,(req, res,next) => {
    const searchedField = req.query.title;
    // We want to return an array of all the lists that belong to the authenticated user 
    list.find(
        {title:{$regex:searchedField,$options:'$i'}}
    ).then((data)=>{
        res.send(data)
    })

})
// app.get('/lists/searched',authenticate ,(req, res,next) => {
//     const searchedField = req.query.updatedAt;
//     // We want to return an array of all the lists that belong to the authenticated user 
//     list.find(
//         {updatedAt:{$regex:searchedField,$options:"$i"}}
//     ).then((data)=>{
//         res.send(data)
//     })

// })


/**post /lists */
    //purpose create new lists
app.post('/lists',authenticate,(req,res)=>{
    // res.send("hello");
   //we want creatte a new list and return list document to the user
   //the list info (fields) will pass via the json body
   let title = req.body.title;
    // let date1 =new Date().toJSON().slice(0,10).replace(/-/g,'/');
   let newList = new list({
    title,
     _userId: req.user_id
});
newList.save().then((listDoc)=>{
     res.send(listDoc);
});
})
/**patch /lists */
    //purpose update lists
app.patch('/lists/:id',authenticate,(req,res)=>{
    // res.send("hello");
   //we want update a  specified list with its id
 
   list.findOneAndUpdate({_id:req.params.id,_userId: req.user_id},{
       $set:req.body
   }).then(()=>{
   res.send({message:'updated successfully'});
   });

});
/**delete /lists */
    //purpose delete lists
app.delete('/lists/:id',authenticate,(req,res)=>{
    // res.send("hello");
   //we want dalete a  specified list with its id
   list.findOneAndRemove({_id:req.params.id,_userId: req.user_id}).then((removedListDoc)=>{
       res.send(removedListDoc);
          // delete all the tasks that are in the deleted list
          deleteTodoFromList(removedListDoc._id);
          console.log(hi);
   });

})

app.get('/lists/:listId/todos',authenticate,(req,res)=>{
    //want to return all todos
    todo.find({
        _listId:req.params.listId
    }).sort([['updatedAt', 'ascending']]).then((todos)=>{
        res.send(todos);
    })
})

// app.post('/lists/:listId/todos',authenticate,(req,res)=>{
//     //want to make all todos
//     list.findOne({
//         _id:req.params.listId,
//         _listId:req.params.listId,
//     }).then((user)=>{
//         if(user){
//             return true;
//         }
//         return false
//     }).then((canCreateTodo)=>{
//         if(canCreateTodo){
//             let newTodo = new todo({
//                 title:req.body.title,
//         _listId:req.params.listId,
//             })
//     newTodo.save().then((newTodoDoc)=>{
//         res.send(newTodoDoc);
//     });
// }else{
//     res.sendStatus(404);
// }
// })
// })

///////////////////////

app.post('/lists/:listId/todos', authenticate, (req, res) => {
    // We want to create a new task in a list specified by listId

    list.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can create new tasks
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canCreateTodo) => {
        if (canCreateTodo) {
            let newTodo = new todo({
                title: req.body.title,
                _listId: req.params.listId
            });
            newTodo.save().then((newTodoDoc) => {
                res.send(newTodoDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})


// app.patch('/lists/:listId/todos/:todoId',(req,res)=>{
//     todo.findOneAndUpdate({
//         _id:req.params.todoId,
//         _listId:req.params.listId
//     },{
//         $set:req.body
//     }).then(()=>{ res.send({message:'updated successfully'});
//     })
// })

app.patch('/lists/:listId/todos/:todoId', authenticate, (req, res) => {
    // We want to update an existing task (specified by taskId)

    list.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canUpdateTodos) => {
        if (canUpdateTodos) {
            // the currently authenticated user can update tasks
            todo.findOneAndUpdate({
                _id: req.params.todoId,
                _listId: req.params.listId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
});



/**lists/:listId/todos/:todoId 
 * purpose delete todo
*/
// app.delete('/lists/:listId/todos/:todoId',(req,res)=>{
//     todo.findOneAndRemove({
//         _id:req.params.todoId,
//         _listId:req.params.listId
//     }).then((removedTodoDoc)=>{
//         res.send(removedTodoDoc)
//     })
// })
// app.get('/lists/:listId/todos/:todoId',(req,res)=>{
//     todo.findOne({
//         _id:req.params.todoId,
//         _listId:req.params.listId
//     }).then((todo)=>{
//         res.send(todo)
//     })
// })

/* DELETE /lists/:listId/tasks/:taskId
* Purpose: Delete a task
*/
app.delete('/lists/:listId/todos/:todoId', authenticate, (req, res) => {

   list.findOne({
       _id: req.params.listId,
       _userId: req.user_id
   }).then((list) => {
       if (list) {
           // list object with the specified conditions was found
           // therefore the currently authenticated user can make updates to tasks within this list
           return true;
       }

       // else - the list object is undefined
       return false;
   }).then((canDeleteTodos) => {
       
       if (canDeleteTodos) {
           todo.findOneAndRemove({
               _id: req.params.todoId,
               _listId: req.params.listId
           }).then((removedTodoDoc) => {
               res.send(removedTodoDoc);
           })
       } else {
           res.sendStatus(404);
       }
   });
});




//////////////////////////////////////////////////////////////////
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})


/**
 * POST /users/login
 * Purpose: Login
 */
// app.post('/users/login', (req, res) => {
//     let email = req.body.email;
//     let password = req.body.password;

//     User.findByCredentials(email, password).then((user) => {
//         return user.createSession().then((refreshToken) => {
//             // Session created successfully - refreshToken returned.
//             // now we geneate an access auth token for the user

//             return user.generateAccessAuthToken().then((accessToken) => {
//                 // access auth token generated successfully, now we return an object containing the auth tokens
//                 return { accessToken, refreshToken }
//             });
//         }).then((authTokens) => {
//             // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
//             res
//                 .header('x-refresh-token', authTokens.refreshToken)
//                 .header('x-access-token', authTokens.accessToken)
//                 .send(user);
//         })
//     }).catch((e) => {
//         res.status(400).send(e);
//     });
// })
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})



/* HELPER METHODS */
// let deleteTasksFromList = (_listId) => {
//     Task.deleteMany({
//         _listId
//     }).then(() => {
//         console.log("Tasks from " + _listId + " were deleted!");
//     })
// }

let deleteTodoFromList = (_listId) => {
    todo.deleteMany({
        _listId
    }).then(() => {
        console.log("todo from " + _listId + " were deleted!");
    })
}





app.listen(3000,()=>{
    console.log("server is listening");
})