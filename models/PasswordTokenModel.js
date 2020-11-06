const knex = require("../database/connection");

class PasswordToken { // gerando token e salvando no banco de dados
    async create(id) {  
        try {       
            if (id != undefined) {
                console.log("aaaa")
                const token = Date.now();
                await knex.insert({
                    id_user: id,
                    used: 0,
                    token: token
                }).table("user_token");
                return { status: true, token: token };

            } else {
                return { status: false, err: "O e-mail passado não existe no banco de dados" };
            }
        } catch (err) {
            console.log(err);
            return { status: false, err: err };
        }


    }

    async validate(token) { //validado token
        try {
            const result = await knex.select().where({ token: token }).table("user_token");

            if (result.length > 0) {
                const tk = result[0];
                if (tk.used == 1) {
                    return { status: false };
                } else {
                    return { status: true, token: tk };
                }

            } else {
                return { status: false };
            }
        } catch (err) {
            console.log(err);
            return { status: false };
        }
    }

    async setToken(token) { // setando o token como usado
        try {
            await knex.update({ used: 1 }).where({ token: token }).table("user_token");
        } catch (err) {
            console.log(err);
        }
    }

    async deleteToken(user){
        try{
            
        }catch(err){

        }
    }

    async tokenByIdUser(idUser){
        try{
            const result = await knex.select(["id_user", "used"]).where({ id_user: idUser.id_users }).table("user_token") //selecionado os campos que consulta retornar
            if (result.length > 0) {
                if(result.used == 1 || result.id_user){
                    await knex.delete().where({id_user: result.id_user}).table("user_token")
                    return true
                }else{
                    return false
                }
            } else {
                    return false
            }
        }catch(err){
            console.log(err)
            return false
        }
    }

}

module.exports = new PasswordToken()