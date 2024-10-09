import { FaCoins, FaGlobe, FaShoppingCart } from "react-icons/fa";
import { AiFillHdd } from "react-icons/ai";
import Chart from "./Chart/Chart";
import PieChart from "./PieCharts/PieCharts";
import Corousel from "./carousel/Carousel";
import Link from "next/link";
import { BsFillPostcardHeartFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import ActionFeature from "@/Api/ActionFeature";
import { INIT_FILTER } from "../Utils/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<any>({});
  const token = useSelector((state: RootState) => state.login.userToken?.token);
  const { recallApi } = useSelector((state: RootState) => state.recallApi);
  const path = "dashboard";

  //   // configure
  ActionFeature.path = path;

  useEffect(() => {
    ActionFeature.get(1, INIT_FILTER, setDashboard);
    return () => {};
  }, [recallApi, token]);

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card  ">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-8">
                  <Link href="/post" style={{ color: "#000" }}>
                    <div className="numbers">
                      <p className="text-sm mb-0 text-uppercase font-weight-bold">
                        Total hire lead
                      </p>
                      <h5 className="font-weight-bolder">
                        {dashboard?.total_hire}
                      </h5>
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {dashboard?.total_hire} hire leads{" "}
                        </span>
                        since last Months
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="col-4 text-end">
                  <div className="icon icon-shape bg-gradient-primary shadow-primary text-center rounded-circle">
                    <BsFillPostcardHeartFill
                      style={{
                        color: "white",
                        marginTop: "12px",
                        fontSize: "1.5rem",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card  ">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-8">
                  <div className="numbers">
                    <p className="text-sm mb-0 text-uppercase font-weight-bold">
                      Total join lead
                    </p>
                    <h5 className="font-weight-bolder">
                      {dashboard?.total_join}
                    </h5>
                    <p className="mb-0">
                      <span className="text-success text-sm font-weight-bolder">
                        {dashboard?.total_join} join leads{" "}
                      </span>
                      since last Months
                    </p>
                  </div>
                </div>
                <div className="col-4 text-end">
                  <div className="icon icon-shape bg-gradient-danger shadow-danger text-center rounded-circle">
                    <FaGlobe
                      style={{
                        color: "white",
                        marginTop: "12px",
                        fontSize: "1.5rem",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card  ">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-8">
                  <div className="numbers">
                    <p className="text-sm mb-0 text-uppercase font-weight-bold">
                      work in progress
                    </p>
                    <h5 className="font-weight-bolder">
                      {dashboard?.work_total_in_progress}
                    </h5>
                    <p className="mb-0">
                      <span className="text-danger text-sm font-weight-bolder">
                        {dashboard?.work_total_in_progress} Works in Progress{" "}
                      </span>
                      since last Months
                    </p>
                  </div>
                </div>
                <div className="col-4 text-end">
                  <div className="icon icon-shape bg-gradient-success shadow-success text-center rounded-circle">
                    <AiFillHdd
                      style={{
                        color: "white",
                        marginTop: "12px",
                        fontSize: "1.5rem",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card  ">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-8">
                  <div className="numbers">
                    <p className="text-sm mb-0 text-uppercase font-weight-bold">
                      completed Works
                    </p>
                    <h5 className="font-weight-bolder">
                      {dashboard?.work_total_in_completed}
                    </h5>
                    <p className="mb-0">
                      <span className=" text-sm font-weight-bolder">
                        {dashboard?.work_total_in_completed} Works completed
                      </span>{" "}
                      since last Months
                    </p>
                  </div>
                </div>
                <div className="col-4 text-end">
                  <div className="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">
                    <FaShoppingCart
                      style={{
                        color: "white",
                        marginTop: "12px",
                        fontSize: "1.5rem",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <Chart
          labels={dashboard?.chart?.labels}
          data={dashboard?.chart?.leads}
          total={dashboard?.total_join + dashboard?.total_hire}
        />
        <PieChart
          init={dashboard?.work_total_in_init || 0}
          progress={dashboard?.work_total_in_progress || 0}
          Completed={dashboard?.work_total_in_completed || 0}
        />
      </div>
    </div>
  );
};

export default Dashboard;
