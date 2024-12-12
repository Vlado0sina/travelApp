import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const addBooking = async (bookingData) => {
  const bookingRef = collection(db, "bookings");
  await addDoc(bookingRef, bookingData);
};

export const getUserBookings = async (userId) => {
  if (!userId) {
    console.error("User if undefined");
    return [];
  }
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log("User bookings", bookings);
  return bookings;
};

export const updateBooking = async (id, updateData) => {
  const bookingRef = doc(db, "bookings", id);
  await updateDoc(bookingRef, updateData);
};

export const deleteBooking = async (id) => {
  const bookingRef = doc(db, "bookings", id);
  await deleteDoc(bookingRef);
};
