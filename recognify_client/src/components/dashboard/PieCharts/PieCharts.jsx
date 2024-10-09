import React, { use, useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieCharts = ({ init, progress, Completed }) => {
  const [pieData, setPieData] = useState([init, progress, Completed]);
  console.log(pieData);
  useEffect(() => {
    setPieData([init, progress, Completed]);
  }, [init, progress, Completed]);

  const data = {
    labels: ["Initial Stage", "In Progress", "Completed"],
    datasets: [
      {
        label: "# of Votes",
        data: pieData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="col-lg-5">
      <div className="card card-carousel overflow-hidden h-100 p-0">
        <div className="card-header pb-0 pt-3 bg-transparent">
          <h6 className="text-capitalize">Works</h6>
        </div>
        <div
          id="carouselExampleCaptions"
          className="carousel slide h-100 pointer-event d-flex justify-content-center"
          data-bs-ride="carousel"
        >
          <div
            className="carousel-inner border-radius-lg h-100"
            style={{ maxHeight: "425px !important" }}
          >
            <Pie
              style={{
                minWidth: "calc(100vw - 77vw)",
                minHeight: "calc(100vh - 72vh)",
                height: "392px",
                width: "392px",
              }}
              maintainAspectRatio={true}
              data={data}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieCharts;
