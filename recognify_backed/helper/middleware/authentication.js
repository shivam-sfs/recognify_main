const { authHandler } = require("../third-party/messages");
const Response = require("../static/Response");
const JWT = require("jsonwebtoken");
const knex = require("../../config/connection/config");

/* -------------------------------------------------------------------------- */
/*                                 JWT Auth Verify                            */
/* -------------------------------------------------------------------------- */

const middleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.json(
      new Response(401, "F").custom(authHandler("TOKEN_REQUIRED"))
    );
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.json(new Response(401, "F").custom(authHandler("JWT_INVALID")));
  }

  const decode = JWT.decode(token);

  if (!decode) {
    return res.json(new Response(401, "F").custom(authHandler("AUTH_FAILED")));
  }

  const authData = await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, {
    ignoreExpiration: true,
  });

  // if()
  const findUser = await knex("users")
    .where({ email: authData.email })
    .first();
  if (
    !findUser ||
    findUser.is_active !== 1 ||
    findUser.is_deleted !== 1 ||
    findUser.role !== 1
  ) {
    let errorMessage = "WRONG";

    if (!findUser) {
      errorMessage = "EMAIL_NOT_EXISTS";
    } else if (findUser.is_active !== 1) {
      errorMessage = "INACTIVE_ACCOUNT";
    } else if (findUser.is_deleted !== 1) {
      errorMessage = "DELETED_ACCOUNT";
    } else if (findUser.role !== 1) {
      errorMessage = "UN_AUTH";
    }

    return new Response(400, "F").custom(authHandler(errorMessage));
  }

  
  const todayDate = new Date().getTime();

  if (authData.exp < todayDate / 1000) {
    return res.json(new Response(401).custom(authHandler("TOKEN_EXPIRED")));
  }

  req.authData = authData;

  next();
};

const signJwt = async (payloadData) => {
  const jwtPayload = payloadData;

  const tokenData = { ...payloadData };

  // JWT token with Payload and secret.
  tokenData.token = JWT.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TIMEOUT_DURATION,
  });

  const refresh_token = JWT.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_TIMEOUT_DURATION,
  });

  return tokenData;
};

const isValidHttpUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

module.exports = {
  middleware,
  signJwt,
  isValidHttpUrl,
};
