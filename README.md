# Corner Time

This is an application that tells you, using voice instructions, go to a corner and stay there without moving until a certain time has passed.

Use it on yourself as a conditioning method (caught yourself picking your nose? get in the corner!) or just for, err, fun. Use it on someone else as part of a long-distance D/s relationship.

Work in progress (pre-alpha). Inspired by the [Virtual Corner Time](https://cornertime.herokuapp.com) application. I am in no way affiliated with the original application. This is a clean-room implementation with improvements over the original:

* Ultimately enabling one to **set all session parameters via a preset**, especially the session duration. This would enable one to set up a session for someone else without notifying them about the duration beforehand. Only local settings such as movement threshold (very dependant on the webcam and distance) are left for the person doing the session to configure.
* **Setting the session duration in terms of minimum time and maximum time**. The +/- 50% setting of the original application causes a very wide duration range, for example from 30 minutes to 90 minutes assuming a nominal time of 60 minutes.
* **Having a numeric input for session duration range** instead of a slider.

Frontend done in TypeScript & React. No backend. Uses [Diffy](https://github.com/maniart/diffyjs) for motion detection.

## Try it out!

See it live at [cornertime.github.io](https://cornertime.github.io) with a modern desktop browser (tested: Chrome 63 on Mac OS X).

## Getting started

At least Node 8 & NPM 5.6 required.

    npm install
    npm start
    npm test

## TODO

* [ ] Ask for the user's name and reason for punishment when starting and include them in the report
* [ ] Calibration view
    * [ ] See the picture from the webcam to help aiming
    * [ ] Provide a visual indicator for current level of motion
    * [ ] Adjust the movement threshold
* [ ] Core functionality improvements
    * [ ] Add a configurable audible tick to tell the user the application is still working
    * [ ] Prevent computer from going to sleep while in session
* [ ] Custom punishment management
    * [ ] Edit the current preset via a UI
    * [X] Export the current preset
    * [X] Import a preset – *currently by pasting in the same field as the JSON. Rethink when we have the preset editor UI*
    * [ ] Select a preset from a list of default presets
* [ ] Encouragement functionality
    * [X] Randomly receive encouragement during session
    * [ ] Make encouragement occur more towards the end of a session
* [ ] Improvements under the hood
    * [ ] Throttle webcam capture rate to 10–30 fps or even lower to conserve battery and cause less heat
    * [ ] Consider rewriting the FSM with Redux or similar state management
    * [ ] Separate speech, time & other side effects from the FSM
    * [ ] Make sure there is no memory leaks

## Import/export format

While sharing presets and reports via links would be preferred, I have no intention to implement any kind of a backend, so they need to be self-contained.

Someone receiving a preset should not know the parameters contained within, so plain JSON is not acceptable. Fixed-width lines are easier to copy & paste.

To this end, we use base64 encoded JSON documents with a header and footer to identify the documents and make them easier to copy & paste.

Examples follow.

### Presets

    -----BEGIN CORNERTIME CUSTOM PUNISHMENT------
    eyJ0aXRsZSI6IkRlZmF1bHQiLCJkdXJhdGlvblJhbmdlIjp7Im1pbmltdW0iOjYwMCwibWF4aW11
    bSI6OTAwfSwicGVuYWx0eVJhbmdlIjp7Im1pbmltdW0iOjYwLCJtYXhpbXVtIjoxODB9LCJwZW5h
    bHR5UHJvYmFiaWxpdGllcyI6WzAsMV0sImVuY291cmFnZW1lbnRQcm9iYWJpbGl0eSI6MC4wNSwi
    cGhyYXNlcyI6eyJnZXRSZWFkeSI6WyJZb3UgaGF2ZSBiZWVuIG5hdWdodHkuIEdldCBpbiB0aGUg
    Y29ybmVyLiJdLCJzdGFydCI6WyJZb3UgYmV0dGVyIG5vdCBtb3ZlLiBJJ20gc3RhcnRpbmcgeW91
    ciBwdW5pc2htZW50IG5vdy4iXSwiZW5jb3VyYWdlIjpbIkp1c3QgYSBmZXcgbW9yZSBtaW51dGVz
    LiJdLCJzY29sZCI6WyJEbyBJIHNlZSB5b3UgbW92aW5nPyJdLCJwZW5hbGl6ZSI6WyJJIHdhcm5l
    ZCB5b3Ugbm90IHRvIG1vdmUuIEknbSBhZGRpbmcgc29tZSBtb3JlIG1pbnV0ZXPCoHRvIHRoZSBj
    bG9jay4iXSwiZW5kIjpbIllvdSBjYW4gY29tZSBvdXQgb2YgdGhlIGNvcm5lciBub3cuIl19fQo=
    ------END CORNERTIME CUSTOM PUNISHMENT------

### Reports

No attempt is made to make forging reports harder. It is trivially easy to cheat by covering the webcam anyway.

    -----BEGIN CORNERTIME PUNISHMENT REPORT-----
    eyJuYW1lIjoiQW5vbnltb3VzIiwicHJlc2V0VGl0bGUiOiJEZWZhdWx0IiwiaW5pdGlhbER1cmF0
    aW9uIjo5LCJ0b3RhbER1cmF0aW9uIjoxOSwic3RhcnRlZEF0IjoiMjAxOC0wMS0xNFQyMzowOTo1
    NC4zMjRaIiwiZXZlbnRzIjpbeyJhZGp1c3RtZW50IjowLCJldmVudFR5cGUiOiJnZXRSZWFkeSIs
    InRpbWUiOi0xMH0seyJhZGp1c3RtZW50IjowLCJldmVudFR5cGUiOiJzdGFydCIsInRpbWUiOjB9
    LHsiYWRqdXN0bWVudCI6MCwiZXZlbnRUeXBlIjoic2NvbGQiLCJ0aW1lIjoxfSx7ImFkanVzdG1l
    bnQiOjUsImV2ZW50VHlwZSI6InBlbmFsaXplIiwidGltZSI6N30seyJhZGp1c3RtZW50Ijo1LCJl
    dmVudFR5cGUiOiJwZW5hbGl6ZSIsInRpbWUiOjEzfSx7ImFkanVzdG1lbnQiOjAsImV2ZW50VHlw
    ZSI6ImVuZCIsInRpbWUiOjE5fV0sInZpb2xhdGlvbnMiOjN9Cg==
    -----END CORNERTIME PUNISHMENT REPORT-----
