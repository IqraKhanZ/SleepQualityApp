import React, { useEffect, useState } from "react";
import SeabornLikeChart from "./SeabornLikeChart.jsx";
import SeabornLikeLine from "./SeabornLikeLine.jsx";
import useIsDarkMode from "../hooks/useIsDarkMode.js";

const DEFAULT_TRANSFORMER = (raw) => {
  const genderLabels = new Map([
    ["0", "Male"],
    ["1", "Female"],
    ["male", "Male"],
    ["female", "Female"]
  ]);

  const palette = { Male: "#8b5cf6", Female: "#38bdf8" };

  const data = (Array.isArray(raw) ? raw : []).map((entry, index) => {
    const rawGender = entry.Gender ?? entry.gender ?? `Category ${index + 1}`;
    const labelKey = String(rawGender).toLowerCase();
    const category = genderLabels.get(labelKey) || genderLabels.get(String(rawGender)) || String(rawGender);
    const value = Number(entry["Sleep Quality"] ?? entry.sleepQuality ?? entry.value ?? 0);

    return {
      category,
      value: Number.isFinite(value) ? Number(value.toFixed(2)) : 0,
      color: palette[category]
    };
  });

  return {
    chartType: "bar",
    props: {
      data,
      keys: ["value"],
      indexBy: "category",
      categoryLabel: "Gender",
      valueLabel: "Sleep Quality",
      colorMap: palette,
      valueFormatter: (v) => Number(v).toFixed(2)
    }
  };
};

const normalizeChartResult = (result) => {
  if (!result) {
    return null;
  }

  if (result.chartType) {
    const { chartType, props = {}, ...rest } = result;
    const resolvedProps = {
      ...(typeof rest === "object" ? rest : {}),
      ...(typeof props === "object" && !Array.isArray(props) ? props : {})
    };
    return { chartType, props: resolvedProps };
  }

  return { chartType: "bar", props: result };
};

const isChartDataEmpty = (chart) => {
  if (!chart || !chart.props) {
    return true;
  }

  const { chartType, props } = chart;

  if (chartType === "line") {
    if (!Array.isArray(props.data) || props.data.length === 0) {
      return true;
    }
    return props.data.every((serie) => !Array.isArray(serie.data) || serie.data.length === 0);
  }

  return !Array.isArray(props.data) || props.data.length === 0;
};

export default function SleepChart({ config = {} }) {
  const {
    dataPath = "/data/chart_data.json",
    transformer = DEFAULT_TRANSFORMER,
    emptyMessage = "No chart data available yet."
  } = config;

  const isDark = useIsDarkMode();
  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartProps, setChartProps] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError(null);

    fetch(dataPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load chart data: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        if (isMounted) {
          setRawData(json);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Unable to load chart data");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dataPath]);

  useEffect(() => {
    if (!rawData) {
      setChartProps(null);
      return;
    }

    try {
      const result = transformer(rawData);
      setChartProps(normalizeChartResult(result));
    } catch (err) {
      setError(err.message || "Unable to transform chart data");
      setChartProps(null);
    }
  }, [rawData, transformer]);

  if (isLoading) {
    return (
      <div className="h-80 w-full rounded-3xl border border-night-200/30 bg-white/60 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <div className="h-full w-full animate-pulse rounded-2xl bg-night-200/40 dark:bg-white/10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-700 dark:border-red-300/40 dark:bg-red-400/10 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (!chartProps || isChartDataEmpty(chartProps)) {
    return (
      <div className="rounded-2xl border border-night-200/40 bg-white/60 p-4 text-sm text-night-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
        {emptyMessage}
      </div>
    );
  }

  const { chartType, props } = chartProps;

  if (chartType === "line") {
    return <SeabornLikeLine {...props} isDark={isDark} />;
  }

  return <SeabornLikeChart {...props} isDark={isDark} />;
}
