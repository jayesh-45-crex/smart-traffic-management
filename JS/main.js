/* ==========================================
   NAGPUR AI TRAFFIC COMMAND
   HOME PAGE JAVASCRIPT
========================================== */


/* ==========================================
   LIVE INDIA TIME
========================================== */

function updateIndiaTime() {

    const time =
        document.getElementById("indiaTime");

    const date =
        document.getElementById("indiaDate");


    if (!time) return;


    const now = new Date();


    time.textContent =
        new Intl.DateTimeFormat(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        ).format(now);


    if (date) {

        date.textContent =
            new Intl.DateTimeFormat(
                "en-IN",
                {
                    timeZone: "Asia/Kolkata",
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(now);

    }

}


updateIndiaTime();

setInterval(
    updateIndiaTime,
    1000
);



/* ==========================================
   DEMO VEHICLE COUNTER
========================================== */

let vehicles = 1248;


function updateVehicleCount() {

    const element =
        document.getElementById(
            "vehicleCount"
        );


    if (!element) return;


    vehicles +=
        Math.floor(
            Math.random() * 4
        );


    element.textContent =
        vehicles.toLocaleString(
            "en-IN"
        );

}


setInterval(
    updateVehicleCount,
    3000
);



/* ==========================================
   AI ASSISTANT
========================================== */

function toggleAI() {

    const assistant =
        document.getElementById(
            "aiAssistant"
        );


    if (!assistant) return;


    if (
        assistant.style.display ===
        "block"
    ) {

        assistant.style.display =
            "none";

    }

    else {

        assistant.style.display =
            "block";

    }

}



/* ==========================================
   DEMO LOCATION SEARCH
========================================== */

function searchLocation() {

    const input =
        document.getElementById(
            "locationSearch"
        );


    if (!input) return;


    const query =
        input.value
        .trim()
        .toLowerCase();


    if (!query) {

        alert(
            "Please enter a Nagpur location."
        );

        return;

    }


    /*
       Full map search will be connected
       in the next development stage.
    */

    alert(
        "Searching Nagpur for: " +
        input.value +
        "\n\nLive map integration next step."
    );

}



/* ==========================================
   OPEN MAP
========================================== */

function openMap() {
    window.location.href = "map.html";
}



/* ==========================================
   OPEN DASHBOARD
========================================== */

function openDashboard() {
    const session = window.NagpurAI ? window.NagpurAI.getSession() : null;
    if (session && session.loggedIn) {
        window.location.href = session.role === "police" ? "police-dashboard.html" : "public-dashboard.html";
    } else {
        window.location.href = "login.html";
    }
}



/* ==========================================
   AI OPTION DEMO
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        const aiButtons =
            document.querySelectorAll(
                ".ai-options button"
            );


        aiButtons.forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const option =
                            button.textContent;


                        alert(
                            "Nagpur AI Assistant selected: " +
                            option
                        );

                    }
                );

            }
        );


    }
);
function openMap() {
    window.location.href = "map.html";
};