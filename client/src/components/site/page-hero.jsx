export default function PageHero({ eyebrow, title, intro }) {
  return (
    <section className="border-b bg-ink text-white">
      <div className="container-rk py-20 md:py-28">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1 className="display mt-4 max-w-3xl text-4xl md:text-6xl">{title}</h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">{intro}</p>
        ) : null}
      </div>
    </section>
  );
}
