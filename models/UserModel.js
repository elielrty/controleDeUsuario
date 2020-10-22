let knex = require("../database/connection")
let bcrypt = require("bcrypt")

class User{
    async findAll(){ //listado usuarios cadastrados
        try{
            const result = await knex.select(["id_users", "name_users", "email_users", "role_users"]).table("users") //selecionado os campos que consulta retornar
            return result
        }catch(err){
            console.log(err)
            return []
        }
    }

    async findId(id){ //listado usuarios cadastrados
        try{
            const result = await knex.select(["id_users", "name_users", "email_users", "role_users"]).where({id_users: id}).table("users") //selecionado os campos que consulta retornar
            if(result.length > 0){
                return result[0]
            }else{
                return undefined
            }
        }catch(err){
            console.log(err)
            return undefined
        }
    }


    async NewUser(name_users, email_users, password_users, ){ // cadastrando usuario
        try{

            const hash = await bcrypt.hash(password_users, 10) // criptografado senha

            await knex.insert({ name_users, email_users, password_users: hash, role_users: 0}).table("users")
        }catch(err){
            console.log(err)
        }
    }
    async findEmail(email){ // verificando se o email exite no banco
        try{
            const result = await knex.select("*").from("users").where({email_users: email})

            if(result.length > 0){
                return true
            }else{
                return false
            }
        }catch(err){
            console.log(err)
            return false
        }
    }
}

module.exports = new User()