import React from "react";
import { Route,Routes } from "react-router";
import Home from "./components/Home/Home";
import AddItem from "./components/Admin/AddItem/AddItem";
import DisplayItem from "./components/Admin/DisplayItem/DisplayItem";
import UpdateItem from "./components/Admin/UpdateItem/UpdateItem";
import Register from "./components/User/Register/Register";
import Login from "./components/User/Login/Login";
import UserProfile from "./components/User/UserProfile/UserProfile";
import UpdateProfile from "./components/User/UpdateProfile/UpdateProfile";
import AdminLogin from "./components/Admin/AdminLogin/AdminLogin";

function App() {
  return (
    <div>
      <React.Fragment>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/addItem" element={<AddItem />} />
        <Route path="/allitems" element={<DisplayItem/>}/>
        <Route path="/updateitem/:id" element={<UpdateItem/>}/>
        <Route path="/adminlogin" element={<AdminLogin/>}/>
        {/* User Management */}
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/userprofile" element={<UserProfile/>}/>
        <Route path="/updateprofile/:id" element={<UpdateProfile/>}/>
      </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
