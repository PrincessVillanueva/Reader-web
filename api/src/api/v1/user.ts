import { PrismaClient } from "@prisma/client"
import { Elysia, t } from "elysia"
import auth from "../../utils/auth";

const app = new Elysia({ prefix: "/user" })
    .decorate("prisma", new PrismaClient())
    .use(auth)

    .post("/signup", async ({ body, prisma }) => {
        try {
            const { email, password, fullname, username, contacts } = body;

            // create
            const user = await prisma.user.create({
                data: {
                    email: email,
                    password: await Bun.password.hash(password, "bcrypt"),
                    name: fullname,
                    username: username,
                    contacts: contacts
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    username: true,
                }
            })

            return {type: "Success", user: user}
        }
        catch(err) {
            throw new Error("Invalid signup!")
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
            fullname: t.String(),
            username: t.String(),
            contacts: t.String()
        })
    })

    .post("/login", async ({ prisma, jwt, body }) => {
        try {
            const { email, password } = body;

            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    email: email
                }
            });

            if(!await Bun.password.verify(password, user.password, "bcrypt")) {
                throw new Error("Invalid password!")
            }

            const token = await jwt.sign({
                id: user.id,
                auth: user.auth,
            })

            return { type: "Success", token: token }
        }   
        catch(err) {
            if(err) {
                throw err
            }
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        })
    })

export default app;