import { app } from "./app";
import { env } from "./env/index";

const host = '0.0.0.0'

app.listen({
    port: env.PORT || 3000,
    host: host
}).then(() => console.log(`Server running on PORT: ${env.PORT || 3000}`) )