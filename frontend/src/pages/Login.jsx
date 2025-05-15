import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, login, resetUserSlice } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { FaAddressBook, FaPencilAlt, FaRegUser } from "react-icons/fa";
import { MdCategory, MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";


function Login() {

    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loading, isAuthenticated, error, message } = useSelector(state => state.user)

    const dispatch = useDispatch();
    const navigateTo = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("role", role);
        formData.append("email", email);
        formData.append("password", password);
        dispatch(login(formData));
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearAllUserErrors());
        }
        if (isAuthenticated) {
            toast.success(message);
            dispatch(resetUserSlice());
            navigateTo("/");
        }
    }, [dispatch,error,isAuthenticated,loading]);

    return (
        <>
            <section className="authPage">
                <div className="container login-container">
                    <div className="header">
                        <h3>Login to your Account</h3>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="inputTag">
                            <label>Login As</label>
                            <div>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="">Select Role</option>
                                    <option value="Employer">Employer</option>
                                    <option value="Job Seeker">Job Seeker</option>
                                </select>
                                <FaRegUser />
                            </div>
                        </div>

                        <div className="inputTag">
                            <label>Email Address</label>
                            <div>
                                <input
                                    type="email"
                                    placeholder="youremail@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <MdOutlineMailOutline />
                            </div>
                        </div>

                        <div className="inputTag">
                            <label>Password</label>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <RiLock2Fill />
                            </div>
                        </div>

                        <button type="submit">Login</button>
                        <Link to={"/register"}>Register Now</Link>
                    </form>

                </div>
            </section>
        </>
    );
}

export default Login;