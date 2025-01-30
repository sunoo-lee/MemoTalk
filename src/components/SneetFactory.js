import React, { useState } from "react";
import { dbService, storageService } from "fbInstance";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const SneetFactory = ({ userObj }) => {
  const [sneet, setSneet] = useState("");
  const [file, setFile] = useState("");
  const onSubmit = async (event) => {
    if (sneet === "") {
      return;
    }
    event.preventDefault();
    let fileUrl = "";

    if (file !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, file, "data_url");
      fileUrl = await getDownloadURL(response.ref);
    }

    const sneetObj = {
      text: sneet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      fileUrl,
    };

    await addDoc(collection(dbService, "sneets"), sneetObj);

    setSneet("");
    setFile("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSneet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const thumbnail = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setFile(result);
    };
    reader.readAsDataURL(thumbnail);
  };

  const onClearFile = () => setFile("");
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={sneet}
          onChange={onChange}
          type="text"
          placeholder="Whats on your mind?"
          maxLength={140}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={
          {
            // opacity: 0,
          }
        }
      />
      {file && (
        <div className="factoryForm__attachment">
          <div className="factoryForm__div">
            <img
              alt=""
              src={file}
              style={{
                backgroundImage: file,
              }}
            />
          </div>
          <div className="factoryForm__clear" onClick={onClearFile}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default SneetFactory;
