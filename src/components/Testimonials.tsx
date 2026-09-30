import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Container, SectionHeader, fadeUp, stagger, renderTitle } from "./ui";
import { useContent } from "../content/ContentContext";

const grads = [
  "from-rose-300 to-amber-400",
  "from-sky-300 to-indigo-400",
  "from-emerald-300 to-teal-500",
  "from-fuchsia-300 to-purple-500",
];

export default function Testimonials() {
  const { content } = useContent();
  const t = content.testimonials;
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-ink-900/70 to-transparent" />
      <Container>
        <SectionHeader eyebrow={t.eyebrow} title={renderTitle(t.title)} desc={t.description} />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-5 md:grid-cols-2"
        >
          {t.items.map((item, i) => (
            <motion.figure
              key={item.name + i}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group glass relative rounded-3xl p-8 transition-colors hover:border-gold-500/20"
            >
              <Quote className="absolute right-8 top-8 h-10 w-10 text-gold-400/10 transition-colors group-hover:text-gold-400/25" />
              <div className="flex items-center gap-1 text-gold-400">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 text-lg leading-relaxed text-slate-200">“{item.quote}”</blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <span className={`h-11 w-11 rounded-full bg-gradient-to-br ${grads[i % grads.length]} ring-2 ring-white/10`} />
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
