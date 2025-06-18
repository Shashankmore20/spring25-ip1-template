import MessageModel from '../../models/messages.model';
import { getMessages, saveMessage } from '../../services/message.service';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const message1 = {
  msg: 'Hello',
  msgFrom: 'User1',
  msgDateTime: new Date('2024-06-04'),
};

const message2 = {
  msg: 'Hi',
  msgFrom: 'User2',
  msgDateTime: new Date('2024-06-05'),
};

describe('Message model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveMessage', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved message', async () => {
      mockingoose(MessageModel).toReturn(message1, 'create');

      const savedMessage = await saveMessage(message1);

      expect(savedMessage).toMatchObject(message1);
    });
    it('should return an error if saving the message fails', async () => {
      jest.spyOn(MessageModel, 'create').mockRejectedValueOnce(new Error('Database save failed'));
      const result = await saveMessage(message1);
      
      expect(result).toHaveProperty('error');
      if ('error' in result) {
        expect(result.error).toContain('Error when saving a message');
      }
    });

    it('should return an error if create() returns null', async () => {
      jest.spyOn(MessageModel, 'create').mockResolvedValueOnce(null as any);
      const result = await saveMessage(message1);
      
      expect(result).toHaveProperty('error');
      expect((result as any).error).toContain('Database save failed');
    });
  });

  describe('getMessages', () => {
    it('should return all messages, sorted by date', async () => {
      mockingoose(MessageModel).toReturn([message1, message2], 'find');

      const messages = await getMessages();

      expect(messages).toMatchObject([message1, message2]);
    });
    
    it('should return an empty array if error when retrieving messages', async () => {
      mockingoose(MessageModel).toReturn(new Error('Error retrieving documents'), 'find');

      const messages = await getMessages();

      expect(messages).toEqual([]);
    });
  });
});
