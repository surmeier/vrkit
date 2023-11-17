---
title: Final Report for CS396VR/AR@Northwestern
author: Carson Surmeier
---

## (Part 1) Tutorial: Hand Tracking with ESP32/Mediapipe

In this tutorial, you will learn how to track hands using a ESP-32 CAM and the
Python library Mediapipe. 

To set up the Python environment, run the following:

```python
python3 -m venv venv
source venv/bin/activate
pip install numpy
pip install opencv-python
pip install autopy
pip install mediapipe
```

It is assumed that you have a working ESP-32 CAM connection either through a
[FTDI programmer](https://randomnerdtutorials.com/program-upload-code-esp32-cam/)
or [ESP-32 CAM MB](https://randomnerdtutorials.com/upload-code-esp32-cam-mb-usb/).

The following python file `track_hand.py` is the core hand tracking logic.

```python
import cv2
import mediapipe as mp
import time
import math
import numpy as np
 
 
class handDetector():
    def __init__(self, mode=False, maxHands=1, modelComplexity=1, detectionCon=0.5, trackCon=0.5):
        self.mode = mode
        self.maxHands = maxHands
        self.modelComplex = modelComplexity
        self.detectionCon = detectionCon
        self.trackCon = trackCon
        self.mpHands = mp.solutions.hands
        self.hands = self.mpHands.Hands(self.mode, self.maxHands, self.modelComplex, 
                                        self.detectionCon, self.trackCon)
        self.mpDraw = mp.solutions.drawing_utils
        self.tipIds = [4, 8, 12, 16, 20]
 
    def findHands(self, img, draw=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(imgRGB)
        # print(results.multi_hand_landmarks)
 
        if self.results.multi_hand_landmarks:
            for handLms in self.results.multi_hand_landmarks:
                if draw:
                    self.mpDraw.draw_landmarks(img, handLms,
                                               self.mpHands.HAND_CONNECTIONS)
 
        return img
 
    def findPosition(self, img, handNo=0, draw=True):
        xList = []
        yList = []
        bbox = []
        self.lmList = []
        if self.results.multi_hand_landmarks:
            myHand = self.results.multi_hand_landmarks[handNo]
            for id, lm in enumerate(myHand.landmark):
                # print(id, lm)
                h, w, c = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                xList.append(cx)
                yList.append(cy)
                # print(id, cx, cy)
                self.lmList.append([id, cx, cy])
                if draw:
                    cv2.circle(img, (cx, cy), 5, (255, 0, 255), cv2.FILLED)
 
            xmin, xmax = min(xList), max(xList)
            ymin, ymax = min(yList), max(yList)
            bbox = xmin, ymin, xmax, ymax
 
            if draw:
                cv2.rectangle(img, (xmin - 20, ymin - 20), (xmax + 20, ymax + 20),
                              (0, 255, 0), 2)
 
        return self.lmList, bbox
 
    def fingersUp(self):
        fingers = []
        # Thumb
        #print(self.lmList)
        #print(self.tipIds)
        
        if self.lmList[self.tipIds[0]][1] > self.lmList[self.tipIds[0] - 1][1]:
            fingers.append(1)
        else:
            fingers.append(0)
 
        # Fingers
        for id in range(1, 5):
 
            if self.lmList[self.tipIds[id]][2] < self.lmList[self.tipIds[id] - 2][2]:
                fingers.append(1)
            else:
                fingers.append(0)
 
        # totalFingers = fingers.count(1)
 
        return fingers
 
    def findDistance(self, p1, p2, img, draw=True,r=15, t=3):
        x1, y1 = self.lmList[p1][1:]
        x2, y2 = self.lmList[p2][1:]
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
 
        if draw:
            cv2.line(img, (x1, y1), (x2, y2), (255, 0, 255), t)
            cv2.circle(img, (x1, y1), r, (255, 0, 255), cv2.FILLED)
            cv2.circle(img, (x2, y2), r, (255, 0, 255), cv2.FILLED)
            cv2.circle(img, (cx, cy), r, (0, 0, 255), cv2.FILLED)
        length = math.hypot(x2 - x1, y2 - y1)
 
        return length, img, [x1, y1, x2, y2, cx, cy]
 
 
def main():
    pTime = 0
    cTime = 0
    cap = cv2.VideoCapture(0)
    detector = handDetector()
    while True:
        
        success, img = cap.read()
        
        img = detector.findHands(img)
        lmList, bbox = detector.findPosition(img)
        if len(lmList) != 0:
            print(lmList[4])
 
        cTime = time.time()
        fps = 1 / (cTime - pTime)
        pTime = cTime
        fingers = detector.fingersUp()
 
        cv2.putText(img, str(int(fps)), (10, 70), cv2.FONT_HERSHEY_PLAIN, 3,
                    (255, 0, 255), 3)
 
        cv2.imshow("Image", img)
        cv2.waitKey(1)
 
 
if __name__ == "__main__":
    main()
```

The following code is repsonsible for interfacing with the CAM and gesture 
recognition. In this particular case, gestures are used to control the mouse.

```python
import numpy as np
import track_hand as htm
import time
import autopy
import cv2
 
url="http://192.168.1.61/cam-hi.jpg"
 
wCam, hCam = 800, 600
frameR = 100 
smoothening = 7
 
pTime = 0
plocX, plocY = 0, 0
clocX, clocY = 0, 0
 
'''cap = cv2.VideoCapture(0)
cap.set(3, wCam)
cap.set(4, hCam)'''
 
detector = htm.handDetector(maxHands=1)
wScr, hScr = autopy.screen.size()
 
while True:
    # 1. Find hand Landmarks
    fingers=[0,0,0,0,0]
    #success, img = cap.read()
    
    img_resp=urllib.request.urlopen(url)
    imgnp=np.array(bytearray(img_resp.read()),dtype=np.uint8)
    img=cv2.imdecode(imgnp,-1)
    
    img = detector.findHands(img)
    lmList, bbox = detector.findPosition(img)
    
    # 2. Get the tip of the index and middle fingers
    if len(lmList) != 0:
        x1, y1 = lmList[8][1:]
        x2, y2 = lmList[12][1:]
        # print(x1, y1, x2, y2)
    
    # 3. Check which fingers are up
        fingers = detector.fingersUp()
        
    cv2.rectangle(img, (frameR, frameR), (wCam - frameR, hCam - frameR),
    (255, 0, 255), 2)
    # 4. Only Index Finger : Moving Mode
    if fingers[1] == 1 and fingers[2] == 0:
        # 5. Convert Coordinates
        x3 = np.interp(x1, (frameR, wCam - frameR), (0, wScr))
        y3 = np.interp(y1, (frameR, hCam - frameR), (0, hScr))
        # 6. Smoothen Values
        clocX = plocX + (x3 - plocX) / smoothening
        clocY = plocY + (y3 - plocY) / smoothening
    
        # 7. Move Mouse
        autopy.mouse.move(wScr - clocX, clocY)
        cv2.circle(img, (x1, y1), 15, (255, 0, 255), cv2.FILLED)
        plocX, plocY = clocX, clocY
        
    # 8. Both Index and middle fingers are up : Clicking Mode
    if fingers[1] == 1 and fingers[2] == 1:
        # 9. Find distance between fingers
        length, img, lineInfo = detector.findDistance(8, 12, img)
        print(length)
        # 10. Click mouse if distance short
        if length < 40:
            cv2.circle(img, (lineInfo[4], lineInfo[5]),
            15, (0, 255, 0), cv2.FILLED)
            autopy.mouse.click()
    
    # 11. Frame Rate
    cTime = time.time()
    fps = 1 / (cTime - pTime)
    pTime = cTime
    cv2.putText(img, str(int(fps)), (20, 50), cv2.FONT_HERSHEY_PLAIN, 3,
    (255, 0, 0), 3)
    # 12. Display
    cv2.imshow("Image", img)
    cv2.waitKey(1)
```

Make sure you update your URL variable, according to the IP displayed on the 
Arduino IDE Serial monitor. Also update the `wCam` and `hCam` variables 
depending on the input resolution. 

By using the above code, and modifying the necessary variables as described, you 
should have a functioning wireless stream of a ESP 32 CAM with hand tracking 
gesture support. 

## (Part 2) 

## (Part 3)

## Self Evaluation

For reasons unrelated to course instruction, my involvement in this course has
been limited. I'm going to work more on the VR setup that I have, fixing the
three.js code and adding more VR/AR components.

## Addendum

Group Work Part:

Goal: Make this part for your personal website

Your group members can share same contents in this part. There are 3 sections 
inside this part:

1. Lab 7 Tutorial

Treat this part as your personal tech blog. The goal here is to let people who 
want to achieve your functionality (stereo cam or mediapipe AI), by following 
your tutorial, could reproduce the results. The tutorial will be graded based 
on how helpful the content is. 

2. Integrated VR/AR Photos and Project Overall Introduction

Suppose you want to put this VR/AR product on your personal website. You need 
an introduction section to let readers understand what your project/product is. 
What functionalities does it have? Why readers should be excited about this 
project?

3. Module Descriptions in Details

If the readers are interested in your project introduction, excellent! They 
want to dig into more details about the project you've done. Provide the 
details for different modules here. What components are you using? How do you 
connect the components? How do you program them? What functionality it could 
achieve? How good it is? Any difficulties you met during making this work?
Individual Work Part

Goal: Make this part as your insights/suggestions on boosting learning speed 
for future VR/AR learners

1. Self Evaluation

How do you comment on your performance during this quarter? Which parts are 
you responsible for during the project? If you have a second chance to take 
the course, what you would change?

2. Teammate Evaluation

Evaluate the contributions of each team member, highlighting their strengths 
and areas for improvement.

3. Course Feedback

- Share your overall feedback on the course, including its strengths and 
weaknesses.

- Suggest any changes or improvements that could enhance the learning 
experience.
