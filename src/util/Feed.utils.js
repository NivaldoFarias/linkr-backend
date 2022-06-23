import { API } from '../blueprints/chalk.js';
import chalk from 'chalk';
import { postsRepository } from '../repositories/posts.js';
import { likesRepository } from '../repositories/likes.js';
import { sharesRepository } from '../repositories/shares.js';
import { commentsRepository } from '../repositories/comments.js';
import { userRepository } from '../repositories/users.js';

export async function getDataFromShares(shares, userId, pageOwnerId) {
    const uniquePostIds = shares.reduce((acc, curr) => {
        if (!acc.includes(curr.postId)) {
            acc.push(curr.postId);
        }
        return acc;
    }, []);

    const postsArray = await getPostArrayFromPostIds(uniquePostIds, userId);
    console.log(chalk.magenta(`${API} posts fetched`));

    const repeatedUserIdsArray = [];
    if (pageOwnerId) {
        repeatedUserIdsArray.push(pageOwnerId);
    }

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
        pageOwnerId,
        shares,
        posts,
        users
    }

    return data;
}


export async function getPostData(postId, userId) {
    const post = await getPost(postId);
    const userIds = [post.userId, ...post.comments.map(comment => comment.userId)];
    const usersArray = await getUserArrayFromUserIds(userIds, userId);
    const users = Object.fromEntries(usersArray.map(user => [user.id, user]));
    const data = {
        post,
        users
    }
    console.log(chalk.magenta(`${API} post fetched`));
    return data;
}

export async function getPost(postId, userId) {
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

export async function getPostArrayFromPostIds(postIds, userId) {
    const postsArray = await Promise.all(
        postIds.map(async (postId) => {
            const post = await getPost(postId, userId);
            return post;
        }
        )
    );
    return postsArray;
}

export async function getUserArrayFromUserIds(userIds, userId) {
    const usersArray = await Promise.all(
        userIds.map(async (val) => {
            const userData = await userRepository.getUserDataById(val, userId);
            return userData;
        })
    );
    return usersArray;
}

export async function getLikesDataForPost(postId, userId) {
    const likes = await likesRepository.getPostLikes(postId);
    const totalLikes = likes.length;

    const likesFiltered = likes.filter((like) => like.userId !== userId);
    const usersWhoLiked =
        likesFiltered.length > 0
            ? likesFiltered.slice(0, likesFiltered.length > 2 ? 2 : likesFiltered.length)
            : [];

    const userHasLiked = likes.find((like) => like.userId === userId) ? true : false;

    const likesData = {
        totalLikes,
        usersWhoLiked,
        userHasLiked
    }

    return likesData;
}
