const app = require("./app");
const cloudinary = require("cloudinary");

require("./config/database").connect();

const { PORT } = process.env;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
