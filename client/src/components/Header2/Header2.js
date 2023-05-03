import React, { useState } from "react";
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

import logo from "./logo.png";

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

  // Ajoutez cette ligne pour définir le style du conteneur #header en fonction de l'état de la barre latérale
  const headerStyle = { width: menuCollapse ? '80px' : '280px' };

  return (
    <>
      <div id="header" style={headerStyle}>
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            <div className={`logotext${menuCollapse ? " collapsed-logo" : " expanded-logo"}`}>
              <img src={logo} alt="Your Logo" />
              {!menuCollapse && <span>Legumz</span>}
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
                  Profil
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
