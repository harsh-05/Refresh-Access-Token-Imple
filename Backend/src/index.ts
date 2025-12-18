import express from 'express';
import bcrypt from 'bcrypt';
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from './generated/prisma/client.js'
import jwt from 'jsonwebtoken';
import cors from 'cors';
import crypto from "node:crypto"

const JWT_Secret = process.env.JWT_SECRET || "somesecret";
const environment = process.env.ENVIRONMENT || "Development";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })
const app = express();

app.use(express.json());



app.use(cors({ origin: 'http://localhost:3000' }));

app.post("/signup", async (req, res) => {
    //1. get the credentials and store them in to db, make sure to hash the password.

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.status(400).json({ msg: "Email or password is required!!" });
        return;
    }
    
    const saltround = 5;

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
        res.status(401).json({ msg: "Authentication Failed ! Not found" });
        return;
    }
    
    const passCorrect = await bcrypt.compare(password, dbPassword.password);
    
    if (!passCorrect) {
        res.status(401).json({ msg: "Authentication Failed ! Password Incorrect" });
        return;
    }

    const refreshToken = jwt.sign({ email }, JWT_Secret, { expiresIn: "7d" });
    const accessToken = jwt.sign({ email }, JWT_Secret, { expiresIn: "15m" });

    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    try {
        const dbRes = await prisma.refreshToken.create({
            data: {
                userEmail: email,
                token: hashedRefreshToken,
                isValid: true
            }
        })

        const maxAge = 7 * 24 * 60 * 60 * 1000;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: environment === 'production',
            sameSite: environment === 'production' ? 'none' : 'lax',
            maxAge: maxAge
        });

        res.json({accessToken, msg: "Successfully signed In !"})
        return;
    } catch (e) {
        res.status(401).json({ msg: "Authentication failed !" , e});
        return;
    }

})

app.post("/refresh", async (req, res) => {
    //1. Extract the refresh-token from the cookie, try to validate the token using jwt verify. If success
    //2. Hash it using sha256 and compare the store one first in the redis cache first.
    //3. If cache fails then go for the db, check there. If found
    //4. then generate the new refresh-token and access-token.
    //5. store the refresh-token hash into the db and invalidate the old one.
    //6. send the refresh-token in cookie and access-token into the json body.


    const userRefreshToken = req.cookies.refreshToken;
    const userTokenHashed = crypto.createHash("sha256").update(userRefreshToken).digest('hex');
    if (!userRefreshToken) {
        res.status(401).json({ msg: "Token not found !" });
        return;
    }
    

    try {
        const decodedToken = jwt.verify(userRefreshToken, JWT_Secret);  
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError || e instanceof jwt.TokenExpiredError) {
            res.status(401).json({ msg: "Token expired or Invalid!", e});
        } 
    }

    try { 
        const updateRes = prisma.refreshToken.update({
            where: {
                token: userTokenHashed,
                isValid: true   
            }, data: {
                isValid: false
            }
        })
    } catch (e) {
        
    }

})

// Later we can also define the signup routes to handle the signup process into the system.





app.listen(3000);