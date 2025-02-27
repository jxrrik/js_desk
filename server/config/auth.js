module.exports = {
  secret: process.env.JWT_SECRET || "minha-chave-secreta",
  expiresIn: "1h",
};
