import React, { useState } from "react";
import logo from "./logo.png";
import { useNavigate } from 'react-router-dom';
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

const Header2 = ({ activePage, email }) => {
  const [menuCollapse, setMenuCollapse] = useState(false);
  const navigate = useNavigate();
  const menuIconClick = () => {
    setMenuCollapse(!menuCollapse);
  };

  const handleClick = (tabName) => {
    if(tabName=="Logout"){
      navigate('/');
    }
    else{
      navigate('/'+tabName+'/'+email);
    } 
  };

  return (
    <>
      <div id="header">
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
  <div className="logotext">
    {menuCollapse ? (
      <img src={logo} alt="logo" className="collapsed-logo" />
    ) : (
      <>
        <img src={logo} alt="logo" className="expanded-logo" />
        <p>Legumz</p>
      </>
    )}
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
              <MenuItem
                  active={activePage === "profil"}
                  icon={<FiHome />}
                  onClick={() => handleClick("profil")}
                >
                  Profile
                </MenuItem>
   

                <MenuItem
                  active={activePage === "messages"}
                  icon={<FaRegCommentDots />}
                  onClick={() => handleClick("messages")}
                >
                  Mes messages
                </MenuItem>
             

                <MenuItem
                  active={activePage === "search"}
                  icon={<FaBinoculars />}
                  onClick={() => handleClick("search")}
                >
                  Paramètre de recherche
                </MenuItem>

                <MenuItem
                  active={activePage === "singles"}
                  icon={<FaGrinHearts />}
                  onClick={() => handleClick("singles")}
                >
                  Trouver des célibataires
                </MenuItem>

                <MenuItem
                  active={activePage === "matchs"}
                  icon={<FaHeart />}
                  onClick={() => handleClick("matchs")}
                >
                  Mes matchs
                </MenuItem>

            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="square">
                <MenuItem icon={<FiLogOut />} onClick={() => handleClick("Logout")}>Logout</MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};

export default Header2;
