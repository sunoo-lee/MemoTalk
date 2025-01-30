import { dbService, storageService } from "fbInstance";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "@firebase/storage";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMaximize,
  faTrash,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";

const Sneet = ({ sneetObj, isOnwer }) => {
  const [editing, setEditing] = useState(false);
  const [newSneet, setNewSneet] = useState(sneetObj.text);
  const SneetTextRef = doc(dbService, "sneets", `${sneetObj.id}`);
  const onDelete = async () => {
    const ok = window.confirm("Are you sure?");
    console.log(ok);

    const desertRef = ref(storageService, sneetObj.fileUrl);

    //delete
    if (ok) {
      try {
        await deleteDoc(SneetTextRef);
        if (sneetObj.fileUrl !== "") {
          await deleteObject(desertRef);
        }
      } catch (error) {
        window.alert("Delete Failed.");
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(sneetObj, newSneet);
    await updateDoc(SneetTextRef, {
      text: newSneet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewSneet(value);
  };

  const onClick = (event) => {
    const url = event.target.nextSibling.currentSrc;
    window.open(url);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              defaultValue={newSneet}
              placeholder="Edit your Tweet"
              required
              onChange={onChange}
              autoFocus
              className="formInput"
            />
            <input type="submit" value="Update Tweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{sneetObj.text}</h4>
          {sneetObj.fileUrl && (
            <div className="nweet__img">
              <div onClick={onClick}>
                <FontAwesomeIcon icon={faMaximize} size="2x" />
              </div>
              <img alt="" src={sneetObj.fileUrl} />
            </div>
          )}
          {isOnwer && (
            <div className="nweet__actions">
              <span onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sneet;
