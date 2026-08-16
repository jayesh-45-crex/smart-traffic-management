/* =========================================================
   NAGPUR AI TRAFFIC — DASHBOARD JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. USER LOGIN DATA
    ===================================================== */

    const userName = localStorage.getItem("trafficUserName") || "Traffic Operator";
    const userEmail = localStorage.getItem("trafficUserEmail") || "operator@nagpur.ai";

    const userNameElements = document.querySelectorAll(
        "#userName, .user-name, .profile-name"
    );

    userNameElements.forEach(element => {
        element.textContent = userName;
    });

    const emailElements = document.querySelectorAll(
        "#userEmail, .user-email"
    );

    emailElements.forEach(element => {
        element.textContent = userEmail;
    });


    /* =====================================================
       2. LIVE CLOCK
    ===================================================== */

    function updateClock() {

        const now = new Date();

        const time = now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });

        const date = now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        const clock = document.getElementById("liveTime");
        const dateElement = document.getElementById("liveDate");

        if (clock) {
            clock.textContent = time;
        }

        if (dateElement) {
            dateElement.textContent = date;
        }
    }

    updateClock();

    setInterval(updateClock, 1000);


    /* =====================================================
       3. NAGPUR LOCATION
    ===================================================== */

    const locationElement = document.getElementById("currentLocation");

    if (locationElement) {
        locationElement.textContent = "Nagpur, Maharashtra";
    }


    /* =====================================================
       4. SIDEBAR NAVIGATION
    ===================================================== */

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", function () {

            navItems.forEach(nav => {
                nav.classList.remove("active");
            });

            this.classList.add("active");

            const pageName = this.dataset.page;

            if (pageName) {
                console.log("Opening:", pageName);
            }

        });

    });


    /* =====================================================
       5. SEARCH BAR
    ===================================================== */

    const searchInput = document.getElementById("trafficSearch");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchValue = this.value.toLowerCase().trim();

            const junctions = document.querySelectorAll(
                ".junction-marker"
            );

            junctions.forEach(junction => {

                const name = junction.dataset.name
                    ? junction.dataset.name.toLowerCase()
                    : "";

                if (searchValue === "") {

                    junction.style.opacity = "1";

                } else if (name.includes(searchValue)) {

                    junction.style.opacity = "1";
                    junction.style.transform =
                        "translate(-50%, -50%) scale(1.5)";

                } else {

                    junction.style.opacity = "0.2";
                    junction.style.transform =
                        "translate(-50%, -50%) scale(1)";

                }

            });

        });

    }


    /* =====================================================
       6. MAP MARKER CLICK
    ===================================================== */

    const markers = document.querySelectorAll(".junction-marker");

    markers.forEach(marker => {

        marker.addEventListener("click", function () {

            const junctionName =
                this.dataset.name || "Nagpur Junction";

            const status =
                this.dataset.status || "Traffic monitored";

            showNotification(
                `${junctionName}: ${status}`,
                "info"
            );

        });

    });


    /* =====================================================
       7. VIEW ALL ALERTS
    ===================================================== */

    const viewAllButton = document.querySelector(".view-all");

    if (viewAllButton) {

        viewAllButton.addEventListener("click", () => {

            showNotification(
                "All traffic alerts are being monitored by the AI Traffic System.",
                "info"
            );

        });

    }


    /* =====================================================
       8. NOTIFICATION BUTTON
    ===================================================== */

    const notificationButton =
        document.querySelector(".notification-btn");

    if (notificationButton) {

        notificationButton.addEventListener("click", () => {

            showNotification(
                "3 active traffic alerts detected in Nagpur.",
                "warning"
            );

        });

    }


    /* =====================================================
       9. AI TRAFFIC ANALYSIS
    ===================================================== */

    const aiButton = document.querySelector(".ai-action");

    if (aiButton) {

        aiButton.addEventListener("click", function () {

            const originalText = this.textContent;

            this.textContent =
                "AI ANALYZING TRAFFIC...";

            this.disabled = true;

            setTimeout(() => {

                this.textContent =
                    "✓ ANALYSIS COMPLETE";

                showNotification(
                    "AI analysis completed successfully. Traffic flow optimized.",
                    "success"
                );

            }, 2200);

            setTimeout(() => {

                this.textContent = originalText;
                this.disabled = false;

            }, 4500);

        });

    }


    /* =====================================================
       10. EMERGENCY RESPONSE
    ===================================================== */

    const emergencyButton =
        document.querySelector(".emergency-btn");

    const emergencyModal =
        document.querySelector(".modal-overlay");

    if (emergencyButton) {

        emergencyButton.addEventListener("click", () => {

            if (emergencyModal) {

                emergencyModal.classList.add("show");

            } else {

                showNotification(
                    "Emergency Priority System activated.",
                    "danger"
                );

            }

        });

    }


    /* =====================================================
       11. CLOSE MODAL
    ===================================================== */

    const closeModal =
        document.querySelector(".modal-close");

    if (closeModal) {

        closeModal.addEventListener("click", () => {

            if (emergencyModal) {
                emergencyModal.classList.remove("show");
            }

        });

    }


    /* =====================================================
       12. MODAL OUTSIDE CLICK
    ===================================================== */

    if (emergencyModal) {

        emergencyModal.addEventListener("click", function (event) {

            if (event.target === emergencyModal) {

                emergencyModal.classList.remove("show");

            }

        });

    }


    /* =====================================================
       13. EMERGENCY ACTION
    ===================================================== */

    const modalAction =
        document.querySelector(".modal-action");

    if (modalAction) {

        modalAction.addEventListener("click", () => {

            modalAction.textContent =
                "✓ PRIORITY ROUTE ACTIVATED";

            showNotification(
                "Emergency green corridor activated for priority vehicle.",
                "success"
            );

            setTimeout(() => {

                if (emergencyModal) {
                    emergencyModal.classList.remove("show");
                }

                modalAction.textContent =
                    "ACTIVATE PRIORITY ROUTE";

            }, 2500);

        });

    }


    /* =====================================================
       14. LOGOUT
    ===================================================== */

    const logoutButton =
        document.querySelector(".logout-btn");

    if (logoutButton) {

        logoutButton.addEventListener("click", () => {

            const confirmLogout =
                confirm("Do you want to logout?");

            if (confirmLogout) {

                localStorage.removeItem("trafficUserName");
                localStorage.removeItem("trafficUserEmail");

                window.location.href = "login.html";

            }

        });

    }


    /* =====================================================
       15. CAMERA SIMULATION
    ===================================================== */

    const cameraCards =
        document.querySelectorAll(".camera-card");

    cameraCards.forEach((camera, index) => {

        setInterval(() => {

            const number =
                Math.floor(Math.random() * 80) + 20;

            const vehicleCount =
                camera.querySelector(".vehicle-count");

            if (vehicleCount) {
                vehicleCount.textContent =
                    number + " vehicles";
            }

        }, 3000 + index * 500);

    });


    /* =====================================================
       16. TRAFFIC STATISTICS SIMULATION
    ===================================================== */

    function updateTrafficStats() {

        const vehicleCounter =
            document.getElementById("vehicleCount");

        const junctionCounter =
            document.getElementById("junctionCount");

        const emergencyCounter =
            document.getElementById("emergencyCount");

        if (vehicleCounter) {

            const vehicles =
                Math.floor(Math.random() * 1000) + 2500;

            vehicleCounter.textContent =
                vehicles.toLocaleString("en-IN");

        }

        if (junctionCounter) {

            const junctions =
                Math.floor(Math.random() * 5) + 40;

            junctionCounter.textContent =
                junctions;

        }

        if (emergencyCounter) {

            const emergency =
                Math.floor(Math.random() * 3);

            emergencyCounter.textContent =
                emergency;

        }

    }

    updateTrafficStats();

    setInterval(updateTrafficStats, 5000);


    /* =====================================================
       17. NOTIFICATION SYSTEM
    ===================================================== */

    function showNotification(message, type = "info") {

        const notification =
            document.createElement("div");

        notification.className =
            `dashboard-notification ${type}`;

        notification.innerHTML = `
            <div class="notification-icon">
                ${getNotificationIcon(type)}
            </div>

            <div>
                <strong>AI Traffic System</strong>
                <p>${message}</p>
            </div>

            <button class="notification-close">×</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("show");
        }, 20);

        const close =
            notification.querySelector(
                ".notification-close"
            );

        close.addEventListener("click", () => {

            notification.classList.remove("show");

            setTimeout(() => {
                notification.remove();
            }, 300);

        });

        setTimeout(() => {

            notification.classList.remove("show");

            setTimeout(() => {
                notification.remove();
            }, 300);

        }, 4500);

    }


    function getNotificationIcon(type) {

        if (type === "success") {
            return "✓";
        }

        if (type === "warning") {
            return "⚠";
        }

        if (type === "danger") {
            return "🚨";
        }

        return "ℹ";
    }


    /* =====================================================
       18. SYSTEM START MESSAGE
    ===================================================== */

    setTimeout(() => {

        showNotification(
            "Nagpur AI Traffic Command Center is online.",
            "success"
        );

    }, 1000);


    /* =====================================================
       19. RANDOM TRAFFIC STATUS
    ===================================================== */

    const trafficStatuses = [
        "Traffic flow normal",
        "Moderate traffic detected",
        "High vehicle density",
        "Signal optimization active",
        "AI monitoring active"
    ];

    setInterval(() => {

        const randomStatus =
            trafficStatuses[
                Math.floor(
                    Math.random() *
                    trafficStatuses.length
                )
            ];

        console.log(
            "AI Traffic Status:",
            randomStatus
        );

    }, 4000);


    /* =====================================================
       20. KEYBOARD SHORTCUT
    ===================================================== */

    document.addEventListener("keydown", event => {

        /* Ctrl + K = Search */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            if (searchInput) {
                searchInput.focus();
            }

        }

        /* Escape = Close Modal */

        if (event.key === "Escape") {

            if (emergencyModal) {
                emergencyModal.classList.remove("show");
            }

        }

    });

});