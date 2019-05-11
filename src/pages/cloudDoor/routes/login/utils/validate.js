// 校验手机号
const validateName = (rule, value, callback) => {
  console.log('正在校验');
  if (!value) {
    callback(new Error('请输入用户名或手机号'));
  } else if (/\s/.test(value)) {
    callback(new Error('不能包含空格'));
  } else {
    callback();
  }
};
// 校验密码
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'));
  } else {
    callback();
  }
};
// 校验图形码
const validateChartcode = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入图形验证码'));
  } else {
    callback();
  }
};
// 校验手机号
const validePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'));
  } else if (/\s/.test(value)) {
    callback(new Error('不能包含空格'));
  } else if (!/^[1][3-9][0-9]{9}$/.test(value)) {
    callback(new Error('输入的手机号码不正确'));
  } else {
    callback();
  }
};

// 校验验证码
const validateVerifycode = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入验证码'));
  } else if (!/^\d{4}$/.test(value)) {
    callback(new Error('验证码错误'));
  } else {
    callback();
  }
};
// 校验图形验证码
const validateChartCode = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入验证码'));
  } else {
    callback();
  }
};

export {
  validateName,
  validatePassword,
  validateChartcode,
  validateVerifycode,
  validePhone,
  validateChartCode,
}
