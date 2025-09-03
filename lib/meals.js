import sql from 'better-sqlite3';

const db = sql('meals.db');

export async function getMeals() {
    // Adding a delay here as a Option (Not needed here, but just to gimic the loading behavior of a server of 2s)
    await new Promise((resolve) => setTimeout(resolve, 2000));

   return(
        db.prepare('SELECT * FROM meals').all()
   );
}