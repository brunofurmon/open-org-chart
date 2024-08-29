const httpStatus = require('http-status');

const renderBuilder = (nextApp) => async (req, res) => {
  try {
    const html = await nextApp.renderToHTML(req, res, req.path, req.query);

    if (res.statusCode >= httpStatus.BAD_REQUEST) {
      res.send(html);

      return;
    }

    res.send(html);
  } catch (err) {
    nextApp.renderError(err, req, res, req.path, req.query);
  }
};

module.exports = renderBuilder;
