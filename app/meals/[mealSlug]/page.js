import Image from 'next/image';
import classes from './page.module.css';
import { getSingleMeal } from '@/lib/meals';
import { notFound } from 'next/navigation';

export default function MealDetailPage({params}) {

    // mealSlug is dynamic route
    const meal = getSingleMeal(params.mealSlug);
    
    if (!meal) {
        notFound();
    }

    // Formatting inscurctions HTML as this didn't add <br> tags, so we just replace \n with the <br /> tags (g means all of it)
    meal.instructions = meal.instructions.replace(/\n/g, '<br />');

    return (
        <>
            <header className={classes.header}>
                <div className={classes.image}>
                    <Image src={meal.image} alt={meal.title} fill />
                </div>
                <div className={classes.headerText}>
                    <h1>{meal.title}</h1>
                    {/* We are using <a> anchor tag here for mailto purposes */}
                    <p className={classes.creator}>by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a></p>
                    <p className={classes.summary}>{meal.summary}</p>
                </div>
            </header>
            <main>
                <p className={classes.instructions} dangerouslySetInnerHTML={{
                    __html: meal.instructions,
                }}></p>
            </main>
        </>
    );
}