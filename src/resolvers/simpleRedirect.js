async function simpleRedirect(req, res, params, route) {
  // TODO: do the actual proxying

  res.end(JSON.stringify({ ok: true }));
}

module.exports = simpleRedirect;
