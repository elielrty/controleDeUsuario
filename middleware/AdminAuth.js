const jwt = require("jsonwebtoken")
const secret = "elielMarquesCarvalho"

module.exports = function (req, res, next){
    const authToken = req.headers['authorization']

    if(authToken){
        const bearer = authToken.split(' ')
        let token = bearer[1]

        try{
            jwt.verify(token, secret, (err, date) => {
                if(err){
                    res.status(401)
                    res.json({err: "Token invalido"})
                }else{
                    if(date.role == 1){
                        next()
                    }else{
                        res.status(401)
                        res.json({err: "Não tem permição para fazer essa operação"})
                    }
                }
            })             
        }catch(err){
            res.status(401)
            res.json({err: "Token invalido"})
            return  // para não parar a aplicação tem que da um return
        } 

    }else{
        res.status(401)
        res.json({err: "Token invalido"})
    }
}

