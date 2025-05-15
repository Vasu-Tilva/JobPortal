import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaSquareXTwitter,
  FaSquareInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa6";

function Footer() {
  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <>
    <footer>
      <div>
        <img src="/images/logo2.png" alt="logo" />
      </div>
      <div>
        <h4>Support</h4>
        <ul>
          <li>Changa road, Near charusat university Sahajanand Hostel,</li>
          <li>vasu@gmail.com</li>
          <li>+91 9714908740</li>
        </ul>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/jobs"}>Jobs</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to={"/dashboard"}>Dashboard</Link>
            </li>
          )}
        </ul>
      </div>
      <div>
        <h4>Follow Us</h4>
        <ul>
          <li>
            <Link>
              <span><FaSquareXTwitter/></span>
              <span>Twitter</span>
            </Link>
          </li>
          <li>
            <Link>
              <span><FaSquareInstagram/></span>
              <span>Instagram</span>
            </Link>
          </li>
          <li>
            <Link>
              <span><FaYoutube/></span>
              <span>YouTube</span>
            </Link>
          </li>
          <li>
            <Link>
              <span><FaLinkedin/></span>
              <span>LinkedIn</span>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
    <div className="copyright">
          &copy; CopyRight 2025, All Rights Reserved By Vasu.
    </div>
    </>
  );
}

export default Footer;
