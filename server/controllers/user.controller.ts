import express, { Response, Router } from 'express';
import { UserRequest, User, UserCredentials, UserByUsernameRequest } from '../types/types';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../services/user.service';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Validates that the request body contains all required fields for a user.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
//   const isUserBodyValid = (req: UserRequest): boolean => {
//   const { username, password } = req.body;
//   return typeof username === 'string' && username.trim() !== '' && typeof password === 'string' && password.trim() !== '';
// };

  const isUserBodyValid = (req: UserRequest): boolean =>
    req.body !== undefined &&
    req.body.username !== undefined &&
    req.body.username !== '' &&
    req.body.password !== undefined &&
    req.body.password !== '';


  /**
   * Handles the creation of a new user account.
   * @param req The request containing username, email, and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }
    
    const { username, password } = req.body;
    try {
      const userResponse = await saveUser({ username, password, dateJoined: new Date() });
      
      if ('error' in userResponse) {
        throw new Error(userResponse.error);
      }
      res.status(200).json(userResponse);
    } catch (error) {
      res.status(500).json({ error: `Error saving user: ${error}` });
    }
  };

  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    try{
      if (!isUserBodyValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }
      
      const loginCredentials: UserCredentials = {
        username: req.body.username,
        password: req.body.password,
      };
      
      const result = await loginUser(loginCredentials);
      
      if ('error' in result) {
        throw Error(result.error);
      }
      res.status(200).json(result);
    } catch(error) {
      res.status(500).send('Login failed');
    }
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const result = await getUserByUsername(username);
      
      if ('error' in result) {
        throw Error(result.error);
      }
      res.status(200).json(result);
    } catch (error){
      res.status(500).send(`Error when getting user by username: ${error}`);
    }
  };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either the successfully deleted user object or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const result = await deleteUserByUsername(username);
      
      if ('error' in result) {
        throw Error(result.error)
      }
      
      res.status(200).json(result);
    }catch(error) {
      res.status(500).send(`Error when deleting user by username: ${error}`);
    }
  };

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either the successfully updated user object or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ error: 'Invalid user body' });
        return;
      }
      
      const result = await updateUser(username, { password });
      
      if ('error' in result) {
        throw Error(result.error);
      }
      res.status(200).json(result);
    } catch (error){
      res.status(500).send(`Error when updating user password: ${error}`);
    }
  };

router.post('/signup', createUser);
router.post('/login', userLogin);
router.get('/getUser/:username', getUser);
router.delete('/deleteUser/:username', deleteUser);
router.put('/resetPassword', resetPassword);

  return router;
};

export default userController;
