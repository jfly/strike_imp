window.addEventListener('load', function() {
  var unlockButton = document.getElementById("unlock-button");
  unlockButton.addEventListener('click', function() {
    fetch('https://agent.electricimp.com/SECRETIMPAGENTIDHERE?buzz=42')
      .then(
        function(response) {
          if(response.status !== 200) {
            alert('Error code from server: ' + response.status);
            return;
          }

          response.json().then(function(data) {
            console.log(data);
          });
        }
      )
      .catch(function(err) {
        console.log(err);
        alert('Fetch Error:' + err);
      });
  });
});
