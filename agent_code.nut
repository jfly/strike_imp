server.log("Open gate: " + http.agenturl() + "?buzz=1");
 
function requestHandler(request, response) {
  try {
    if ("buzz" in request.query) {
      if (request.query.buzz == "1" || request.query.buzz == "0") {
        local buzzerState = request.query.buzz.tointeger();
        device.send("buzz", buzzerState);
        server.log("Setting device to " + buzzerState);
      }
    }
    response.send(200, "OK");
  } catch (ex) {
    response.send(500, "Internal Server Error: " + ex);
  }
}

http.onrequest(requestHandler);