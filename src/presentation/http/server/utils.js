const httpStatus = require('http-status');

const renderBuilder = (nextApp, { logger }) => async (req, res) => {
  try {
    const html = await nextApp.renderToHTML(req, res, req.path, req.query);
    if (res.statusCode >= httpStatus.BAD_REQUEST) {
      res.send(html);

      return;
    }

    res.send(html);
  } catch (err) {
    logger.error(err);
    nextApp.renderError(err, req, res, req.path, req.query);
  }
};

module.exports = renderBuilder;
