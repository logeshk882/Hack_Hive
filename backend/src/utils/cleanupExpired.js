const Hackathon = require('../models/Hackathon');
const { isHackathonClosed } = require('./dateUtils');

/**
 * Sweeps the hackathons collection in MongoDB and removes any hackathon
 * whose registration is closed or deadline has passed compared to current date.
 * 
 * @param {Date} [referenceDate] - Optional reference date (defaults to current date)
 * @returns {Promise<{ totalScanned: number, totalDeleted: number, deletedTitles: string[] }>}
 */
async function cleanupExpiredHackathons(referenceDate = new Date()) {
  try {
    const hackathons = await Hackathon.find({});
    const expiredIds = [];
    const deletedTitles = [];

    for (const item of hackathons) {
      if (isHackathonClosed(item.deadline, item.title, referenceDate)) {
        expiredIds.push(item._id);
        deletedTitles.push(item.title);
      }
    }

    if (expiredIds.length > 0) {
      await Hackathon.deleteMany({ _id: { $in: expiredIds } });
      console.log(`[Auto-Cleanup] Successfully removed ${expiredIds.length} expired/closed hackathons.`);
    } else {
      console.log(`[Auto-Cleanup] Clean sweep complete. No expired hackathons found.`);
    }

    return {
      totalScanned: hackathons.length,
      totalDeleted: expiredIds.length,
      deletedTitles: deletedTitles.slice(0, 10), // Limit array length in return payload
    };
  } catch (error) {
    console.error(`[Auto-Cleanup Error] Failed to cleanup expired hackathons:`, error);
    throw error;
  }
}

module.exports = {
  cleanupExpiredHackathons,
};
