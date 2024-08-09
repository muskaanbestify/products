const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const kidswearRoutes = require('./routes/kidswear')
const menswearRoutes = require('./routes/menswear')
const womenswearRoutes = require("./routes/womenswear")
const appliancesRoutes = require("./routes/appliances")
const beautyRoutes = require("./routes/beauty")
const phoneaccessoriesRoutes = require("./routes/phonesaccessories")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/kidswear',kidswearRoutes );
app.use('/api/menswear', menswearRoutes);
app.use('/api/womenswear', womenswearRoutes);
app.use('/api/appliances', appliancesRoutes);
app.use('/api/beauty', beautyRoutes );
app.use('/api/phoneaccessories', phoneaccessoriesRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://muskaanvirdi2601:OICRAgSOYjBLgw4s@cluster0.8g2supr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  dbName: 'unlockdiscounts',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Keep-alive mechanism
setInterval(() => {
  http.get('http://localhost:' + PORT, (res) => {
    console.log(`Keep-alive request sent. Status code: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`Keep-alive request failed: ${e.message}`);
  });
}, 600000); // Send a keep-alive request every 10 minutes (600000 ms)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
