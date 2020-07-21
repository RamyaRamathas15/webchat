const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ origin: true }));

const bcrypt = require("bcrypt");
const saltRounds = 11;

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

exports.app = functions.https.onRequest(app);
