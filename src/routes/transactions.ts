import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { knex } from "../database_config"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"

export async function transactionRoutes(server: FastifyInstance){

    // CRIAR TRANSAÇÃO
    server.post("/", async (req: FastifyRequest, res: FastifyReply) => {

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.coerce.number(),
            type: z.enum(["credit", "debit"])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body)

        let session_id = req.cookies.session_id

        if(!session_id){
            
            session_id = randomUUID()
            res.cookie("session_id", session_id, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7 // 7 dias ( dica de clean code )
            })
        
        }

        const transaction = await knex("transactions").insert({
            id: randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
            session_id
        })

        return res.status(201).send("Transação criada com sucesso!")
    })

    // LISTAR TRANSAÇÕES
    server.get(
        "/", 
        {
            preHandler: [ checkSessionIdExists ]
        }, 
        async (req: FastifyRequest, res: FastifyReply) => {

            const getSessionIdSchema = z.object({
                session_id: z.uuid()
            })

            const { session_id } = getSessionIdSchema.parse(req.cookies)

            const transactions = await knex("transactions").where("session_id", session_id).select()

            return res.status(200).send({
                transactions
            })
        }
    )

    // LISTAR ÚNICA TRANSAÇÃO
    server.get(
        "/:id", 
        {
            preHandler: [ checkSessionIdExists ]
        },
        async (req : FastifyRequest, res: FastifyReply) => {

            const getSessionIdSchema = z.object({
                session_id: z.uuid()
            })

            const { session_id } = getSessionIdSchema.parse(req.cookies)
        
            const createGetTransactionSchema = z.object({
                id: z.uuid()
            })

            const { id } = createGetTransactionSchema.parse(req.params) 

            const transaction = await knex("transactions")
                .where({
                    id: id,
                    session_id: session_id
                })
                .first()

            return res.status(200).send({
                transaction
            })

        }
    )

    // RESUMO DE TRANSAÇÕES
    server.get(
        "/summary", 
        {
            preHandler: [ checkSessionIdExists ]
        },
        async (req: FastifyRequest, res: FastifyReply) => {

            const getSessionIdSchema = z.object({
                session_id: z.uuid()
            })

            const { session_id } = getSessionIdSchema.parse(req.cookies)


            const summary = await knex("transactions")
                .where({
                    session_id
                })
                .sum("amount", {
                    as: "amount"
                })
                .first()

            return res.status(200).send({
                summary
            })
        }
    )

}