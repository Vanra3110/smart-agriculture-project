const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CropHistoryItemSchema = new mongoose.Schema(
    {
        inputs: {
            N: { type: Number, required: true },
            P: { type: Number, required: true },
            K: { type: Number, required: true },
            temperature: { type: Number, required: true },
            humidity: { type: Number, required: true },
            ph: { type: Number, required: true },
            rainfall: { type: Number, required: true },
        },
        recommendedCrop: { type: String, required: true },
        confidence: { type: Number },
        explanation: { type: String, default: "" },
        topPredictions: [
            {
                crop: { type: String },
                confidence: { type: Number }
            }
        ],
        notes: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const DiseaseHistoryItemSchema = new mongoose.Schema(
    {
        crop: { type: String, required: true },
        disease: { type: String, required: true },
        isHealthy: { type: Boolean, default: false },
        confidence: { type: Number },
        severity: { type: String, default: "Moderate" },
        symptoms: { type: String, default: "" },
        organicTreatment: { type: String, default: "" },
        chemicalTreatment: { type: String, default: "" },
        prevention: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false, // Don't return password in normal queries
        },
        farmLocation: {
            type: String,
            default: "",
            trim: true,
        },
        farmSize: {
            type: String,
            default: "",
            trim: true,
        },
        soilType: {
            type: String,
            default: "",
            trim: true,
        },
        phone: {
            type: String,
            default: "",
            trim: true,
        },
        cropHistory: [CropHistoryItemSchema],
        diseaseHistory: [DiseaseHistoryItemSchema],
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
