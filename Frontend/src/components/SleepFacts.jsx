import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ALL_FACTS = [
  {
    title: "Sleep strengthens memory",
    description: "During deep sleep the brain consolidates memories and reinforces new learning."
  },
  {
    title: "Dreaming enhances creativity",
    description: "REM sleep helps the brain form novel associations, boosting creativity and problem solving."
  },
  {
    title: "Sleep deprivation mimics drunkenness",
    description: "Staying awake for 17 hours can impair cognition as much as a 0.05 percent blood alcohol level."
  },
  {
    title: "Sleep clears brain waste",
    description: "The glymphatic system flushes out toxins such as beta amyloid during slow wave sleep."
  },
  {
    title: "Sleep improves focus",
    description: "A single poor night can cut attention span and reaction time by more than thirty percent."
  },
  {
    title: "REM stabilises emotions",
    description: "Dream sleep processes emotional experiences, reducing anxiety and stress responses."
  },
  {
    title: "Power naps work",
    description: "A focused twenty minute nap can enhance alertness, learning, and motor performance."
  },
  {
    title: "Rest supports decisions",
    description: "Well rested people make more accurate and ethical choices than the sleep deprived."
  },
  {
    title: "Sleep builds neural links",
    description: "Overnight, new information is integrated into long term memory networks."
  },
  {
    title: "Sleep loss clouds judgement",
    description: "Lack of sleep lowers self awareness, hiding how tired you really are."
  },
  {
    title: "Sleep strengthens immunity",
    description: "Nightly rest releases cytokines that help fight infection and inflammation."
  },
  {
    title: "Short sleep raises illness risk",
    description: "Adults who sleep under seven hours are roughly three times more likely to catch a cold."
  },
  {
    title: "Sleep balances appetite",
    description: "Poor sleep raises hunger hormone ghrelin and lowers satiety hormone leptin."
  },
  {
    title: "Sleep guards against diabetes",
    description: "Chronic sleep loss reduces insulin sensitivity and elevates blood sugar levels."
  },
  {
    title: "Sleep protects the heart",
    description: "Seven to nine hours per night helps lower blood pressure and heart disease risk."
  },
  {
    title: "Sleep repairs muscles",
    description: "Growth hormone, vital for tissue repair, is released mainly during deep sleep."
  },
  {
    title: "Sleep loss fuels inflammation",
    description: "Insufficient rest raises C reactive protein, a marker tied to chronic disease."
  },
  {
    title: "Sleep ties to longevity",
    description: "People who consistently sleep seven to eight hours tend to live longer."
  },
  {
    title: "Sleep steers metabolism",
    description: "Fragmented sleep can slow metabolic rate and make weight management harder."
  },
  {
    title: "Sleep aids detox",
    description: "The liver and kidneys complete key detox responsibilities more efficiently overnight."
  },
  {
    title: "Adults thrive on 7-9 hours",
    description: "Most adults operate best in this window; anything less builds sleep debt."
  },
  {
    title: "Sleep cycles average ninety minutes",
    description: "Each night we loop through light, deep, and REM stages four to six times."
  },
  {
    title: "Deep sleep peaks early",
    description: "The first few sleep cycles contain the highest proportion of slow wave sleep."
  },
  {
    title: "REM sleep dominates mornings",
    description: "Later cycles feature longer and more vivid dream phases."
  },
  {
    title: "Everyone dreams",
    description: "Most people experience three to five dreams nightly even if they forget them."
  },
  {
    title: "Cooler rooms aid rest",
    description: "Body temperature drops during sleep; a room near sixty five degrees Fahrenheit supports quality rest."
  },
  {
    title: "Sleep patterns evolve",
    description: "Age brings lighter sleep, shorter duration, and less slow wave sleep."
  },
  {
    title: "Screens delay sleep",
    description: "Blue light from devices suppresses melatonin, the hormone that cues sleep."
  },
  {
    title: "Morning light resets clocks",
    description: "Daylight exposure soon after waking helps anchor your circadian rhythm."
  },
  {
    title: "Chronotypes are genetic",
    description: "Whether you are a night owl or early bird is partly set by your DNA."
  },
  {
    title: "Sleep calms anxiety",
    description: "Consistent rest lowers amygdala reactivity and steadies emotional responses."
  },
  {
    title: "Insomnia links to depression",
    description: "Roughly three quarters of people with depression report disrupted sleep."
  },
  {
    title: "Tired brains skew negative",
    description: "Sleep deprivation heightens reactions to stress and frustration."
  },
  {
    title: "Rest boosts empathy",
    description: "Well rested individuals show stronger social and emotional understanding."
  },
  {
    title: "Sleep processes trauma",
    description: "REM sleep replays emotional memories safely, easing their intensity over time."
  },
  {
    title: "Rest fuels motivation",
    description: "Sufficient sleep improves dopamine sensitivity, enhancing drive and goal pursuit."
  },
  {
    title: "Sleep shifts pain perception",
    description: "Poor sleep lowers endorphin activity, making pain feel more intense."
  },
  {
    title: "Mindfulness aids sleep",
    description: "Relaxation practices before bed lower cortisol and ease the path to sleep."
  },
  {
    title: "Sleep preserves cognition",
    description: "Reliable sleep helps maintain mental sharpness and brain volume with age."
  },
  {
    title: "Sleep lifts happiness",
    description: "People who sleep well report higher overall life satisfaction."
  }
];

const FACTS_TO_SHOW = 4;

function pickRandomFacts(source, count) {
  if (!Array.isArray(source) || source.length === 0) {
    return [];
  }
  const seen = new Set();
  const selection = [];
  while (selection.length < count && seen.size < source.length) {
    const index = Math.floor(Math.random() * source.length);
    if (!seen.has(index)) {
      seen.add(index);
      selection.push(source[index]);
    }
  }
  return selection;
}

export default function SleepFacts() {
  const [facts, setFacts] = useState([]);

  useEffect(() => {
    setFacts(pickRandomFacts(ALL_FACTS, FACTS_TO_SHOW));
  }, []);

  return (
    <section id="facts" className="mx-auto max-w-6xl px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center text-night-900 transition-colors dark:text-white"
      >
        <h2 className="text-4xl font-semibold">Did You Know?</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Refresh the page to explore new science backed sleep insights tailored for quick inspiration.
        </p>
      </motion.div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {facts.map((fact) => (
          <motion.article
            key={fact.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-night-200/40 bg-white/90 p-6 text-left text-night-900 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            <h3 className="text-xl font-semibold">{fact.title}</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-200">{fact.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
