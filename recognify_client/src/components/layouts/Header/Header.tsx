import Image from "next/image";
import { IoIosSettings } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sidebarToggle } from "@/redux/reducer/sidebar";
import { googleLogout } from "@react-oauth/google";
import { RootState } from "@/redux/store";
import { removeToken } from "@/redux/reducer/login";
import { usePathname } from "next/navigation";
import { Dropdown } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/router";
import Link from "next/link";
const Header = () => {
  const [userClick, setUserClick] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const path = usePathname();

  const user: any = useSelector((state: RootState) => state.login.userToken);
  const { open } = useSelector((state: RootState) => state.sidebar);

  const onNavToggle = (open: boolean) => {
    dispatch(sidebarToggle(!open));
  };
  const onLogOut = () => {
    dispatch(removeToken());
    googleLogout();
  };

  return (
    <>
      <nav
        className="navbar navbar-main navbar-expand-lg px-0 shadow-none border-radius-xl "
        data-scroll="false"
      >
        <div className="container-fluid">
          <div className="collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4">
            <div className="ms-md-auto pe-md-3 d-flex align-items-center"></div>
            <ul className="navbar-nav header_menu">
              <li className="nav-item  d-flex align-items-center mb-1">
                <a
                  href="javascript:;"
                  className="nav-link text-white p-0"
                  id="iconNavbarSidenav"
                >
                  <div
                    className="sidenav-toggler-inner"
                    onClick={() => onNavToggle(open)}
                  >
                    <i className="sidenav-toggler-line bg-black"></i>
                    <i className="sidenav-toggler-line bg-black"></i>
                    <i className="sidenav-toggler-line bg-black"></i>
                  </div>
                </a>
              </li>
              <div
                style={{
                  backgroundColor: "right",
                  color: "white",
                  fontWeight: 600,
                  marginRight: "20px",
                  marginTop: "5px",
                }}
                role="button"
              >
                {/* {profileData?.first_name && profileData?.last_name
                ? `${profileData.first_name} ${profileData.last_name}`
                : 'Admin'} */}
              </div>
              {/* <Dropdown as="li" className="ms-2">
                <Dropdown.Toggle
                  as="a"
                  bsPrefix=" "
                  className="rounded-circle"
                  id="dropdownUser"
                >
                  <div className="avatar avatar-md avatar-indicators avatar-online">
                    <div
                      style={{
                        lineHeight: "0px",
                        cursor: "pointer",
                        width: "33px",
                        height: "33px",
                      }}
                    >
                      <Image
                        src={user?.image || ""}
                        alt="profile"
                        style={{
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        className="rounded-circle"
                        width="33"
                        height="33"
                      />
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="dropdown-menu dropdown-menu-end "
                  align="end"
                  aria-labelledby="dropdownUser"
                >
                  <Dropdown.Item
                    as="div"
                    className="px-4 pb-0 pt-2"
                    bsPrefix=" "
                  >
                    <div className="lh-1 ">
                      <h5 className="mb-2 ">
                        {user?.first_name + " " + user?.last_name}
                      </h5>
                      <p style={{ color: "#ccc" }}> </p>
                      <Link
                        href={"mailto:" + user?.email}
                        className="text-inherit fs-6"
                      >
                        {user?.email}
                      </Link>
                    </div>
                    <div className=" dropdown-divider mt-3 mb-2"></div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="2"
                    onClick={() => {
                      router.push("/userprofile");
                    }}
                  >
                    <FaUser />
                    <i className="fe fe-user me-2"></i> Edit Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      onLogOut();
                    }}
                  >
                    <CiLogout /> <i className="fe fe-power me-2"></i>Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown> */}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
