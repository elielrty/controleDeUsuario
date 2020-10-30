let knex = require("../database/connection")
let bcrypt = require("bcrypt")

class User {
    async findAll() { //listado usuarios cadastrados
        try {
            const result = await knex.select(["id_users", "name_users", "email_users", "role_users"]).table("users") //selecionado os campos que consulta retornar
            return result
        } catch (err) {
            console.log(err)
            return []
        }
    }

    async findById(id) { //listado usuarios cadastrados pelo id
        try {
            const result = await knex.select(["id_users", "name_users", "email_users", "role_users"]).where({ id_users: id }).table("users") //selecionado os campos que consulta retornar
            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }
        } catch (err) {
            console.log(err)
            return undefined
        }
    }

    async findByEmail(email) { //listado usuarios cadastrados pelo id
        try {
            const result = await knex.select(["id_users", "name_users", "email_users", "role_users"]).where({ email_users: email }).table("users") //selecionado os campos que consulta retornar
            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }
        } catch (err) {
            console.log(err)
            return undefined
        }
    }


    async NewUser(name_users, email_users, password_users,) { // cadastrando usuario
        try {

            const hash = await bcrypt.hash(password_users, 10) // criptografado senha

            await knex.insert({ name_users, email_users, password_users: hash, role_users: 0 }).table("users")
        } catch (err) {
            console.log(err)
        }
    }
    async findEmail(email) { // verificando se o email exite no banco
        try {
            const result = await knex.select("*").from("users").where({ email_users: email }) 

            if (result.length > 0) {
                return true
            } else {
                return false
            }
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async update(id, name, email, role) {// editando cadastro
        const user = this.findById(id) // pegando o usuario que vai receber a edição

        if (user) {
            const editUser = {}



            if (name) {// validação
                editUser.name_users = name
            }
            if (email) {
                if (email != user.email_users) {
                    const result = await this.findEmail(email) //verificando se ja existe o email cadastrado
                    if (result == false) {
                        editUser.email_users = email
                    } else {
                        return { status: false, err: "E-mail ja estar cadastrado" }
                    }

                }
            }
            if (role) {// validação
                editUser.role_users = role
            }

            try {
                await knex.update(editUser).where({ id_users: id }).table("users")
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {
            return { status: false, err: "O usuario não existe" }
        }
    }

    async delete(id){
        const user = await this.findById(id)

        if(user){
            try{
                await knex.delete().where({id_users: id}).table("users")
                return {status: true}
            }catch(err){
                return { status: false, err: err  }
            }

        }else{
            return {status: false, err: "Usuario não exite!"}
        }
    }

    async changepass(newPassoword, id, token){
        
    }
}

module.exports = new User()