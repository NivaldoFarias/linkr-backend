import { userRepository } from '../repositories/users.js';

export const usersByUserName = async (req, res, next) => {
  const { username } = req.params;
  const {userId} = res.locals;
  try {
    const users = await userRepository.getUsersByUserName(username, userId);

    users.map((item)=>{
      if (item.followerId == userId) {
        item.following = true;
      }else {
        item.following = false;
      }
      delete item.email;
      delete item.followerId;

      return item;
    });
    res.status(200).json({ users });
  } catch (e) {
    next(e);
  }
};

export async function getUser(req, res, next) {
  try {
    const { userId } = res.locals;
    const user = await userRepository.getUserById(userId);
    res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
}


export async function getUserById(req, res, next) {
  const { userId, visitedUserId } = res.locals;
  const user = await userRepository.getUserDataById(visitedUserId, userId);
  return res.status(200).json({ user });
}
