const knex = require("../database/connection");

class PasswordToken { // gerando token e salvando no banco de dados
    async create(id) {
        try {
            if (id != undefined) {
                await this.tokenDeleteByIdUser(id);
                const token = Date.now();
                await knex.insert({
                    id_user: id,
                    used: 0,
                    token: token
                }).table("user_token");
                return { status: true, token: token };

            } else {
                return { status: false };
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


    async tokenDeleteByIdUser(idUser) {
        try {
            const result = await knex.select(["used"]).where({ id_user: idUser }).table("user_token") //selecionado os campos que consulta retornar
            if (result.length > 0) {
                await knex.delete().where({ id_user: idUser }).table("user_token")
                return 
            } else {
                return 
            }
        } catch (err) {
            console.log(err)
            return 
        }
    }

}

module.exports = new PasswordToken()