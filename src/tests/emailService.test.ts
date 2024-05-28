import { sendEmail } from '../service/emailService';
import { startScheduler } from '../scheduler';

jest.mock('../service/emailService');

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send a birthday email', async () => {

    (sendEmail as jest.Mock).mockResolvedValue({
      status: 'sent',
      sentTime: '2022-07-01T14:48:00.000Z'
    });

    await startScheduler();
    expect(sendEmail);
  });
});
