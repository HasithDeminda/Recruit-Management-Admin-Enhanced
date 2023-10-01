import React, { useEffect, useState } from "react";
import { IoIosMore, IoMdContacts } from "react-icons/io";
import { Button } from "../Components";
import { useStateContext } from "../Contexts/ContextProvider";
import { FaFileInvoice, FaTwitch, FaUserTie } from "react-icons/fa";
import axios from "axios";
import { css } from "@emotion/react";
import { PropagateLoader } from "react-spinners";

const Ecommerce = () => {
  const { currentColor, currentMode } = useStateContext();
  const [data, setData] = useState("");
  const [announcement, setAnnouncement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const Token = localStorage.getItem("Token");

  const config = {
    headers: {
      Authorization: `${Token}`,
    },
  };

  const onReddirectAnn = () => {
    window.location.href = "/Announcements";
  };

  const onReddirectJobs = () => {
    window.location.href = "/Jobs";
  };
  const fetchData = async () => {
    try {
      const [realtimeData, jobData] = await Promise.all([
        axios.get(
          "https://rwa-webapp.azurewebsites.net/api/dashboard/data",
          config
        ),
        axios.get(
          "https://rwa-webapp.azurewebsites.net/api/jobMgt/GetALLJobs",
          config
        ),
      ]);

      if (realtimeData.status && jobData.status) {
        setData(realtimeData.data.analytics);
        setAnnouncement(realtimeData.data.analytics.notices);
        setJobs(jobData.data.allJobs);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dashboardData = [
    {
      icon: <IoMdContacts />,
      amount: data.activeUsers,
      title: "Total Active Users",
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
      pcColor: "red-600",
    },
    {
      icon: <FaFileInvoice />,
      amount: data.activeJobs,
      title: "Total Active Job Posts",
      iconColor: "rgb(255, 244, 229)",
      iconBg: "rgb(254, 201, 15)",
      pcColor: "green-600",
    },
    {
      icon: <FaUserTie />,
      amount: data.appliedJobs,
      title: "Applied Jobs",
      iconColor: "rgb(228, 106, 118)",
      iconBg: "rgb(255, 244, 229)",

      pcColor: "green-600",
    },
    {
      icon: <FaTwitch />,
      amount: data.feedbacks,
      title: "Feedbacks",
      iconColor: "rgb(0, 194, 146)",
      iconBg: "rgb(235, 250, 242)",
      pcColor: "red-600",
    },
  ];

  const [latestJob, setLatestJob] = useState(null);

  // Function to get the latest job
  const getLatestJob = (jobs) => {
    // setLoading(true);
    return jobs.length > 0
      ? [...jobs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0]
      : null;
    // setLoading(false);
  };

  // Update 'latestJob' state
  useEffect(() => {
    const latestJobResult = getLatestJob(jobs);
    setLatestJob(latestJobResult);
  }, [jobs]);

  return (
    <>
      {loading ? (
        <div
          className="loader"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
        >
          <PropagateLoader
            color={"#1A97F5"}
            loading={loading}
            css={override}
            size={20}
          />
        </div>
      ) : (
        <div className="mt-24">
          <div className="flex flex-wrap lg:flex-nowrap justify-center ">
            <div className="flex m-3 flex-wrap justify-center gap-10 items-center">
              {dashboardData.map((item) => (
                <div
                  key={item.title}
                  className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl "
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      color: item.iconColor,
                      backgroundColor: item.iconBg,
                    }}
                    className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
                  >
                    {item.icon}
                  </button>
                  <p className="mt-3">
                    <span className="text-lg font-semibold">{item.amount}</span>
                    <span className={`text-sm text-${item.pcColor} ml-2`}>
                      {item.percentage}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400  mt-1">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center">
            {/* //Map the last published job */}
            {latestJob ? (
              <div className="w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
                <div className="flex justify-between">
                  <p className="text-xl font-semibold">Recent Job Vacancies</p>
                  <button
                    type="button"
                    className="text-xl font-semibold text-gray-500"
                  >
                    <IoIosMore />
                  </button>
                </div>
                <div className="mt-10">
                  <img
                    className="md:w-96 h-50 "
                    src={
                      latestJob.imageUrlPoster ||
                      "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
                    }
                    alt=""
                  />
                  <div className="mt-8">
                    <p className="font-semibold text-lg">{latestJob.title}</p>
                    <p className="mt-8 text-sm text-gray-400">
                      {latestJob.description}
                    </p>
                    <div
                      className="mt-3"
                      onClick={() => {
                        onReddirectJobs();
                      }}
                    >
                      <Button
                        color="white"
                        bgColor={currentColor}
                        text="Read More"
                        borderRadius="10px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {announcement.length > 0
              ? announcement.map((item) => (
                  <div className="w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
                    <div className="flex justify-between">
                      <p className="text-xl font-semibold">
                        Recent Announcements
                      </p>
                      <button
                        type="button"
                        className="text-xl font-semibold text-gray-500"
                      >
                        <IoIosMore />
                      </button>
                    </div>
                    <div className="mt-10">
                      <img
                        className="md:w-96 h-50 "
                        src={
                          item.imageUrlPoster ||
                          "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
                        }
                        alt=""
                      />
                      <div className="mt-8">
                        <p className="font-semibold text-lg">{item.title}</p>
                        {/* <p className="text-gray-400 ">By Johnathan Doe</p> */}
                        <p className="mt-8 text-sm text-gray-400">
                          {item.description}
                        </p>
                        <div
                          className="mt-3"
                          onClick={() => {
                            onReddirectAnn();
                          }}
                        >
                          <Button
                            color="white"
                            bgColor={currentColor}
                            text="Read More"
                            borderRadius="10px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      )}
    </>
  );
};

const override = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
`;

export default Ecommerce;
