import 'dotenv/config';
import express from 'express';
import authRouter from './routes/auth';
import affiliateRouter from './routes/affiliate';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/affiliate', affiliateRouter);

app.use(errorHandler as never);

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`Middleware listening on port ${port}`);
});

export default app;
