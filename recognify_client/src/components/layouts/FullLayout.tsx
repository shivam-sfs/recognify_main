import { Container } from "react-bootstrap";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const FullLayout = ({ children }: childrenType) => {
  const { open } = useSelector((state: RootState) => state.sidebar);
  const loading = useSelector((state: RootState) => state.loader.loading);

  return (
    <div
      className={`g-sidenav-show bg-gray-100 ${
        open ? "g-sidenav-pinned" : "g-sidenav-hidden"
      }`}
    >
      <section
        className="background-radial-gradient"
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          minHeight: "100vh !important",
        }}
      >
        {loading ? (
          <div className="global__loader__Container">
            <div id="global__loader">
              <div className="whirly__loader"> </div>
            </div>
          </div>
        ) : null}
        <Sidebar />
        <main className="main-content position-relative border-radius-lg">
          <div className="position-relative">
            <Header />
            <div className="flex-grow-1">
              <Container className="wrapper" fluid>
                <div>{children}</div>
              </Container>
            </div>
          </div>
          <footer className="footer  "></footer>
        </main>
      </section>
    </div>
  );
};

export default FullLayout;
