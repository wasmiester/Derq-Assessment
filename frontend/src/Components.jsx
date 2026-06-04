import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";

export function BarChart({ data }) {
  const barRef = useRef(null);
  const barInst = useRef(null);
  useEffect(() => {
    if (data.length > 0 && barRef.current) {
      const countries = data.map((item) => item.country_code);
      const traffVol = data.map((item) => item.total_volume);

      if (barInst.current) {
        barInst.current.destroy();
      }

      const ctx = barRef.current.getContext("2d");
      barInst.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: countries,
          datasets: [
            {
              label: "Traffic Volume",
              data: traffVol,
              backgroundColor: "rgba(75, 192, 192, 0.7)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Country-wise Traffic Volume",
            },
            legend: {
              display: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [data]);
  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <canvas ref={barRef}></canvas>
    </div>
  );
}

export function Doughnut({ data }) {
  const doughRef = useRef(null);
  const doughInstance = useRef(null);

  useEffect(() => {
    if (data.length > 0 && doughRef.current) {
      const vTypes = data.map((item) => item.vehicle_type);
      const vCounts = data.map((item) => item.vehicle_count);

      if (doughInstance.current) {
        doughInstance.current.destroy();
      }

      const colors = [
        "red",
        "green",
        "blue",
        "purple",
        "pink",
        "grey",
      ];

      const ctx = doughRef.current.getContext("2d");
      doughInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: vTypes,
          datasets: [
            {
              label: "Vehicle Count",
              data: vCounts,
              backgroundColor: colors.slice(0, vTypes.length),
              borderColor: colors
                .slice(0, vTypes.length)
                .map((c) => c.replace("0.7", "1")),
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
              display: true,
              text: "Vehicle Type Distribution",
            },
            legend: {
              display: true,
              position: "right",
            },
          },
        },
      });
    }
  }, [data]);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <canvas ref={doughRef}></canvas>
    </div>
  );
}

export function Line({ data }) {
  const trendRef = useRef(null);
  const trendInstance = useRef(null);

  useEffect(() => {
    if (data.length > 0 && trendRef.current) {
      const timelines = data.map((item) =>
        new Date(item.time_stamp).toLocaleDateString(),
      );
      const timelineVolumes = data.map((item) =>
        parseInt(item.traff_volume, 10),
      );

      if (trendInstance.current) {
        trendInstance.current.destroy();
      }

      const ctx = trendRef.current.getContext("2d");
      trendInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: timelines,
          datasets: [
            {
              label: "Volume Flow Over Timeline",
              data: timelineVolumes,
              fill: true,
              borderColor: "rgba(153, 102, 255, 1)",
              backgroundColor: "rgba(153, 102, 255, 0.2)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
              display: true,
              text: "Historical Traffic Density Trends (Bonus)",
            },
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [data]);

  return (
    <div
      style={{
        marginTop: "40px",
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <canvas ref={trendRef}></canvas>
    </div>
  );
}

