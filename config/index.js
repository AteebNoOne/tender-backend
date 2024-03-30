import dotenv from 'dotenv';
dotenv.config();

const {
    PORT = 8000,
    MONGO_URI,
    TOKEN_KEY,
    BASE_URL
} = process.env;

export { PORT, MONGO_URI, TOKEN_KEY ,BASE_URL};
