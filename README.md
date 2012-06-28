tuiohost
========

Multitouch TUIO Events to the Browser using node.js and socket.io

Description
===========

TuioHost is (yet another) implementation of TUIO designed to provide web applications
with a socket.io access point for multitouch events. 

The tuiohost server assumes the OSC messages can arrive from anywhere, and if there are senders
from multiple IP addresses the cursor identifiers will be kept distinct to avoid cursor id
collisions.

The typical installation will be on a desktop system with its own stream of TUIO events.
In this most simple configuration it serves as a simple forklift to get TUIO events into
a browser without requiring any kind of plugin. This has been tested successfully in Windows
and Linux with numerous recent editions of popular web browsers (e.g. Chrome, Firefox,
IE9, and Safari).

It is assumed that a separate server is hosting the client application logic to bind its events
(i.e. tuiostart, tuiomove, tuioend) to handlers in client-side javascript.

Examples
========

Coming soon.

