// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  const fragmentId = req.params.id;
  let contentType = null;
  try {
    const idParts = fragmentId.split('.');
    let type = idParts.length > 1 ? idParts[1] : null;
    switch (type) {
      case 'txt':
        contentType = 'text/plain';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      default:
        contentType = req.headers.contentType;
    }
    const fragment = await Fragment.byId(req.user, fragmentId);
    if (!Fragment.isSupportedType(contentType)) {
      res.status(415).json(createErrorResponse(415, 'Fragment type not supported'));
    }
    res.status(200).json(createSuccessResponse(fragment));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
