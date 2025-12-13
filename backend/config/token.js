import jwt from "jsonwebtoken"


const genToken = async (id) => {
    try {
        const token = await jwt.sign({ id }, process.env.JWT_SECRET,
            { expiresIn: "7d" })
            return token
    } catch (error) {

    }
}

export default genToken
