    import mongoose from "mongoose";

    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        avatar: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true

            }
        },
        role: {
            type: String,
            default: "user",
            required: true
        },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpire: { type: Date, default: null },
    }, { timestamps: true }); 

    const User = mongoose.model("User", userSchema);

    export default User;
