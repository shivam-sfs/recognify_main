import { useEffect } from "react";
import Image from "next/image";
import { CgScreen } from "react-icons/cg";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { SiFramework } from "react-icons/si";

import { ImCross } from "react-icons/im";
import {
  MdPayment,
  MdTouchApp,
} from "react-icons/md";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { sidebarToggle } from "@/redux/reducer/sidebar";
import {
  COMPANY_NAME_SHOW,
  company_name,
} from "@/components/Utils/constants";
import { CiLogout } from "react-icons/ci";
import { removeToken } from "@/redux/reducer/login";
import { googleLogout } from "@react-oauth/google";
import logo from "../../../../public/logo.png";
import halfLogo from "../../../../public/halfLogo.png";
import { FaUser, FaUsers } from "react-icons/fa";

let navigation = [
  {
    id: 0,
    title: "Dashboard",
    href: "/dashboard",
    icon: <CgScreen style={{ fontSize: "1.2rem", color: "#ABB6F0" }} />,
  },
  {
    id: 1,
    title: "Client",
    href: "/client",
    icon: <FaUser style={{ fontSize: "1.2rem", color: "rgb(217 73 73)" }} />,
  },
  {
    id: 2,
    title: "Project",
    href: "/project",
    icon: <SiFramework style={{ fontSize: "1.2rem", color: "#000" }} />,
  },
  {
    id: 4,
    title: "Partners",
    href: "/partners",
    icon: <FaUsers style={{ fontSize: "1.2rem", color: "#106FFB" }} />,
  },
  {
    id: 5,
    title: "Payment",
    href: "/payment",
    icon: <MdPayment style={{ fontSize: "1.5rem", color: "rgb(251 188 16)" }} />,
  },
];

const Sidebar = () => {
  const path = usePathname();
  const dispatch = useDispatch();
  const { open } = useSelector((state: RootState) => state.sidebar);
  const role = useSelector((state: RootState) => state.login.userToken?.role);

  const onNavToggle = (open: boolean) => {
    dispatch(sidebarToggle(!open));
  };

  const [CloseSideBar, setCloseSideBar] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1200 ? setCloseSideBar(true) : setCloseSideBar(false);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onLogOut = () => {
    dispatch(removeToken());
    googleLogout();
  };

  return (
    <aside className="sidenav bg-glass navbar navbar-vertical navbar-expand-xs border-0 fixed-start overflow-hidden">
      <div className="sidenav-header">
        {CloseSideBar && (
          <ImCross
            className="cursor-pointer text-secondary opacity-5 position-absolute end-6 top-2"
            id="iconSidenav"
            onClick={() => onNavToggle(open)}
            size={10}
          />
        )}
        <a className="navbar-brand m-0" target="_blank">
          <Image
            src={logo}
            alt="recognify"
            width={300}
            height={300}
            className="object-fit-contain fullLogo"
          />
          <Image
            src={halfLogo}
            alt="recognify"
            width={300}
            height={300}
            className="object-fit-contain halfLogo"
          />
          {COMPANY_NAME_SHOW && (
            <span className="ms-1 font-weight-bold text-uppercase">
              {company_name}
            </span>
          )}
        </a>
      </div>
      <hr className="horizontal dark mt-0" />
      <ul className="navbar-nav side  side_Nav_container">
        {navigation.map((nav: any, index) => {
          if (nav.label)
            return (
              <li className="nav-item mt-3" key={index + "k"}>
                <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
                  {nav.label}
                </h6>
              </li>
            );
          return (
            <div key={nav.id}>
              {nav.subMenu ? (
                <>
                  <Link
                    className={`nav-link ${path === nav.href ? "active" : ""}`}
                    href={nav.href}
                  >
                    <div className="icon icon-shape icon-md border-radius-md text-center me-4 d-flex align-items-center justify-content-center opacity-10">
                      {nav.icon}
                    </div>
                    &nbsp;
                    <span
                      className="nav-link-text ms-4"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {nav.title}
                    </span>
                    {path?.split("/")[1] === nav.href.split("/")[1] ? (
                      <BsChevronUp
                        className="bi bi-chevron-up ms-auto md-auto"
                        size={15}
                      />
                    ) : (
                      <BsChevronDown
                        className="bi bi-chevron-down ms-auto md-auto"
                        size={15}
                      />
                    )}
                  </Link>
                  {path?.split("/")[1] === nav.href.split("/")[1] ? (
                    <>
                      {nav.subMenu.map(
                        (
                          subNavItem: any,
                          subIndex: React.Key | null | undefined
                        ) => (
                          <li className="sub_menu nav-item ms-2" key={subIndex}>
                            <Link
                              className={`nav-link ${
                                path === subNavItem.href ? "active" : ""
                              }`}
                              href={subNavItem.href}
                            >
                              <div className="icon icon-shape icon-md border-radius-md text-center d-flex align-items-center justify-content-end opacity-10">
                                {subNavItem.icon}
                              </div>
                              <span
                                className="nav-link-text ms-4"
                                style={{ fontSize: "0.9rem" }}
                              >
                                {subNavItem.title}
                              </span>
                            </Link>
                          </li>
                        )
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  {/* <Collapse isOpen={}> */}

                  {/* </Collapse> */}
                </>
              ) : (
                <li className="nav-item" key={nav.id}>
                  <Link href={nav.href}>
                    <div
                      className={`nav-link ${
                        path === nav.href ? "active" : ""
                      }`}
                      //   onClick={() => setActiveItem(index)}
                    >
                      <div className="icon icon-shape icon-md border-radius-md text-center d-flex align-items-center justify-content-center opacity-10">
                        {nav.icon}
                      </div>
                      <span className=" d-inline-block">{nav.title}</span>
                    </div>
                  </Link>
                </li>
              )}
            </div>
          );
        })}
      </ul>
      <div
        className="sidenav-footer position-fixed w-100 fixed-bottom p-2"
        style={{ backgroundColor: "#1c2a4221" }}
      >
        <div
          className="nav-link d-flex justify-content-start align-items-center"
          onClick={() => {
            onLogOut();
          }}
        >
          <div>
            <CiLogout
              size={25}
              style={{ fontSize: "1rem", color: "#000100" }}
            />
          </div>
          <span
            className="nav-link-text ms-4 text-uppercase font-weight-bold active user-select-none"
            style={{ fontSize: "0.9rem" }}
          >
            logOut
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
