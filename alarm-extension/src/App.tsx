import { useState } from "react";

function App() {
  const [time, setTime] = useState("");

  const setAlarm = () => {
    if (!time) return alert("Please select a time");

    const now = new Date();
    const [hours, minutes] = time.split(":").map(Number);

    const alarmDate = new Date();
    alarmDate.setHours(hours, minutes, 0, 0);

    // If the time already passed for today → schedule for tomorrow
    if (alarmDate.getTime() < now.getTime()) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }

    chrome.alarms.create("dailyAlarm", {
      when: alarmDate.getTime(),
    });

    alert(`Alarm set for ${alarmDate.toLocaleTimeString()}`);
  };

  return (
    <div style={{ padding: 20, width: 250 }}>
      <h3>Set Daily Alarm</h3>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        style={{ width: "100%", margin: "10px 0" }}
      />
      <button onClick={setAlarm} style={{ width: "100%", padding: 10 }}>
        Set Alarm
      </button>
    </div>
  );
}

export default App;
