# SETUP:
1.	Install and start redis server on default port (6379)
   
   Note: Docker command to start redis-server: 
   ```bash
docker run -p 6379:6379 -p 8001:8001 -d redis/redis-stack:latest
```
2. Setup [MongoDB](https://www.mongodb.com/). This will be used to store location of input, output csv, along with status of the csv processing
3. Setup [Cloudinary](https://cloudinary.com/). This will be used for storing output images.
4. Setup .env File
   
```JavaScript
PORT = 'enter_port'

MONGODB_URI = 'enter_your_mongodb_uri_here'

CLOUDINARY_NAME = 'enter_cloudinary_name'
CLOUDINARY_KEY = 'enter_cloudinary_key'
CLOUDINARY_SECRET = 'enter_cloudinary_secret'
```

5. Start application
```bash
npm run start
```

# API Testing
Postman workspace with API test cases. The test cases include following tests.
1. Positive CSV submission
2. Negative CSV submission 1: Missing S. No 2 (the csv file contains S. No. 1 and 3)
3. Negative CSV submission 2: Invalid URL
4. Negative CSV submission 3: Invalid file extension (Completely valid csv file without any extension)
5. Positive check for status: _Valid JobID need to be entered_.

Click [here](https://www.postman.com/supply-engineer-8483506/workspace/csv-reader-backend) to access postman Workspace.
_All Required CSV files have been uploaded to Postman_
