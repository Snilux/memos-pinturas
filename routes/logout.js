const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.session.destroy(() => {
    res.render("index", {
      title: "Memo's Pinturas",
    });
  });
});

module.exports = router;
