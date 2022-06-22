import { postsRepository } from '../repositories/posts.js';
import { API } from '../blueprints/chalk.js';
import chalk from 'chalk';

export async function getTimelineData(req, res) {
  const { userId, beforeDate, afterDate, limit } = res.locals;

  try {
    const shares = await postsRepository.getTimelineShares(userId, beforeDate, afterDate, limit);
    console.log(chalk.magenta(`${API} shares fetched`));

    const uniquePostIds = shares.reduce((acc, curr) => {
      if (!acc.includes(curr.postId)) {
        acc.push(curr.postId);
      }
      return acc;
    }, []);

    const postsArray = await getPostArrayFromPostIds(uniquePostIds);
    console.log(chalk.magenta(`${API} posts fetched`));

    const repeatedUserIdsArray = [];

    postsArray.forEach((post) => {
      repeatedUserIdsArray.push(post.userId);
      post.comments.forEach((comment) => {
        repeatedUserIdsArray.push(comment.userId);
      });
    });
    shares.forEach((share) => {
      repeatedUserIdsArray.push(share.userId);
    });

    const uniqueUserIdsArray = repeatedUserIdsArray.reduce((acc, curr) => {
      if (!acc.includes(curr)) {
        acc.push(curr);
      }
      return acc;
    }, []);

    const usersArray = await getUserArrayFromUserIds(uniqueUserIdsArray, userId);
    console.log(chalk.magenta(`${API} users fetched`));

    const posts = {};
    postsArray.forEach((post) => {
      posts[post.id] = post;
    });

    const users = {};
    usersArray.forEach((user) => {
      users[user.id] = user;
    });

    const data = {
      shares,
      posts,
      users,
    };

    console.log(chalk.magenta(`${API} data fetched`));
    res.send(data);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

export async function checkTimelineShares(req, res) {
  let { userId, afterDate, beforeDate } = res.locals;
  afterDate = afterDate ? afterDate : beforeDate;
  beforeDate = beforeDate ? beforeDate : afterDate;

  try {
    const postsBeforeDate = await postsRepository.checkTimelineShares(userId, '<', beforeDate);
    const postsAfterDate = await postsRepository.checkTimelineShares(userId, '>', afterDate);

    const data = {
      beforeDate,
      postsBeforeDate,
      afterDate,
      postsAfterDate,
    };

    console.log(chalk.magenta(`${API} timeline shares checked`));
    res.send(data);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

// ============================================================

async function getPost(postId, userId) {
  const post = await postsRepository.getPostById(postId);
  const likes = await getLikesDataForPost(postId, userId);
  const comments = await postsRepository.getPostComments(postId);
  const shares = await postsRepository.getSharesInfo(postId, userId);
  const newPost = {
    id: post.id,
    createdAt: post.createdAt,
    userId: post.userId,
    text: post.text,
    url: { url: post.url, title: post.title, description: post.description, imageUrl: post.image },
    likes,
    comments,
    shares,
  };
  return newPost;
}

async function getPostArrayFromPostIds(postIds, userId) {
  const postsArray = await Promise.all(
    postIds.map(async (postId) => {
      const post = await getPost(postId, userId);
      return post;
    }),
  );
  return postsArray;
}

async function getUserArrayFromUserIds(userIds, userId) {
  const usersArray = await Promise.all(
    userIds.map(async (val) => {
      const userData = await postsRepository.getUserDataById(val, userId);
      return userData;
    }),
  );
  return usersArray;
}

async function getLikesDataForPost(postId, userId) {
  const likes = await postsRepository.getPostLikes(postId);
  const totalLikes = likes.length;

  const likesFiltered = likes.filter((like) => like.userId !== userId);
  const usersWhoLiked =
    likesFiltered.length > 0
      ? likesFiltered.slice(0, likesFiltered.length > 2 ? 2 : likesFiltered.length)
      : [];

  let userHasLiked = false;
  for (const like of likes) {
    if (like.userId === userId) {
      userHasLiked = true;
    }
  }

  const likesData = {
    totalLikes,
    usersWhoLiked,
    userHasLiked,
  };

  return likesData;
}
