import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Avatar, Button, Typography } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("John Doe"); // Default username for display
  const [userAvatar, setUserAvatar] = useState(null); // Placeholder for user image URL
  const [isHovered, setIsHovered] = useState(false); // State to track hover status
  const { isAuthenticated, logout, user } = useAuthStore();

  useEffect(() => {
    // Fetch user data (e.g., from local storage or an API) and update state
    const storedUserAvatar = localStorage.getItem("userAvatar"); // URL of user avatar if available
    setUserName(user.firstName + " " + user.lastName);
    setUserAvatar(storedUserAvatar);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const menu = (
    <Menu className="custom-dropdown-menu">
      <Menu.Item key="1" onClick={() => navigate("/profile")}>
        Edit Profile
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button
        type="text"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px",
          backgroundColor: isHovered ? "#a7a7a7" : "transparent", // Change background color on hover
          border: "none",
        }}
        onMouseEnter={() => setIsHovered(true)} // Set hover state to true on mouse enter
        onMouseLeave={() => setIsHovered(false)} // Set hover state to false on mouse leave
      >
        <Avatar src={userAvatar} icon={!userAvatar && <UserOutlined />} />
        <Typography.Text style={{ marginLeft: 8, marginRight: 8 }}>
          {userName}
        </Typography.Text>
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default ProfileDropdown;
