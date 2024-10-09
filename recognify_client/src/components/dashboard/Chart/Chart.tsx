
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const Chart = ({ labels = [], data = [], total = 0 }) => {
  return (
    <div className="col-lg-7 mb-lg-0 mb-4">
      <div className="card z-index-2 h-100 ">
        <div className="card-header pb-0 pt-3 bg-transparent">
          <h6 className="text-capitalize">Leads Generated</h6>
          <p className="text-sm mb-0">
            <i className="fa fa-arrow-up text-success" aria-hidden="true"></i>
            <span className="font-weight-bold">
              {total || 0} leads generated this month{" "}
            </span>{" "}
            {/* {DDMMYYYY(new Date().toDateString())} */}
          </p>
        </div>
        <div className="card-body p-3">
          <div className="chart" style={{ height: "320px" }}>
            <Line
              style={{
                minWidth: "calc(100vw - 57vw)",
                minHeight: "calc(100vh - 72vh)",
              }}
              data={{
                labels,
                datasets: [
                  {
                    label: "My First Dataset",
                    data,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                  },
                ],
              }}
              options={{ maintainAspectRatio: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
