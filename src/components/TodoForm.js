"use client";

import { Button, TextField } from "@mui/material";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "@/config/firebase";
import { TodoContext } from "@/TodoContext";

export const TodoForm = () => {
  const inputAreaRef = useRef();

  const { showAlert, todo, setTodo } = useContext(TodoContext);

  const onSubmit = async () => {
    if (!todo.title.trim() || !todo.detail.trim()) {
      showAlert("error", "Both Title and Detail are required.");
      return;
    }
    if (todo?.hasOwnProperty("timestamp")) {
      // update the todo
      try {
        const docReference = doc(db, "todos", todo.id);
        const todoUpdated = { ...todo, timestamp: serverTimestamp() };
        updateDoc(docReference, todoUpdated);

        setTodo({ title: "", detail: "" });
        showAlert(
          "success",
          `Todo with id ${docReference.id} is updated succesfully`
        );
      } catch (error) {
        showAlert("error", `Failed to add todo:${error.message}`);
      }
    } else {
      try {
        const collectionReference = collection(db, "todos");
        const docReference = await addDoc(collectionReference, {
          ...todo,
          timestamp: serverTimestamp(),
        });
        setTodo({ title: "", detail: "" });
        showAlert(
          "success",
          `Todo with id ${docReference.id} is added succesfully`
        );
      } catch (error) {
        showAlert("error", `Failed to add todo:${error.message}`);
      }
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (!inputAreaRef.current.contains(e.target)) {
        console.log("outside input area");
        setTodo({ title: "", detail: "" });
      } else {
        console.log("inside input area");
      }
      document.addEventListener("mousedown", checkIfClickedOutside);
      return () => {
        document.addEventListener("mousedown", checkIfClickedOutside);
      };
    };
  }, []);

  return (
    <div ref={inputAreaRef}>
      <pre>{JSON.stringify(todo, null, "\t")}</pre>
      <TextField
        fullWidth
        label="title"
        margin="normal"
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <TextField
        fullWidth
        label="detail"
        multiline
        maxRows={4}
        value={todo.detail}
        onChange={(e) => setTodo({ ...todo, detail: e.target.value })}
      />
      <Button onClick={onSubmit} variant="contained" sx={{ mt: 3 }}>
        {todo.hasOwnProperty("timestamp") ? "Update" : "Add"}
      </Button>
    </div>
  );
};
