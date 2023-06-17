const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

const createFragment = async (req, res) => {
  const { headers } = req;
  const contentType = headers['content-type'];

  if (Fragment.isSupportedType(contentType) || Buffer.isBuffer(req.body)) {
    const ownerId = req.user;
    const fragment = new Fragment({ ownerId, type: contentType });

    try {
      await fragment.save();
      await fragment.setData(req.body);

      const apiUrl = process.env.API_URL;
      const locationHeader = `${apiUrl}/v1/fragments/${fragment.id}`;

      res.set('Location', locationHeader);
      res.status(201).json(createSuccessResponse({ fragment }));
    } catch (err) {
      throw new Error(err);
    }
  } else {
    const unsupportedError = createErrorResponse(415, 'Type not supported');
    res.status(415).json(unsupportedError);
  }
};

module.exports = createFragment;
