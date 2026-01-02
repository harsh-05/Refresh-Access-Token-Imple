// You actaully cannot use the seed in this code, because you have to generate and store the bcrypt generated hashes into the db..
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import bcrypt from 'bcrypt'

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })


async function main() {
    // Here we have to hash the password 
    const saltround = 5;
    const hashedpassword1 = await bcrypt.hash('12345', saltround);
      const hashedpassword2 = await bcrypt.hash('123456', saltround);
    const users = await prisma.user.createManyAndReturn({
        data: [{ email: "user1@gmail.com", password: hashedpassword1 }, { email: "user2@gmail.com", password: hashedpassword2 }]
    });

    console.log(users);

}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
