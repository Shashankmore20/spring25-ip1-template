import MessageModel from '../models/messages.model';
import { Message, MessageResponse } from '../types/types';

/**
 * Saves a new message to the database.
 *
 * @param {Message} message - The message to save
 *
 * @returns {Promise<MessageResponse>} - The saved message or an error message
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> => {
  try{
    const newMessage = await MessageModel.create(message);
    if (!newMessage) {
      throw new Error('Database save failed');
    }
    return newMessage.toObject();
  } catch (error) {
    return { error: `Error when saving a message: ${(error as Error).message}` };
  }
};

/**
 * Retrieves all messages from the database, sorted by date in ascending order.
 *
 * @returns {Promise<Message[]>} - An array of messages. If an error occurs, an empty array is returned.
 */
export const getMessages = async (): Promise<Message[]> => {
 try {
    return await MessageModel.find().sort({ date: 1 }).lean();
  } catch (error) {
    return [];
  }
};
