import express from 'express';
import bcrypt from 'bcrypt';
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from './generated/prisma/client.js'
import jwt from 'jsonwebtoken';
import cors from 'cors';

const JWT_Secret = process.env.JWT_SECRET || "somesecret";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })
const app = express();

const saltround = 5;


app.use(cors({ origin: 'http://localhost:3000' }));

app.post("/signup", async (req, res) => {
    //1. get the credentials and store them in to db, make sure to hash the password.

    const email = req.body.email;
    const password = req.body.password;
    

    const hashedpassword = await bcrypt.hash(password, saltround);

    try {
        const dbRes = await prisma.user.create(
            {
                data: {
                    email, password: hashedpassword
                }
            }
        )
        res.json({ msg: "signup successful!" });
        return;
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({ Error: e.code })
            return;
        } else {
            res.status(400).json({ e })
            return;
        }
    }
    

})


app.post("/signin", async (req, res) => {
    //1. extract the credentials, email and password
    //2. hash the password, then check the hash in db, if correct then generate the access-token and refresh-token
    //3. store the refresh-token in the db, and send the refresh-token in the http-cookie only.
    //4. send the access-token in the response json.

    const email = req.body.email;
    const password = req.body.password;

    const dbPassword = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            email,
            password
        }
    })
    if (!dbPassword) {
        res.status(401).json({ msg: "Authentication Failed !" });
        return;
    }
    
    const passCorrect = await bcrypt.compare(password, dbPassword.password);
    
    if (!passCorrect) {
        res.status(401).json({ msg: "Authentication Failed !" });
        return;
    }

    const refreshToken = jwt.sign({ email }, JWT_Secret, { expiresIn: "7d" });
    const accessToken = jwt.sign({ email }, JWT_Secret, { expiresIn: "15m" });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === 'production',
    })

})

app.post("/refresh", (req, res) => {
    //1. Extract the refresh-token from the cookie, try to match with the redis cache first.
    //2. If cache fails then go for the db, check there.
    //3. If found and still valid then generate the new refresh-token and access-token
})

// Later we can also define the signup routes to handle the signup process into the system.





app.listen(3000);