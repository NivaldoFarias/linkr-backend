import { API } from '../blueprints/chalk.js';
import chalk from 'chalk';
import { timelineSharesRepository } from '../repositories/sharesTimelineFeed.js';
import { userSharesRepository } from '../repositories/sharesUserFeed.js';
import { hashtagsSharesRepository } from '../repositories/sharesHashtagFeed.js';
import { getDataFromShares } from '../util/Feed.utils.js';

// TIMELINE SHARES

export async function getTimelineData(req, res) {
  const { userId, beforeDate, afterDate, limit } = res.locals;

  try {
    const shares = await timelineSharesRepository.getTimelineShares(userId, beforeDate, afterDate, limit);
    console.log(chalk.magenta(`${API} shares fetched`));
    const data = await getDataFromShares(shares, userId);
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
  try {
    const shares = await userSharesRepository.getUserShares(visitedUserId, beforeDate, afterDate, limit);
    console.log(chalk.magenta(`${API} shares fetched`));
    const data = await getDataFromShares(shares, userId);
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

    console.log(chalk.magenta(`${API} user shares checked`));
    res.send(data);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}


// HASHTAG SHARES

export async function getHashtagData(req, res) {
  const { userId, hashtagId, beforeDate, afterDate, limit } = res.locals;
  try {
    const shares = await hashtagsSharesRepository.getHashtagShares(hashtagId, beforeDate, afterDate, limit);
    console.log(chalk.magenta(`${API} shares fetched`));
    const data = await getDataFromShares(shares, userId);
    console.log(chalk.magenta(`${API} data fetched`));
    res.send(data);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

export async function checkHashtagShares(req, res) {
  let { hashtagId, afterDate, beforeDate } = res.locals;
  afterDate = afterDate ? afterDate : beforeDate;
  beforeDate = beforeDate ? beforeDate : afterDate;

  try {
    const postsBeforeDate = await hashtagsSharesRepository.checkHashtagSharesBeforeDate(hashtagId, beforeDate);
    const postsAfterDate = await hashtagsSharesRepository.checkHashtagSharesAfterDate(hashtagId, afterDate);

    const data = {
      beforeDate,
      postsBeforeDate,
      afterDate,
      postsAfterDate,
    }

    console.log(chalk.magenta(`${API} hashtag shares checked`));
    res.send(data);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

