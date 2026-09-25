


const validateSignup = (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];
    
    if (!username) {
        errors.push("Username is required");
    } else if (typeof username !== "string") {
        errors.push("Username must be a string");
    } else {
        const trimmedUsername = username.trim();

        if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
            errors.push("Username must be between 3 and 20 characters");
        }

        if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
            errors.push("Username can only contain letters, numbers, and underscores");
        }
    }

    if (!password) {
        errors.push("Password is required");

    } else if (typeof password !== "string") {
        errors.push("Password must be a string");

    } else if (password.length < 6) {
        errors.push("Password must be at least 6 characters long");

    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};


const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];

    if (!username || typeof username !== "string" || username.trim() === "") {
        errors.push("Username is required");
    }

    if (!password || typeof password !== "string" || password.length === 0) {
        errors.push("Password is required");
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};


export { validateSignup, validateLogin };