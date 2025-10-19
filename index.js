import connectTOMongo from './db.js';
import express from 'express';
import cors from 'cors';
connectTOMongo();

const app = express();
const port = 3001;

app.use(cors());


// app.get('/', (req, res) => {
//   res.send('Hello Prajwal!');
// });

// app.get('/api/v1/login', (req, res) => {
//   res.send('Hello login!');
// });

// app.get('/api/v1/signup', (req, res) => {
//   res.send('Hello signup!');
// });

app.use(express.json())

// Available Routes
import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);
import notesRoutes from './routes/notes.js'
app.use('/api/notes',notesRoutes);

app.listen(port, () => {
  console.log(`inotebook backend listening at http://localhost:${port}`);
});