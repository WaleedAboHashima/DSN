const { verify } = require('jsonwebtoken');
const userSchema = require('../models/users');

exports.verifyToken = (...roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
        }
        else {
            verify(token, process.env.TOKEN, async (err, decoded) => {
                if (err) {
                    res.status(401).json({ message: 'Authorization error' });
                }
                else {
                    if (roles.includes(decoded.role)) {
                        const user = await userSchema.findById(decoded.id);
                        if (!user) {
                            res.status(404).json({ message:"User not found" });
                        }
                        else {
                            req.user = decoded;
                            next()
                        }
                    }
                    else {
                        res.status(403).json({message: `${decoded.role === 501 ? "Shop Maker" : "User"} doesn't have access to this API.`})
                    }
                }
            })
        }
    }   
}