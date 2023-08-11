const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.debug(`owner id and id: ${req.user}, ${req.params.id}`);

  const id = req.params.id;

  try {
    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse());
  } catch (e) {
    res.status(404).json(createErrorResponse(404, e.message));
  }
};
