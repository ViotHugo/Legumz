import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import {
  FaList,
  FaRegHeart,
  FaRegCommentDots,
  FaBinoculars,
  FaGrinHearts,
  FaHeart,
} from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";
import "react-pro-sidebar/dist/css/styles.css";
import "./Header2.css";

const Header2 = ({ activePage }) => {
  const [menuCollapse, setMenuCollapse] = useState(false);

  const menuIconClick = () => {
    setMenuCollapse(!menuCollapse);
  };

  const handleClick = (tabName) => {
    console.log("Clicked on", tabName);
  };

  return (
    <>
      <div id="header">
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            <div className="logotext">
              <p>{menuCollapse ? "Logo" : "Big Logo"}</p>
            </div>
            <div className="closemenu" onClick={menuIconClick}>
              {menuCollapse ? (
                <FiArrowRightCircle />
              ) : (
                <FiArrowLeftCircle />
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <NavLink to="/profil/your_email" activeClassName="active">
                <MenuItem
                  active={activePage === "profil"}
                  icon={<FiHome />}
                  onClick={() => handleClick("Profil")}
                >
                  Profil
                </MenuItem>
              </NavLink>

              <NavLink to="/messages/your_email" activeClassName="active">
                <MenuItem
                  active={activePage === "messages"}
                  icon={<FaRegCommentDots />}
                  onClick={() => handleClick("Mes messages")}
                >
                  Mes messages
                </MenuItem>
              </NavLink>

              <NavLink to="/search" activeClassName="active">
                <MenuItem
                  active={activePage === "search"}
                  icon={<FaBinoculars />}
                  onClick={() => handleClick("Paramètre de recherche")}
                >
                  Paramètre de recherche
                </MenuItem>
              </NavLink>

              <NavLink to="/singles" activeClassName="active">
                <MenuItem
                  active={activePage === "singles"}
                  icon={<FaGrinHearts />}
                  onClick={() => handleClick("Trouver des célibataires")}
                >
                  Trouver des célibataires
                </MenuItem>
              </NavLink>

              <NavLink to="/matches" activeClassName="active">
                <MenuItem
                  active={activePage === "matches"}
                  icon={<FaHeart />}
                  onClick={() => handleClick("Mes matchs")}
                >
                  Mes matchs
                </MenuItem>
              </NavLink>

            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="square">
              <NavLink to="/" activeClassName="active">
                <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
              </NavLink>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};

export default Header2;
