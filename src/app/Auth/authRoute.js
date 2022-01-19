module.exports = function(app){
  const authController = require('./authController');

  //이메일 인증번호 발급 API
  app.post('/imsi/auth', authController.createVerificationCode);
}