import { React } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj }) => (
  <nav>
    <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <li className="Nav__li">
        <Link
          to="/"
          style={{
            marginRight: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 12,
          }}
        >
          <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
          <span className="Nav__tag" style={{ marginTop: 10 }}>
            Home
          </span>
        </Link>
      </li>
      <li className="Nav__li">
        <Link
          to="/profile"
          style={{
            marginLeft: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 12,
          }}
        >
          <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
          <span className="Nav__tag" style={{ marginTop: 10 }}>
            {userObj.displayName
              ? `${userObj.displayName} Profile`
              : "My Profile"}
          </span>
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;
