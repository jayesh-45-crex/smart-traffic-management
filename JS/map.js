/* =========================================================
   NAGPUR AI TRAFFIC COMMAND CENTER
   LIVE MAP ENGINE
   ========================================================= */

let map;

let markers = [];

let allJunctions = [];


/* =========================================================
   1. INITIALIZE NAGPUR MAP
   ========================================================= */

map = L.map("map", {
    zoomControl: true
}).setView(
    [21.1458, 79.0882],
    12
);


/* =========================================================
   2. OPENSTREETMAP
   ========================================================= */

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,

        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


/* =========================================================
   3. CREATE TRAFFIC MARKER
   ========================================================= */

function createMarker(junction) {

    /*
       Dataset fields:

       Signal ID
       Zone
       Junction
       Connecting Roads
       Route Direction
       Priority
    */


    let priority =
        String(
            junction["Priority"] ||
            junction["priority"] ||
            junction.status ||
            "Medium"
        ).toLowerCase();


    let color = "#ffc542";


    if (
        priority.includes("critical") ||
        priority.includes("high")
    ) {

        color = "#ff4c55";

    }

    else if (
        priority.includes("low")
    ) {

        color = "#35d993";

    }


    /*
       DEMO LOCATION

       Until real latitude/longitude are
       added, markers are placed around
       Nagpur center.

       We will replace this with verified
       coordinates later.
    */

    let lat =
        Number(
            junction.Latitude ||
            junction.latitude
        );

    let lng =
        Number(
            junction.Longitude ||
            junction.longitude
        );


    /*
       If dataset does not contain GPS
       coordinates, generate demo position.
    */

    if (
        !lat ||
        !lng ||
        isNaN(lat) ||
        isNaN(lng)
    ) {

        lat =
            21.1458 +
            (Math.random() - 0.5) * 0.08;

        lng =
            79.0882 +
            (Math.random() - 0.5) * 0.10;

    }


    /* MARKER ICON */

    const icon =
        L.divIcon({

            className: "",

            html: `
                <div class="traffic-marker"
                     style="
                        width:16px;
                        height:16px;
                        background:${color};
                        border-radius:50%;
                        border:3px solid white;
                        box-shadow:
                        0 0 15px ${color};
                     ">
                </div>
            `,

            iconSize: [16,16],

            iconAnchor: [8,8]

        });


    /* CREATE MARKER */

    const marker =
        L.marker(
            [lat, lng],
            {
                icon: icon
            }
        );


    /*
       SAVE DATA INSIDE MARKER
    */

    marker.junctionData =
        junction;


    /* =====================================================
       POPUP
    ===================================================== */

    const signalId =
        junction["Signal ID"] ||
        junction.id ||
        "N/A";


    const name =
        junction["Junction"] ||
        junction.name ||
        "Unknown Junction";


    const zone =
        junction["Zone"] ||
        "Unknown";


    const roads =
        junction["Connecting Roads"] ||
        "Not available";


    const direction =
        junction["Route Direction"] ||
        "Not available";


    const finalPriority =
        junction["Priority"] ||
        "Medium";


    const vehicleCount =
        Math.floor(
            80 + Math.random() * 250
        );


    marker.bindPopup(`

        <div class="popup-title">

            🚦 ${name}

        </div>


        <div class="popup-status">

            <b>Signal ID:</b>
            ${signalId}

        </div>


        <div class="popup-status">

            <b>Zone:</b>
            ${zone}

        </div>


        <div class="popup-status">

            <b>Connecting Roads:</b>
            ${roads}

        </div>


        <div class="popup-status">

            <b>Route:</b>
            ${direction}

        </div>


        <div class="popup-status">

            <b>Priority:</b>
            ${finalPriority}

        </div>


        <div class="popup-status">

            <b>AI Vehicle Count:</b>
            ${vehicleCount}

        </div>


        <div class="popup-status">

            <b>Signal:</b>
            <span style="color:#35d993">
                ACTIVE
            </span>

        </div>


        <div class="popup-ai">

            🤖 AI Recommendation:

            <br>

            Monitor traffic density and
            optimize signal timing.

        </div>

    `);


    /* =====================================================
       MARKER CLICK
    ===================================================== */

    marker.on(
        "click",
        function() {

            showJunctionDetails(
                junction
            );

        }
    );


    /* SAVE MARKER */

    markers.push(marker);


    /* ADD TO MAP */

    marker.addTo(map);

}


