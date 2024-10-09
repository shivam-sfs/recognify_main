exports.extractUser = (reqObject) => {
    const { host } = reqObject.headers;
    const { user_id, is_deleted } = reqObject.params;
    const { user_id: created_by } = reqObject.authData;
    const { first_name, last_name, email, role, address, phone_number, company_name, password, oldImage, is_active  } = reqObject.body
    const image = reqObject.file && reqObject.file.filename || '';

    const requestData = {
        user_id,
        host,
        is_deleted,
        created_by,
        first_name,
        last_name,
        image,
        email,
        role,
        address,
        phone_number,
        company_name,
        password,
        oldImage,
        is_active,
    };

    return requestData;
}





