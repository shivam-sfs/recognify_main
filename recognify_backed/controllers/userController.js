const Response = require("../helper/static/Response");
const userModel = require("../models/userModels");
const { hashAndSalt, compareHash } = require("../config/Bcrypt/bcrypt");
const {
  signupValidationSchema,
  loginValidationSchema,
} = require("../config/validation-schema/userValidation");
const { signJwt } = require("../helper/middleware/authentication");
const { authHandler } = require("../helper/third-party/messages");
const { extractRequestData } = require("../helper/static/request-response");
const { extractUser } = require("../helper/extractRequest/extractUser");

exports.login = async (req, res) => {
  try {
    const postData = extractRequestData(req);
    const response = await userModel.login(postData);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.saveUser = async (req, res) => {
  try {
    const postData = extractUser(req);
    const response = await userModel.saveUser(postData);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

// exports.bk_saveUser = (req, res) => {
//   const postData = req.body;
//   postData.created_by = req.authData.user_id;
//   if (req.file) {
//     let URL = "http://" + req.headers.host + "/profile/" + req.file.filename;
//     postData.image = URL;
//   }
//   if (postData.previous_image) {
//     let oldNmae = postData.previous_image;
//     const withSlash = oldNmae.split("/");
//     fs.unlinkSync("profile/" + withSlash[4], (err) => { });
//   }
//   userModel.saveUser(postData, (err, data) => {
//     if (data === null) {
//       return res.json({
//         status: 500,
//         message: "There are some error in fetch Add Admin.",
//         data: err,
//       });
//     } else {
//       return res.json({
//         status: 200,
//         message: "Add Admin fetched successfully.",
//         data: data,
//       });
//     }
//   });
// };

exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const response = await userModel.deleteUser({ user_id });
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.toogleUser = async (req, res) => {
  try {
    const postData = extractRequestData(req);
    const response = await userModel.toogleUser(postData);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.update = async (req, res) => {
  try {
    const postData = extractRequestData(req);
    const response = await userModel.update(postData);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.login_bk = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error, value } = loginValidationSchema.validate(req.body);

    if (error) {
      return res.json(
        new Response(400, "F").custom(error?.details[0]?.message)
      );
    }

    //convert password to a hash value
    const { hash } = await hashAndSalt(password);

    const findUser = await userModel.getUserByEmail(email);

    if (!findUser || findUser.is_active !== 1 || findUser.is_deleted !== 1) {
      let errorMessage = "WRONG";

      if (!findUser) {
        errorMessage = "EMAIL_NOT_EXISTS";
      } else if (findUser.is_active !== 1) {
        errorMessage = "INACTIVE_ACCOUNT";
      } else if (findUser.is_deleted !== 1) {
        errorMessage = "DELETED_ACCOUNT";
      }

      return res.json(new Response(400, "F").custom(authHandler(errorMessage)));
    }

    const comparePassword = await compareHash(password, findUser.password);

    if (!comparePassword) {
      return res.json(new Response(400, "F").custom(authHandler("WRONG_PASS")));
    }

    //preapare for jwt token to send
    const payLoad = {
      user_id: findUser.user_id,
      email: findUser.email,
      phone: findUser.phone,
      role: findUser.role,
      image: findUser.image ? findUser.image : "",
    };

    const jwtToken = await signJwt(payLoad);

    return res.json(
      new Response(200, "T", jwtToken).custom(authHandler("AUTH_SUCCESS"))
    );

    return res.json(
      new Response(200, "T", jwtToken).custom(authHandler("AUTH_SUCCESS"))
    );
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const postData = extractRequestData(req);
    const response = await userModel.getUserDetails(postData);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
exports.list = async (req, res) => {
  try {
    const postData = extractRequestData(req);
    const response = await userModel.list(postData);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const postData = req.body;
    const response = await userModel.forgetPassword(postData);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
}
exports.sendMailOtp = async (req, res) => {
  try {
    const postData = extractRequestData(req);
    const response = await userModel.sendMailOtp(postData);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
}
exports.checkMailOtp = async (req , res) => {
  try{
    const postData = extractRequestData(req);
    const response = await userModel.checkMailOtp(postData);
    return res.status(response.status).json(response);
    
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
}
