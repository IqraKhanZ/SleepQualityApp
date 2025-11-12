import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const DEFAULT_PALETTE = ["#8b5cf6", "#38bdf8", "#f97316", "#22c55e", "#ec4899", "#facc15"];
const DEFAULT_MARGIN = { top: 32, right: 24, bottom: 56, left: 64 };

export default function SeabornLikeChart({
  data,
  isDark = false,
  keys = ["value"],
  indexBy = "category",
  categoryLabel = "Category",
  valueLabel = "Value",
  colorMap,
  valueFormatter = (value) => Number(value).toFixed(2),
  layout = "vertical",
  groupMode = "grouped",
  padding = 0.35,
  innerPadding = 2,
  margin = DEFAULT_MARGIN,
  indexScale,
  valueScale,
  colors,
  legends: customLegends,
  axisBottomLegendOffset,
  axisBottomTickRotation,
  axisBottomTickPadding,
  axisLeftLegendOffset,
  axisLeftTickPadding
}) {
  const axisColor = isDark ? "#dbeafe" : "#1e293b";
  const gridColor = isDark ? "rgba(148, 163, 255, 0.25)" : "rgba(148, 163, 255, 0.35)";
  const tooltipBackground = isDark ? "#0f172a" : "#ffffff";
  const tooltipText = isDark ? "#e2e8f0" : "#1e293b";
  const isHorizontal = layout === "horizontal";

  const colorResolver = (bar) => {
    const key = bar.id || bar.data?.[indexBy];
    if (colorMap && key && colorMap[key]) {
      return colorMap[key];
    }
    if (bar.data && bar.data.color) {
      return bar.data.color;
    }
    const paletteIndex = typeof bar.index === "number" ? bar.index % DEFAULT_PALETTE.length : 0;
    return DEFAULT_PALETTE[paletteIndex];
  };

  const bottomLegendOffset = typeof axisBottomLegendOffset === "number"
    ? axisBottomLegendOffset
    : isHorizontal ? 44 : 40;
  const bottomTickPadding = typeof axisBottomTickPadding === "number" ? axisBottomTickPadding : 12;
  const bottomTickRotation = typeof axisBottomTickRotation === "number" ? axisBottomTickRotation : 0;
  const leftLegendOffset = typeof axisLeftLegendOffset === "number"
    ? axisLeftLegendOffset
    : isHorizontal ? -64 : -52;
  const leftTickPadding = typeof axisLeftTickPadding === "number" ? axisLeftTickPadding : 10;

  const axisBottom = {
    tickSize: 6,
    tickPadding: bottomTickPadding,
    tickRotation: bottomTickRotation,
    legend: isHorizontal ? valueLabel : categoryLabel,
    legendPosition: "middle",
    legendOffset: bottomLegendOffset,
    format: isHorizontal ? (value) => valueFormatter(value) : undefined
  };

  const axisLeft = {
    tickSize: 6,
    tickPadding: leftTickPadding,
    legend: isHorizontal ? categoryLabel : valueLabel,
    legendPosition: "middle",
    legendOffset: leftLegendOffset,
    format: !isHorizontal ? (value) => valueFormatter(value) : undefined
  };

  const legends = typeof customLegends !== "undefined"
    ? customLegends
    : keys.length > 1
      ? [
          {
            dataFrom: "keys",
            anchor: "top-right",
            direction: "column",
            justify: false,
            translateX: 0,
            translateY: 0,
            itemsSpacing: 6,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 16,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: { itemOpacity: 1 }
              }
            ]
          }
        ]
      : [];

  return (
    <div style={{ height: 320 }}>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={margin}
        padding={padding}
        innerPadding={innerPadding}
        colors={colors ?? colorResolver}
        layout={layout}
        groupMode={groupMode}
        valueScale={valueScale}
        indexScale={indexScale}
        borderRadius={6}
        borderColor={{ from: "color", modifiers: [["darker", 1.2]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={axisBottom}
        axisLeft={axisLeft}
        enableGridY={!isHorizontal}
        enableGridX={isHorizontal}
        gridYValues={6}
        enableLabel
        labelSkipHeight={18}
        labelSkipWidth={18}
        labelTextColor={{ from: "color", modifiers: [["darker", 3]] }}
        legends={legends}
        tooltip={({ value, color, indexValue, id }) => (
          <div
            style={{
              padding: "6px 10px",
              background: tooltipBackground,
              border: `1px solid ${color}`,
              borderRadius: "8px",
              color: tooltipText,
              fontSize: 13
            }}
          >
            {keys.length > 1 && <div className="font-medium">{id}</div>}
            <strong>{indexValue}</strong>: {valueFormatter(value)}
          </div>
        )}
        animate
        motionConfig="wobbly"
        theme={{
          textColor: axisColor,
          fontSize: 13,
          axis: {
            ticks: {
              line: {
                stroke: axisColor,
                strokeWidth: 1
              },
              text: {
                fill: axisColor,
                fontWeight: 500
              }
            },
            legend: {
              text: {
                fill: axisColor,
                fontWeight: 600
              }
            }
          },
          grid: {
            line: {
              stroke: gridColor,
              strokeDasharray: "3 3"
            }
          }
        }}
        role="img"
        ariaLabel="SleepWise comparison chart"
      />
    </div>
  );
}
