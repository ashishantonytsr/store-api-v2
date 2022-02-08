const register = async (req, res) => {
  res.send('customer register route')
}

const login = async (req, res) => {
  res.send('customer login router')
}

module.exports = {
  register,
  login,
}
