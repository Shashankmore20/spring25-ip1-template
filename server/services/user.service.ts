import UserModel from '../models/users.model';
import { User, UserCredentials, UserResponse } from '../types/types';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 * 
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    const newUser = await UserModel.create(user);

    if (!newUser) {
      throw Error('Failed to create user');
    }

    const { password, ...safeUser } = newUser.toObject();
    return safeUser;
  } catch (error) {
    return { error: `Error occurred when saving user: ${error}` };
  }
};

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> =>{
 try {
    const user = await UserModel.findOne({ username }).lean();
    if (!user) {
      return { error: 'User not found' };
    }

    const { password, ...safeUser } = user;
    return safeUser;
  } catch(error) {
    return { error: `Error occurred when finding user: ${error}` };
  }
};

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> => {
  const { username, password } = loginCredentials;
  
  try {
    const user = await UserModel.findOne({ username, password }).lean()
    if (!user) {
      throw Error('Authentication failed');
    }
    
    const { password: _, ...safeUser } = user;

    return safeUser;

  } catch (error) {
    return { error: `Error occurred when authenticating user: ${error}` };
  }
};

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({ username }).lean();
    if (!deletedUser) {
        throw Error('Error deleting user');
    }
    const { password, ...safeUser } = deletedUser;

    return safeUser;

  } catch (error) {
    return { error: `Error occurred when finding user: ${error}` };
  }
};

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (username: string, updates: Partial<User>): Promise<UserResponse> =>{
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      updates,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      throw Error('Error updating user');
    }

    const { password, ...safeUser } = updatedUser;
    return safeUser;
  } catch (error) {
    return { error: `Error occurred when updating user: ${error}` };
  }
};
