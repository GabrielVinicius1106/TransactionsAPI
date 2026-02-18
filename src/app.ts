import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cookie from "@fastify/cookie"
import { transactionRoutes } from "./routes/transactions";

const app = fastify()

app.register(cookie)

// Executado antes de todo HANDLER da aplicação
app.addHook('preHandler', async (req: FastifyRequest, res: FastifyReply) => {
    console.log(`[${req.method}] ${req.url}`);
})

app.register(transactionRoutes, {
    prefix: "transactions"
})

export { app }