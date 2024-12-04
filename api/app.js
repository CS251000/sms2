import cron from 'node-cron';
import { scheduleMessages } from '../scheduler.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); 


scheduleMessages();


// cron.schedule('* * * * *', () => {
//   console.log('Running cron job to check for SMS to send...');
//   scheduleMessages();
// });
