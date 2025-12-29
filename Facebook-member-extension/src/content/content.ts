console.log("FB Member Requests Script Loaded");

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .fbmr-approve-btn,
    .fbmr-decline-btn,
    .fbmr-bulk-approve,
    .fbmr-bulk-decline {
      padding: 8px 16px;
      margin: 4px 4px 0 0;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .fbmr-approve-btn,
    .fbmr-bulk-approve {
      background-color: #31a24c;
      color: white;
    }

    .fbmr-approve-btn:hover,
    .fbmr-bulk-approve:hover {
      background-color: #2a8c40;
      box-shadow: 0 2px 6px rgba(49, 162, 76, 0.3);
    }

    .fbmr-approve-btn:active,
    .fbmr-bulk-approve:active {
      transform: scale(0.98);
    }

    .fbmr-decline-btn,
    .fbmr-bulk-decline {
      background-color: #e4163a;
      color: white;
    }

    .fbmr-decline-btn:hover,
    .fbmr-bulk-decline:hover {
      background-color: #c01230;
      box-shadow: 0 2px 6px rgba(228, 22, 58, 0.3);
    }

    .fbmr-decline-btn:active,
    .fbmr-bulk-decline:active {
      transform: scale(0.98);
    }

    .fbmr-custom-actions {
      display: flex;
      gap: 4px;
      margin-top: 8px;
    }
  `;
  document.head.appendChild(style);
}

function getRequestCards(): Element[] {
  // Find all native "Approve" buttons within the member request containers
  const nativeApproveButtons = Array.from(
    document.querySelectorAll('div[role="button"], button')
  ).filter((btn) => /^Approve/i.test(btn.textContent?.trim() || ""));

  // Map each approve button to its parent request card container
  return nativeApproveButtons
    .map((btn) => {
      // Walk up the DOM tree to find the request card container
      let current = btn.parentElement;
      while (current) {
        const children = current.children;
        // Check if this container has both profile info and action buttons
        if (
          current.querySelectorAll('div[role="button"], button').length >= 2 &&
          current.textContent?.includes("Requested")
        ) {
          return current;
        }
        current = current.parentElement;
      }
      return null;
    })
    .filter((el) => el !== null) as Element[];
}

function extractCardData(card: Element) {
  // Multiple strategies to find the member name and profile link
  let nameEl: HTMLAnchorElement | null = null;
  let name = "Unknown";
  let profileUrl = "";

  // Strategy 1: Find profile link with /[username]/ pattern
  const profileLinks = Array.from(
    card.querySelectorAll('a[href*="/"]')
  ) as HTMLAnchorElement[];
  for (const link of profileLinks) {
    const href = link.getAttribute("href") || "";
    // Look for profile links: /[username]/, /profile.php?id=..., /pages/...
    if (/\/([\w.]+)\/?(\?|$)|\/profile\.php\?id=|\/pages\//.test(href)) {
      const text = link.innerText?.trim();
      if (
        text &&
        text.length > 0 &&
        !text.includes("Requested") &&
        !text.includes("said")
      ) {
        nameEl = link;
        name = text;
        profileUrl = link.href;
        break;
      }
    }
  }

  // Strategy 2: If no profile link found, look for any link with text inside the card
  if (!nameEl) {
    const anyLink = card.querySelector(
      'a[href*="facebook.com"]'
    ) as HTMLAnchorElement | null;
    if (anyLink?.innerText?.trim()) {
      name = anyLink.innerText.trim();
      profileUrl = anyLink.href;
    }
  }

  // Strategy 3: Extract from card text content as last resort
  if (name === "Unknown") {
    const cardText = card.textContent || "";
    const lines = cardText.split("\n").filter((l) => l.trim());
    // First non-empty line is often the name
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed &&
        trimmed.length > 2 &&
        !trimmed.includes("Requested") &&
        !trimmed.includes("Approve")
      ) {
        name = trimmed;
        break;
      }
    }
  }

  // Try to find a readable request date element, fallback to now
  const dateEl = card.querySelector("abbr") as HTMLElement | null;
  const requestDate = dateEl?.getAttribute("title") || new Date().toISOString();

  console.debug(
    `Extracted card data: name="${name}", profileUrl="${profileUrl}"`
  );

  return { name, profileUrl, requestDate };
}

function createCustomButtons(card: Element) {
  // Skip if already processed to prevent infinite loops
  if (card.querySelector(".fbmr-custom-actions")) return;
  if ((card as any)._fbmrProcessed) return;
  (card as any)._fbmrProcessed = true;

  const { name, profileUrl, requestDate } = extractCardData(card);

  // Find native approve/decline buttons inside the card's action area
  const possibleBtns = Array.from(
    card.querySelectorAll('div[role="button"], button')
  ) as HTMLElement[];

  const nativeApprove = possibleBtns.find((b) =>
    /^Approve\b/i.test(b.textContent?.trim() || "")
  );
  const nativeDecline = possibleBtns.find((b) =>
    /^Decline\b/i.test(b.textContent?.trim() || "")
  );

  function makeReplacement(
    nativeBtn: HTMLElement | undefined,
    label: string,
    actionType: string
  ) {
    if (!nativeBtn) return null;
    const repl = document.createElement("button");
    repl.className =
      actionType === "APPROVED" ? "fbmr-approve-btn" : "fbmr-decline-btn";
    repl.textContent = `${label} & Save`;

    repl.addEventListener("click", () => {
      repl.disabled = true;
      const data = { name, profileUrl, requestDate, action: actionType };
      repl.textContent = "Saving...";
      // send save message
      chrome.runtime.sendMessage(
        { type: "SAVE_MEMBER", payload: data },
        (resp) => {
          if (resp && resp.success) {
            repl.textContent = "Saved";
          } else {
            repl.textContent = "Error";
            console.error(resp?.error || "Unknown error saving member");
          }
          setTimeout(() => {
            try {
              repl.textContent = `${label} & Save`;
            } catch (e) {}
          }, 1500);
          repl.disabled = false;
        }
      );

      // trigger native action so UI behaves the same
      try {
        nativeBtn.click();
      } catch (e) {
        console.error("Failed to trigger native button click", e);
      }
    });

    // insert replacement before native button and hide native
    nativeBtn.parentElement?.insertBefore(repl, nativeBtn);
    nativeBtn.style.display = "none";
    return repl;
  }

  const replApprove = makeReplacement(nativeApprove, "Approve", "APPROVED");
  const replDecline = makeReplacement(nativeDecline, "Decline", "DECLINED");

  // If no native buttons found, fall back to appending our buttons
  if (!replApprove && !replDecline) {
    const approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve & Save";
    approveBtn.className = "fbmr-approve-btn";
    approveBtn.addEventListener("click", () => {
      approveBtn.disabled = true;
      approveBtn.textContent = "Saving...";
      chrome.runtime.sendMessage(
        {
          type: "SAVE_MEMBER",
          payload: { name, profileUrl, requestDate, action: "APPROVED" },
        },
        (resp) => {
          if (resp && resp.success) {
            approveBtn.textContent = "Saved";
            setTimeout(() => (approveBtn.textContent = "Approve & Save"), 2000);
          } else {
            approveBtn.textContent = "Error";
            setTimeout(() => (approveBtn.textContent = "Approve & Save"), 2000);
          }
          approveBtn.disabled = false;
        }
      );
    });

    const declineBtn = document.createElement("button");
    declineBtn.textContent = "Decline & Save";
    declineBtn.className = "fbmr-decline-btn";
    declineBtn.addEventListener("click", () => {
      declineBtn.disabled = true;
      declineBtn.textContent = "Saving...";
      chrome.runtime.sendMessage(
        {
          type: "SAVE_MEMBER",
          payload: { name, profileUrl, requestDate, action: "DECLINED" },
        },
        (resp) => {
          if (resp && resp.success) {
            declineBtn.textContent = "Saved";
            setTimeout(() => (declineBtn.textContent = "Decline & Save"), 2000);
          } else {
            declineBtn.textContent = "Error";
            setTimeout(() => (declineBtn.textContent = "Decline & Save"), 2000);
          }
          declineBtn.disabled = false;
        }
      );
    });

    const wrapper = document.createElement("div");
    wrapper.className = "fbmr-custom-actions";
    wrapper.style.marginTop = "8px";
    wrapper.appendChild(approveBtn);
    wrapper.appendChild(declineBtn);

    // put wrapper near the first possible button area or at card end
    const firstBtnParent = possibleBtns[0]?.parentElement ?? card;
    firstBtnParent.appendChild(wrapper);
  }
}

function injectButtons(cards: Element[]) {
  cards.forEach((card) => createCustomButtons(card));
}

let bulkButtonsInjected = false;

function replaceBulkButtons() {
  // Only inject once per page load
  if (bulkButtonsInjected) return;
  if (document.querySelector(".fbmr-bulk-actions")) return;

  // Look for buttons that contain "Approve All" text directly (not in parent text)
  const nativeButtons = Array.from(
    document.querySelectorAll('div[role="button"], button')
  ) as Element[];

  let targetContainer: Element | null = null;

  // Find the first native button with "Approve All" text
  for (const btn of nativeButtons) {
    const text = btn.textContent?.trim() || "";
    if (/^Approve All/i.test(text)) {
      // Found a native button, get its parent container
      targetContainer = btn.parentElement;
      break;
    }
  }

  // If we found a target container, replace buttons there
  if (targetContainer) {
    // Hide all native buttons in this container
    targetContainer
      .querySelectorAll('div[role="button"], button')
      .forEach((b) => {
        (b as HTMLElement).style.display = "none";
      });

    const bulkApprove = document.createElement("button");
    bulkApprove.textContent = "Approve All & Save";
    bulkApprove.className = "fbmr-bulk-approve";
    bulkApprove.addEventListener("click", async () => {
      bulkApprove.disabled = true;
      bulkApprove.textContent = "Processing...";
      const cards = getRequestCards();

      // Add rate limiting: 1 second delay between requests
      for (const card of cards) {
        const { name, profileUrl, requestDate } = extractCardData(card);
        chrome.runtime.sendMessage({
          type: "SAVE_MEMBER",
          payload: { name, profileUrl, requestDate, action: "APPROVED" },
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      bulkApprove.textContent = "Approve All & Save";
      bulkApprove.disabled = false;
    });

    const bulkDecline = document.createElement("button");
    bulkDecline.textContent = "Decline All & Save";
    bulkDecline.className = "fbmr-bulk-decline";
    bulkDecline.addEventListener("click", async () => {
      bulkDecline.disabled = true;
      bulkDecline.textContent = "Processing...";
      const cards = getRequestCards();

      // Add rate limiting: 1 second delay between requests
      for (const card of cards) {
        const { name, profileUrl, requestDate } = extractCardData(card);
        chrome.runtime.sendMessage({
          type: "SAVE_MEMBER",
          payload: { name, profileUrl, requestDate, action: "DECLINED" },
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      bulkDecline.textContent = "Decline All & Save";
      bulkDecline.disabled = false;
    });

    const wrapper = document.createElement("div");
    wrapper.className = "fbmr-bulk-actions";
    wrapper.style.marginTop = "6px";
    wrapper.appendChild(bulkApprove);
    wrapper.appendChild(bulkDecline);

    targetContainer.appendChild(wrapper);
    bulkButtonsInjected = true;
  }
}

// Debounce MutationObserver to avoid excessive re-injections
let mutationTimeout: NodeJS.Timeout;
let processingCards = new WeakSet<Element>();

const observer = new MutationObserver(() => {
  clearTimeout(mutationTimeout);
  mutationTimeout = setTimeout(() => {
    const cards = getRequestCards();
    // Only process cards that haven't been processed yet
    const newCards = cards.filter((card) => !processingCards.has(card));
    if (newCards.length > 0) {
      newCards.forEach((card) => processingCards.add(card));
      injectButtons(newCards);
    }
    if (!bulkButtonsInjected) replaceBulkButtons();
  }, 300);
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial run
injectStyles();
setTimeout(() => {
  injectButtons(getRequestCards());
  replaceBulkButtons();
}, 1500);
