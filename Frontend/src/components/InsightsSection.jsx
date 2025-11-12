import React from "react";
import { motion } from "framer-motion";
import SleepChart from "./SleepChart.jsx";

const QUALITY_FORMATTER = (value) => Number(value ?? 0).toFixed(2);
const integerFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const ACTIVITY_LABELS = {
  "-1": "Low Activity",
  "0": "Moderate Activity",
  "1": "High Activity"
};

const ACTIVITY_COLORS = {
  "Low Activity": "#f97316",
  "Moderate Activity": "#38bdf8",
  "High Activity": "#8b5cf6"
};

const DIET_LABELS = {
  "-1": "Irregular Diet",
  "0": "Balanced Diet",
  "1": "Nutritious Diet"
};

const DIET_COLORS = {
  "Irregular Diet": "#ef4444",
  "Balanced Diet": "#f97316",
  "Nutritious Diet": "#22c55e"
};

const AGE_ORDER = ["18-25", "26-35", "36-45", "46-55", "56-65", "66-75"];

const BEDTIME_COLORS = {
  "21:00-22:00": "#22c55e",
  "22:00-23:00": "#38bdf8",
  "23:00-24:00": "#8b5cf6"
};

const CALORIES_COLORS = ["#0ea5e9"];
const STEPS_COLORS = ["#22c55e"];
const AGE_LINE_COLORS = ["#8b5cf6"];

const GENDER_LABELS = {
  "0": "Male",
  "1": "Female",
  male: "Male",
  female: "Female"
};

const formatRangeBucket = (bucket, fallbackLabel, suffix = "") => {
  if (!bucket || typeof bucket !== "object") {
    return fallbackLabel;
  }

  const left = bucket.left ?? bucket[0];
  const right = bucket.right ?? bucket[1];
  const mid = bucket.mid ?? bucket.Cal_Mid ?? bucket.Step_Mid;

  if (Number.isFinite(left) && Number.isFinite(right)) {
    const leftRounded = Math.round(left);
    const rightRounded = Math.round(right);
    return `${integerFormatter.format(leftRounded)}-${integerFormatter.format(rightRounded)}${suffix}`;
  }

  if (Number.isFinite(mid)) {
    const midRounded = Math.round(mid);
    return `${integerFormatter.format(midRounded)}${suffix}`;
  }

  return fallbackLabel;
};

const createBarChart = (raw, {
  categoryKey,
  valueKey,
  categoryLabel,
  valueLabel,
  labelMap = {},
  palette = {},
  valueFormatter = QUALITY_FORMATTER,
  axisBottomLegendOffset,
  axisBottomTickPadding,
  axisBottomTickRotation,
  axisLeftLegendOffset,
  axisLeftTickPadding
}) => {
  const source = Array.isArray(raw) ? raw : [];

  const data = source.map((entry, index) => {
    const rawCategory = entry?.[categoryKey] ?? `Category ${index + 1}`;
    const stringKey = String(rawCategory);
    const label = labelMap[stringKey] ?? labelMap[rawCategory] ?? stringKey;
    const rawValue = Number(entry?.[valueKey] ?? entry?.value ?? 0);
    const value = Number.isFinite(rawValue) ? Number(rawValue.toFixed(2)) : 0;
    const color = palette[label];

    return {
      category: label,
      value,
      ...(color ? { color } : {})
    };
  });

  return {
    chartType: "bar",
    props: {
      data,
      keys: ["value"],
      indexBy: "category",
      categoryLabel,
      valueLabel,
      colorMap: palette,
      valueFormatter,
      ...(axisBottomLegendOffset !== undefined ? { axisBottomLegendOffset } : {}),
      ...(axisBottomTickPadding !== undefined ? { axisBottomTickPadding } : {}),
      ...(axisBottomTickRotation !== undefined ? { axisBottomTickRotation } : {}),
      ...(axisLeftLegendOffset !== undefined ? { axisLeftLegendOffset } : {}),
      ...(axisLeftTickPadding !== undefined ? { axisLeftTickPadding } : {})
    }
  };
};

