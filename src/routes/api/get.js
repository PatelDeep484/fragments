// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

// const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...

  const expand = req.query?.expand;
  try {
    const fragments = await Fragment.byUser(req.user, expand === '1');

    const data = {
      fragments,
    };
    res.status(200).json(createSuccessResponse(data));
  } catch (err) {
    logger.error(err);
  }
};
