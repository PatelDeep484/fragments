const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

const createFragment = async (req, res) => {
  const { headers } = req;
  const contentType = headers['content-type'];
  if (Fragment.isSupportedType(contentType) == false && Buffer.isBuffer(req.body) == false) {
    const unsupportedError = createErrorResponse(415, 'Type not supported');
    return res.status(415).send(unsupportedError);
  } else {
    //if (Fragment.isSupportedType(contentType) || Buffer.isBuffer(req.body)) {
    const ownerId = req.user;
    const fragment = new Fragment({ ownerId, type: contentType });

    try {
      await fragment.save();
      await fragment.setData(req.body);

      const apiUrl = process.env.API_URL;
      const locationHeader = `http://${apiUrl}/v1/fragments/${fragment.id}`;

      res.set('Location', locationHeader);
      res.status(201).json(createSuccessResponse({ fragment }));
    } catch (err) {
      const errorResponse = createErrorResponse(500, 'Failed to create fragment');
      res.status(500).json(errorResponse);
    }
  }
};

module.exports = createFragment;
