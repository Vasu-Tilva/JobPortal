import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, clearAllUserErrors } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { LuMoveRight } from "react-icons/lu";
import MyProfile from "../components/MyProfile";
import UpdateProfile from "../components/UpdateProfile";
import UpdatePassword from "../components/UpdatePassword";
import JobPost from "../components/JobPost";
import MyJobs from "../components/MyJobs";
import Applications from "../components/Applications";
import MyApplications from "../components/MyApplications";


function Dashboard() {
  const [show, setShow] = useState(false);
  const [componentName, setComponentName] = useState("");

  const { loading, isAuthenticated, error, user } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  useEffect(() =>{
    navigateTo("/dashboard");
  },[]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, error, isAuthenticated, loading]);

  

  return (
    <>
      <section className="account">
        <div className="component_header">
          <p>Dashboard</p>
          <p>
            Welcome! <span>{user && user.name}</span>
          </p>
        </div>
        <div className="container">
          <div className={show ? "sidebar showSidebar" : "sidebar"}>
            <ul className="sidebar_links">
              <h4>Manage Account</h4>

              <li>
                <button
                  onClick={() => {
                    setComponentName("My Profile");
                    setShow(!show);
                  }}
                >
                  My profile
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setComponentName("Update Profile");
                    setShow(!show);
                  }}
                >
                  Update Profile
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setComponentName("Update Password");
                    setShow(!show);
                  }}
                >
                  Update Password
                </button>
              </li>

              {user && user.role === "Employer" && (
                <>
                  <li>
                    <button
                      onClick={() => {
                        setComponentName("Post Job");
                        setShow(!show);
                      }}
                    >
                      Post new Job
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        setComponentName("My Jobs");
                        setShow(!show);
                      }}
                    >
                      My Jobs
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setComponentName("Applications");
                        setShow(!show);
                      }}
                    >
                      Applications
                    </button>
                  </li>
                </>
              )}

              {user && user.role === "Job Seeker" && (
                <>
                  <li>
                    <button
                      onClick={() => {
                        setComponentName("My Applications");
                        setShow(!show);
                      }}
                    >
                      My Applications
                    </button>
                  </li>
                </>
              )}

              <li>
                <button
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
          <div className="banner">
            <div className={show ? "sidebar_icon move_right" : "sidebar_icon move_left"}>
              <LuMoveRight className={show ? "left_arrow" : "right_arrow"} onClick={()=> setShow(!show)}/>
            </div>
            {(() => {
              switch (componentName) {
                case "My Profile":
                  return <MyProfile />;
                  break;
                case "Update Profile":
                  return <UpdateProfile />;
                  break;
                case "Update Password":
                  return <UpdatePassword />;
                  break;
                case "Post Job":
                  return <JobPost />;
                  break;
                case "My Jobs":
                  return <MyJobs />;
                  break;
                case "Applications":
                  return <Applications />;
                  break;
                case "My Applications":
                  return <MyApplications />;
                  break;
                default:
                  setComponentName("My Profile");
                  break;
              }
            })()}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
