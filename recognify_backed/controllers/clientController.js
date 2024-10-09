const Response = require('../helper/static/Response');
const clientModel = require('../models/clientModel.js');


exports.list = async (req, res) => {
    try {
        const response = await clientModel.list(req.body);
        return res.status(response.status).json(response);
    } catch (error) {
        return res.json(new Response(500, "F").custom(error.message));
    }
};

exports.save = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await clientModel.save({ ...req.body, id });
        return res.status(response.status).json(response);
    } catch (error) {
        return res.json(new Response(500, "F").custom(error.message));
    }
};

exports.delete = async (req, res) => {
    try {
        const { work_id } = req.params;
        const response = await clientModel.delete({ work_id });
        return res.status(response.status).json(response);
    } catch (error) {
        return res.json(new Response(500, "F").custom(error.message));
    }
}

