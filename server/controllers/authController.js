const authData = (req, res) => {
  res.status(200).json({
    message: "You are authorized."
  });
};

module.exports = {
  authData 
};
