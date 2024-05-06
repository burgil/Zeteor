const { Client } = require('pg');
// port: 5432
// pass: postgres
// "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
/*
sudo -u postgres psql
sudo su
sudo -i -u postgres
\d
\connect zeteordb
ALTER USER postgres WITH PASSWORD 'new_password';
*/
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

async function listTables() {
    try {
        const res = await client.query(`
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        // console.log("Tables in the public schema:", res.rows.map(row => row.table_name));
        return res.rows.map(row => row.table_name);
    } catch (err) {
        console.error("Error listing tables:", err);
    }
}

const dbs = {
    't1': `
        c1 INT,
        c2 VARCHAR(10)
    `,
    't2': `
        c1 INT,
        c2 VARCHAR(10)
    `,
}

const db_patches = [
    {
        't1': `ADD COLUMN new_column INT;`
    },
    {
        't2': `DROP COLUMN c2;`
    },
]

async function dropDatabase(dbName) {
    console.log("Deleting Database...", dbName);
    await client.query(`DROP TABLE ${dbName};`);
}

async function alterTable() {
    try {
        // Add a new column
        await client.query(`
            ALTER TABLE t1
            ADD COLUMN new_column INT;
        `);
        // Remove a column
        await client.query(`
            ALTER TABLE t1
            DROP COLUMN column_to_remove;
        `);
        console.log("Table altered successfully!");
    } catch (err) {
        console.error("Error altering table:", err);
    }
}

async function checkTableAlteration(dbName) {
    try {
        const currentColumns = await client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = '${dbName}';
        `);
        return currentColumns.rows;
    } catch (err) {
        console.error("Error checking table alteration:", err);
    }
}

async function createDatabases() {
    const tables = await listTables();
    for (const table of tables) {
        if (!dbs[table]) {
            console.log("Database is missing from configuration, Delete?");
            // dropDatabase(table);
        }
    }
    for (const db in dbs) {
        if (!tables.includes(db)) {
            console.log("Creating Database...", db);
            await client.query(`CREATE TABLE IF NOT EXISTS ${db} (${dbs[db]});`);
        } else {
            const dbColumns = await checkTableAlteration(db);
            console.log("Checking Database...", db, dbColumns);
        }
    }
    const res = await client.query(`SELECT * FROM t1;`)
    console.log(res.rows)
}

client.connect(async (err) => {
    console.log("Connected to DB!");
    try {
        console.log("Trying to use the DB...");
        const res = await client.query('SELECT $1::text as message', ['Hello world!'])
        console.log(res.rows[0].message)
        console.log("DB is working!");
        await createDatabases();
        // dropDatabase('t1');
        // dropDatabase('t2');
    } catch (err) {
        console.error(err.message);
        console.log("Please install Postgres to use the synced database.")
    } finally {
        // console.log("Database connection ended.");
        // await client.end()
    }
});

module.exports = {
    test: 42
};