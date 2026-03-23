const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "admin",
  password: "12345",
  database: "mydb",
});

async function run() {
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      age INT
    );
  `);

  await client.query(`
    INSERT INTO users (name, age)
    VALUES ('Dong', 21),
           ('Nam', 22);
  `);

  const res = await client.query("SELECT * FROM users");
  console.log(res.rows);

  await client.end();
}

run();