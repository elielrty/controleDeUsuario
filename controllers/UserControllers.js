const UserModel = require("../models/UserModel");
const TokenPass = require("../models/PasswordTokenModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "elielNodeJs@gmail.com",
        pass: "mamute123"
    },
    tls: {
        rejectUnauthorized: false
    }
});
const secret = "elielMarquesCarvalho";

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
                    res.json({ err: "A senha é invalida" })
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
        res.json({err: "Tudo OK!"})
    }

    async update(req, res){ // editando usuario
        const { id, name, role, email } = req.body
        const result = await UserModel.update(id, name, email, role)

        if(result){
            if(result.status){
                res.status(200)
                res.json({sucess: "Tudo OK!"})
            }else{
                res.status(406)
                res.json({err: result.err})
            }
        }else{
            res.status(406)
            res.json({err: "ocorreu um erro no servidor"})
        }
    }

    async delete(req, res){ // deletando usuario
        const id = req.params.id

        const result = await UserModel.delete(id)

        if(result.status){
            res.status(200)
            res.json({sucess:"Tudo ok"})
        }else{
            res.status(406)
            res.json({err: result.err})
        }
    }

    async recoverPass(req, res){ // gerando token para recuperação
        let email = req.body.email
        let idToken = await UserModel.findByEmail(email)
        let result = await TokenPass.create(idToken.id_users)
        if(result.status){
           const emailSend = await smtpTransport.sendMail({
                from: "Eliel Carvalho <elielNodeJs@gmail.com>",
                to: "elielrty@gmail.com",
                subject: "Teste de envio de email",
                text: "Teste de enviou bla bla bla bla",
                html: "Clique aqui para mudar a senha <a href='google.com'>Aqui</a>"
            });
            if(emailSend != undefined){
                res.status(200)
                res.json({Sucess: "Email enviado Com sucesso"})
            }
            
        }else{
            res.status(406)
            res.json({err: result.err})
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
            res.json({sucess: "Senha alterada"})
            return
            }else{
                res.status(406)
                res.json({err: "erro ao salvar senha"})
                return
            }
        }else{
            res.status(406)
            res.json({err: "token invalido"})
            return
        }
    }

    async login(req, res){// entrando no sistema
        const {email, password} = req.body

        const user = await UserModel.findByEmail(email)

        if(user){
            const result = await bcrypt.compare(password, user.password_users)// Comparando a senha passando com a do banco
            if(result){
                    jwt.sign({email: user.email_users, role: user.role_users}, secret, {expiresIn: '24h'}, (err, token) =>{
                    if(err){
                        res.status(400)
                        res.json({err: "Erro interno"})
                    }else{
                        res.status(200)
                        res.json({token: token})
                    }
                })
               
            }else{
                res.status(404)
                res.json({err: "senha invalida"})
            }
        }else{
            res.status(404)
            res.json({err: "Email invalido"})
        }
    }

}

module.exports = new UserControler()