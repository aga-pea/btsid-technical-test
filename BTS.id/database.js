import mysql from "mysql2"
var pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"agape_btsid_test"
}).promise()

export async function fetchAllTasks(){
    var result = await pool.query("SELECT task_name, status from tasks")

    return result
}

export async function fetchTasksFromList(id){
    var result = await pool.query("SELECT id, task_name, status from tasks where title_id = ?", [id])

    return result
}

export async function fetchAllLists(){
    var result = await pool.query(`SELECT id, titles from list_names`)
    
    return result
}

export async function checkList(list){
    var checkAvailability = await pool.query(`SELECT * from list_names where titles = ?`, [list])

    return checkAvailability
}

export async function checkListById(id){
    var checkAvailability = await pool.query(`SELECT * from list_names where id = ?`, [id])

    return checkAvailability
}

export async function createList(title){
    var result = await pool.query(`INSERT into list_names(titles) values(?)`, [title])

    return result
}

export async function deleteList(id){
    var result = await pool.query(`DELETE FROM list_names WHERE id = ?`, [id])

    return result
}

export async function deleteAllTaskInList(id){
    var result = await pool.query(`DELETE FROM tasks WHERE title_id = ?`, [id])

    return result
}

export async function deleteTaskInList(taskId, listId){
    var result = await pool.query(`DELETE FROM tasks WHERE id = ? and title_id = ?`, [taskId, listId])

    return result
}
export async function createTaskInList(task, id){
    var result = await pool.query(`INSERT INTO tasks (task_name, status, title_id) VALUES (?, 0, ?)`, [task, id])

    return result
}

export async function updateTaskStatus(taskId, listId, status){
    var result = await pool.query(`UPDATE tasks SET status = ?, title_id = ? WHERE tasks.ID = ?`, [status, listId, taskId])

    return result
}

export async function updateTaskName(taskId, listId, name){
    var result = await pool.query(`UPDATE tasks SET task_name = ?, title_id = ? WHERE tasks.ID = ?`, [name, listId, taskId])

    return result
}

export async function checkTaskInList(taskId, listId){
    var result = await pool.query(`SELECT * from tasks where id = ? and title_id = ?`, [taskId, listId])

    return result
}