import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import fs from 'node:fs';

const db = sql('meals.db');

export async function getMeals() {
    // Adding a delay here as a Option (Not needed here, but just to gimic the loading behavior of a server of 2s)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    //throw new Error('loading meals failed');
    return (
        db.prepare('SELECT * FROM meals').all()
    );
}

export function getSingleMeal(slug) {
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
    meal.slug = slugify(meal.title, { lower: true }); // lower => all URL slug should be lowercase
    meal.instructions = xss(meal.instructions); // sanitizing the instructions

    const extension = meal.image.name.split('.').pop(); // Get the .png or .jpeg -> (Split & Pop)
    const fileName = `${meal.slug}.${extension}`;

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await meal.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
        if (error) {
            throw new Error('saving image failed!');
        }
    });

    meal.image = `/images/${fileName}`;

    db.prepare(`
        INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug)
        VALUES (
            @title,
            @summary,
            @instructions,
            @creator,
            @creator_email,
            @image,
            @slug
        )
        `).run(meal);
}