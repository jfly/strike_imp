server.log("Hihi from the device!")

buzzDoorOpen <- hardware.pin9;

buzzDoorOpen.configure(DIGITAL_OUT);

function setBuzzer(buzzerState) {
    if (buzzerState == 1) {
        server.log("Opening door for 3 seconds");
        buzzDoorOpen.write(1);
        imp.sleep(3);
        server.log("Buzzer off");
        buzzDoorOpen.write(0);
    } else if (buzzerState == 0) {
        server.log("Buzzer off");
        buzzDoorOpen.write(buzzerState);
    }
}

agent.on("buzz", setBuzzer);



/*
//=== Agent-driven Hello World ===
// create a global variabled called led, 
// and assign pin9 to it
led <- hardware.pin9;
 
// configure led to be a digital output
led.configure(DIGITAL_OUT);
 
// function to turn LED on or off
function setLed(ledState) {
  server.log("Set LED: " + ledState);
  led.write(ledState);
}
 
// register a handler for "led" messages from the agent
agent.on("led", setLed);
*/



/*
//=== Device-driven Hello World ===
// create a global variabled called led and assign pin9 to it
led <- hardware.pin9;
 
// configure led to be a digital output
led.configure(DIGITAL_OUT);
 
// create a global variable to store current state of the LED
state <- 0;
 
function blink() {
  // invert the value of state:
  // when state = 1, 1-1 = 0
  // when state = 0, 1-0 = 1
  state = 1-state;  
 
  // write current state to led pin
  led.write(state);
 
  // schedule imp to wakeup in .5 seconds and do it again. 
  imp.wakeup(0.5, blink);
}
 
// start the loop
blink();
*/