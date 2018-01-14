# Corner Time

This is an application that tells you, using voice instructions, go to a corner and stay there without moving until a certain time has passed.

Use it on yourself as a conditioning method (caught yourself picking your nose? get in the corner!) or just for, err, fun. Use it on someone else as part of a long-distance D/s relationship.

Work in progress (pre-alpha). Inspired by the [Virtual Corner Time](https://cornertime.herokuapp.com) application. I am in no way affiliated with the original application. This is a clean-room implementation with improvements over the original:

* Ultimately enabling one to **set all session parameters via a preset**, especially the session duration. This would enable one to set up a session for someone else without notifying them about the duration beforehand. Only local settings such as movement threshold (very dependant on the webcam and distance) are left for the person doing the session to configure.
* **Setting the session duration in terms of minimum time and maximum time**. The +/- 50% setting of the original application causes a very wide duration range, for example from 30 minutes to 90 minutes assuming a nominal time of 60 minutes.
* **Having a numeric input for session duration range** instead of a slider.

Frontend done in TypeScript & React. No backend. Uses [Diffy](https://github.com/maniart/diffyjs) for motion detection.

## Try it out!

1. Have a webcam. Best results can be achieved with one that has roughly similar FOV to a MacBook Pro 2017, but just try yours out. (Sorry, threshold params not configurable yet.)
2. Navigate to [cornertime.github.io](https://cornertime.github.io) with a modern desktop browser (tested: Chrome 63 on Mac OS X).
3. Allow webcam access. **No data will be sent** from your webcam to the Internet. All image processing is done locally in your browser.
4. Set up the webcam so that it sees the corner where you'll be spending time. The current set of hard-coded settings works best at a distance of 2 to 3 meters.
5. Hide the "Diffy debug view" by clicking on its `-` button.
6. Adjust the parameters in the text area below. You will find the `durationRange` and `penaltyRange` parameters especially interesting. All times are in seconds. There will be a configuration dialog at some point.
7. Make sure you have sound on, with decent volume. Remember, there will be voice instructions.
8. Hit Start.
9. Follow the voice instructions: go to the corner and stand still.
10. While standing still, the voice should be quiet. If you are getting scolded and penalized while standing still, try moving the webcam further away from the corner or moving to a more peaceful location.
11. If you move enough, you should first get scolded, and at repeat offences, be notified of extra time being added to the clock.
12. Once the duration of the session is reached, there will be another voice instruction informing you that you can exit the corner.

## Getting started

At least Node 8 & NPM 5.6 required.

    npm install
    npm start
    npm test

## TODO

* [ ] UI improvements
    * [ ] Do away with the Diffy debug view and have a video canvas instead
    * [ ] Provide a visual indicator for current motion detection status instead of a number
    * [ ] Improve UI texts (now mostly a dump of the internal data structure)
* [ ] Preset management
    * [ ] Edit the current preset via a UI
    * [ ] Export the current preset
    * [ ] Import a preset
    * [ ] Select a preset from a list of default presets
* [ ] Settings view
    * [ ] User name
    * [ ] Movement threshold
* [ ] Report view
    * [ ] View the report after a session
    * [ ] Export report
    * [ ] Import and view a report
* [ ] Encouragement functionality
    * [ ] Randomly receive encouragement during session
    * [ ] Make encouragement occur more towards the end of a session
* [ ] Improvements under the hood
    * [ ] Throttle webcam capture rate to 10–30 fps or even lower to conserve battery and cause less heat
    * [ ] Consider rewriting the FSM with Redux or similar state management
    * [ ] Separate speech, time & other side effects from the FSM

## Notes

### Preset import/export

While sharing presets via links would be preferred, I have no intention to implement any kind of a backend, so presets need to be self-contained.

Someone receiving a preset should not know the parameters contained within, so plain JSON is not applicable. Fixed-width lines are easier to copy & paste.

Perhaps use base64 encoded JSON documents for this? Perhaps add a header and a footer to show the user where to copy & paste?

    -----BEGIN CORNERTIME PRESET------
    eyJ0aXRsZSI6IkRlZmF1bHQiLCJkdXJhdGlvblJhbmdlIjp7Im1pbmltdW0iOjYwMCwibWF4aW11
    bSI6OTAwfSwicGVuYWx0eVJhbmdlIjp7Im1pbmltdW0iOjYwLCJtYXhpbXVtIjoxODB9LCJwZW5h
    bHR5UHJvYmFiaWxpdGllcyI6WzAsMV0sImVuY291cmFnZW1lbnRQcm9iYWJpbGl0eSI6MC4wNSwi
    cGhyYXNlcyI6eyJnZXRSZWFkeSI6WyJZb3UgaGF2ZSBiZWVuIG5hdWdodHkuIEdldCBpbiB0aGUg
    Y29ybmVyLiJdLCJzdGFydCI6WyJZb3UgYmV0dGVyIG5vdCBtb3ZlLiBJJ20gc3RhcnRpbmcgeW91
    ciBwdW5pc2htZW50IG5vdy4iXSwiZW5jb3VyYWdlIjpbIkp1c3QgYSBmZXcgbW9yZSBtaW51dGVz
    LiJdLCJzY29sZCI6WyJEbyBJIHNlZSB5b3UgbW92aW5nPyJdLCJwZW5hbGl6ZSI6WyJJIHdhcm5l
    ZCB5b3Ugbm90IHRvIG1vdmUuIEknbSBhZGRpbmcgc29tZSBtb3JlIG1pbnV0ZXPCoHRvIHRoZSBj
    bG9jay4iXSwiZW5kIjpbIllvdSBjYW4gY29tZSBvdXQgb2YgdGhlIGNvcm5lciBub3cuIl19fQo=
    ------END CORNERTIME PRESET------

### Report export

Most points above apply to reports as well.

No attempt is made at making forgery harder. It is trivially easy to cheat by covering the webcam anyway.

    -----BEGIN CORNERTIME REPORT-----
    eyJuYW1lIjoiQW5vbnltb3VzIiwicHJlc2V0VGl0bGUiOiJEZWZhdWx0IiwiaW5pdGlhbER1cmF0
    aW9uIjo5LCJ0b3RhbER1cmF0aW9uIjoxOSwic3RhcnRlZEF0IjoiMjAxOC0wMS0xNFQyMzowOTo1
    NC4zMjRaIiwiZXZlbnRzIjpbeyJhZGp1c3RtZW50IjowLCJldmVudFR5cGUiOiJnZXRSZWFkeSIs
    InRpbWUiOi0xMH0seyJhZGp1c3RtZW50IjowLCJldmVudFR5cGUiOiJzdGFydCIsInRpbWUiOjB9
    LHsiYWRqdXN0bWVudCI6MCwiZXZlbnRUeXBlIjoic2NvbGQiLCJ0aW1lIjoxfSx7ImFkanVzdG1l
    bnQiOjUsImV2ZW50VHlwZSI6InBlbmFsaXplIiwidGltZSI6N30seyJhZGp1c3RtZW50Ijo1LCJl
    dmVudFR5cGUiOiJwZW5hbGl6ZSIsInRpbWUiOjEzfSx7ImFkanVzdG1lbnQiOjAsImV2ZW50VHlw
    ZSI6ImVuZCIsInRpbWUiOjE5fV0sInZpb2xhdGlvbnMiOjN9Cg==
    -----END CORNERTIME REPORT-----
