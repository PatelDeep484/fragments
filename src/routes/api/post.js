const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
require('dotenv').config();

module.exports = async (req, res) => {
  if (!req) {
    res.status(400).json(createErrorResponse(400, 'e.message'));
  }
  const data = req.body;
  const user = req.user;

  logger.debug(user, 'POST request: user');
  logger.debug(data, 'POST request: fragment buffer');

  try {
    const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
    await fragment.save();
    await fragment.setData(req.body);

    logger.debug({ fragment }, 'New fragment created');

    res.setHeader('Location', process.env.API_URL + '/v1/fragments/' + fragment.id);
    res.status(201).json(
      createSuccessResponse({
        status: 'ok',
        fragment: fragment,
      })
    );
  } catch (e) {
    logger.warn(e.message, 'Error posting fragment');
    res.status(415).json(createErrorResponse(415, e.message));
  }
};
