import React from 'react'
import "./DashBoard.css"
import {SideBar} from "../Navbar/SideBar"
import { Outlet } from 'react-router'
const DashBoard = ({Activeuser}) => {
  return <>
  
  <section className="dashboard">
    <div className="sidebar"><SideBar Activeuser={Activeuser}/></div>
    <div className="dynamic-components">
        <Outlet/>
    </div>
  </section>
  
  
  
  </>
}

export default DashBoard