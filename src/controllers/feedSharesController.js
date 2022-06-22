import { API } from '../blueprints/chalk.js';
import chalk from 'chalk';
import { postsRepository } from '../repositories/posts.js';
import { likesRepository } from '../repositories/likes.js';
import { sharesRepository } from '../repositories/shares.js';
import { commentsRepository } from '../repositories/comments.js';
import { userRepository } from '../repositories/users.js';
import { timelineSharesRepository } from '../repositories/sharesTimelineFeed.js';
import { userSharesRepository } from '../repositories/sharesUserFeed.js';

// TIMELINE SHARES

export async function getTimelineData(req, res) {
  const { userId, beforeDate, afterDate, limit } = res.locals;

  try {
    const shares = await timelineSharesRepository.getTimelineShares(userId, beforeDate, afterDate, limit);
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
    })

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
      users
    }

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
    const postsBeforeDate = await timelineSharesRepository.checkTimelineSharesBeforeDate(userId, beforeDate);
    const postsAfterDate = await timelineSharesRepository.checkTimelineSharesAfterDate(userId, afterDate);

    const data = {
      beforeDate,
      postsBeforeDate,
      afterDate,
      postsAfterDate,
    }

    console.log(chalk.magenta(`${API} timeline shares checked`));
    res.send(data);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

// USER SHARES

export async function getUserData(req, res) {

  const { userId, visitedUserId, beforeDate, afterDate, limit } = res.locals;
  console.log(userId, visitedUserId, beforeDate, afterDate, limit);

  try {
    const shares = await userSharesRepository.getUserShares(visitedUserId, beforeDate, afterDate, limit);
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
    })

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
      users
    }

    console.log(chalk.magenta(`${API} data fetched`));
    res.send(data);

  } catch (e) {
    res.status(500).send({ error: e });
  }
}

export async function checkUserShares(req, res) {
  let { visitedUserId, afterDate, beforeDate } = res.locals;
  afterDate = afterDate ? afterDate : beforeDate;
  beforeDate = beforeDate ? beforeDate : afterDate;

  try {
    const postsBeforeDate = await userSharesRepository.checkUserSharesBeforeDate(visitedUserId, beforeDate);
    const postsAfterDate = await userSharesRepository.checkUserSharesAfterDate(visitedUserId, afterDate);

    const data = {
      beforeDate,
      postsBeforeDate,
      afterDate,
      postsAfterDate,
    }

    console.log(chalk.magenta(`${API} timeline shares checked`));
    res.send(data);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}


// HASHTAG SHARES

export async function getHashtagData(req, res) { }

export async function checkHashtagShares(req, res) { }




// ========================== AUXILIARES ==================================

async function getPost(postId, userId) {
  const post = await postsRepository.getPostById(postId);
  const likes = await getLikesDataForPost(postId, userId);
  const comments = await commentsRepository.getPostComments(postId);
  const shares = await sharesRepository.getSharesInfo(postId, userId);
  const newPost = {
    id: post.id,
    createdAt: post.createdAt,
    userId: post.userId,
    text: post.text,
    url: { url: post.url, title: post.title, description: post.description, imageUrl: post.image },
    likes,
    comments,
    shares
  }
  return newPost;
}

async function getPostArrayFromPostIds(postIds, userId) {
  const postsArray = await Promise.all(
    postIds.map(async (postId) => {
      const post = await getPost(postId, userId);
      return post;
    }
    )
  );
  return postsArray;
}

async function getUserArrayFromUserIds(userIds, userId) {
  const usersArray = await Promise.all(
    userIds.map(async (val) => {
      const userData = await userRepository.getUserDataById(val, userId);
      return userData;
    })
  );
  return usersArray;
}

async function getLikesDataForPost(postId, userId) {
  const likes = await likesRepository.getPostLikes(postId);
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
    userHasLiked
  }

  return likesData;
}
