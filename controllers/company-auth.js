const Company = require('../models/Company')

const register = async (req, res) => {
  const { name, email, password, contact_number } = req.body
  try {
    const company = await Company.create({
      name,
      email,
      password,
      contact_number,
    })
    res
      .status(200)
      .json({
        success: true,
        msg: `Added company ${company.name}`,
        data: company,
      })
  } catch (error) {
    console.log(error)
  }
}

const login = async (req, res) => {
  res.send('company login router')
}

module.exports = {
  register,
  login,
}
