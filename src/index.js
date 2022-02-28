const express = require('express');
const Task = require('./Model/task');
const app = express();
app.use(express.json())
const crypto = require('crypto');
//express() is already a inbuild object kind of thing which will give us the express app which
//app variable will be holding 

app.get('/',(req,res)=> {
    res.send('When you hit from postMan like http://localhost:9000 i will return');
})

app.listen(9000,()=> console.log('Listening on port 9000'))
//try hitting this from postMan


// We are creating a task manager Project so we need 

//1.Get Call to get the task with id 
//2.Post Call to create a task
//3.Put call to update a task
//4.delete call to delete a task 

global.tasks = []; // instead of Db we use this

//1.Get Call to get the task with id 
app.get('/api/v1/tasks',(req,res)=>{
    // res.send(tasks);// we can use send to send anything , we can send any type of data but
    res.json({tasks}); // we will use json which is easy and user friendly
})

//2.Post Call to create a task
app.post('/api/v1/tasks',(req,res)=>{
    //end point with the same url can be same because req methods are different 
    //lets create a another folder called model under src and inside that Task class and define
    //how the task should be and export that class 
    //to create a id lets use one more module called crypto :) which give unique id with random Bytes
    //you can specify the bytes as 16 and convert it to hexa with both numbers and strings
    const id = crypto.randomBytes(16).toString('hex');
    // const task = new Task(id,'New task');// here we are hardcoding title but lets say 
    // i should creata a task with the name provided by the server here it is 
    const task = new Task(id,req.body.title)
    global.tasks = [task,...global.tasks] // with all the tasks already available in global append our new one in the begining
    res.status(201).json({task});// for every request we should return something 
}) // hit http://localhost:9000/api/v1/tasks from postman
//hit http://localhost:9000/api/v1/tasks from postman but if you want include some payload 
//to to body and select raw and come back to headers and configure Content-Type : application/json
//so this will hold my name as json ( key value pair ) and come back to body and send json 
//like {"title":"Task 1"}
//it you execute till here it will throw error title of undefined , this is because to access
// the payload or body we should configure something called "MiddleWare" , in order to accept the 
//json request only app.use(express.json())




//Lets congigure Get call more dynamically :) 
//1.Get Call to get the task with id 
//Lets say we send a id from the get call , and we will find if that id exist in our db( for now
//in our global object) 

app.get('/api/v1/tasks/:id',(req,res)=>{
    const taskId = req.params.id;
    const task = global.tasks.find((task)=>task.id === taskId);
    if(!task){
        return res.status(404).json({
            message: `No Task with ${taskId}` // we use aptic symbol to print dynamic value
        })
    }
    res.json({task});
})

//now go to postman , and check the get call by disabling content-type and slect one id 
//and send a req like this http://localhost:9000/api/v1/tasks/3cfe041636c8aaa985a197c49f682552


//3.Put call to update a task

app.put('/api/v1/tasks/:id',(req,res)=>{
    const taskId = req.params.id;
    //find this id 
    const task = global.tasks.find((task)=> task.id === taskId);
    if(!task){
        return res.status(404).json({
            message : `Task with ${taskId} not found`
        })
    }
    //if task exists we have to update the array with the new title
    task.title = req.body.title;
   global.tasks =  global.tasks.map((task)=>{
        if(task.id === taskId){
            task.title = req.body.title;
            return task;
        }
    return task; // return all the other task if does not staisty
    })
    res.json({ task })

})

app.delete('/api/v1/tasks/:id', (req,res)=>{
    const taskId = req.params.id;
    const task = global.tasks.find((task)=>task.id=== taskId)
    if(!task){
        return res.status(404).json({
            message : `Task with ${taskId} not found`
        })
    }
    global.tasks = global.tasks.filter((task)=> task.id !== taskId); // it will return everything except this 
    res.json({
        message:`Task with ${taskId} deleted`
    })
})


