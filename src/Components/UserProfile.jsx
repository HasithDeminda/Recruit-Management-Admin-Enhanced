import React, { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

import { Button } from ".";
import { userProfileData } from "../Data/dummy";
import { useStateContext } from "../Contexts/ContextProvider";
import avatar from "../Data/avatar.jpg";
import { Link, useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { BsShield } from "react-icons/bs";
import axios from "axios";

const UserProfile = () => {
  //Get id from local storage
  const userId = localStorage.getItem("Token");

  //Fetch user data from backend
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    fullName: "",
    role: "",
    imageUrl: "",
  });

  //Send token to backend to get user data with header authorization
  const fetchUser = async () => {
    const res = await axios.get(
      `https://rwa-webapp.azurewebsites.net/api/admin/AdminProfile`,
      {
        headers: {
          Authorization: `${userId}`,
        },
      }
    );
    setUser(res.data.logedAdmin);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  //remove token from localStorage after 3 days
  const removeToken = () => {
    localStorage.removeItem("Token");
    window.location.href = "/login";
  };

  const userProfileData = [
    {
      icon: <FaUser />,
      title: "My Profile",
      desc: "Account Settings",
      iconColor: "#1a97f5",
      iconBg: "#E5FAFB",
      Link: "/profile",
    },
    {
      icon: <BsShield />,
      title: "My Inbox",
      desc: "Messages & Emails",
      iconColor: "#1a97f5",
      iconBg: "rgb(235, 250, 242)",
      Link: "/inbox",
    },
    // {
    //   icon: <FiCreditCard />,
    //   title: "My Tasks",
    //   desc: "To-do and Daily Tasks",
    //   iconColor: "rgb(255, 244, 229)",
    //   iconBg: "rgb(254, 201, 15)",
    // },
  ];

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={
            user.imageUrl ||
            "https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg"
          }
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {user.fullName}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {" "}
            Administrator{" "}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <Link to={item.Link} key={index}>
            <div
              key={index}
              className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
            >
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className=" text-xl rounded-lg p-3 hover:bg-light-gray"
              >
                {item.icon}
              </button>

              <div>
                <p className="font-semibold dark:text-gray-200 ">
                  {item.title}
                </p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {" "}
                  {item.desc}{" "}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-5">
        <button
          style={{
            width: "100%",
            backgroundColor: "#1a97f5",
            color: "white",
          }}
          type="button"
          className="bg-gray-300 text-gray-700 font-semibold rounded-lg p-3 hover:bg-light-gray"
          onClick={removeToken}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
