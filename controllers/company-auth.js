const register = async (req, res) => {
  res.json({ token: 'nothing' })
}

const login = async (req, res) => {
  res.send('company login router')
}

module.exports = {
  register,
  login,
}
