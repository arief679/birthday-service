import axios from 'axios';

export const sendEmail = async (email: string, message: string) => {
  try {
    const response = await axios.post('https://email-service.digitalenvision.com.au/send-email', {
      email,
      message
    });
    return response.data;
  } catch (error: any) { 
    if (error instanceof Error) {
      console.error(`Failed to send email to ${email}:`, error.message);
    } else {
      console.error(`Unknown error occurred while sending email to ${email}`);
    }
    throw error;
  }
};
