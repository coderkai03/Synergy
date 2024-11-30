import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

async function updateTeams() {
  try {
    const hackathonId = "xHWyURZvXJIb6T6nC4qI";
    const teamsRef = collection(db, "teams");
    const querySnapshot = await getDocs(teamsRef);

    const updatePromises = [];

    querySnapshot.forEach((teamDoc) => {
      const teamRef = doc(db, "teams", teamDoc.id);
      updatePromises.push(updateDoc(teamRef, {
        hackathonId: hackathonId
      }));
    });

    await Promise.all(updatePromises);
    console.log("Successfully updated all teams with hackathon ID");
  } catch (error) {
    console.error("Error updating teams:", error);
  }
}

updateTeams();
