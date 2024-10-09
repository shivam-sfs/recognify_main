import { type } from "os";
import react, { useState, useEffect } from "react";
import { FaLightbulb } from "react-icons/fa";
import { FaCameraRetro } from "react-icons/fa6";
import { GrTrophy } from "react-icons/gr";

interface carouselType {
  icon: any;
  title: string;
  sunTitle: string;
  img: { default: { src: string } };
}

const CarouselData = [
  {
    icon: <FaCameraRetro color={"#000"} />,
    title: "Get started with Argon",
    sunTitle:
      "Get ahead of the curve with our in-depth analysis and coverage of the top upcoming trends in your Business Area.",
    img: require("../../../../public/assets/img/carousel-1.jpg"),
  },
  {
    icon: <FaLightbulb color={"#000"} />,
    title:
      "Stay informed with the latest news and updates in your business area",
    sunTitle:
      " Get the latest updates and news related to your business area with IMS. Stay informed and ahead of the competition with our comprehensive coverage and analysis.",
    img: require("../../../../public/assets/img/carousel-2.jpg"),
  },
  {
    icon: <GrTrophy color={"#000"} />,
    title: "Forecasting the Future: Top Upcoming Trends in your Business Area",
    sunTitle:
      "Get ahead of the curve with our in-depth analysis and coverage of the top upcoming trends in your Business Area.",
    img: require(`../../../../public/assets/img/carousel-3.jpg`),
  },
];
let time: any;
const Carousel = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    time = setInterval(() => {
      setActive((pre) => {
        if (CarouselData.length - 2 < pre) {
          return (pre = 0);
        }
        return (pre += 1);
      });
    }, 2000);

    return () => {
      clearInterval(time);
    };
  }, []);

  const onNextClick = () =>
    setActive((pre) => {
      clearInterval(time);
      if (0 === pre) {
        return (pre = CarouselData.length - 1);
      }
      return (pre -= 1);
    });
  const onPreClick = () =>
    setActive((pre) => {
      clearInterval(time);
      if (CarouselData.length - 2 < pre) {
        return (pre = CarouselData.length - 1);
      }
      return (pre -= 1);
    });

  return (
    <div className="col-lg-5">
      <div className="card card-carousel overflow-hidden h-100 p-0">
        <div
          id="carouselExampleCaptions"
          className="carousel slide h-100 pointer-event"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner border-radius-lg h-100">
            {CarouselData.map((item: carouselType, index: number) => {
              return (
                <div
                  key={index}
                  className={`carousel-item h-100 ${
                    active === index ? "active" : null
                  }`}
                  style={{
                    backgroundImage: `url(${item.img?.default.src})`,
                    backgroundSize: "cover",
                  }}
                >
                  <div className="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5">
                    <div className="icon icon-shape icon-sm bg-white text-center border-radius-md mb-3">
                      {item.icon}
                    </div>
                    <h5 className="text-white mb-1">{item.title}</h5>
                    <p>{item.sunTitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="carousel-control-prev w-5 me-3"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
            onClick={onPreClick}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next w-5 me-3"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
            onClick={onNextClick}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
