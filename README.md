# Process Image Upload Lambda

This Lambda function processes image uploads to an S3 bucket and updates an `images.json` file with metadata about the images.

## Author

**Jedidiah Staley**

## Usage
1. Create an S3 bucket with public read permissions.
2. Upload images to the S3 bucket.
3. The Lambda function will be triggered on image upload, updating the `images.json` file.

## Issues Encountered
- Ensure the S3 bucket policy allows public read access.
- Avoid infinite loops by setting the Lambda trigger to specific image file extensions.

## Links
- [images.json](https://s3-us-east-1.amazonaws.com/first-bucket-jed/images.json)
  
