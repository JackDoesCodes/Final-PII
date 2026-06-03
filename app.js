import app from "./server.js";
import process from "process";

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor levantado`);
});
