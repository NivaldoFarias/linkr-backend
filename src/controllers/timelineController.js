import { postsRepository } from '../repositories/posts.js';

export async function getTimelinePosts(req, res) {
  const { userId } = res.locals;
  try {
    const posts = await postsRepository.getTimelinePosts();
    for (const post of posts) {
      const likes = await postsRepository.getPostLikes(post.id);
      const likesFiltered = likes.filter((like) => like.userId !== userId);
      post.totalLikes = likes.length;
      post.usersWhoLiked =
        likesFiltered.length > 0
          ? likesFiltered.slice(0, likesFiltered.length > 2 ? 2 : likesFiltered.length)
          : [];
      post.userHasLiked = false;
      for (const like of likes) {
        if (like.userId === res.locals.userId) {
          post.userHasLiked = true;
        }
      }
    }

    res.send(posts);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}


export async function getTimelinePosts2(req, res) {
  const { userId, beforeDate, afterDate } = res.locals;
  try {
    const shares = await postsRepository.getTimelineShares(userId, beforeDate, afterDate);

    // get unique posts from postId in shares
    const uniquePostIds = shares.map((share) => share.postId);
    const postsArray = await getPostArrayFromPostIds(uniquePostIds);

    // get unique users mixing: posts userId + post comments userId + shares userId

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
      if (!acc.some((user) => user.id === curr.id)) {
        acc.push(curr);
      }
      return acc;
    }, []);

    // get usersArray with id, username, imageUrl, isFollowing
    const usersArray = await getUserArrayFromUserIds(uniqueUserIdsArray);

    // transform postsArray in posts (object based on postId)
    const posts = {};
    postsArray.forEach((post) => {
      posts[post.id] = post;
    });

    // transform usersArray in users (object based on userId)
    const users = {};
    usersArray.forEach((user) => {
      users[user.id] = user;
    });

    // conforming data
    const data = {
      shares,
      posts,
      users
    }

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
    userIds.map(async (user) => {
      const userData = await postsRepository.getOtherUserDataById(user.id, userId);
      return userData;
    })
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
    if (like.userId === res.locals.userId) {
      userHasLiked = true;
    }
  }
  return { userHasLiked, totalLikes, usersWhoLiked };
}
