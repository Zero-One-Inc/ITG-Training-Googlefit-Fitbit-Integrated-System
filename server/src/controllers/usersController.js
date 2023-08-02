
import User from "../models/Users.js";

export const createUser = async (firstName, lastName, email, password) => {
    try {
        const user = await User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });
    
        return user;
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById({_id: req.params.userID});

        if (!user){
            console.log("This user doesn't exist.");
            res.status(404).redirect("/login");
        }

        await user.deleteOne();
        res.status(200).redirect("/register");

        return true;
    } catch (error) {
        throw error;
    }
}