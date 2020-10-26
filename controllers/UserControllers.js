let UserModel = require("../models/UserModel")
class UserControler {
    async list(req, res) {
        const users = await UserModel.findAll()
        res.status(200)
        res.json(users)
    }

    async findUser(req, res) {
        let id = req.params.id
        let user = await UserModel.findById(id)
        if (user == undefined) {
            res.status(404)
            res.json({ err: "Erro ao pesquisar Usuario" })
        } else {
            res.status(200)
            res.json(user)
        }
    }

    async create(req, res) {
        let { email, name, password } = req.body

        if (email == undefined) {
            res.status(401)
            res.json({ erro: "O email é invalido" })
            return
        } else {
            if (name == undefined) {
                res.status(401)
                res.json({ erro: "O nome é invalido" })
                return
            } else {
                if (password == undefined) {
                    res.status(401)
                    res.json({ erro: "A senha é invalida" })
                    return
                }
            }
        }
        const emailExist = await UserModel.findEmail(email)
        if (emailExist) {
            res.status(406)
            res.json({ err: "E-mail ja cadastrado" })
            return
        }

        await UserModel.NewUser(name, email, password)

        res.status(200)
        res.send('Tudo ok')
    }

    async update(req, res){
        const { id, name, role, email } = req.body
        const result = await UserModel.update(id, name, email, role)

        if(result != undefined){
            if(result.status){
                res.status(200)
                res.send("Tudo OK!")
            }else{
                res.status(406)
                res.send(result.err)
            }
        }else{
            res.status(406)
            res.send("ocorreu um erro no servidor")
        }
    }

}

module.exports = new UserControler()