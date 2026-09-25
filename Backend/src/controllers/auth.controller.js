import User from '../model/user.model.js'
import { hashPassword, verifyPassword } from "../utils/password.js"
import { signToken } from "../utils/jwt.js";





export async function register(req, res) {
    const { username, password } = req.body;

    try {

    

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            username,
            passwordHash: hashedPassword
        });

        const token = signToken(user._id.toString());

        return res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });

    } catch (error) {
          if (error.code === 11000) {
        return res.status(409).json({ message: "Username is already taken" });
    }
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

         const isMatch = await verifyPassword(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = signToken(user._id.toString());

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        }); 
    }
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }}


export async function getUser(req, res) {
     try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Error fetching user:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}


