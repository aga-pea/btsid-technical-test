import jawt from "jsonwebtoken"

export function verifyUser(req,res,next){
    var userCheck = true
    var adminCheck = true
    var finalError
    const bearer = req.headers.authorization.split(" ");
    jawt.verify(bearer[1],'secret', (err,data) => {
        if(err){
            userCheck = false
            finalError = err
        }
    })

    jawt.verify(bearer[1],'secret-admin', (err,data) => {
        if(err){
            adminCheck = false
            finalError = err
        }
    })

    if(userCheck || adminCheck){
        next()
    } else {
        res.json(finalError)
        return
    }
}

export function verifyAdmin(req,res,next){
    const bearer = req.headers.authorization.split(" ");
    jawt.verify(bearer[1],'secret-admin', (err,data) => {
        if(err){
            console.log(err.message);
            res.json(err);
            return
        }
        next()
    })
}