/* =========================================================
   4. LOAD NAGPUR DATASET
   ========================================================= */

async function loadJunctions() {

    try {

        const response =
            await fetch(
                "deta/nagpur-junctions.json"
            );


        if (!response.ok) {

            throw new Error(
                "Dataset file not found"
            );

        }


        const data =
            await response.json();


        /*
           Support both:

           {
             "junctions":[]
           }

           and

           []
        */

        if (
            Array.isArray(data)
        ) {

            allJunctions =
                data;

        }

        else {

            allJunctions =
                data.junctions ||
                data.intersections ||
                [];

        }


        console.log(
            "Nagpur dataset loaded:",
            allJunctions.length
        );


        /*
           CREATE MARKERS
        */

        allJunctions.forEach(
            function(junction) {

                createMarker(
                    junction
                );

            }
        );


        /*
           UPDATE DASHBOARD
        */

        updateSummary(
            allJunctions
        );


        /*
           AI MESSAGE
        */

        const ai =
            document.getElementById(
                "aiMessage"
            );


        if (ai) {

            ai.textContent =
                `AI Traffic Engine connected with ${allJunctions.length} Nagpur junction records.`;

        }


    }

    catch(error) {

        console.error(
            "Dataset loading error:",
            error
        );


        const ai =
            document.getElementById(
                "aiMessage"
            );


        if (ai) {

            ai.textContent =
                "⚠ Dataset could not be loaded. Check deta/nagpur-junctions.json";

        }


        alert(
            "Nagpur dataset load nahi hua.\n\n" +
            "Check karo:\n" +
            "deta/nagpur-junctions.json"
        );

    }

}


/* =========================================================
   5. START DATA LOADING
   ========================================================= */

loadJunctions();


/* =========================================================
   6. ZONE FILTER
   ========================================================= */

function filterZone(zone) {


    /*
       Remove existing markers
    */

    markers.forEach(
        function(marker) {

            map.removeLayer(
                marker
            );

        }
    );


    markers = [];


    let filtered;


    if (
        zone === "All"
    ) {

        filtered =
            allJunctions;

    }

    else {

        filtered =
            allJunctions.filter(
                function(item) {

                    const itemZone =
                        String(
                            item["Zone"] ||
                            item.zone ||
                            ""
                        );


                    return (
                        itemZone
                            .toLowerCase()
                            .includes(
                                zone.toLowerCase()
                            )
                    );

                }
            );

    }


    /*
       Recreate markers
    */

    filtered.forEach(
        function(junction) {

            createMarker(
                junction
            );

        }
    );


    updateSummary(
        filtered
    );


    /*
       AI STATUS
    */

    const ai =
        document.getElementById(
            "aiMessage"
        );


    if (ai) {

        ai.textContent =
            `${zone}: ${filtered.length} junctions currently loaded in the traffic network.`;

    }

}


/* =========================================================
   7. UPDATE SUMMARY
   ========================================================= */

function updateSummary(data) {


    const junctionCount =
        document.getElementById(
            "junctionCount"
        );


    const highCount =
        document.getElementById(
            "highCount"
        );


    if (junctionCount) {

        junctionCount.textContent =
            data.length;

    }


    let high = 0;


    data.forEach(
        function(item) {

            const priority =
                String(
                    item["Priority"] ||
                    item["priority"] ||
                    item.status ||
                    ""
                ).toLowerCase();


            if (
                priority.includes("high") ||
                priority.includes("critical")
            ) {

                high++;

            }

        }
    );


    if (highCount) {

        highCount.textContent =
            high;

    }

}


/* =========================================================
   8. SHOW JUNCTION DETAILS
   ========================================================= */

