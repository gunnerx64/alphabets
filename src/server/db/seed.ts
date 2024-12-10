import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import { region } from "@/server/db/schema";
import "@/envConfig";

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.local");

const staticRegions = [
  { state: "РСФСР", regions: ["Архангельская обл.", "Белгородская обл."] },
  { state: "УССР", regions: ["Одесская обл."] },
];

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);

  const regions = await db.select().from(region);
  // console.log(`regions: ${regions.length}`);
  if (regions.length < 1) {
    const data: (typeof region.$inferInsert)[] = [];
    let sort = 0;
    for (let s = 0; s < staticRegions.length; s++) {
      for (let i = 0; i < staticRegions[s].regions.length; i++) {
        data.push({
          state: staticRegions[s].state,
          title: staticRegions[s].regions[i],
          sort: sort++,
        });
      }
    }
    console.log("Seed regions started");
    await db.insert(region).values(data);
    console.log(`Seed regions completed (count: ${await db.$count(region)})`);
  } else console.log(`Seed regions skipped (count: ${regions.length})`);

  // const data: (typeof users.$inferInsert)[] = [];

  // for (let i = 0; i < 20; i++) {
  //   data.push({
  //     username: faker.internet.userName(),
  //     email: faker.internet.email(),
  //   });
  // }

  // console.log("Seed start");
  // await db.insert(users).values(data);
  console.log("Seed done");
};

main();
