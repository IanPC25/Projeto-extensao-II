const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

let sourceDbPath = isDev
  ? path.join(__dirname, 'luz_da_lua_db.sqlite')
  : path.join(process.resourcesPath, 'app', 'luz_da_lua_db.sqlite');

let targetDbPath;

if (isDev) {
  targetDbPath = sourceDbPath;
} else {
  const { app } = require('electron');
  const userDataPath = app.getPath('userData');
  targetDbPath = path.join(userDataPath, 'luz_da_lua_db.sqlite');

  if (!fs.existsSync(targetDbPath)) {
    try {
      fs.copyFileSync(sourceDbPath, targetDbPath);
      console.log('Banco copiado para:', targetDbPath);
    } catch (err) {
      console.error('Erro ao copiar banco para userData:', err);
    }
  }
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: targetDbPath,
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectamos ao SQLite com Sequelize!');
  } catch (error) {
    console.error('Não foi possível conectar ao banco:', error);
  }
})();

module.exports = sequelize;
