// main.js
import { app } from './firebaseConfig.js';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const db = getFirestore(app);

// 🎯 Referencias al DOM
const input = document.getElementById('fanMessage');
const button = document.getElementById('sendMessage');

// 📝 Enviar mensaje
button.addEventListener('click', async () => {
  const texto = input.value.trim();
  if (texto === '') return;

  try {
    await addDoc(collection(db, 'mensajes'), {
      texto,
      timestamp: Date.now()
    });

    input.value = '';
    console.log('Mensaje enviado a Rick 🕊️');
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
  }
});