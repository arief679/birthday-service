import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import moment from 'moment-timezone';
import { sendEmail } from '../service/emailService';
import cron from 'node-cron';

export const startScheduler = () => {
  // Run scheduleer every minutes
  cron.schedule('* * * * *', async () => { 
    const userRepository = getRepository(User);
    
    // Get users whose birthday is today
    const users = await userRepository
      .createQueryBuilder('user')
      .where(`strftime('%m-%d', user.birthday) = :today`, { today: moment().format('MM-DD') })
      .getMany();

    // Check filtered user before sending notification
    // System gave the flexibility using timeNotification for further improvement
    for (const user of users) {
      const now = moment().tz(user.timeZone);
      const notificationTime = moment.tz(user.timeNotification, 'HH:mm', user.timeZone);

      // Check if the current time matches the user's notification time
      if (now.hours() === notificationTime.hours() && now.minutes() === notificationTime.minutes()) {
        try {
          const response = await sendEmail(user.email, `Hey, ${user.firstName} ${user.lastName} it’s your birthday`);
          console.log(response); 
        } catch (error: any) { 
          if (error instanceof Error) {
            console.error(`Error sending email to ${user.email}:`, error.message);
          } else {
            console.error(`Unknown error occurred while sending email to ${user.email}`);
          }
        }
      }
    }
  });
};