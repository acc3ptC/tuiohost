# tuiohost

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

# Credits

Credit is definitely due to the makers of node-osc. I am just getting started with node.js. The initial target platform for this app is Windows, and with the "node-waf" requirement within that package I failed to find a way to install it. To get by for now, I embedded some
of their code within this application. 

# Examples

Coming soon. For a quick video of the package and its intended use please visit [here](http://vimeo.com/44835933 "Plugin-free TUIO in the Browser").

