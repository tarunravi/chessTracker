import React, { useState } from "react";
import styles from "./SaveGame.module.css";
import firebase from "firebase";
import { db, auth } from "../../firebase";
import { useList } from "react-firebase-hooks/database";
import { useAuthState } from "react-firebase-hooks/auth";

function SaveGame({ userName, opponentName }) {
  const [user, userLoading] = useAuthState(auth);
  //If whitePosition is true, then the user is white
  const [whitePosition, setWhitePosition] = useState(true); //True
  const [winnerColor, setWinnerColor] = useState("potato"); //White
  var dbRef = db.ref(
    "/" +
      user.uid +
      "/-" +
      window.location.href.split("opponent-")[1] +
      "/games"
  );

  const sendData = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    console.log(today);

    if (winnerColor !== "potato") {
      const isUser =
        (winnerColor === "White" && whitePosition) ||
        (winnerColor === "Black" && !whitePosition)
          ? "user"
          : "opponent";

      const name = isUser === "user" ? userName : opponentName;
      dbRef.push({
        isUser: isUser,
        name: name,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        date: today,
        color: winnerColor,
      });
    }
    setWinnerColor("potato");
    window.location.reload();
  };
  return (
    <div className={styles.saveGameDiv}>
      <div className={styles.topSectionSave}>
        <div
          className={
            styles.whitePlayer +
            " " +
            (winnerColor === "White" ? styles.clicked : "")
          }
          onClick={() => {
            winnerColor === "White"
              ? setWinnerColor("potato")
              : setWinnerColor("White");
          }}
        >
          <h1>{whitePosition ? userName : opponentName}</h1>
        </div>
        <h1>vs</h1>
        <div
          className={
            styles.blackPlayer +
            " " +
            (winnerColor === "Black" ? styles.clicked : "")
          }
          onClick={() => {
            winnerColor === "Black"
              ? setWinnerColor("potato")
              : setWinnerColor("Black");
          }}
        >
          <h1>{!whitePosition ? userName : opponentName}</h1>
        </div>
        <div
          className={styles.flip}
          onClick={() => {
            setWhitePosition(!whitePosition);
          }}
        >
          <h3>flip sides</h3>
        </div>
      </div>
      <div className={styles.gradientButton} onClick={sendData}>
        <h1>Save Results</h1>
      </div>
    </div>
  );
}

export default SaveGame;
