import React from "react";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import {Sidebar, Menu,MenuItem, useProSidebar, ProSidebarProvider} from "react-pro-sidebar";
import {Link, Outlet} from "react-router-dom";
import "./AdminDashboard.css"

function AdminDashboard() {
    const {collapseSidebar} = useProSidebar();
    return (
        <div id="app" style={{display: "flex"}}>
            <Sidebar className="admin-sidebar">
                <Menu>
                    <MenuItem
                        className="admin-sidebar-header"
                        icon={<MenuOutlinedIcon/>}
                        onClick={() => {
                            collapseSidebar();
                        }}
                        style={({textAlign: "center"})}
                    >
                        {" "}
                        <h2>Admin</h2>
                    </MenuItem>

                    <MenuItem icon={<PersonAddAltIcon/>}>
                        Add medic
                    </MenuItem>
                </Menu>
            </Sidebar>
            <main className="admin-component">
                <div>
                    <Outlet/>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;