function showJunctionDetails(
    junction
) {


    const panel =
        document.getElementById(
            "junctionDetails"
        );


    if (!panel) {

        return;

    }


    const signalId =
        junction["Signal ID"] ||
        junction.id ||
        "N/A";


    const name =
        junction["Junction"] ||
        junction.name ||
        "Unknown Junction";


    const zone =
        junction["Zone"] ||
        "Unknown";


    const roads =
        junction["Connecting Roads"] ||
        "Not available";


    const direction =
        junction["Route Direction"] ||
        "Not available";


    const priority =
        junction["Priority"] ||
        "Medium";


    panel.innerHTML = `

        <small>
            SELECTED JUNCTION
        </small>


        <h3>
            🚦 ${name}
        </h3>


        <p>
            <b>Signal ID:</b>
            ${signalId}
        </p>


        <p>
            <b>Zone:</b>
            ${zone}
        </p>


        <p>
            <b>Connecting Roads:</b>
            ${roads}
        </p>


        <p>
            <b>Route:</b>
            ${direction}
        </p>


        <p>
            <b>Priority:</b>
            ${priority}
        </p>


        <p>
            <b>AI Monitoring:</b>

            <span style="color:#35d993">
                ONLINE
            </span>

        </p>

    `;


    /*
       AI recommendation
    */

    const ai =
        document.getElementById(
            "aiMessage"
        );


    if (ai) {

        ai.textContent =
            `AI is analysing ${signalId} — ${name}. Priority level: ${priority}.`;

    }

}


/* =========================================================
   9. SEARCH — SIGNAL ID + JUNCTION NAME
   ========================================================= */

function searchJunction() {


    const input =
        document.getElementById(
            "mapSearch"
        );


    if (!input) {

        return;

    }


    const query =
        input.value
            .trim()
            .toLowerCase();


    if (!query) {

        alert(
            "Please enter Signal ID or Junction name."
        );

        return;

    }


    /*
       SEARCH:

       NAG-001
       Zero Mile
       Chhatrapati Square
       Medical Square
       etc.
    */

    const result =
        allJunctions.find(
            function(item) {


                const signalId =
                    String(
                        item["Signal ID"] ||
                        item.id ||
                        ""
                    )
                    .toLowerCase();


                const junction =
                    String(
                        item["Junction"] ||
                        item.name ||
                        ""
                    )
                    .toLowerCase();


                return (
                    signalId === query ||

                    signalId.includes(
                        query
                    ) ||

                    junction.includes(
                        query
                    )
                );

            }
        );


    /*
       NOT FOUND
    */

    if (!result) {

        alert(

            "❌ Junction not found.\n\n" +

            "Try:\n" +

            "NAG-001\n" +

            "Zero Mile\n" +

            "Chhatrapati Square\n" +

            "Medical Square"

        );

        return;

    }


    /*
       FIND MARKER
    */

    const marker =
        markers.find(
            function(marker) {


                const data =
                    marker.junctionData;


                const markerId =
                    String(
                        data["Signal ID"] ||
                        data.id ||
                        ""
                    );


                const resultId =
                    String(
                        result["Signal ID"] ||
                        result.id ||
                        ""
                    );


                return (
                    markerId === resultId
                );

            }
        );


    /*
       MOVE MAP
    */

    if (marker) {


        map.setView(
            marker.getLatLng(),
            16,
            {
                animate: true
            }
        );


        marker.openPopup();


        showJunctionDetails(
            result
        );


        return;

    }


    /*
       FALLBACK
    */

    showJunctionDetails(
        result
    );

}


/* =========================================================
   10. SEARCH USING ENTER KEY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        const search =
            document.getElementById(
                "mapSearch"
            );


        if (search) {

            search.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "Enter"
                    ) {

                        searchJunction();

                    }

                }
            );

        }

    }
);


/* =========================================================
   11. LIVE INDIA TIME
   ========================================================= */

function updateMapTime() {


    const element =
        document.getElementById(
            "mapTime"
        );


    if (!element) {

        return;

    }


    element.textContent =

        new Intl.DateTimeFormat(
            "en-IN",
            {

                timeZone:
                    "Asia/Kolkata",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hour12:
                    false

            }
        ).format(
            new Date()
        );

}


updateMapTime();


setInterval(
    updateMapTime,
    1000
);


/* =========================================================
   12. DEMO LIVE TRAFFIC UPDATE
   ========================================================= */

setInterval(
    function() {


        /*
           This is only UI simulation.

           Later actual camera/AI data
           will replace it.
        */


        if (
            allJunctions.length > 0
        ) {


            const random =
                Math.floor(
                    Math.random() *
                    allJunctions.length
                );


            const junction =
                allJunctions[random];


            const ai =
                document.getElementById(
                    "aiMessage"
                );


            if (ai) {

                const name =
                    junction["Junction"] ||
                    junction.name ||
                    "Junction";


                ai.textContent =
                    `🤖 Monitoring ${name} — AI traffic analysis active.`;

            }

        }

    },

    5000

);