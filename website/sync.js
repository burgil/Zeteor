const { Client } = require('pg');
// port 5432
// pass 1234
// C:\Program Files\PostgreSQL\16\bin>psql -U postgres
const client = new Client({
    user: 'postgres', // string | undefined
    database: 'zeteordb', // string | undefined
    password: 'postgres', // string | (() => string | Promise<string>) | undefined
    // port: 5432, // number | undefined
    // host: '127.0.0.1', // string | undefined
    // connectionString: '', // string | undefined
    // keepAlive: true, // boolean | undefined
    // stream: , // () => stream.Duplex | stream.Duplex | undefined
    // statement_timeout: , // false | number | undefined
    // ssl: true, // boolean | ConnectionOptions | undefined
    // query_timeout: 0, // number | undefined
    // keepAliveInitialDelayMillis: 0, // number | undefined
    // idle_in_transaction_session_timeout: 0, // number | undefined
    // application_name: '', // string | undefined
    // connectionTimeoutMillis: 0, // number | undefined
    // types: '', // CustomTypesConfig | undefined
    // options: '', // string | undefined
});

client.connect(async (err) => {
    console.log("Connected to DB!");
    try {
        console.log("Trying...");
        const res = await client.query('SELECT $1::text as message', ['Hello world!'])
        console.log(res.rows[0].message)
        console.log("Got it");
    } catch (err) {
        console.error(err.message);
        console.log("Please install Postgres to use the synced database.")
    } finally {
        console.log("Finished");
        await client.end()
    }
});
module.exports = {
    test: 42
};