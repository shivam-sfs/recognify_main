const Response = require('../helper/static/Response');
const leadModel = require('../models/leadModal');


exports.list = async (req, res) => {
    try {
        const response = await leadModel.list(req.body);
        return res.status(response.status).json(response);
    } catch (error) {
        return res.json(new Response(500, "F").custom(error.message));
    }
};

exports.saveLead = async (req, res) => {
    try {
        const { lead_id } = req.params;
        const { email, full_name, type,
            status, message ,is_active } = req.body;
        const postData = {
            lead_id,
            email,
            full_name,
            message,
            type,
            status,
        }
        const response = await leadModel.saveLead(postData);
        return res.status(response.status).json(response);
    } catch (error) {
        return res.json(new Response(500, "F").custom(error.message));
    }
};

exports.delete= async (req, res) => {
    try {
        const { lead_id } = req.params;
        const response = await leadModel.delete({ lead_id });
        return res.status(response.status).json(response);
    } catch (error) {
        return res.json(new Response(500, "F").custom(error.message));
    }
}

