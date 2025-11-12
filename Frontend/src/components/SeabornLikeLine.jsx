import React from "react";
import { ResponsiveLine } from "@nivo/line";

const DEFAULT_COLORS = ["#38bdf8", "#8b5cf6", "#f97316", "#22c55e", "#ec4899", "#facc15"];

export default function SeabornLikeLine({
  data,
  isDark = false,
  xLabel = "X-Axis",
  yLabel = "Y-Axis",
  yFormat = (value) => Number(value).toFixed(2),
  colors = DEFAULT_COLORS,
  margin = { top: 40, right: 40, bottom: 60, left: 70 },
  pointSize = 10,
  lineWidth = 3,
  enableArea = false,
  axisBottomLegendOffset = 40,
  axisBottomTickRotation = 0,
  axisBottomTickPadding = 12,
  axisLeftLegendOffset = -50,
  axisLeftTickPadding = 10
}) {
  const axisColor = isDark ? "#dbeafe" : "#1e293b";
  const gridColor = isDark ? "rgba(148, 163, 255, 0.25)" : "rgba(148, 163, 255, 0.35)";
  const tooltipBackground = isDark ? "#0f172a" : "#ffffff";
  const tooltipText = isDark ? "#e2e8f0" : "#1e293b";

  return (
    <div style={{ height: 320 }}>
      <ResponsiveLine
        data={data}
        margin={margin}
        colors={colors}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 6,
          tickPadding: axisBottomTickPadding,
          tickRotation: axisBottomTickRotation,
          legend: xLabel,
          legendOffset: axisBottomLegendOffset,
          legendPosition: "middle"
        }}
        axisLeft={{
          tickSize: 6,
          tickPadding: axisLeftTickPadding,
          legend: yLabel,
          legendOffset: axisLeftLegendOffset,
          legendPosition: "middle",
          format: (value) => yFormat(value)
        }}
        lineWidth={lineWidth}
        enableArea={enableArea}
        areaOpacity={0.12}
        enableGridX={false}
        enableGridY
        gridYValues={6}
        pointSize={pointSize}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        useMesh
        tooltip={({ point }) => (
          <div
            style={{
              padding: "6px 10px",
              background: tooltipBackground,
              border: `1px solid ${point.borderColor}`,
              borderRadius: "8px",
              color: tooltipText,
              fontSize: 13
            }}
          >
            <div className="font-medium">{point.serieId}</div>
            <strong>{point.data.xFormatted ?? point.data.x}</strong>: {yFormat(point.data.y)}
          </div>
        )}
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
        animate
        motionConfig="wobbly"
        role="img"
        ariaLabel="SleepWise line chart"
      />
    </div>
  );
}
