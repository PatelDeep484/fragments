// src/routes/api/getbyID.js

/**
 * Get a list of fragments for the current user
 */

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  const fragmentId = req.params.id;
  try {
    const fragment = await Fragment.byId(req.user, fragmentId);
    var fragmentData = await fragment.getData();
    res.status(200).json(createSuccessResponse({ fragmentData }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
