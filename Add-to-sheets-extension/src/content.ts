// src/content.ts
// This script runs on facebook.com and handles member request approval/decline

interface MemberRequest {
  name: string;
  userId?: string;
  timestamp: string;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "approveMember") {
    approveMember(request.memberName)
      .then((success) => sendResponse({ success }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // async response
  }

  if (request.action === "declineMember") {
    declineMember(request.memberName)
      .then((success) => sendResponse({ success }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // async response
  }

  if (request.action === "getMemberRequests") {
    const requests = getMemberRequests();
    sendResponse({ requests });
    return true;
  }
});

/**
 * Get list of pending member requests from the page
 */
function getMemberRequests(): MemberRequest[] {
  const requests: MemberRequest[] = [];

  // Look for member request cards/rows
  // This selector may vary based on Facebook's current DOM structure
  const requestElements = document.querySelectorAll(
    '[data-testid="member_request_card"], [role="listitem"][data-type="member_request"]'
  );

  requestElements.forEach((el) => {
    // Try to extract member name
    const nameEl = el.querySelector("[data-testid='name'], h2, .name");
    const name = nameEl?.textContent?.trim() || "Unknown";

    requests.push({
      name,
      timestamp: new Date().toISOString(),
    });
  });

  return requests;
}

/**
 * Click the approve button for a specific member
 */
async function approveMember(memberName: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Find the member card by name
    const cards = document.querySelectorAll(
      '[data-testid="member_request_card"], [role="listitem"]'
    );

    for (const card of cards) {
      const nameEl = card.querySelector("[data-testid='name'], h2, .name");
      if (nameEl?.textContent?.includes(memberName)) {
        // Find approve button - usually contains "Approve", "Add", or checkmark
        const buttons = card.querySelectorAll("button");
        for (const btn of buttons) {
          const btnText =
            btn.getAttribute("aria-label")?.toLowerCase() ||
            btn.textContent?.toLowerCase() ||
            "";
          if (
            btnText.includes("approve") ||
            btnText.includes("add") ||
            btnText.includes("confirm")
          ) {
            btn.click();
            console.log(`[Extension] Approved member: ${memberName}`);
            setTimeout(() => resolve(true), 500);
            return;
          }
        }
      }
    }

    console.warn(`[Extension] Could not find member to approve: ${memberName}`);
    resolve(false);
  });
}

/**
 * Click the decline button for a specific member
 */
async function declineMember(memberName: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Find the member card by name
    const cards = document.querySelectorAll(
      '[data-testid="member_request_card"], [role="listitem"]'
    );

    for (const card of cards) {
      const nameEl = card.querySelector("[data-testid='name'], h2, .name");
      if (nameEl?.textContent?.includes(memberName)) {
        // Find decline/reject button
        const buttons = card.querySelectorAll("button");
        for (const btn of buttons) {
          const btnText =
            btn.getAttribute("aria-label")?.toLowerCase() ||
            btn.textContent?.toLowerCase() ||
            "";
          if (
            btnText.includes("decline") ||
            btnText.includes("reject") ||
            btnText.includes("remove") ||
            btnText.includes("delete")
          ) {
            btn.click();
            console.log(`[Extension] Declined member: ${memberName}`);
            setTimeout(() => resolve(true), 500);
            return;
          }
        }
      }
    }

    console.warn(`[Extension] Could not find member to decline: ${memberName}`);
    resolve(false);
  });
}
