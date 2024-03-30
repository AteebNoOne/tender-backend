export const sendToken = (res, user, message, statusCode = 200) => {
  const token = user.getJWTToken();

  const option = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: false,
    // secure: true,
    sameSite: "none",
  };

  res.status(statusCode).cookie("token", token, option).json({
    sucess: true,
    message,
    user,
    token
  });
};
