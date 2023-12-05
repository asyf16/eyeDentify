import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {UserModel} from "./models/User.js";
import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";
import url from 'url';


// misc
dotenv.config();
const randomBytes = promisify(crypto.randomBytes);


// aws s3
const region = "us-east-2";
const bucketName = "eyedentify-images";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    signatureVersion: 'v4'
})

const generateUploadURL = async () => {
    const rawBytes = await randomBytes(16);
    // unique image name for url
    const imageName = rawBytes.toString("hex");
    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    return uploadURL;
}

// express.js
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('frontend'));
app.listen(3001, () => console.log("server is running"));

// mongoDB
const atlasConnection = process.env.MONGODB_ATLAS_CONNECTION;
mongoose.connect(atlasConnection)
.then(() => {
    console.log("Connected to MongoDB Atlas");
})
.catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
});

// existing user sign in route
app.post('/login', (req, res) => {
    const {email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if(user && user.password===password){
            res.json("success");
        } else {
            res.json("incorrect email or password");
        }
    })
    .catch(err => res.json(err));
})

// new sign up route
app.post('/register', (req, res) => {
    const {email, password} = req.body;
    // check if user already exists
    UserModel.findOne({email : email})
    .then(exists => {
        if(exists){
            console.log(exists);
            res.json("User already exists.");
        } else {
            UserModel.create({email: email, password: password, imgCollection:[]})
            .then(user => {
                res.json(user);
            })
            .catch(err => res.json(err))
        }
    })
    
    
})

// upload image to aws s3 bucket
app.get('/s3Url', (req, res) => {
    generateUploadURL()
    .then(url => {
        res.send({ url });
    })
    .catch(err => {
        res.status(500).send({ err: 'Failed to generate upload URL' });
    });
});

// add image to user collection 
app.post('/users/:userEmail/upload', (req, res) => {
    // Get the email and imageData from the request params and body
    const { userEmail } = req.params; 
    const imageData = req.body;
  
    UserModel.findOne({email : userEmail})
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Update the imgCollection by pushing new image data
        user.imgCollection.push(imageData);
        // resolve the current promise in the chain by returning
        return user.save();
    })
    .then(updatedUser => {
        // Respond with the updated user data
        res.json(updatedUser); 
    })
    .catch(error => {
        console.error('Error updating user imgCollection:', error);
        res.status(500).json({ error: 'Failed to update user imgCollection' });
    });
});

// retrieve all imageUrls of the current user
app.get('/users/:userEmail/retrieve', (req, res) => {
    // Get the email from the request params
    const { userEmail } = req.params; 
  
    UserModel.findOne({email : userEmail})
    .then(user => {
        if (!user) {    
            return res.status(404).json({ error: 'User not found' });
        }
        // respond with the array imgCollection
        res.json(user.imgCollection);
    })
    .catch(error => {
        console.error('Error fetching user imgCollection:', error);
        res.status(500).json({ error: 'Failed to fetch user imgCollection' });
    });
});

// delete the current image from the user
app.post('/users/:userEmail/delete', (req, res) => {
    // Get the email from the request params
    const { userEmail } = req.params; 
    const { AWSCode } = req.body;

    UserModel.findOne({ email: userEmail })
    .then(user => {
        // Remove from mongoDB
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const indexToRemove = user.imgCollection.findIndex(curr => curr.AWSCode === AWSCode);
        if (indexToRemove === -1) {
            return res.status(404).json({ message: 'Item not found in user collection' });
        }
        user.imgCollection.splice(indexToRemove, 1);
        
        // Remove from AWS
        const parsedUrl = new URL(AWSCode);
        const key = decodeURIComponent(parsedUrl.pathname.substring(1)); // Extract the key from URL 
        const s3Params = {
            Bucket: 'eyedentify-images',
            Key: key
        };
        return s3.deleteObject(s3Params).promise().then(() => user.save()); // Chaining AWS deletion and user save
    })
    .then(() => {
        return res.status(200).json({ message: 'Item deleted successfully' });
    })
    .catch(error => {
        console.error('Error deleting item:', error);
        return res.status(500).json({ error: 'Internal server error' });
    });
});

