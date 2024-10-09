exports.extractRequestData = (reqObject) => {
    const {authorization,host} = reqObject.headers;
    const {protocol} = reqObject.protocol;
    const { body, params, query, authData, file, files, cookies, session} =
        reqObject;

    const requestData = {
        ...(body && { ...body }),
        ...(authData && { authData }),
        ...(authorization && { authorization }),
        ...(host && { host }),
        ...(protocol && { protocol }),
        ...(file && { file }),
        ...(files && { files }),
        ...(query && { ...query }),
        ...(cookies.myCookie && { ...cookies.myCookie }),
        ...(session),
        ...(params.id && { id: params.id }),
        ...(params.user_id && { user_id : params.user_id }),
        ...(params.type && { type: params.type }),
        ...(params.subject && { subject: params.subject }),
    };

    return requestData;
}