const createLineChart = (raw, {
  categoryKey,
  valueKey,
  categoryLabel,
  valueLabel,
  seriesId = "Series",
  labelMap = {},
  order,
  colors,
  axisBottomLegendOffset,
  axisBottomTickRotation,
  axisBottomTickPadding,
  axisLeftLegendOffset,
  axisLeftTickPadding
}) => {
  const source = Array.isArray(raw) ? raw : [];

  let points = source.map((entry, index) => {
    const rawCategory = entry?.[categoryKey] ?? `Category ${index + 1}`;
    const stringKey = String(rawCategory);
    const label = labelMap[stringKey] ?? labelMap[rawCategory] ?? stringKey;
    const rawValue = Number(entry?.[valueKey] ?? entry?.value ?? 0);
    const value = Number.isFinite(rawValue) ? Number(rawValue.toFixed(2)) : null;

    return {
      label,
      value,
      order: Array.isArray(order) ? order.indexOf(label) : index
    };
  }).filter((point) => point.value !== null);

  if (Array.isArray(order)) {
    points = points.sort((a, b) => {
      const orderA = a.order === -1 ? Number.MAX_SAFE_INTEGER : a.order;
      const orderB = b.order === -1 ? Number.MAX_SAFE_INTEGER : b.order;
      return orderA - orderB;
    });
  }

  return {
    chartType: "line",
    props: {
      data: [
        {
          id: seriesId,
          data: points.map((point) => ({ x: point.label, y: point.value }))
        }
      ],
      xLabel: categoryLabel,
      yLabel: valueLabel,
      yFormat: QUALITY_FORMATTER,
      colors,
      ...(axisBottomLegendOffset !== undefined ? { axisBottomLegendOffset } : {}),
      ...(axisBottomTickRotation !== undefined ? { axisBottomTickRotation } : {}),
      ...(axisBottomTickPadding !== undefined ? { axisBottomTickPadding } : {}),
      ...(axisLeftLegendOffset !== undefined ? { axisLeftLegendOffset } : {}),
      ...(axisLeftTickPadding !== undefined ? { axisLeftTickPadding } : {})
    }
  };
};

