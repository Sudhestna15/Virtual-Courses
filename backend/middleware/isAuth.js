import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(400).json({ message: "User does not have token" });
        }

        let verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!verifyToken) {
            return res.status(400).json({ message: "User does not have valid token" });
        }

        req.userId = verifyToken.userId;

        next();
    } catch (error) {
        return res.status(500).json({ message: `isAuth error ${error}` });
    }
};

export default isAuth;
