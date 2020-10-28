const knex = require("../database/connection")
const User = require("./UserModel")

class PasswordToken {
    async create(email) {
        const user = await User.findByEmail(email)
        if (!user) {
            try {
                const token = Date.now()
                await knex.insert({
                    id_user: user.id,
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
}

module.exports = new PasswordToken()