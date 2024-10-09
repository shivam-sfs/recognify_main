const { authHandler, commonHandler } = require('../third-party/messages');

const responseMessages = {
  // Informational responses (100–199)
  100: {
    status: 100,
    info: 'Continue',
  },

  101: {
    status: 101,
    info: 'Switching Protocol',
  },

  102: {
    status: 102,
    info: 'Processing',
  },

  103: {
    status: 103,
    info: 'Early Hints',
  },

  // Successful responses (200–299)
  200: {
    status: 200,
    info: 'OK',
  },

  201: {
    status: 201,
    info: 'Created',
  },

  202: {
    status: 202,
    info: 'Accepted',
  },

  203: {
    status: 203,
    info: 'Non-Authoritative Information',
  },

  204: {
    status: 204,
    info: 'No Content',
  },

  205: {
    status: 205,
    info: 'Reset Content',
  },

  206: {
    status: 206,
    info: 'Partial Content',
  },

  207: {
    status: 207,
    info: 'Multi-success',
  },

  208: {
    status: 208,
    info: 'Already Reported',
  },

  226: {
    status: 226,
    info: 'IM Used',
  },

  // Redirects (300–399)
  300: {
    status: 300,
    info: 'Multiple Choice',
  },

  301: {
    status: 301,
    info: 'Moved Permanently',
  },

  302: {
    status: 302,
    info: 'Found',
  },

  303: {
    status: 303,
    info: 'See Other',
  },

  304: {
    status: 304,
    info: 'Not Modified',
  },

  305: {
    status: 305,
    info: 'Use Proxy',
  },

  307: {
    status: 307,
    info: 'Temporary Redirect',
  },

  308: {
    status: 308,
    info: 'Permanent Redirect',
  },

  // Client errors (400–499)
  400: {
    status: 400,
    info: 'Bad Request',
  },

  401: {
    status: 401,
    info: 'Unauthorized',
  },

  402: {
    status: 402,
    info: 'Payment Required',
  },

  403: {
    status: 403,
    info: 'Forbidden',
  },

  404: {
    status: 404,
    info: 'Not Found',
  },

  405: {
    status: 405,
    info: 'Method Not Allowed',
  },

  406: {
    status: 406,
    info: 'Not Acceptable',
  },

  407: {
    status: 407,
    info: 'Proxy Authentication Required',
  },

  408: {
    status: 408,
    info: 'Request Timeout',
  },

  409: {
    status: 409,
    info: 'Conflict',
  },

  410: {
    status: 410,
    info: 'Gone',
  },

  411: {
    status: 411,
    info: 'Length Required',
  },

  412: {
    status: 412,
    info: 'Precondition Failed',
  },

  413: {
    status: 413,
    info: 'Payload Too Large',
  },

  414: {
    status: 414,
    info: 'URI Too Long',
  },

  415: {
    status: 415,
    info: 'Unsupported Media Type',
  },

  416: {
    status: 416,
    info: 'Range Not Satisfiable',
  },

  417: {
    status: 417,
    info: 'Expectation Failed',
  },

  418: {
    status: 418,
    info: "I'm a teapot",
  },

  421: {
    status: 421,
    info: 'Misdirected Request',
  },

  422: {
    status: 422,
    info: 'Unprocessable Entity',
  },

  423: {
    status: 423,
    info: 'Locked',
  },

  424: {
    status: 424,
    info: 'Failed Dependency',
  },

  425: {
    status: 425,
    info: 'Too Early',
  },

  426: {
    status: 426,
    info: 'Upgrade Required',
  },

  428: {
    status: 428,
    info: 'Precondition Required',
  },

  429: {
    status: 429,
    info: 'Too Many Requests',
  },

  431: {
    status: 431,
    info: 'Request Header Fields Too Large',
  },

  444: {
    status: 444,
    info: 'Connection Closed Without Response',
  },

  451: {
    status: 451,
    info: 'Unavailable For Legal Reasons',
  },

  499: {
    status: 499,
    info: 'Client Closed Request',
  },

  // Server errors (500–599)
  500: {
    status: 500,
    info: 'Internal Server Error',
  },

  501: {
    status: 501,
    info: 'Not Implemented',
  },

  502: {
    status: 502,
    info: 'Bad Gateway',
  },

  503: {
    status: 503,
    info: 'Service Unavailable',
  },

  504: {
    status: 504,
    info: 'Gateway Timeout',
  },

  505: {
    status: 505,
    info: 'HTTP Version Not Supported',
  },

  506: {
    status: 506,
    info: 'Variant Also Negotiates',
  },

  507: {
    status: 507,
    info: 'Insufficient Storage',
  },

  508: {
    status: 508,
    info: 'Loop Detected',
  },

  510: {
    status: 510,
    info: 'Not Extended',
  },

  511: {
    status: 511,
    info: 'Network Authentication Required',
  },

  599: {
    status: 599,
    info: 'Network Connect Timeout Error',
  },
};

class Response {
  constructor(status, success, data = '') {
    this.status = status || 500;
    this.success = success || 'T';
    this.data = data;
  }

  custom(message) {
    const responseType = responseMessages[this.status];
    const output = {};

    output.status = responseType.status;

    if (this.success === 'T' && this.status === 500) {
      output.success = false;
    } else if (this.success === 'T') {
      output.success = true;
    } else {
      output.success = false;
    }

    output.info = responseType.info;

    if (this.data) {
      output.data = this.data;
    }

    if (message) {
      output.message = message;
    }

    return output;
  }
  coreResponse(message, data) {
    const responseType = responseMessages[this.code];

    const output = { ...responseType };

    if (message) {
      output.message = message;
    }

    if (data) {
      output.data = data;
    }

    return output;
  }

  commonResponse(typeProp, relatedTo, idx) {
    const responseType = responseMessages[this.code];

    const output = { ...responseType };

    output.message = commonHandler(typeProp, relatedTo, idx);

    if (this.data) {
      output.data = this.data;
    }

    return output;
  }

  customResponse(message, data) {
    const responseType = responseMessages[this.code];

    const output = { ...responseType };

    if (message) {
      output.message = message;
    }

    if (data) {
      output.data = data;
    }

    return output;
  }

  auth(type, related) {
    const responseType = responseMessages[this.status];
    const output = {};

    output.status = responseType.status;

    if (this.success === 'T' && this.status === 500) {
      output.success = false;
    } else if (this.success === 'T') {
      output.success = true;
    } else {
      output.success = false;
    }

    output.info = responseType.info;

    output.message = authHandler(type, related);

    if (this.data) {
      output.data = this.data;
    }

    return output;
  }
}
module.exports = Response;
