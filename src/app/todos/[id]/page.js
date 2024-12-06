import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid2,
  Typography,
} from "@mui/material";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import Link from "next/link";

const Detail = async ({ params }) => {
  const { id } = params; // Access the dynamic `id` from the URL
  const docRef = doc(db, "todos", id);
  const docSnapshot = await getDoc(docRef);

  if (!docSnapshot.exists()) {
    return <h1>Todo Not Found</h1>;
  }

  const todo = docSnapshot.data();

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Card sx={{ minWidth: 345 }}>
        <CardContent>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {id}
          </Typography>
          <Typography variant="h5" component="div">
            {todo.title}
          </Typography>

          <Typography variant="body2">
            {todo.detail}
            <br />
          </Typography>
        </CardContent>
        <CardActions>
          <Link href="/">Learn More</Link>
        </CardActions>
      </Card>
    </Grid2>
  );
};

export default Detail;
