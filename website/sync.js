const { Client } = require('pg');

const skipYesNo = true;

const tables = {
    'users': [
        {
            column_name: 'discord_id', // index must be first
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'settings',
            data_type: 'json',
            sql_type: 'JSON',
        },
        {
            column_name: 'payment_id',
            data_type: 'character varying',
            sql_type: 'VARCHAR(100)',
        },
        {
            column_name: 'last_login',
            data_type: 'character varying',
            sql_type: 'VARCHAR(100)',
        },
        {
            column_name: 'global_name',
            data_type: 'character varying',
            sql_type: 'VARCHAR(100)',
        },
        {
            column_name: 'username',
            data_type: 'character varying',
            sql_type: 'VARCHAR(100)',
        },
        {
            column_name: 'payment_status',
            data_type: 'character varying',
            sql_type: 'VARCHAR(100)',
        },
    ],
    'personas': [
        {
            column_name: 'slug', // index must be first
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'title',
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'description',
            data_type: 'character varying',
            sql_type: 'VARCHAR(500)',
        },
        {
            column_name: 'price',
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'image',
            data_type: 'character varying',
            sql_type: 'VARCHAR(500)',
        },
        {
            column_name: 'ai_prompt',
            data_type: 'character varying',
            sql_type: 'VARCHAR(500)',
        },
    ],
    'servers': [
        {
            column_name: 'discord_id', // index must be first
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'name',
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'commands',
            data_type: 'json',
            sql_type: 'JSON',
        },
        {
            column_name: 'persona',
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'settings',
            data_type: 'json',
            sql_type: 'JSON',
        },
        {
            column_name: 'image',
            data_type: 'character varying',
            sql_type: 'VARCHAR(500)',
        },
    ],
    'ai': [
        {
            column_name: 'discord_id', // index must be first
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'image',
            data_type: 'character varying',
            sql_type: 'VARCHAR(500)',
        },
    ],
    'payments': [
        {
            column_name: 'discord_id', // index must be first
            data_type: 'character varying',
            sql_type: 'VARCHAR(100)',
        },
        {
            column_name: 'id',
            data_type: 'character varying',
            sql_type: 'VARCHAR(100)',
        },
        {
            column_name: 'event_type',
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'summary',
            data_type: 'character varying',
            sql_type: 'VARCHAR(510)',
        },
        {
            column_name: 'create_time',
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'total',
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
        {
            column_name: 'currency',
            data_type: 'character varying',
            sql_type: 'VARCHAR(50)',
        },
    ]
};

/*
    // port: 5432
    // pass: postgres
    // "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
    sudo -u postgres psql
    sudo su
    sudo -i -u postgres
    \d
    \connect zeteordb
    ALTER USER postgres WITH PASSWORD 'new_password';
    git checkout -- website/website_update.sh
    git fetch
    git pull
    chmod +x website/website_update.sh
    cd website
    npm run updater
    ./website_update.sh
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

async function sql(sql, values) {
    // console.log("RUNNING SQL:", sql, values ? values : '');
    return await client.query(sql, values);
}

async function generateDeleteStatement(tableName, id, custom_selector = 'discord_id') {
    const sql = `DELETE FROM ${tableName} WHERE ${custom_selector} = $1`;
    return { sql, values: [id] };
}

async function generateInsertStatement(tableName, data) {
    const tableColumns = tables[tableName];
    const columns = tableColumns.map((column) => column.column_name);
    const placeholders = columns.map((_, index) => `$${index + 1}`);
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
    const values = [];
    for (const column of columns) {
        if (data[column]) {
            values.push(data[column]);
        } else {
            const columnDef = tableColumns.find((col) => col.column_name === column);
            if (columnDef) {
                if (columnDef.data_type == 'integer') {
                    values.push(0);
                } else if (columnDef.data_type == 'character varying') {
                    values.push('');
                } else if (columnDef.data_type == 'json') {
                    values.push({});
                } else {
                    values.push('');
                }
            }
        }
    }
    return { sql, values };
}

async function generateUpdateStatement(tableName, discord_id, updates, custom_selector = 'discord_id') {
    const tableColumns = tables[tableName];
    const setClauses = [];
    const values = [];
    for (const [column, value] of Object.entries(updates)) {
        const columnDef = tableColumns.find((col) => col.column_name === column);
        if (columnDef) {
            setClauses.push(`${column} = $${values.length + 1}`);
            values.push(value);
        }
    }
    const sql = `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE ${custom_selector} = $${values.length + 1}`;
    values.push(discord_id);
    return { sql, values };
}

async function generateInsertOrUpdateStatement(tableName, discordId, data) {
    const tableColumns = tables[tableName];
    const columns = tableColumns.map((column) => column.column_name);
    const placeholders = columns.map((_, index) => `$${index + 1}`);
    const values = [];
    const selectSql = `SELECT * FROM ${tableName} WHERE discord_id = $1`;
    const selectResult = await sql(selectSql, [discordId]);
    if (selectResult.rows.length > 0) {
        const updateSetClauses = [];
        for (const [key, value] of Object.entries(data)) {
            const columnDef = tableColumns.find((col) => col.column_name === key);
            if (columnDef) {
                updateSetClauses.push(`${key} = $${values.length + 1}`);
                values.push(value);
            }
        }
        const updateSql = `UPDATE ${tableName} SET ${updateSetClauses.join(', ')} WHERE discord_id = $${values.length + 1}`;
        return { sql: updateSql, values: [...values, discordId] };
    } else {
        const insertSql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
        values.push(discordId);
        let i = 0;
        for (const column of columns) {
            i += 1;
            if (i == 1) continue;
            if (data[column]) {
                values.push(data[column]);
            } else {
                const columnDef = tableColumns.find((col) => col.column_name === column);
                if (columnDef) {
                    if (columnDef.data_type == 'integer') {
                        values.push(0);
                    } else if (columnDef.data_type == 'character varying') {
                        values.push('');
                    } else if (columnDef.data_type == 'json') {
                        values.push({});
                    } else {
                        values.push('');
                    }
                }
            }
        }
        return { sql: insertSql, values };
    }
}

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
        console.error("Error listing tables:", err.message);
        return false;
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
    if (newDBColumn.sql_type.includes('JSON') && newDBColumn.data_type !== 'json') {
        console.log('DB TABLE:', tableName, '-> WARNING ->', newDBColumn.column_name, "Column of type JSON must be of data_type 'json'...", 'But got instead:', newDBColumn.data_type)
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
                    // console.warn('DB TABLE:', tableName, '->', currentDBColumn.column_name, "Column Exist.. no need to remove...")
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
                console.log('DB TABLE:', tableName, '-> QUESTION ->', currentDBColumn.column_name, "Column doesn't exist!" + (skipYesNo ? ' Delete it?' : ''))
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
                    // console.warn('DB TABLE:', tableName, '->', currentDBColumn.column_name, "Column Already Exist.. no need to add...");
                    columnExist = true;
                }
            }
            if (!columnExist) {
                if (!validateSQL(tableName, newDBColumn)) continue;
                console.log('DB TABLE:', tableName, '-> QUESTION ->', newDBColumn.column_name, "Column Need to be added..." + (skipYesNo ? ' Add it?' : ''));
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
    if (!dbTables) return false;
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
    return true;
}

client.connect(async (err) => {
    // console.log("Connected to DB!");
    try {
        // console.warn("Trying to use the DB...");
        // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
        // console.warn(res.rows[0].message)
        if (await createTables()) {
            console.log("Postgres is Working!");
        } else {
            console.log("Error in Postgres, Check connection string!");
        }
        // Clean DB
        // await sql(`DELETE FROM users;`)
        // await sql(`DELETE FROM personas;`)
        // await sql(`DELETE FROM servers;`)
        // await sql(`DELETE FROM ai;`)
        // Select DB
        // const usersDB = await sql(`SELECT * FROM users;`)
        // console.warn('users:', usersDB.rows)
        // const personasDB = await sql(`SELECT * FROM personas;`)
        // console.warn('personas:', personasDB.rows)
        // const serversDB = await sql(`SELECT * FROM servers;`)
        // console.warn('servers:', serversDB.rows)
        // const aiDB = await sql(`SELECT * FROM ai;`)
        // console.warn('ai:', aiDB.rows)
        /*
        // ------------------------------------------------------------------- users
        console.log('INSERT example');
        const insertUser = await generateInsertStatement('users', {
            discord_id: '1',
            settings: {
                test: 42
            },
        });
        await sql(insertUser.sql, insertUser.values)
        //
        console.log('UPDATE example');
        const updateUser = await generateUpdateStatement('users', '1', {
            discord_id: '1',
            settings: {
                test: 42
            },
        });
        const updatedUser = await sql(updateUser.sql, updateUser.values)
        console.warn(updatedUser.rows)
        //
        console.log('DELETE example');
        const deleteUser = await generateDeleteStatement('users', '1');
        await sql(deleteUser.sql, deleteUser.values)
        // ------------------------------------------------------------------- personas
        console.log('INSERT example');
        const insertPersona = await generateInsertStatement('personas', {
            title: 'New Title',
            description: 'New Description',
            price: 42,
            image: 'New image',
            ai_prompt: 'ai_prompt',
        }, 'slug')
        await sql(insertPersona.sql, insertPersona.values)
        //
        console.log('UPDATE example');
        const updatePersona = await generateUpdateStatement('personas', '1', {
            title: 'New Title',
            description: 'New Description',
            price: 42,
            image: 'New image',
            ai_prompt: 'ai_prompt',
        }, 'slug')
        const updatedPersona = await sql(updatePersona.sql, updatePersona.values)
        console.warn(updatedPersona.rows)
        //
        console.log('DELETE example');
        const deletePersona = await generateDeleteStatement('personas', '1', 'slug');
        await sql(deletePersona.sql, deletePersona.values)
        // ------------------------------------------------------------------- servers
        console.log('INSERT example');
        const insertServer = await generateInsertStatement('servers', {
            name: 'New name',
            discord_id: '1',
            commands: {
                hello: 42
            },
            persona: 'New persona',
            settings: {
                hello: 42
            },
            image: 'New image',
        })
        await sql(insertServer.sql, insertServer.values)
        //
        console.log('UPDATE example');
        const updateServer = await generateUpdateStatement('servers', '1', {
            name: 'New name',
            discord_id: '1',
            commands: {
                hello: 42
            },
            persona: 'New persona',
            settings: {
                hello: 42
            },
            image: 'New image',
        });
        const updatedServer = await sql(updateServer.sql, updateServer.values)
        console.warn(updatedServer.rows)
        //
        console.log('DELETE example');
        const deleteServer = await generateDeleteStatement('servers', '1');
        await sql(deleteServer.sql, deleteServer.values)
        // ------------------------------------------------------------------- ai
        console.log('INSERT example');
        const insertAI = await generateInsertStatement('ai', {
            image: 'New image',
        })
        await sql(insertAI.sql, insertAI.values)
        //
        console.log('UPDATE example');
        const updateAI = await generateUpdateStatement('ai', '1', {
            image: 'New image',
        });
        const updatedAI = await sql(updateAI.sql, updateAI.values)
        console.warn(updatedAI.rows)
        //
        console.log('DELETE example');
        const deleteAI = await generateDeleteStatement('ai', '1');
        await sql(deleteAI.sql, deleteAI.values)
        */
    } catch (err) {
        console.error(err.message);
        console.warn("Please install Postgres to use the DB.")
    } finally {
        // console.warn("DB connection ended.");
        // await client.end()
    }
});

module.exports = {
    sql,
    generateInsertStatement,
    generateUpdateStatement,
    generateDeleteStatement,
    generateInsertOrUpdateStatement,
};