import app from "./app";

// Hardcoded port, no env yet
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
