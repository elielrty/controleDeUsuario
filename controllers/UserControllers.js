const UserModel = require("../models/UserModel")
const TokenPass = require("../models/PasswordTokenModel")
const bcrypt = require("bcrypt")

const jwt =  require("jsonwebtoken")

const secret = "elielMarquesCarvalho"

class UserControler {
    async list(req, res) { // listando todos os usuarios
        const users = await UserModel.findAll()
        res.status(200)
        res.json(users)
    }

    async findUser(req, res) { // pesquisando um usuario
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

    async create(req, res) { //cadastrando um usuario
        let { email, name, password } = req.body

        if (!email) {
            res.status(401)
            res.json({ erro: "O email é invalido" })
            return
        } else {
            if (!name) {
                res.status(401)
                res.json({ erro: "O nome é invalido" })
                return
            } else {
                if (!password) {
                    res.status(401)
                    res.json({ erro: "A senha é invalida" })
                    return
                }
            }
        }
        const emailExist = await UserModel.findEmail(email) // verificando se o email existe
        if (emailExist) {
            res.status(406)
            res.json({ err: "E-mail ja cadastrado" })
            return
        }

        await UserModel.NewUser(name, email, password)

        res.status(200)
        res.send('Tudo ok')
    }

    async update(req, res){ // editando usuario
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

    async delete(req, res){ // deletando usuario
        const id = req.params.id

        const result = await UserModel.delete(id)

        if(result.status){
            res.status(200)
            res.send("Tudo ok")
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async recoverPass(req, res){ // gerando token para recuperação
        const email = req.body.email
        const result = await TokenPass.create(email)
        if(result.status){
            res.status(200)
            res.send("" + result.token)
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async changePass(req, res){ // alterando a senha 
        const token = req.body.token
        const password = req.body.password

        const isTokenValid = await TokenPass.validate(token)

        if(isTokenValid.status){
          const result = await UserModel.changePass(password, isTokenValid.token.id_user, isTokenValid.token.token)
          if(result.status){
            res.status(200)
            res.send("Senha alterada")
            return
            }else{
                res.status(406)
                res.send("erro ao salvar senha")
                return
            }
        }else{
            res.status(406)
            res.send("token invalido")
            return
        }
    }

    async login(req, res){
        const {email, password} = req.body

        const user = await UserModel.findByEmail(email)

        if(user){
            const result = await bcrypt.compare(password, user.password_users)// Comparando a senha passando com a do banco
            if(result){

            }else{
                res.status(406)
                res.json({err: "senha invalida"})
            }
        }else{
            
        }
    }

}

module.exports = new UserControler()