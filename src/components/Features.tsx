import { motion } from "framer-motion";
import { FileCheck2, Landmark, Compass, HandCoins, Scale, KeyRound } from "lucide-react";
import { Container, SectionHeader, fadeUp, stagger, renderTitle } from "./ui";
import { useContent } from "../content/ContentContext";

const icons = [FileCheck2, Landmark, Compass, HandCoins, Scale, KeyRound];

export default function Features() {
  const { content } = useContent();
  const f = content.features;
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute left-0 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gold-500/5 blur-[120px]" />
      <Container>
        <SectionHeader eyebrow={f.eyebrow} title={renderTitle(f.title)} desc={f.description} />
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {f.items.map(({ title, desc }, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.li
                key={title + i}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group glass relative overflow-hidden rounded-3xl p-7"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold-400/0 blur-3xl transition-all duration-500 group-hover:bg-gold-400/20" />
                <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-gold-500/20 bg-gold-500/10 text-gold-300 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-500/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{desc}</p>
                <span className="mt-6 block h-px w-10 bg-gold-400/40 transition-all duration-500 group-hover:w-full" />
              </motion.li>
            );
          })}
        </motion.ul>
      </Container>
    </section>
  );
}
