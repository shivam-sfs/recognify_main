const fs = require('fs');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const Response = require('../static/Response');
/* -------------------------------------------------------------------------- */
/*                                   Multer                                   */
/* -------------------------------------------------------------------------- */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },

    filename: (req, file, cb) => {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
        );
    },
});

const documentStorage  = (folder) => {

    try {
        if (!fs.existsSync(folder)) {
            console.log('folder',folder);
            fs.mkdirSync(folder);
        }

        const Storage = multer.diskStorage({
            destination: (req, file, cb) => {

                const { product_name } = req.body;
                const newFolder = product_name ? `${folder}/${product_name}` : folder;

                if (file) {

                    try {
                        if (!fs.existsSync(newFolder)) {
                            fs.mkdirSync(newFolder);
                        }
                    } catch (err) {
                        console.error(err);
                    }

                    cb(null, newFolder);
                }
            },

            filename: (req, file, cb) => {
                if (file) {
                    const fileNameCheck = file.originalname.replace(
                        /[-&\/\\#.,+()$~%'":*?<>{} ]/g,
                        '',
                    );
                    cb(
                        null,
                        `${fileNameCheck}-${Date.now()}${path.extname(file.originalname)}`,
                    );
                }
            },
        });
        return multer({ storage: Storage });
    } catch (error) {
        return new Response(500, "F").custom(error.message);
    }
}
const upload = multer({
    storage,
});

// const uploadDocument = multer({
//     storage: documentStorage,
// });

const uploadFiles = (folder) => {

    try {
        if (!fs.existsSync(folder)) {
            console.log('folder',folder);
            fs.mkdirSync(folder);
        }

        const Storage = multer.diskStorage({
            destination: (req, file, cb) => {

                const { product_name } = req.body;
                const newFolder = product_name ? `${folder}/${product_name}` : folder;

                if (file) {

                    try {
                        if (!fs.existsSync(newFolder)) {
                            fs.mkdirSync(newFolder);
                        }
                    } catch (err) {
                        console.error(err);
                    }

                    cb(null, newFolder);
                }
            },

            filename: (req, file, cb) => {
                if (file) {
                    const fileNameCheck = file.originalname.replace(
                        /[-&\/\\#.,+()$~%'":*?<>{} ]/g,
                        '',
                    );
                    cb(
                        null,
                        `${fileNameCheck}-${Date.now()}${path.extname(file.originalname)}`,
                    );
                }
            },
        });
        return multer({ storage: Storage });
    } catch (error) {
        return new Response(500, "F").custom(error.message);
    }
}

const unlinkFile = async (folderPath, image) => {

    const basePath = path.dirname(__dirname);
    const parentDir = path.dirname(basePath);

    const imagePath = path.join(parentDir, `${folderPath}/${image}`);

    try {
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted file: ${imagePath}`);
            return true;
        } else {
            console.log(`File not found: ${imagePath}`);
            return false;
        }
    } catch (error) {
        console.error(`Error deleting file: ${error}`);
        return false;
    }
}

const unlinkFiles = async (folderPath, files) => {
    const basePath = path.dirname(__dirname);
    const parentDir = path.dirname(basePath);
    for (const file of files) {
        try {
            const filePath = path.join(parentDir, `${folderPath}/${file}`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`File ${file} deleted successfully`);
            } else {
                console.log(`Filepath ${filePath}`);
                console.log(`File ${file} does not exist`);
            }
        } catch (error) {
            console.error(`Error deleting file ${file}:`, error);
        }
    }
};

const renameFolder = async (currPath, newPath) => {
    const basePath = path.dirname(__dirname);
    const parentDir = path.dirname(basePath);

    currPath = path.join(parentDir, currPath);
    newPath = path.join(parentDir, newPath);

    try {
        fs.renameSync(currPath, newPath)
        console.log("Successfully renamed the directory.")
    } catch (err) {
        console.log(err)
    }
}
/* -------------------------------------------------------------------------- */
/*                                 Nodemailer                                 */
/* -------------------------------------------------------------------------- */

async function mailer(email, subject, text) {
    try {
      const { data } = await MailSettingModel.readSetting({
        type: 'email',
      });
  
      const transporter = nodemailer.createTransport({
        host: data.mailer_host,
        service: data.mailer_service,
        port: +data.mailer_port,
        // secure: Boolean(data.mailer_is_secure),
        auth: {
          user: data.mailer_user_name,
          pass: data.mailer_password,
        },
      });
  
      await transporter.sendMail({
        from: `${data.sender_name} <${data.sender_email}>`,
        to: email,
        subject,
        // text,
        html: text,
      });
  
      console.log('Email sent successfully.');
    } catch (error) {
      console.log(error, 'Email not sent.');
    }
  }


module.exports = {
    upload,
    uploadDocument: documentStorage,
    uploadFiles,
    unlinkFile,
    unlinkFiles,
    renameFolder,
    mailer
};
