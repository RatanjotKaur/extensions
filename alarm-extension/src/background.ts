console.log("Background service worker started");
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyAlarm") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon-48.png",
      title: "Alarm Notification",
      message: "⏰ Your alarm time is here!",
      priority: 2,
    });

    // Re-schedule it for next day
    const next = new Date();
    next.setDate(next.getDate() + 1);

    chrome.alarms.create("dailyAlarm", {
      when: next.getTime(),
    });
  }
});
