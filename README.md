![Logo Screen](https://github.com/asyf16/eyeDentify/assets/144833617/93f2774c-cb8f-460a-b17f-5b9b4132dfc6)
# ⏩ Video Demo
https://youtu.be/KergMVdy5mk 

# 🧠 Our inspiration
A world without facial recognition is a world full of strangers... EyeDentify was created to improve everyday experiences for those who lack the ability to identify faces, turning all those distant strangers into loved ones.

# 🤔 What does it do? 
EyeDentify is a wearable headset powered by Raspberry Pi integrated with a camera and LCD screen that allows users to navigate the world with instant facial recognition and labeling. This sleek device captures and identifies faces in a real-time camera feed by cross-referencing them with a database of images uploaded by the user.

# ⁉️ How does it work?
![Image Upload](https://github.com/asyf16/eyeDentify/assets/144833617/156c34c8-c039-43ca-891f-1ca70a769205)

![Image Database](https://github.com/asyf16/eyeDentify/assets/144833617/666418d2-f1a3-4b7c-a8a4-3a52e3c9caa0)

First, users can create an account on our website built with React. They can then upload photos of their friends and label them with names and notes. These photos are then stored in an AWS database, where they can then be retrieved for analysis. Upon logging into our Raspberry Pi EyeDentify system, our program will download the user's data based on their login credentials stored in a MongoDB database. Next, when the user wears the device, the Pi opens the camera using the OpenCV library. It finds the coordinates of the face in front of the screen and utilizes the pre-existing encoded data to recognize and label whoever appears. It displays a bounding box over the person’s face as well as their name and pre-entered notes.

# 💻 The software 
Upon startup, the Pi sends a request to the server to access MongoDB and retrieves the list of “Upload” objects stored for the current user. Each Upload object stores the name, notes, and AWS URL of its associated image. Each image is directly accessed from AWS S3 using the requests library, and if successful, compressed to a smaller size to reduce processing time. The retrieved image is then saved in an images folder. Our program uses Python's Face_Recognition library to encode facial recognition data from the downloaded images. 

![Detected Face](https://github.com/asyf16/eyeDentify/assets/144833617/83db14eb-4fcc-4cd5-8efc-f9ee9b1ae41c)

When the user wears our headset, EyeDentify uses the OpenCV library to process and detect faces in the camera stream. It uses Face_Recognition again to encode the detected face and cross-reference the faces with the database using Dlib. If a match is identified, the individual's name appears next to their head on the headset screen. If a match is not found, an "Unknown" message is displayed. EyeDentify considers a face a valid match if the calculated confidence value is greater than a threshold value. For the purposes of our project, this is set to 95%. 

![Pi GUI](https://github.com/asyf16/eyeDentify/assets/144833617/73eedc5c-606b-4ccf-9578-0057526ff24a)

The GUI on the Raspberry Pi was built using TKinter to create a user-friendly login page. 

# 📷 The hardware  
![Headset](https://github.com/asyf16/eyeDentify/assets/144833617/dee3be59-34ca-4194-8ee6-c74792a76ffa)

The frame of our headset was 3D printed using a MK3S+ 3D printer. Straps made of elastic bands and velcro straps were attached to the base print by sewing. Our program was run on a Raspberry Pi 4. We used a Sensor OV5647 Mini Camera to capture live camera footage that was displayed on a Freenove touchscreen LCD monitor connected to the Pi. To power the Pi, we used a small portable battery pack connected to the top of the headset. 

# ☑️ Features of our product

![Accuracy Meter](https://github.com/asyf16/eyeDentify/assets/144833617/bf723d07-e886-4379-adae-4bd780dcd2e8)

We calculated an accuracy meter for each face detected and did not label faces that were below 95% accurate. 

We also created an option for users to enter personal notes for each person and strangers. These notes are displayed alongside the identified person's name label and could include information such as their age, birthday, etc. 

# 👎 Challenges we faced
One challenge that we ran into was that the video stream can be slow if multiple faces are detected. 

![Running Facial Recognition every other frame](https://github.com/asyf16/eyeDentify/assets/144833617/a95b22f9-c61f-4b66-8a34-8daec0fc9fca)

To alleviate this, we decided to only run the facial detection on every other frame and to scale down the frames before running the detection, then scaling it up again. 

![Scaling Down Images](https://github.com/asyf16/eyeDentify/assets/144833617/84edd6a2-2e82-4e18-9ed5-07f6377c8bbb)

Furthermore, the camera we used was very sensitive and had trouble connecting to the Raspberry Pi. During our tests, we had to ensure that the camera was securely connected to both the Pi and the headset. 

# What could it be used for?
Besides being a passion project that interested our team, EyeDentify possesses versatile applications. Our headset could be helpful for those suffering from dementia or Alzheimer's to recall and identify their loved ones. 

![Stranger Danger](https://github.com/asyf16/eyeDentify/assets/144833617/8f8b3e00-550b-40bb-b65c-a40ff2d1482b)

Additionally, EyeDentify can be employed by parents as a safeguard, enabling them to protect their children from potentially harmful encounters with strangers. Besides merely issuing warnings about unfamiliar individuals, photos from criminal databases can also be uploaded to the website to detect criminals in real-time. 
