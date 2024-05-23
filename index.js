const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.log("Event received:", JSON.stringify(event, null, 2));

    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: 'images.json'
    };

    let images = [];
    try {
        const data = await s3.getObject(params).promise();
        images = JSON.parse(data.Body.toString());
        console.log("Existing images.json data:", images);
    } catch (error) {
        if (error.code === 'NoSuchKey') {
            console.log("images.json does not exist. Creating a new one.");
        } else {
            console.error("Error getting images.json:", error);
            throw error;
        }
    }

    const metadata = {
        name: key,
        size: event.Records[0].s3.object.size,
        type: key.split('.').pop()
    };

    const index = images.findIndex(img => img.name === key);
    if (index !== -1) {
        images[index] = metadata;
        console.log("Updated existing image metadata:", metadata);
    } else {
        images.push(metadata);
        console.log("Added new image metadata:", metadata);
    }

    params.Body = JSON.stringify(images);
    params.ContentType = 'application/json';

    try {
        await s3.putObject(params).promise();
        console.log("Successfully updated images.json with new metadata.");
    } catch (error) {
        console.error("Error updating images.json:", error);
        throw error;
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Successfully processed image upload',
            images
        }),
    };
};
