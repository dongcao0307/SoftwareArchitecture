const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,        // nếu bạn run -p 5433:5432 thì đổi thành 5433
  user: "admin",
  password: "12345",
  database: "mydb",
});

async function testDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL!");

    const res = await client.query("SELECT * FROM users;");
    console.log("Data in users table:");
    console.log(res.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

testDB();