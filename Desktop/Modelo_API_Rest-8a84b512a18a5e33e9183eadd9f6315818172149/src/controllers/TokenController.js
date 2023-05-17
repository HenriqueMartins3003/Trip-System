/* eslint-disable import/no-extraneous-dependencies */
import jwt from 'jsonwebtoken';
import User from '../models/User';

class TokenController {
  async store(req, res) {
    const { email = '', password = '' } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        errors: ['Credenciais inválidas'],
      });
    }
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          errors: ['Usuario não existe'],
        });
      }
      if (!(await user.passwordIsValid(password))) {
        return res.status(401).json({
          errors: ['Senha incorreta'],
        });
      }
      const { id } = user;
      const token = jwt.sign(
        { id, email },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION },
      );
      return res.json({ token, user: { nome: user.nome, id, email } });
    } catch (error) {
      return res.json('not ok');
    }
  }
}
export default new TokenController();
