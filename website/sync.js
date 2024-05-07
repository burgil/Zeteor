const { Client } = require('pg');

const skipYesNo = true;

const tables = {
    'users': [
        {
            column_name: 'c1',
            data_type: 'integer',
            sql_type: 'INT',
        },
        {
            column_name: 'c2',
            data_type: 'character varying',
            sql_type: 'VARCHAR(10)',
        },
    ],
    't2': [
        {
            column_name: 'c1',
            data_type: 'integer',
            sql_type: 'INT',
        },
    ],
}

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
git checkout -- website/update.sh
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

async function yesNo(callback) {
    process.stdout.write("(y/n)? ");
    skipYesNo ? await callback() : await new Promise((resolve, reject) => {
        try {
            process.stdin.on("data", async function (data) {
                try {
                    if (data.toString().trim().toLowerCase() === "y" || data.toString().trim().toLowerCase() === "ye" || data.toString().trim().toLowerCase() === "yes") {
                        process.stdin.end();
                        await callback();
                        resolve();
                    } else if (data.toString().trim().toLowerCase() === "n" || data.toString().trim().toLowerCase() === "no") {
                        process.stdin.end();
                        resolve();
                    }
                } catch (err) {
                    reject(err);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

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

async function checkTableAlteration(tableName) {
    try {
        const currentColumns = await client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = '${tableName}';
        `);
        return currentColumns.rows;
    } catch (err) {
        console.error('DB TABLE:', tableName, '-> ERROR ->', "Error checking table alteration:", err.message);
    }
}

async function dropTable(tableName) {
    console.log("Deleting Table...", tableName);
    const sql = `DROP TABLE ${tableName};`;
    console.log('      - DB TABLE ->', tableName, "RUNNING SQL:", sql);
    await client.query(sql);
}

function validateSQL(tableName, newDBColumn) {
    if (newDBColumn.sql_type.includes('VARCHAR') && newDBColumn.data_type !== 'character varying') {
        console.log('DB TABLE:', tableName, '-> WARNING ->', newDBColumn.column_name, "Column of type VARCHAR must be of data_type 'character varying'...", 'But got instead:', newDBColumn.data_type)
        return false;
    }
    if (newDBColumn.sql_type == 'INT' && newDBColumn.data_type !== 'integer') {
        console.log('DB TABLE:', tableName, '-> WARNING ->', newDBColumn.column_name, "Column of type INT must be of data_type 'integer'...", 'But got instead:', newDBColumn.data_type)
        return false;
    }
    return true;
}

async function alterTable(tableName, currentDBColumns, newDBColumns) {
    try {
        const cols = [];
        for (const newDBColumn of newDBColumns) {
            if (cols.includes(newDBColumn.column_name)) {
                console.log('DB TABLE:', tableName, '-> ERROR ->', newDBColumn.column_name, "Column already exists.");
                console.log("DB Tables Schema Fix Required! Exiting DB Creator...");
                return;
            } else {
                cols.push(newDBColumn.column_name);
            }
        }
        for (const currentDBColumn of currentDBColumns) {
            let columnExist = false;
            for (const newDBColumn of newDBColumns) {
                if (currentDBColumn.column_name === newDBColumn.column_name) {
                    // console.warn('DB TABLE:', tableName, '->', "Column Exist.. no need to remove...", currentDBColumn.column_name)
                    columnExist = true;
                    if (!validateSQL(tableName, newDBColumn)) break;
                    if (currentDBColumn.data_type !== newDBColumn.data_type) {
                        console.log('DB TABLE:', tableName, '-> QUESTION ->', "Columns data type doesn't match, alter required!" + (skipYesNo ? ' Change it?' : ''), currentDBColumn.column_name, 'current:', currentDBColumn.data_type, 'new:', newDBColumn.data_type)
                        await yesNo(async () => {
                            const sql = `
                                ALTER TABLE ${tableName}
                                ADD COLUMN ${newDBColumn.column_name} ${newDBColumn.sql_type};
                            `;
                            console.log('      - DB TABLE ->', tableName, "RUNNING SQL:", sql);
                            await client.query(sql);
                        });
                    }
                    break;
                }
            }
            if (!columnExist) {
                console.log('DB TABLE:', tableName, '-> QUESTION ->', "Column doesn't exist!" + (skipYesNo ? ' Delete it?' : ''), currentDBColumn.column_name)
                await yesNo(async () => {
                    const sql = `
                        ALTER TABLE ${tableName}
                        DROP COLUMN ${currentDBColumn.column_name};
                    `;
                    console.log('      - DB TABLE ->', tableName, "RUNNING SQL:", sql);
                    await client.query(sql);
                });
            }
        }
        for (const newDBColumn of newDBColumns) {
            let columnExist = false;
            for (const currentDBColumn of currentDBColumns) {
                if (currentDBColumn.column_name === newDBColumn.column_name) {
                    // console.warn('DB TABLE:', tableName, '->', "Column Already Exist.. no need to add...", currentDBColumn.column_name);
                    columnExist = true;
                }
            }
            if (!columnExist) {
                if (!validateSQL(tableName, newDBColumn)) continue;
                console.log('DB TABLE:', tableName, '-> QUESTION ->', "Column Need to be added..." + (skipYesNo ? ' Add it?' : ''), newDBColumn.column_name);
                await yesNo(async () => {
                    const sql = `
                        ALTER TABLE ${tableName}
                        ADD COLUMN ${newDBColumn.column_name} ${newDBColumn.sql_type};
                    `;
                    console.log('      - DB TABLE ->', tableName, "RUNNING SQL:", sql);
                    await client.query(sql);
                });
            }
        }
        // console.warn('- DB TABLE:', tableName, "Finished Checking Table.");
    } catch (err) {
        console.error('DB TABLE:', tableName, '-> ERROR ->', "Error altering table:", err.message);
    }
}

async function createTables() {
    const dbTables = await listTables();
    for (const tableName of dbTables) {
        if (!tables[tableName]) {
            console.log('DB TABLE:', tableName, "Table is missing from configuration..." + (skipYesNo ? ' Delete it?' : ''));
            await yesNo(() => {
                dropTable(tableName);
            });
        }
    }
    for (const tableName in tables) {
        if (!dbTables.includes(tableName)) {
            console.log('DB TABLE:', tableName, "Creating Table...", tableName);
            const sql_cols = [];
            for (const col of tables[tableName]) {
                sql_cols.push(col.column_name + ' ' + col.sql_type);
            }
            const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${sql_cols.join(',')});`;
            console.log('      - DB TABLE ->', tableName, "RUNNING SQL:", sql);
            await client.query(sql);
        } else {
            const dbColumns = await checkTableAlteration(tableName);
            // console.warn('- DB TABLE:', tableName, "Checking Table...");
            await alterTable(tableName, dbColumns, tables[tableName]);
        }
    }
    console.log("DB Creator Finished!");
}

client.connect(async (err) => {
    // console.log("Connected to DB!");
    try {
        // console.warn("Trying to use the DB...");
        // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
        // console.warn(res.rows[0].message)
        console.log("DB is working!");
        await createTables();
        // const res = await client.query(`SELECT * FROM t1;`)
        // console.warn(res.rows)
    } catch (err) {
        console.error(err.message);
        console.warn("Please install Postgres to use the DB.")
    } finally {
        // console.warn("DB connection ended.");
        // await client.end()
    }
});

module.exports = {
    test: 42
};