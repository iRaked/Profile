import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

document.getElementById("sendMessage").addEventListener("click", async () => {
  const message = document.getElementById("fanMessage").value;

  if (message.trim() === "") return;

  try {
    await addDoc(collection(db, "messages"), {
      texto: message,
      timestamp: serverTimestamp()
    });
    document.getElementById("fanMessage").value = ""; // Limpieza ritual
    console.log("Mensaje enviado a Rick");
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
});
