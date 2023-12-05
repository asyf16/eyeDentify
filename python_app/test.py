import face_recognition
import os, sys
import cv2
import numpy as np
import math
import customtkinter
from tkinter import *
import tkinter as Tk

# set colour to 0
colorvalue = 0


def startprogram():
    fr.run_recognition()

def change_color():
    global colorvalue
    colorvalue = radio_var.get()

customtkinter.set_appearance_mode("light")  # sets the color of the background
root = customtkinter.CTk()  # create the root window
root.title("eyedentify")  # names the window
h = root.winfo_screenheight()
w = root.winfo_screenwidth()
root.geometry(str(w)+"x"+str(h))
radio_var = Tk.IntVar(value=0)

# entry = customtkinter.CTkEntry(root, placeholder_text="example@gmail.com", height = h/10, width = w/2, corner_radius=70, placeholder_text_color="#bcc4cc", text_color="#415161", font=("Corbel", w/45))

email_entry = customtkinter.CTkEntry(root, placeholder_text="Enter Email", height=h/10, width=w/2,
corner_radius=70, placeholder_text_color="#bcc4cc", text_color="#415161", font=("Corbel", w/45))

password_entry = customtkinter.CTkEntry(root, placeholder_text="Enter Password", height=h/10, width=w/2,
corner_radius=70, placeholder_text_color="#bcc4cc", text_color="#415161", font=("Corbel", w/45), show="*")


startbutton = customtkinter.CTkButton(root, height = h/9, font=("Comfortaa", w/35), fg_color="#5885AF", corner_radius=100, hover_color = "#41729F", text_color = "#23334d", width = w/6, text='Log in', command = startprogram)
titlelabel = customtkinter.CTkLabel(root, height = h/8, width = w/4, text = "eyeDentify", font=("Impact", w/12),text_color = "#23334d")
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
        for image in os.listdir('python_app/Faces'):
            face_image = face_recognition.load_image_file(f"python_app/Faces/{image}")
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
        video_capture = cv2.VideoCapture(0)
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

                    # Calculate the shortest distance to face
                    face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)

                    best_match_index = np.argmin(face_distances)
                    if matches[best_match_index]:
                        name = self.known_face_names[best_match_index]
                        parts = name.split(".")
                        name = parts[0]
                        confidence = face_confidence(face_distances[best_match_index])

                    self.face_names.append(f'{name} ({confidence})')

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
                parts = name.split(".")
                cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1)

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
fr = FaceRecognition()
titlelabel.place(relx=0.5, rely=0.30, anchor=CENTER)
startbutton.place(relx=0.5, rely=0.8, anchor=CENTER)

email_entry.place(relx=0.5, rely=0.45, anchor=CENTER)
password_entry.place(relx=0.5, rely=0.6, anchor=CENTER)

color1.place(relx=0.7, rely=0.95, anchor=CENTER)
color2.place(relx=0.8, rely=0.95, anchor=CENTER)
color3.place(relx=0.9, rely=0.95, anchor=CENTER)
root.mainloop()