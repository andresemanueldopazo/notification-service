# Notification service

Implementation of a notification service as a HTTP server using [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).

# General idea

An external client (e.g. a browser) could connect to this HTTP service via `/connect` and until desconnection it can receive a simple message sent from the server.

The server has a `/notifyAll` method handler that sends a very simple message that could be understood as a _notification_ from the client's perspective since it sends it to _all_ the connected clients at that particular moment.

Also, there's a `/notify` methond handler for sending a notification to a _specific_ connection.

# Design

It has a very similar design as the [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) which is one of the behavioural pattern listed in the GoF design patterns book.

The analogy is that the _subject_ is the service itself, which mantain a list of its dependents i.e. the _connections_ that are analogous to the _observers_.

# Implementation

It is a Node.js server built with the [Express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs) framework.

This repo also has an example frontend built with [React](https://create-react-app.dev/) to try it out quickly and for manual testing purposes.

This repo is also already set up for being ready to publish it as a npm package as [minimal-ts-project](https://github.com/ignaciodopazo/minimal-ts-project). For me has being quite useful having the possibility of easily decouple any business logic related code from the web server as soon as it worth it.
