import express from "express"
import {
    createList,
    fetchAllLists,
    fetchAllTasks,
    fetchTasksFromList,
    checkList,
    checkListById,
    deleteAllTaskInList,
    deleteList,
    createTaskInList,
    checkTaskInList,
    updateTaskStatus,
    deleteTaskInList,
    updateTaskName
}
from "./database.js"
const app = express();
const PORT = 8080;

app.use( express.json() ) 
app.listen(
    PORT,
    () => console.log(`its'alive on http://localhost:${PORT}`)
)

var incorrectReqBody = {
    status: "400",
    detail: "Incorrect request body"
}

var notFound = {
    status : "404",
    detail : "Not found"
}

var conflict = {
    status : "409",
    detail : "Conflicting content"
}

app.post('/login', (req, res) => {
    var request = req.body
    var username = request.username
    var password = request.password

    const user = {
        id : 1,
        username: 'agape',
        password: 'bts123'
    }
    jawt.sign(user, 'secret', (err,token) => {
        if(err){
            console.log(err)
            res.sendStatus(304)
            return
        }
        const Token = token;
        res.json({
            user: user,
            token: Token
        });
    })
})


app.get('/tasks', async (req,res) => {
    var taskList = await fetchAllTasks()
    var taskNames = taskList[0]
    console.log(taskList)
    res.status(200).send({
        taskNames
    })
    console.log("All task fetched!")
});

app.get('/checklist', async (req,res) => {
    var lists = await fetchAllLists()
    var listNames = lists[0]
    console.log(listNames)
    res.status(200).send({
        listNames
    })
    console.log("All task fetched!")
});

app.post('/checklist', async (req,res) => {
    var request = req.body;
    var list = request.name

    console.log("Creating new list")
    var checkAvailability = await checkList(list)
    if(checkAvailability[0].length != 0){
        res.status(409).send(conflict)
    } else {
        await createList(list)
        res.status(204).send()
        console.log(`List "${list}" created`)
    }
});

app.delete('/checklist/:id', async (req,res) => {
    const { id } = req.params;

    console.log("Deleting list")
    var checkAvailability = await checkListById(id);
    if(checkAvailability[0].length == 0){
        res.status(404).send(notFound)
    } else {
        deleteAllTaskInList(id)
        deleteList(id)
        res.status(204).send()
        console.log(`List "${id}" deleted`)
    }
});

app.get('/checklist/:id/item', async (req,res) => {
    const { id } = req.params;

    var lists = await fetchTasksFromList(id)
    var listNames = lists[0]
    console.log(listNames)
    res.status(200).send({
        listNames
    })
    console.log("All task fetched!")
});

app.post('/checklist/:id/item', async (req,res) => {
    const { id } = req.params;

    var request = req.body;
    var item = request.itemName

    console.log(`"${id}"`)
    console.log("Creating new item")
    var checkAvailability = await checkListById(id);
    if(checkAvailability[0].length == 0){
        res.status(404).send(notFound)
    } else {
        await createTaskInList(item, id)
        res.status(204).send()
    }
});

app.put('/checklist/:id/item/:itemId', async (req,res) => {
    const { id } = req.params;
    const { itemId } = req.params;

    var checkListAvailability = await checkListById(id);
    var checkTaskAvailability = await checkTaskInList(parseInt(itemId), parseInt(id))

    if(checkListAvailability[0].length == 0){
        res.status(404).send(notFound)
    } else {
        if(checkTaskAvailability[0].length == 0){
            res.status(404).send(notFound)
        } else {
            var status = 1
            if(checkTaskAvailability[0][0]['status'] == 1){
                status = 0
            }
            await updateTaskStatus(itemId, id, status)
            res.status(204).send()
        }
    }
});

app.delete('/checklist/:id/item/:itemId', async (req,res) => {
    const { id } = req.params;
    const { itemId } = req.params;

    var checkListAvailability = await checkListById(id);
    var checkTaskAvailability = await checkTaskInList(parseInt(itemId), parseInt(id))

    if(checkListAvailability[0].length == 0){
        res.status(404).send(notFound)
    } else {
        if(checkTaskAvailability[0].length == 0){
            res.status(404).send(notFound)
        } else {
            await deleteTaskInList(itemId, id)
            res.status(204).send()
        }
    }
});

app.put('/checklist/:id/item/rename/:itemId', async (req,res) => {
    const { id } = req.params;
    const { itemId } = req.params;
    
    var request = req.body;
    var item = request.itemName

    var checkListAvailability = await checkListById(id);
    var checkTaskAvailability = await checkTaskInList(parseInt(itemId), parseInt(id))

    if(checkListAvailability[0].length == 0){
        res.status(404).send(notFound)
    } else {
        if(checkTaskAvailability[0].length == 0){
            res.status(404).send(notFound)
        } else {
            await updateTaskName(itemId, id, item)
            res.status(204).send()
        }
    }
});
