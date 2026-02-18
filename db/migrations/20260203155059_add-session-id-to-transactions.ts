import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // ALTERA TABELA "transactions" 
    await knex.schema.alterTable("transactions", (table) => {
        table.uuid("session_id").after("id").index()
    })
}


export async function down(knex: Knex): Promise<void> {
    // DESFAZ TABELA "transactions" 
    await knex.schema.alterTable("transactions", (table) => {
        table.dropColumn("session_id")
    })
}

