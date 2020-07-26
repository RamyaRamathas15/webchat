const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ origin: true }));

const bcrypt = require("bcrypt");
const saltRounds = 11;
const fetch = require("node-fetch");
const formidable = require('formidable-serverless');

var FormData = require('form-data');
var fs = require('fs');

const db = admin.firestore();

app.get("/getUserDetails/:id/:password", async(req, res) => {
    try {
        console.log("input data");
        console.log(req.params.id);
        const document = db.collection('users').doc(req.params.id);
        let item = await document.get();
        if (!item.exists) {
            console.log('No such document!');
        }
        let response = item.data();
        console.log(response);
        const password = req.params.password;
        const isCompared = await bcrypt.compare(password, response.password);
        if (isCompared) {
            return res.status(200).send(response);
        }
        return res.status(200).send(false);
    } catch (error) {
        console.log(error);
        return res.status(200).send(error);
    }
});

app.get("/findUser/:email", async(req, res) => {
    const email = req.params.email;
    admin
        .auth()
        .getUserByEmail(email)
        .then((userRecord) => {
            return res.status(200).send(userRecord.toJSON());
        })
        .catch((error) => {
            return res.status(200).send(error);
        });
});

app.post("/createUser/", async(req, res) => {
    admin
        .auth()
        .createUser({
            email: req.body.email,
            password: req.body.password,
        })
        .then((userRecord) => {
            return res.status(200).send(userRecord.toJSON());
        })
        .catch((error) => {
            return res.status(200).send(error);
        });
});

app.post("/postUserDetails", async(req, res) => {
    const password = req.body.password;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    try {
        await db
            .collection("users")
            .doc("/" + req.body.id + "/")
            .create({
                URL: "",
                description: "",
                messages: [],
                id: req.body.id,
                email: req.body.email,
                password: encryptedPassword,
                name: req.body.name,
                organization: req.body.organization,
            });
        return res.status(200).send(req.body.id);
    } catch (error) {
        console.log(error);
        return res.status(200).send(error);
    }
});

app.delete("/deleteUser/:id", async(req, res) => {
    admin
        .auth()
        .deleteUser(req.params.id)
        .then((userRecord) => {
            return res.status(200).send("deleted");
        })
        .catch((error) => {
            return res.status(200).send(error);
        });
});

app.delete("/deleteUserDetails/:id", async(req, res) => {
    try {
        const document = db.collection("users").doc(req.params.id);
        await document.delete();
        return res.status(200).send("deleted");
    } catch (error) {
        console.log(error);
        return res.status(200).send(error);
    }
});

app.post("/uploadFiles", (req, res, next) => {
    try {
        console.log("Running....")

        const form = formidable({ multiples: true });

        form.on('file', async(filename, file) => {
            console.log({ name: 'file', key: filename, value: file.name, path: file.path });

        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err);
                next(err);
                return;
            }
            return res.json({ fields, files });
        });
    } catch (error) {
        console.log(error);
    }
});

exports.app = functions.https.onRequest(app);

exports.myFunction = functions.firestore
    .document('Messages/{docId}/{collectionId}/{msgId}')
    .onCreate(async(snap, context) => {
        const newValue = snap.data();
        console.log(context.params.collectionId);
        console.log(context.params.msgId);
        console.log(newValue);
        const dataObj = {
            fileName: context.params.collectionId + "-" + context.params.msgId,
            data: newValue
        }
        await fetch("https://czuil77sqd.execute-api.us-east-1.amazonaws.com/default/uploadFilesS3", {
            method: "POST",
            body: JSON.stringify(dataObj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return "success";
    });