import Image from "next/image";
import classes from "./hero.module.css";

export default function Hero() {
  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image
          src="/images/site/me2.jpg"
          alt="Image showing Kevin"
          width={300}
          height={300}
        />
      </div>

      <h1>Hi, I'm Kevin Tomas!</h1>
      <p>I blog about web and mobile app development</p>
    </section>
  );
}
