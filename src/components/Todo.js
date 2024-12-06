"use client";
import { IconButton, ListItem, ListItemText } from "@mui/material";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteDoc, doc } from "firebase/firestore";
import { useContext } from "react";
import { TodoContext } from "@/TodoContext";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";

const Todo = ({ id, timestamp, title, detail }) => {
  const { showAlert, setTodo } = useContext(TodoContext);
  const router = useRouter();

  const deleteTodo = async (id, e) => {
    e.stopPropagation();
    const docReference = doc(db, "todos", id);
    await deleteDoc(docReference);
    showAlert("error", `todo with id ${id} deleted successfully`);
  };

  const seeMore = (id, e) => {
    e.stopPropagation();
    router.push(`/todos/${id}`);
  };

  return (
    <ListItem
      onClick={() => setTodo({ id, title, detail, timestamp })}
      sx={{ mt: 3, boxShadow: 3 }}
      style={{ backgroundColor: "#FAFAFA" }}
      secondaryAction={
        <>
          <IconButton onClick={(e) => deleteTodo(id, e)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={(e) => seeMore(id, e)}>
            <MoreVertIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText
        style={{ color: "#000000" }}
        primary={title}
        secondary={moment(timestamp).format("MMMM,DD,YYYY")}
      ></ListItemText>
    </ListItem>
  );
};

export default Todo;
