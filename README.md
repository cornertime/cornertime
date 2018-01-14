# Improved Virtual Corner Time

This is an application that tells you go to a corner and stay there without moving until a certain time has passed.

Use it on yourself as a conditioning method (caught yourself picking your nose? get in the corner!) or just for, err, fun. Use it on someone else as part of a long-distance D/s relationship.

Inspired by the [Virtual Corner Time](https://cornertime.herokuapp.com) application. This is a clean-room implementation with improvements over the original:

* Ultimately enabling one to **set all session parameters via a preset**, especially the session duration. This would enable one to set up a session for someone else without notifying them about the duration beforehand. Only local settings such as movement threshold (very dependant on the webcam and distance) are left for the person doing the session to configure.
* **Setting the session duration in terms of minimum time and maximum time**. The +/- 50% setting of the original application causes a very wide duration range, for example from 30 minutes to 90 minutes assuming a nominal time of 60 minutes.
* **Having a numeric input for session duration range** instead of a slider.

## Getting started

At least Node 8 & NPM 5.6 required.

    npm install
    npm start
    npm test
