import { faker } from "@faker-js/faker";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const con = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export function createRandomUser() {
  return {
    country_code: faker.location.countryCode(),
    vehicle_type: faker.vehicle.type(),
    traffic_vol: faker.number.int({ min: 1000, max: 100000 }),
    rec_time: faker.date.past(),
  };
}

async function seedDatabase() {
  try {    

    const checkQuery = "SELECT COUNT(*) FROM traffic_metrics;";
    const res = await con.query(checkQuery);
    const rowCount = parseInt(res.rows[0].count, 10);

    if (rowCount > 0) {
      console.log(
        `${rowCount} rows available.`,
      );
      process.exit(0);
    }
    const users = faker.helpers.multiple(createRandomUser, { count: 100 });
    for (const user of users) {
      await con.query(
        "INSERT INTO traffic_metrics (country_code, vehicle_type, traffic_vol, rec_time) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
        [user.country_code, user.vehicle_type, user.traffic_vol, user.rec_time]
      );
    }

    await con.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    await con.end();
    process.exit(1);
  }
}

seedDatabase();
