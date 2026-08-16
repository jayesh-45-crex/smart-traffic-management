from pathlib import Path
from collections import Counter

import cv2
from ultralytics import YOLO


# =========================================
# NAGPUR AI TRAFFIC
# Vehicle Detection Prototype
# =========================================

BASE_DIR = Path(__file__).resolve().parent

VIDEO_PATH = BASE_DIR / "traffic.mp4"
OUTPUT_PATH = BASE_DIR / "traffic_ai_output.mp4"


# =========================================
# LOAD AI MODEL
# =========================================

print("Loading YOLO model...")

model = YOLO("yolo11n.pt")

print("YOLO model loaded.")


# =========================================
# CHECK VIDEO
# =========================================

if not VIDEO_PATH.exists():

    print()
    print("ERROR: traffic.mp4 was not found.")
    print()
    print("Put your traffic video inside:")
    print(BASE_DIR)
    print()

    raise SystemExit(1)


# =========================================
# OPEN VIDEO
# =========================================

cap = cv2.VideoCapture(
    str(VIDEO_PATH)
)

if not cap.isOpened():

    print("ERROR: Could not open traffic video.")

    raise SystemExit(1)


fps = cap.get(
    cv2.CAP_PROP_FPS
)

width = int(
    cap.get(
        cv2.CAP_PROP_FRAME_WIDTH
    )
)

height = int(
    cap.get(
        cv2.CAP_PROP_FRAME_HEIGHT
    )
)


print()
print("Video:")
print(f"Resolution : {width} x {height}")
print(f"FPS        : {fps}")
print()


# =========================================
# OUTPUT VIDEO
# =========================================

fourcc = cv2.VideoWriter_fourcc(
    *"mp4v"
)

out = cv2.VideoWriter(
    str(OUTPUT_PATH),
    fourcc,
    fps,
    (width, height)
)


# =========================================
# TARGET VEHICLES
# =========================================

TARGET_CLASSES = {
    "car",
    "motorcycle",
    "bus",
    "truck"
}


# =========================================
# PROCESS VIDEO
# =========================================

while True:

    success, frame = cap.read()

    if not success:
        break


    # AI detection
    results = model.predict(
        source=frame,
        conf=0.35,
        imgsz=640,
        verbose=False
    )


    result = results[0]

    counts = Counter()


    # =====================================
    # READ DETECTIONS
    # =====================================

    if result.boxes is not None:

        for box in result.boxes:

            class_id = int(
                box.cls[0]
            )

            class_name = model.names[
                class_id
            ]

            if class_name in TARGET_CLASSES:

                counts[class_name] += 1


    # =====================================
    # DRAW AI BOXES
    # =====================================

    frame = result.plot()


    # =====================================
    # TOTAL
    # =====================================

    total = sum(
        counts.values()
    )


    # =====================================
    # TRAFFIC LEVEL
    # =====================================

    if total >= 30:

        traffic = "HIGH"

    elif total >= 15:

        traffic = "MEDIUM"

    else:

        traffic = "LOW"


    # =====================================
    # DASHBOARD OVERLAY
    # =====================================

    cv2.rectangle(
        frame,
        (15, 15),
        (350, 185),
        (5, 18, 28),
        -1
    )


    cv2.putText(
        frame,
        "NAGPUR AI TRAFFIC",
        (30, 45),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (0, 220, 255),
        2
    )


    cv2.putText(
        frame,
        f"Cars       : {counts['car']}",
        (30, 78),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (255, 255, 255),
        2
    )


    cv2.putText(
        frame,
        f"Motorcycle : {counts['motorcycle']}",
        (30, 107),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (255, 255, 255),
        2
    )


    cv2.putText(
        frame,
        f"Bus        : {counts['bus']}",
        (30, 136),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (255, 255, 255),
        2
    )


    cv2.putText(
        frame,
        f"Truck      : {counts['truck']}",
        (180, 78),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (255, 255, 255),
        2
    )


    cv2.putText(
        frame,
        f"TOTAL      : {total}",
        (180, 107),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (0, 245, 155),
        2
    )


    cv2.putText(
        frame,
        f"TRAFFIC    : {traffic}",
        (180, 136),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (0, 245, 155),
        2
    )


    # =====================================
    # SAVE FRAME
    # =====================================

    out.write(frame)


    # =====================================
    # SHOW AI WINDOW
    # =====================================

    cv2.imshow(
        "Nagpur AI Traffic Detection",
        frame
    )


    # Press Q to stop
    if cv2.waitKey(1) & 0xFF == ord("q"):

        break


# =========================================
# CLEANUP
# =========================================

cap.release()

out.release()

cv2.destroyAllWindows()


print()
print("====================================")
print("AI DETECTION COMPLETED")
print("====================================")
print(f"Output: {OUTPUT_PATH}")
