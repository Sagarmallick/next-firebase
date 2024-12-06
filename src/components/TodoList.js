'use client'

// Import necessary Firestore functions and React hooks
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
// Import the Firebase Firestore instance from your configuration file
import { db } from "@/config/firebase";
import Todo from "@/components/Todo";

const TodoList = () => {
  // State to store the list of todos, initialized as an empty array
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Reference the 'todos' collection in Firestore
    const collectionReference = collection(db, 'todos');
    
    // Create a query to order documents by the 'timestamp' field in descending order
    const q = query(collectionReference, orderBy('timestamp', 'desc'));

    // Subscribe to real-time updates using onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Map over the documents in the snapshot and transform them into an array
      setTodos(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(), // Spread document data
          id: doc.id, // Include document ID
          timestamp: doc.data().timestamp?.toDate().getTime(), // Convert Firestore timestamp to milliseconds
        }))
      );
    });

    // Cleanup function to unsubscribe from the snapshot listener on component unmount
    return unsubscribe;
  }, []); // Empty dependency array ensures this runs only once, when the component mounts

  return (
    <div>
      {/* Render a list of todos, each with a unique key */}
      {todos.map((todo) => (
        <Todo key={todo.id} 
                id={todo.id}
                title={todo.title} 
                detail={todo.detail} 
                timestamp={todo.timestamp}/>
      ))}
    </div>
  );
};

export default TodoList;
