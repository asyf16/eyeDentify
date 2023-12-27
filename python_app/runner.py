import face_recognition
import os, sys
import cv2
import numpy as np
import math
import customtkinter
from tkinter import *
from dotenv import load_dotenv
import tkinter as Tk
import time
from PIL import Image
from io import BytesIO

# Load env variables
load_dotenv()

# set colour to 0
colorvalue = 0

# Connect to mongoDB
import requests
from pymongo import MongoClient


# Function to download and save an image
def download_image(image_url, save_path, new_name):
    # Fetch the image data from the URL
    response = requests.get(image_url)
    if response.status_code == 200:
        # Open the image from the response content, remove the alpha channel from RGBA
        img = Image.open(BytesIO(response.content))

        img = img.convert('RGB')
        # # Original dimensions
        og_width, og_height = img.size

        # # Resize the image to the desired width and height IF NEEDED
        ratio = max(1, og_width/800)
        width = int(og_width/ratio)
        height = int(og_height/ratio)
        resized_img = img.resize((width, height))

        # # Save the resized image locally
        resized_img.save(os.path.join(save_path, new_name))



def get_all_users(client, db_name, collection_name):
    # Select the database and collection
    db = client[db_name]
    collection = db[collection_name]

    # Retrieve all documents from the collection
    users = collection.find({})

    return list(users)

# dictionary, key is name of a user, value is corresponding notes of a user
notes_dict = {}
def perform_db_operations(client, email):
    # Database details
    db_name = "UserData"
    collection_name = "users"
    save_directory = "./images"  # Update this path to the folder where you want to save images

    # Create the directory if it does not exist
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)

    # Fetch all users
    users = get_all_users(client, db_name, collection_name)

    # Download and save images & notes from the imgCollection field
    for user in users:
        if user["email"] != email:
            continue
        # Safe navigation in case 'imgCollection' is missing
        for img in user.get('imgCollection', []):  
            image_url = img['AWSCode']
            # Create a new filename using the name field and replacing spaces with underscores
            new_name = img['name'].replace(" ", "_") + ".jpeg"
            download_image(image_url, save_directory, new_name)
            # Store the corresponding notes of the name 
            notes_dict[img['name'].replace(" ", "_")] = "" if img['notes']=="N/A" else img['notes']
        # Unknown Notes for the current user
        notes_dict["Unknown"] = "" if user["unknownNotes"]=="N/A" else user["unknownNotes"]
    

def login_db_operations(client, email, password):
    # Database details
    db_name = os.getenv("DB_NAME")
    collection_name = os.getenv("COLLECTION_NAME")

    # Select the database and collection
    db = client[db_name]
    collection = db[collection_name]

    # check for relevant users from collection
    matching_users = collection.find({"email": email, "password": password})
    for user in matching_users:
        # print(user)
        return True
    
    return False
    
    

# Connection details 
connection_uri = os.getenv("MONGODB_ATLAS_CONNECTION")
client = MongoClient(connection_uri)



# Runs when user attempts to log in and start the program run
def startprogram():
    email = email_entry.get()
    password = password_entry.get()

    # Check for email in database 
    user_found = False
    try:
        user_found = login_db_operations(client, email, password)
    except:
        print("An error occured while querying the database for login")

    if not user_found:
        print("poo")
        errorlabel.place(relx=0.5, rely=0.7,anchor=CENTER)
    else:
        # load photos
        start_time = time.time()

        perform_db_operations(client, email)

        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"Download time: {elapsed_time} seconds")
        
        # run the app
        start_time = time.time()

        client.close()
        fr = FaceRecognition()

        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"Processing time: {elapsed_time} seconds")

        fr.run_recognition()
        
        # Delete all images in the images directory
        directory = "./images"
        print("reaching")
        files = os.listdir(directory)
                
        for f in files:
            file_path = os.path.join(directory, f)
            print(f"{file_path}")
            if os.path.isfile(file_path):
                print(f"removed: {file_path}")
                os.remove(file_path)

def change_color():
    global colorvalue
    colorvalue = radio_var.get()

#GUI
customtkinter.set_appearance_mode("light")  # sets the color of the background
root = customtkinter.CTk()  # create the root window
root.title("eyedentify")  # names the window
h = root.winfo_screenheight()
w = root.winfo_screenwidth()
root.geometry(str(w)+"x"+str(h))
radio_var = Tk.IntVar(value=0)


email_entry = customtkinter.CTkEntry(root, placeholder_text="Enter Email", height=h/10, width=w/2,
corner_radius=70, placeholder_text_color="#bcc4cc", text_color="#415161", font=("Corbel", w/45))

password_entry = customtkinter.CTkEntry(root, placeholder_text="Enter Password", height=h/10, width=w/2,
corner_radius=70, placeholder_text_color="#bcc4cc", text_color="#415161", font=("Corbel", w/45), show="*")


