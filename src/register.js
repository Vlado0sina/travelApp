import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";

const registerUser = async (values) => {
  const { email, password, phoneNumber, lastName, firstName, clientType } =
    values;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(collection(db, "users"), user.uid), {
      uid: user.uid,
      firstName,
      lastName,
      phoneNumber,
      email,
      clientType,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.log(err.message);
  }
};
export default registerUser;
