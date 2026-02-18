import { expect, test, beforeAll, afterAll, describe, beforeEach } from "vitest"
import { execSync } from "node:child_process"
import request from "supertest"
import { app } from "../src/app"

// "describe" serve para criar uma categoria de testes. Podemos criar várias subcategorias também.
describe("Transactions Routes", () => {
    
    beforeAll( async () => {
        await app.ready()
    })

    afterAll( async() => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    test("User can create a new transaction", async () => {
        const response = await request(app.server)
            .post("/transactions")
            .send({
                title: "new-transaction-test",
                amount: 5000,
                type: "credit"
            })

        expect(response.statusCode).toBe(201)
        expect(response.text).toBe("Transação criada com sucesso!")

    })

    test("User can list all transactions", async () => {

        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "new-transaction-test",
                amount: 5000,
                type: "credit"
            })
        
        const cookies = createTransactionResponse.get("Set-Cookie")

        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set('Cookie', cookies!)
            .expect(200)
    
        expect(listTransactionsResponse.body.transactions).toEqual([
           expect.objectContaining({
                title: "new-transaction-test",
                amount: 5000
           })
        ]);

    })

    test("User can list a single transaction", async () => {

        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "new-transaction-test",
                amount: 5000,
                type: "credit"
            })

        const cookies = createTransactionResponse.get("Set-Cookie")

        const listTransactionsResponse = await request(app.server)
            .get(`/transactions`)
            .set('Cookie', cookies!)
            .expect(200) 
        
        const transactionId = listTransactionsResponse.body.transactions[0].id

        const listSingleTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies!)
            .expect(200)

        expect(listSingleTransactionResponse.body.transaction).toEqual(
           expect.objectContaining({
            id: transactionId,
            title: "new-transaction-test",
            amount: 5000
           })
        );

    })

    test("User can list a summary of all transactions", async () => {

        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "new-credit-transaction-test",
                amount: 5000,
                type: "credit"
            })
        
        const cookies = createTransactionResponse.get("Set-Cookie")

        await request(app.server)
            .post("/transactions")
            .set("Cookie", cookies!)
            .send({
                title: "new-debit-transaction-test",
                amount: 2000,
                type: "debit"
            })

        const getTransactionsSummaryResponse = await request(app.server)
            .get("/transactions/summary")
            .set("Cookie", cookies!)
            .expect(200)
    
        expect(getTransactionsSummaryResponse.body.summary).toEqual(
           expect.objectContaining({
                amount: 3000
           })
        );

    })
})

