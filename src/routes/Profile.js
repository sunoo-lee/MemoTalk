import { authService, dbService } from "fbInstance";
import {
  collection,
  // getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { updateProfile } from "@firebase/auth";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Sneet from "components/Sneet";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setnewDisplayName] = useState("");
  const [mySneets, setMySneets] = useState([]);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMySneets = async () => {
    const q = query(
      collection(dbService, "sneets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );

    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, "=>", doc.data());
    // });

    onSnapshot(q, (snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMySneets(arr);
    });
  };

  useEffect(() => {
    getMySneets();
  });

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setnewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Sign Out
      </span>
      <div className="profile__sneets">
        {mySneets.map((sneet) => (
          <Sneet
            key={sneet.id}
            sneetObj={sneet}
            isOnwer={sneet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