startbutton = customtkinter.CTkButton(root, height = h/9, font=("Comfortaa", w/35), fg_color="#5885AF", corner_radius=100, hover_color = "#41729F", text_color = "#23334d", width = w/6, text='Log in', command = startprogram)
titlelabel = customtkinter.CTkLabel(root, height = h/8, width = w/4, text = "eyedentify", font=("Comfortaa", w/12),text_color = "#23334d")
errorlabel = customtkinter.CTkLabel(root, text = "Incorrect Email or Password", font=("Comfortaa", w/50),text_color = "#52333b")
color1 = customtkinter.CTkRadioButton(root, width = w/10, height = h/20, text="Blue",command=change_color, font=("Comfortaa", w/35), text_color = "#23334d", hover_color = "#41729F",fg_color="#5885AF",variable= radio_var, value=0)
color2 = customtkinter.CTkRadioButton(root, width = w/10, height = h/20, text="Red",command=change_color, font=("Comfortaa", w/35), text_color = "#23334d",fg_color="#5885AF",hover_color = "#41729F",variable= radio_var, value=1)
color3 = customtkinter.CTkRadioButton(root, width = w/10, height = h/20, text="White",command=change_color, font=("Comfortaa", w/35), text_color = "#23334d",fg_color="#5885AF",hover_color = "#41729F",variable= radio_var, value=2)

# Helper
def face_confidence(face_distance, face_match_threshold=0.6):
    range = (1.0 - face_match_threshold)
    linear_val = (1.0 - face_distance) / (range * 2.0)

    if face_distance > face_match_threshold:
        return str(round(linear_val * 100, 2)) + '%'
    else:
        value = (linear_val + ((1.0 - linear_val) * math.pow((linear_val - 0.5) * 2, 0.2))) * 100
        return str(round(value, 2)) + '%'


def mouse_callback(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:  # Check for left mouse button click
        cv2.destroyAllWindows()  # Optionally, close the OpenCV window
        # Delete all images in the images directory
        directory = "./images"
        print("reaching")
        files = os.listdir(directory)
                
        for f in files:
            file_path = os.path.join(directory, f)
            print(f"{file_path}")
            if os.path.isfile(file_path):
                print(f"removed: {file_path}")
                os.remove(file_path)
        exit()

    
class FaceRecognition:
    face_locations = []
    face_encodings = []
    face_names = []
    known_face_encodings = []
    known_face_names = []
    process_current_frame = True

    def __init__(self):
        self.encode_faces()

    def encode_faces(self):
        for image in os.listdir('./images'):
            face_image = face_recognition.load_image_file(f"./images/{image}")
            # Make sure there is actually a face !
            if len(face_recognition.face_encodings(face_image)):
                face_encoding = face_recognition.face_encodings(face_image)[0]
                self.known_face_encodings.append(face_encoding)
                self.known_face_names.append(image)



        print(self.known_face_names)

    def run_recognition(self):
        if colorvalue == 0:
            color = (161,20,54)
        if colorvalue == 1:
            color = (51,110,204)
        if colorvalue == 2:
            color = (255,255,255)
        video_capture = cv2.VideoCapture(cv2.CAP_V4L2)
        root.destroy()
        if not video_capture.isOpened():
            sys.exit('Video source not found...')

        while True:
            ret, frame = video_capture.read()

            # Only process every other frame of video to save time
            if self.process_current_frame:
                # Resize frame of video to 1/4 size for faster face recognition processing
                small_frame = cv2.resize(frame, (0, 0), fx=0.2, fy=0.2)

                # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
                rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

                # Find all the faces and face encodings in the current frame of video
                self.face_locations = face_recognition.face_locations(rgb_small_frame)
                self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)

                self.face_names = []
                for face_encoding in self.face_encodings:
                    # See if the face is a match for the known face(s)
                    matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
                    name = "Unknown"
                    confidence = 'None'

                    # Calculate the shortest distance to face if uploaded faces
                    if len(self.known_face_encodings):
                        face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                        best_match_index = np.argmin(face_distances)
                        if matches[best_match_index]:
                            name = self.known_face_names[best_match_index]
                            parts = name.split(".")
                            name = parts[0]
                            confidence = face_confidence(face_distances[best_match_index])
                    

                    # Append to match IF it is a good match 
                    confidenceInt = confidence.split('%')[0]
                    if (confidence != 'None') and (float(confidenceInt) >= 95.0):
                        self.face_names.append(f'{name} ({confidence})')
                    else:
                        self.face_names.append(f'Unknown (None)')
                    
                    
                    

            self.process_current_frame = not self.process_current_frame

            # Display the results
            for (top, right, bottom, left), name in zip(self.face_locations, self.face_names):
                # Scale back up face locations since the frame we detected in was scaled to 1/4 size
                top *= 5
                right *= 5
                bottom *= 5
                left *= 5

                # Create the frame with the name
                cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
                justName = name.split(" ")[0]
                cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1)
                cv2.putText(frame, notes_dict[justName], (left, bottom + 20), cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1)


            # Display the resulting image
            cv2.imshow('Face Recognition', frame)
            cv2.setMouseCallback('Face Recognition', mouse_callback)

            # Hit 'q' on the keyboard to quit!
            if cv2.waitKey(1) == ord('q'):
                break
        
        
        

        # Release handle to the webcam
        video_capture.release()
        cv2.destroyAllWindows()

# Run and Render Stuff
titlelabel.place(relx=0.5, rely=0.30, anchor=CENTER)
startbutton.place(relx=0.5, rely=0.8, anchor=CENTER)

email_entry.place(relx=0.5, rely=0.45, anchor=CENTER)
password_entry.place(relx=0.5, rely=0.6, anchor=CENTER)

color1.place(relx=0.7, rely=0.95, anchor=CENTER)
color2.place(relx=0.8, rely=0.95, anchor=CENTER)
color3.place(relx=0.9, rely=0.95, anchor=CENTER)
root.mainloop()
