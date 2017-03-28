exports.defaultMimeType = "application/octet-stream";
exports.mimeTypes = {
    "text/html": [
        ".html",
        ".htm"
    ],
    "text/javascript": [
        ".js"
    ],
    "application/json": [
        ".json"
    ],
    "text/css": [
        ".css"
    ],
    "image/png": [
        ".png"
    ],
    "image/jpg": [
        ".jpg",
        ".jpeg"
    ]
};

//exports.root = "./src/requirejs/angularjs";
//exports.root = "./src/requirejs/angularjs+uirouter";
exports.root = "./src/requirejs/angularjs+uirouter+codemirror";
//exports.root = "./src/requirejs/angularjs+uirouter+prismjs";
exports.defaultDocument = "index.html";