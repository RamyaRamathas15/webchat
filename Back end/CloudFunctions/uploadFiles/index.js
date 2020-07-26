const { Storage } = require('@google-cloud/storage');
const formidable = require('formidable-serverless');

exports.uploadFiles = async(req, res) => {
    console.log("Starting process.");
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    //respond to CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    var list = {};
    let message = req.query.message || req.body.message || 'Hello World!';
    const storage = new Storage();

    const bucketName = 'test_bucket_575';
    console.log("tttttttttttttt");
    const orgId = req.params.organizationId || req.query.organizationId;
    console.log(orgId);
    try {
        console.log("Running....")

        const form = formidable({ multiples: true });

        form.on('file', async(filename, file) => {
            console.log({ name: 'file', key: filename, value: file.name, path: file.path });

            const fileObj = file.path.split("/")[2] || file.path.split("/")[1];
            const newFilename = `${orgId}/${fileObj}`;

            const res = await storage.bucket(bucketName).upload(file.path, {
                destination: newFilename
            });

        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err);
                next(err);
                return;
            }
            return res.status(200).json({ fields, files });
        });
    } catch (error) {
        console.log(error);
    }
};