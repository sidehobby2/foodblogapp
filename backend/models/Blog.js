import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    summary: {
        type: String,
        required: [true, 'Summary is required'],
        trim: true,
        maxlength: [500, 'Summary cannot be more than 500 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'],
        default: 'Dinner'
    },
    cookingTime: {
        type: Number, // in minutes
        min: 1
    },
    servings: {
        type: Number,
        min: 1
    }
}, {
    timestamps: true
});

// Index for better search performance
blogSchema.index({ title: 'text', summary: 'text', 'profile.displayName': 'text' });

export default mongoose.model('Blog', blogSchema);