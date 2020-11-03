const knex = require("../database/connection")
const User = require("./UserModel")

class PasswordToken { // gerando token e salvando no banco de dados
    async create(email) {
        const user = await User.findByEmail(email)
        if (user) {
            try {
                const token = Date.now()
                await knex.insert({
                    id_user: user.id_users,
                    used: 0,
                    token: token
                }).table("user_token")
                return {status: true, token: token}
            } catch (err) {
                console.log(err)
                return {status: false, err: err}
            }

        } else {
            return { status: false, err: "O e-mail passado não existe no banco de dados" }
        }
    }

    async validate(token){ //validado token
        try{
           const result = await knex.select().where({ token: token }).table("user_token")

           if( result.length > 0){
                const tk = result[0]
                if(tk.used == 1){
                   return {status: false}
                }else{
                    return {status: true, token: tk}
                }

           }else{
               return {status: false}
           }
        }catch(err){
            console.log(err)
            return {status: false}
        }
    }

    async setToken(token){ // setando o token como usado
        try{
            await knex.update({used: 1}).where({token: token}).table("user_token")
        }catch(err){
            console.log(err)
        }
    }

}

module.exports = new PasswordToken()