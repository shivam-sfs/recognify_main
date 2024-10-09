const fs = require("fs");
const path = require("path");
const { compareHash, hashAndSalt } = require("../config/Bcrypt/bcrypt");
const knex = require("../config/connection/config");
const {
  loginValidationSchema,
  signupValidationSchema,
  toogleUserValidation,
  deleteUserValidation,
  userList,
  forgotPasswordSchema,
  emailValidation,
} = require("../config/validation-schema/userValidation");
const {
  listValidation,
} = require("../config/validation-schema/listValidation");
const {
  signJwt,
  isValidHttpUrl,
} = require("../helper/middleware/authentication");
const { authHandler } = require("../helper/third-party/messages");
const Response = require("../helper/static/Response");
const { mailer } = require("../helper/third-party/mailer");

/* -------------------- Google auth library --------------------- */
const { OAuth2Client } = require("google-auth-library");
const { unlinkFile } = require("../helper/third-party/multipart");
const { OTPTemplate } = require("../utils/MailTemplate");
const client = new OAuth2Client();

/* -------------------------------------------------------------------------- */
/*                                 Login                                      */
/* -------------------------------------------------------------------------- */

exports.login = async (postData) => {
  try {
    let { email } = postData;
    let picture, name;
    const { password, authorization } = postData;
    let loggedInWith = "";

    if (authorization) {
      try {
        const token = authorization.split(" ")[1];
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        ({ email } = ticket.getPayload());
        ({ picture, name } = ticket.getPayload());

        loggedInWith = "google";
      } catch (error) {
        return new Response(400, "F").custom(error.message);
      }
    } else {
      const { error } = loginValidationSchema.validate({ email, password });

      if (error) {
        return new Response(400, "F").custom(error.details[0].message);
      }
      loggedInWith = "username-password";
    }

    try {
      const findUser = await knex("users").where({ email }).first();
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

      if (loggedInWith === "username-password") {
        const comparePassword = await compareHash(password, findUser.password);

        if (!comparePassword) {
          return new Response(400, "F").custom(authHandler("WRONG_PASS"));
        }
      } else if (loggedInWith === "google") {
        try {
        
        } catch (error) {
          return new Response(400, "F").custom(error.message);
        }
      }

      const payLoad = {
        user_id: findUser.user_id,
        first_name: findUser.first_name,
        last_name: findUser.last_name,
        phone_number: findUser.phone_number,
        company_name: findUser.company_name,
        address: findUser.address,
        email: findUser.email,
        phone: findUser.phone,
        role: findUser.role,
        roleText:
          findUser.role === 1
            ? "Admin"
            : findUser.role === 2
            ? "Customer"
            : "Supplier",
        image: findUser.image
          ? isValidHttpUrl(findUser.image)
            ? findUser.image
            : `http://${postData.host}/profile/${findUser.image}`
          : null,
        loggedInWith: loggedInWith,
      };

      const jwtToken = await signJwt(payLoad);

      return new Response(200, "T", jwtToken).custom(
        authHandler("AUTH_SUCCESS")
      );
    } catch (error) {
      return new Response(400, "F").custom(error.message);
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Signup a new User                           */
/* -------------------------------------------------------------------------- */

exports.saveUser = async (postData) => {
  try {
    if (postData?.oldImage) {
      const basePath = path.dirname(__dirname);
      const imagePath = path.join(
        basePath,
        `public/profile/${postData.oldImage}`
      );
      const unlinkResult = await unlinkFile(imagePath);
    }

    const { error, value, host } = signupValidationSchema.validate(postData);

    if (error) {
      return new Response(400, "F").custom(error?.details[0]?.message);
    }

    if (value.password) {
      const { hash } = await hashAndSalt(value.password);
      value.password = hash;
    }

    delete value.user_id;
    delete value.oldImage;
    const reqHost = value.host;
    delete value.host;

    if (postData?.user_id) {
      const findUser = await knex("users")
        .where({ user_id: postData?.user_id })
        .first();

      if (!findUser) {
        return new Response(400, "F").custom(authHandler("USER_NOT_EXISTS"));
      }

      value.first_name = postData?.first_name || findUser?.first_name;
      value.last_name = postData?.last_name || findUser?.last_name;
      value.email = postData?.email || findUser?.email;
      value.role = postData?.role || findUser?.role;
      value.address = postData?.address || findUser?.address;
      value.phone_number = postData?.phone_number || findUser?.phone_number;
      value.image = postData?.image || findUser?.image;
      value.company_name = postData?.company_name || findUser?.company_name;
      value.password = value.password || findUser?.password;
      value.is_active =
        postData?.is_active !== undefined || postData?.is_active != ""
          ? postData?.is_active
          : findUser?.is_active;

      let message = "USER_UPDATED";
      if (postData?.is_deleted == "true") {
        message = "USER_DELETED";
      }

      if (postData?.is_active === 1) {
        message = "USER_ACTIVATED";
      } else if (postData?.is_active === 0) {
        message = "USER_DEACTIVATED";
      }

      //check email already exists or not
      const checkEmailExists = await knex("users")
        .where({ email: value.email, is_deleted: 1 })
        .whereNot({ user_id: postData?.user_id })
        .first();

      if (checkEmailExists) {
        return new Response(400, "F").custom(authHandler("DUPLICATE_EMAIL"));
      }

      const updatRresult = await knex("users")
        .update(value)
        .where({ user_id: postData?.user_id });

      if (updatRresult) {
        const userData = await knex("users")
          .select("*")
          .where({ user_id: postData?.user_id })
          .first();

        const payLoad = {
          user_id: userData.user_id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number,
          company_name: userData.company_name,
          address: userData.address,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          roleText:
            userData.role === 1
              ? "Admin"
              : userData.role === 2
              ? "Customer"
              : "Supplier",
          image: userData.image
            ? isValidHttpUrl(userData.image)
              ? userData.image
              : `http://${postData.host}/profile/${userData.image}`
            : null,
        };

        const jwtToken = await signJwt(payLoad);

        return new Response(jwtToken ? 200 : 400, jwtToken ? "T" : "F", {
          jwtToken,
        }).custom(authHandler(jwtToken ? message : "USER_UPDATED_FAILED"));
      }
      return new Response(400, "F").custom(authHandler("USER_UPDATED_FAILED"));
    } else {
      const findUser = await knex("users")
        .where({ email: value.email, is_deleted: 1 })
        .first();

      if (findUser) {
        return new Response(400, "F").custom(authHandler("DUPLICATE_EMAIL"));
      }

      const result = await knex("users").insert(value);

      return new Response(result ? 200 : 500, result ? "T" : "F").custom(
        authHandler(result ? "SIGNUP" : "SIGNUP_FAILED")
      );
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 get user list                              */
/* -------------------------------------------------------------------------- */

exports.list = async (postData) => {
  const {
    limit,
    offset,
    orderBy,
    order,
    searchParam,
    startDate,
    endDate,
    host,
  } = postData;
  const user_id = postData?.authData?.user_id || 0;

  const { error, value } = listValidation.validate({
    limit,
    offset,
    orderBy,
    order,
    searchParam,
    startDate,
    endDate,
  });

  if (error) {
    return new Response(400, "F").custom(error?.details[0]?.message);
  }

  if (!value.orderBy) {
    value.orderBy = "user_id";
  }

  if (!value.order) {
    value.order = "DESC";
  }

  try {
    const list = await knex("users")
      .select(
        "user_id",
        "first_name",
        "last_name",
        "company_name",
        "address",
        "phone_number",
        "email",
        "role",
        "image as oldImage",
        knex.raw(`CONCAT("http://${host}/profile/", image) as image`),
        "is_active",
        "is_deleted",
        "created_at",
        "updated_at",
        "created_by"
      )
      .where({ is_deleted: 1 })
      .andWhere(function () {
        if (value.searchParam) {
          this.where("first_name", "like", `%${value.searchParam}%`);
          this.orWhere("last_name", "like", `%${value.searchParam}%`);
          this.orWhere("company_name", "like", `%${value.searchParam}%`);
          this.orWhere("address", "like", `%${value.searchParam}%`);
          this.orWhere("phone_number", "like", `%${value.searchParam}%`);
          this.orWhere("email", "like", `%${value.searchParam}%`);
        }
      })
      .andWhere(function () {
        if (user_id) {
          this.whereNot("user_id", "=", user_id);
        }
      })
      .andWhere(function () {
        if (value.startDate && value.endDate) {
          this.whereBetween("created_at", [
            value.startDate + " 00:00:00",
            value.endDate + " 23:59:59",
          ]);
        } else if (value.startDate) {
          this.where("created_at", "like", `%${value.startDate}%`);
        }
      })

      .orderBy(value.orderBy, value.order)
      .limit(value.limit)
      .offset(value.offset);

    if (!list) {
      return new Response(500, "F").custom(authHandler("USER_LIST_WRONG"));
    }

    const totalCount = await knex("users")
      .select(knex.raw("count(*) as total"))
      .where({ is_deleted: 1 })
      .andWhere(function () {
        if (value.searchParam) {
          this.where("first_name", "like", `%${value.searchParam}%`);
          this.orWhere("last_name", "like", `%${value.searchParam}%`);
          this.orWhere("company_name", "like", `%${value.searchParam}%`);
          this.orWhere("address", "like", `%${value.searchParam}%`);
          this.orWhere("phone_number", "like", `%${value.searchParam}%`);
          this.orWhere("email", "like", `%${value.searchParam}%`);
        }
      })
      .andWhere(function () {
        if (user_id) {
          this.whereNot("user_id", "=", user_id);
        }
      })
      .andWhere(function () {
        if (value.startDate && value.endDate) {
          this.whereBetween("created_at", [
            value.startDate + " 00:00:00",
            value.endDate + " 23:59:59",
          ]);
        } else if (value.startDate) {
          this.where("created_at", "like", `%${value.startDate}%`);
        }
      })
      .first();

    if (!totalCount) {
      return new Response(500, "F").custom(authHandler("TOTAL_WRONG"));
    }

    const total = totalCount.total;
    const pagination = {
      limit,
      offset,
      total,
    };

    return new Response(200, "T", { list, pagination }).custom("User List");
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 get user details                           */
/* -------------------------------------------------------------------------- */

exports.getUserDetails = async (postData) => {
  try {
    const { user_id, host } = postData;

    const { error, value } = userList.validate({ user_id });

    if (error) {
      return new Response(400, "F").custom(error?.details[0]?.message);
    }

    const user = await knex("users")
      .where({ user_id: user_id })
      .select("*")
      .first();

    if (!user) {
      return new Response(400, "F").custom("User Data Not Available");
    }

    delete user.password;
    delete user.otp;
    user["oldImage"] = user.image;
    user["image"] = `http://${host}/profile/${user.image}`;

    return new Response(200, "T", user).custom("User Data");
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Delete a user                              */
/* -------------------------------------------------------------------------- */

exports.deleteUser = async (postData) => {
  try {
    const { user_id } = postData;

    const { error, value } = deleteUserValidation.validate({ user_id });

    if (error) {
      return new Response(400, "F").custom(error.details[0]?.message);
    }

    const deletedRowsCount = await knex("users")
      .update({ is_deleted: 0 })
      .where({ user_id });

    if (deletedRowsCount > 0) {
      return new Response(200, "T").custom(authHandler("USER_DELETED"));
    } else {
      return new Response(400, "F").custom(authHandler("FAILED_DELETE_USER"));
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Active/Deactive User                       */
/* -------------------------------------------------------------------------- */

exports.toogleUser = async (postData) => {
  try {
    const { user_id, is_active } = postData;

    const { error, value } = toogleUserValidation.validate({
      user_id,
      is_active,
    });

    if (error) {
      return new Response(400, "F").custom(error?.details[0]?.message);
    }

    const findUser = await knex("users")
      .where({ user_id: value.user_id })
      .first();

    if (findUser) {
      if (findUser.is_deleted === 0) {
        return new Response(400, "F").custom(
          "Error : Deleted User can not be activate or deactivate"
        );
      }
    } else {
      return new Response(400, "F").custom(
        "Error : User Details Not Available."
      );
    }

    const user = await knex("users")
      .update({ is_active })
      .where({ user_id: value.user_id });

    if (user) {
      const text = is_active == 1 ? " Activated " : " Deactivated ";
      const message = "User" + text + "Successfully.";

      return new Response(200, "T", { message }).custom();
    } else {
      const message = "User Update Failed";
      return new Response(500, "F", { message }).custom();
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 sendMailOtp                                */
/* -------------------------------------------------------------------------- */

exports.sendMailOtp = async (postData) => {
  try {
    // const { error, email } = emailValidation.validate({ postData });
    let { email } = postData;
    const findUser = await knex("users").where({ email: email }).first();
    if (!findUser || findUser.is_active !== 1 || findUser.is_deleted !== 1) {
      let errorMessage = "WRONG";

      if (!findUser) {
        errorMessage = "EMAIL_NOT_EXISTS";
      } else if (findUser.is_active !== 1) {
        errorMessage = "INACTIVE_ACCOUNT";
      } else if (findUser.is_deleted !== 1) {
        errorMessage = "DELETED_ACCOUNT";
      }
      return new Response(400, "F").custom(authHandler(errorMessage));
    } else {
      if (findUser) {
        function numberInRange(min, max) {
          return Math.floor(Math.random() * (max - min) + min);
        }
        const randomNumber = numberInRange(111111, 999999);
        await knex("users")
          .where({ email: email })
          .update({ otp: randomNumber });

        mailer(
          findUser.email,
          "OTP",
          OTPTemplate(
            randomNumber,
            findUser.first_name + " " + findUser.last_name,
            postData.host
          )
        );

        console.log("host", postData.host);
        return {
          status: 200,
          success: true,
          message: "Your OTP has been sent to the email",
          otp: randomNumber,
          email: findUser.email,
        };
      }
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 checkMailOtp                               */
/* -------------------------------------------------------------------------- */

exports.checkMailOtp = async (postData) => {
  try {
    // const { error, email } = emailValidation.validate({ postData });
    let { email, userEnteredOtp } = postData;
    const findUser = await knex("users").where({ email: email }).first();
    if (!findUser || findUser.is_active !== 1 || findUser.is_deleted !== 1) {
      let errorMessage = "WRONG";

      if (!findUser) {
        errorMessage = "EMAIL_NOT_EXISTS";
      } else if (findUser.is_active !== 1) {
        errorMessage = "INACTIVE_ACCOUNT";
      } else if (findUser.is_deleted !== 1) {
        errorMessage = "DELETED_ACCOUNT";
      }
      return new Response(400, "F").custom(authHandler(errorMessage));
    } else {
      if (
        userEnteredOtp &&
        findUser.otp !== undefined &&
        findUser.otp.toString() === userEnteredOtp.toString()
      ) {
        if (findUser.email === email) {
          return {
            status: 200,
            success: true,
            message: "OTP is correct",
            user: findUser,
          };
        } else {
          return {
            status: 400,
            success: false,
            message: "Email does not match the OTP",
          };
        }
      } else {
        return { status: 400, success: false, message: "Incorrect OTP" };
      }
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 forgetPassword                             */
/* -------------------------------------------------------------------------- */

exports.forgetPassword = async (postData) => {
  try {
    const { email, newPassword, confirmNewPassword } = postData;

    if (newPassword !== confirmNewPassword) {
      return new Response(400, "F").custom("New passwords do not match");
    }

    if (!newPassword) {
      return new Response(400, "F").custom("New password is required");
    }
    let hashedPassword = newPassword;

    if (newPassword) {
      const { hash } = await hashAndSalt(newPassword);
      hashedPassword = hash;
    }
    const updatedUserCount = await knex("users")
      .where({ email: email })
      .update({ password: hashedPassword });

    if (updatedUserCount === 0) {
      return new Response(400, "F").custom("Failed to update password");
    }

    const updatedUserData = await knex("users")
      .where({ email: email })
      .first();

    if (
      !updatedUserData ||
      updatedUserData.is_active !== 1 ||
      updatedUserData.is_deleted !== 1
    ) {
      let errorMessage = "WRONG";

      if (!updatedUserData) {
        errorMessage = "EMAIL_NOT_EXISTS";
      } else if (updatedUserData.is_active !== 1) {
        errorMessage = "INACTIVE_ACCOUNT";
      } else if (updatedUserData.is_deleted !== 1) {
        errorMessage = "DELETED_ACCOUNT";
      }

      return new Response(400, "F").custom(
        `Failed to update password.${errorMessage}`
      );
    } else {
      return new Response(200, "T", updatedUserData).custom(
        "Password updated successfully"
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Extra API for Save user                    */
/* -------------------------------------------------------------------------- */

exports.bk_saveUser = async (req, cb) => {
  var postData = req;
  if (postData.user_id) {
    postData.user_id = Number(postData.user_id);
  } else {
    delete postData.user_id;
  }
  let validateRes = signupValidationSchema.validate(postData);
  if (Object.keys(postData).length === 3) {
    validateRes = toogleUserValidation.validate(postData);
  }
  if (validateRes.error) {
    return new Response(400, "F").custom(
      validateRes.error?.details[0]?.message
    );
  }
  if (postData.password) {
    const { hash } = await hashAndSalt(postData.password);
    postData.password = hash;
  }
  if (postData.user_id) {
    knex("users")
      .where({
        user_id: postData.user_id,
      })
      .update(postData)
      .then((result) => {
        if (postData) {
          cb(null, postData);
        } else {
          cb(true, null);
        }
      })
      .catch((err) => {
        cb(err, null);
      });
  } else {
    knex("users")
      .insert(postData)
      .then((result) => {
        if (postData) {
          cb(null, postData);
        } else {
          cb(true, null);
        }
      })
      .catch((err) => {
        cb(err, null);
      });
  }
};