const createRangeLineChart = (raw, {
  rangeKey,
  valueKey,
  categoryLabel,
  valueLabel,
  seriesId,
  fallbackLabel,
  suffix = "",
  sortKey,
  colors,
  axisBottomLegendOffset,
  axisBottomTickRotation,
  axisBottomTickPadding,
  axisLeftLegendOffset,
  axisLeftTickPadding
}) => {
  const source = Array.isArray(raw) ? raw : [];

  const points = source
    .map((entry, index) => {
      const bucket = entry?.[rangeKey];
      const fallback = `${fallbackLabel ?? "Range"} ${index + 1}`;
      const label = formatRangeBucket(bucket, fallback, suffix);
      const rawValue = Number(entry?.[valueKey] ?? entry?.value ?? 0);
      if (!Number.isFinite(rawValue)) {
        return null;
      }
      const midCandidate = Number(entry?.[sortKey]) || Number(bucket?.mid) || Number(bucket?.Cal_Mid) || Number(bucket?.Step_Mid);

      return {
        label,
        value: Number(rawValue.toFixed(2)),
        order: Number.isFinite(midCandidate) ? midCandidate : index
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  return {
    chartType: "line",
    props: {
      data: [
        {
          id: seriesId ?? valueLabel,
          data: points.map((point) => ({ x: point.label, y: point.value }))
        }
      ],
      xLabel: categoryLabel,
      yLabel: valueLabel,
      yFormat: QUALITY_FORMATTER,
      colors,
      ...(axisBottomLegendOffset !== undefined ? { axisBottomLegendOffset } : {}),
      ...(axisBottomTickRotation !== undefined ? { axisBottomTickRotation } : {}),
      ...(axisBottomTickPadding !== undefined ? { axisBottomTickPadding } : {}),
      ...(axisLeftLegendOffset !== undefined ? { axisLeftLegendOffset } : {}),
      ...(axisLeftTickPadding !== undefined ? { axisLeftTickPadding } : {})
    }
  };
};

const createGenderActivityChart = (raw) => {
  const source = Array.isArray(raw) ? raw : [];
  const genderBuckets = new Map();

  source.forEach((entry, index) => {
    const genderRaw = entry?.Gender ?? entry?.gender ?? `Group ${index + 1}`;
    const genderKey = String(genderRaw);
    const genderLabel = GENDER_LABELS[genderKey] ?? GENDER_LABELS[genderRaw] ?? genderKey;

    const activityRaw = entry?.["Physical Activity Level"] ?? index;
    const activityKey = String(activityRaw);
    const activityLabel = ACTIVITY_LABELS[activityKey] ?? ACTIVITY_LABELS[activityRaw] ?? `Level ${activityKey}`;

    const rawValue = Number(entry?.["Average Sleep Quality"] ?? entry?.value ?? 0);
    const value = Number.isFinite(rawValue) ? Number(rawValue.toFixed(2)) : null;

    if (value === null) {
      return;
    }

    if (!genderBuckets.has(genderLabel)) {
      genderBuckets.set(genderLabel, { category: genderLabel });
    }

    const bucket = genderBuckets.get(genderLabel);
    bucket[activityLabel] = value;
  });

  const genderOrder = ["Male", "Female"];
  const orderedData = [];
  genderOrder.forEach((label) => {
    if (genderBuckets.has(label)) {
      orderedData.push(genderBuckets.get(label));
      genderBuckets.delete(label);
    }
  });
  genderBuckets.forEach((value) => orderedData.push(value));

  const keyOrder = ["Low Activity", "Moderate Activity", "High Activity"];
  const keys = keyOrder.filter((key) => orderedData.some((entry) => typeof entry[key] === "number"));

  return {
    chartType: "bar",
    props: {
      data: orderedData,
      keys,
      indexBy: "category",
      categoryLabel: "Gender",
      valueLabel: "Average Sleep Quality",
      colorMap: ACTIVITY_COLORS,
      valueFormatter: QUALITY_FORMATTER,
      layout: "horizontal",
      groupMode: "grouped",
      padding: 0.4,
      margin: { top: 32, right: 48, bottom: 84, left: 120 },
      axisBottomLegendOffset: 56,
      axisBottomTickPadding: 10,
      axisLeftLegendOffset: -90,
      axisLeftTickPadding: 16,
      legends: [
        {
          dataFrom: "keys",
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 50,
          itemsSpacing: 12,
          itemWidth: 120,
          itemHeight: 18,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 14,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: { itemOpacity: 1 }
            }
          ]
        }
      ]
    }
  };
};

const CHART_DEFINITIONS = [
  {
    title: "Sleep Quality by Gender",
    description: "Baseline comparison of average sleep quality between genders across the dataset.",
    config: {}
  },
  {
    title: "Sleep Quality by Activity Level",
    description: "See how daily movement influences restfulness in the combined sample.",
    config: {
      dataPath: "/data/chart_activity_sleep.json",
      transformer: (raw) => createBarChart(raw, {
        categoryKey: "Physical Activity Level",
        valueKey: "Average Sleep Quality",
        categoryLabel: "Physical Activity Level",
        valueLabel: "Average Sleep Quality",
        labelMap: ACTIVITY_LABELS,
        palette: ACTIVITY_COLORS,
        axisBottomLegendOffset: 52,
        axisBottomTickPadding: 14
      })
    }
  },
  {
    title: "Diet Quality and Sleep",
    description: "Compare how nutrition profiles align with reported sleep quality.",
    config: {
      dataPath: "/data/chart_diet_sleep.json",
      transformer: (raw) => createBarChart(raw, {
        categoryKey: "Dietary Habits",
        valueKey: "Average Sleep Quality",
        categoryLabel: "Diet Quality",
        valueLabel: "Average Sleep Quality",
        labelMap: DIET_LABELS,
        palette: DIET_COLORS,
        axisBottomLegendOffset: 52,
        axisBottomTickPadding: 14
      })
    }
  },
  {
    title: "Sleep Quality by Age Group",
    description: "Spot how sleep satisfaction shifts from young adults through retirement age.",
    config: {
      dataPath: "/data/chart_age_sleep.json",
      transformer: (raw) => createLineChart(raw, {
        categoryKey: "Age Group",
        valueKey: "Average Sleep Quality",
        categoryLabel: "Age Group",
        valueLabel: "Average Sleep Quality",
        order: AGE_ORDER,
        colors: AGE_LINE_COLORS,
        seriesId: "Average Sleep Quality",
        axisBottomLegendOffset: 46,
        axisBottomTickPadding: 12
      })
    }
  },
  {
    title: "Bedtime Habits",
    description: "Later bedtimes align with lower quality scores in this aggregated view.",
    config: {
      dataPath: "/data/chart_bedtime_sleep.json",
      transformer: (raw) => createBarChart(raw, {
        categoryKey: "Bedtime Hour Range",
        valueKey: "Average Sleep Quality",
        categoryLabel: "Bedtime Window",
        valueLabel: "Average Sleep Quality",
        palette: BEDTIME_COLORS,
        axisBottomLegendOffset: 52,
        axisBottomTickPadding: 14
      })
    }
  },
  {
    title: "Calories Burned vs Sleep",
    description: "Track how increasing calorie expenditure maps to better sleep quality.",
    config: {
      dataPath: "/data/chart_calories_sleep.json",
      transformer: (raw) => createRangeLineChart(raw, {
        rangeKey: "Calories Range",
        valueKey: "Average Sleep Quality",
        categoryLabel: "Daily Calorie Range",
        valueLabel: "Average Sleep Quality",
        fallbackLabel: "Calorie Band",
        suffix: " kcal",
        sortKey: "Cal_Mid",
        colors: CALORIES_COLORS,
        seriesId: "Average Sleep Quality",
        axisBottomLegendOffset: 54,
        axisBottomTickRotation: -28,
        axisBottomTickPadding: 6
      })
    }
  },
  {
    title: "Steps per Day and Sleep",
    description: "Higher step counts show a steady rise in reported sleep quality.",
    config: {
      dataPath: "/data/chart_steps_sleep.json",
      transformer: (raw) => createRangeLineChart(raw, {
        rangeKey: "Step Range",
        valueKey: "Average Sleep Quality",
        categoryLabel: "Daily Step Range",
        valueLabel: "Average Sleep Quality",
        fallbackLabel: "Step Band",
        suffix: " steps",
        sortKey: "Step_Mid",
        colors: STEPS_COLORS,
        seriesId: "Average Sleep Quality",
        axisBottomLegendOffset: 54,
        axisBottomTickRotation: -28,
        axisBottomTickPadding: 6
      })
    }
  },
  {
    title: "Sleep Quality by Gender and Activity Level",
    description: "Compare activity-driven restfulness within each gender.",
    config: {
      dataPath: "/data/chart_gender_activity_sleep.json",
      transformer: createGenderActivityChart,
      emptyMessage: "Add gender plus activity data to surface this comparison."
    }
  }
];

export default function InsightsSection() {
  return (
    <section id="insights" className="mx-auto max-w-6xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center text-night-900 transition-colors dark:text-white"
      >
        <h2 className="text-4xl font-semibold">Explore key insights and sleep trends powered by real datasets.</h2>
      </motion.div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {CHART_DEFINITIONS.map((chart, index) => (
          <motion.div
            key={chart.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="rounded-3xl border border-night-200/40 bg-white/80 p-6 backdrop-blur-xl transition-colors dark:border-white/5 dark:bg-white/5"
          >
            <h3 className="text-lg font-semibold text-night-900 dark:text-white">{chart.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{chart.description}</p>
            <div className="mt-6">
              <SleepChart config={chart.config} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
