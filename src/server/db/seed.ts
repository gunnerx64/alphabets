import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// import { faker } from "@faker-js/faker";
import * as schema from "./schema";
import "@/envConfig";

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.local");

const staticRegions = [
  { state: "РСФСР", regions: ["Архангельская обл.", "Белгородская обл."] },
  { state: "УССР", regions: ["Одесская обл."] },
];

const main = async () => {
  if (!process.env.DATABASE_URL) {
    console.log("env DATABASE_URL is not set");
    process.exit(1);
  }
  const client = postgres(process.env.DATABASE_URL);

  const db = drizzle(client, { schema });

  const foundRegions = await db.select().from(schema.regions);
  // console.log(`regions: ${regions.length}`);
  if (foundRegions.length < 1) {
    const data: (typeof schema.regions.$inferInsert)[] = [];
    let sort = 0;
    for (let s = 0; s < staticRegions.length; s++) {
      //@ts-expect-error
      for (let i = 0; i < staticRegions[s].regions.length; i++) {
        data.push({
          state: staticRegions[s]?.state,
          //@ts-expect-error
          title: staticRegions[s]?.regions[i],
          sort: sort++,
        });
      }
    }
    console.log("Seed regions started");
    await db.insert(schema.regions).values(data);
    console.log(
      //@ts-expect-error
      `Seed regions completed (count: ${await db.$count(schema.regions)})`,
    );
  } else console.log(`Seed regions skipped (count: ${foundRegions.length})`);

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
  process.exit(0);
};

main();
