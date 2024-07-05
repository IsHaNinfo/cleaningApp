import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const roleAuthentication = (allowedRoles) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ error: "Authorization token required" });
        }
        const token = authorization.split(" ")[1];
        try {
            const { _id } = jwt.verify(token, process.env.SECRET);
            const user = await User.findOne({ _id }).select("_id role");
            if (!user || !allowedRoles.includes(user.role)) {
                return res.status(403).json({ error: "Access denied" });
            }
            console.log(user.role);
            req.userId = user._id;
            req.userRole = user.role;
            next();
        } catch (error) {
            res.status(401).json({ error: "Request is not authorized" });
        }
    };
};

export default  roleAuthentication;
