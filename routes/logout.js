const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.session.destroy(() => {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    res.redirect("/");
  });
});

module.exports = router;
