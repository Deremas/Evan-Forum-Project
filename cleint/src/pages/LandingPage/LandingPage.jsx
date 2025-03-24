import React from "react";
import backGroundPic from "../../assets/images/DarkLogo.png";
import classes from "./LandingPage.module.css";
import { Link, useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  function ToLogIn() {
    navigate("./users/login");
  }
  return (
    <div>
      <div className={classes.background}>
        {/* <ul className={classes.ulupdate}>
          <li>
            <img src={backGroundPic} alt="" />
          </li>
          <li className={classes.item_link}>
            <Link to="">Home</Link>
          </li>
          <li className={classes.item_link}>
            <Link to="/how-it-works">How it works</Link>
          </li>

          <li>
            <button onClick={ToLogIn} className={classes.login_button}>
              Sign In
            </button>
          </li>
        </ul> */}

        <div style={{ marginTop: "40%" }}>
          <h2>
            Bypass the Industrial, <br /> Dive into the Digital!
          </h2>
          <p>
            Before us is a golden opportunity, demanding us to take a bold step
            forward and join the new digital era.
          </p>
          <div style={{gap: "50%"}}>
            <a className={classes.createAccount} href="/users/register">Create Account</a>
            <a className={classes.signIn} href="/users/login">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
