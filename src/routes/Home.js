import React, { useEffect, useState } from "react";
import { dbService } from "fbInstance";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Sneet from "components/Sneet";
import SneetFactory from "components/SneetFactory";

const Home = ({ userObj }) => {
  const [sneets, setSneets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "sneets"),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const sneetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSneets(sneetArr);
    });
  }, []);

  return (
    <div className="container">
      <SneetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {sneets.map((sneet) => (
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

export default Home;
