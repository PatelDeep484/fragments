/**
 * Get a list of fragments for the current user
 */

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const path = require('path');
const markdownIt = require('markdown-it')();
module.exports = async (req, res) => {
  //const fragmentId = req.params.id;
  // const requestedExtension = req.params.extension; // Extract the extension from the request
  const requestedExtension = path.extname(req.params.id);
  const fragmentId = path.basename(req.params.id, requestedExtension);
  logger.debug(requestedExtension);
  logger.debug(fragmentId);

  try {
    const fragment = await Fragment.byId(req.user, fragmentId);
    const fragmentData = await fragment.getData();
    logger.debug(fragmentData);
    // Check if the requested extension is valid for the fragment's MIME type
    if (requestedExtension) {
      const exten = getMimeTypes(requestedExtension);
      var mimeTypes = fragment.formats.includes(exten);

      if (!mimeTypes) {
        res.status(415).json(createErrorResponse(415, 'Unsupported extension'));
        return;
      }
      logger.debug(exten);
      if (exten === 'text/html' && fragment.mimeType === 'text/markdown') {
        const convertedData = markdownIt.render(fragmentData.toString());
        logger.debug(convertedData);
        res.status(200).set('content-type', exten).send(convertedData);
      } else {
        res.status(415).json(createErrorResponse(415, 'Unsupported extension conversation'));
        //res.set('content-type', exten).status(200).json(createSuccessResponse(fragmentData));
      }
    } else {
      logger.debug(fragmentData + '=====================================================');
      res.set('content-type', fragment.mimeType).status(200).send(fragmentData);
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};

/**
 * Get the MIME type based on the requested extension
 */

function getMimeTypes(extension) {
  const mimeTypeMap = {
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.html': 'text/html',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };

  return mimeTypeMap[extension.toLowerCase()] || null;
}
