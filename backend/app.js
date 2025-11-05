import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './routes/blogRoutes.js';
import userRoutes from './routes/userRoutes.js';


if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();

// CORS configuration for production
const allowedOrigins = [
    'http://localhost:3000',
    'https://your-frontend-app.vercel.app', // Will update after deployment
    process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {

        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error(' MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log(' Connected to MongoDB Atlas');
        console.log('Database:', mongoose.connection.db?.databaseName);
    })
    .catch(err => {
        console.error(' MongoDB connection error:', err);
    });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

// Health check
app.get('/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

    res.status(200).json({
        success: true,
        status: 'OK',
        message: 'FoodBlog API is running',
        database: dbStatus,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        cors: {
            allowedOrigins: allowedOrigins
        }
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to FoodBlog API',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        endpoints: {
            health: '/health',
            users: '/api/users',
            blogs: '/api/blogs'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        availableEndpoints: ['/', '/health', '/api/users', '/api/blogs']
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(' Error:', err);

    // CORS error
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            message: 'CORS policy: Origin not allowed'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(` Server is running on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV}`);
    console.log(` Health check: http://0.0.0.0:${PORT}/health`);
    console.log(` CORS allowed origins:`, allowedOrigins);
});