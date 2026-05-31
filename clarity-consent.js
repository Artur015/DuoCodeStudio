const DUOCODE_CLARITY_PROJECT_ID = "wxtcftrojx";
const DUOCODE_CLARITY_PLACEHOLDER_ID = "CLARITY_PROJECT_ID";
const DUOCODE_ANALYTICS_CONSENT_KEY = "duocode-analytics-consent";

let duocodeClarityLoaded = false;

function hasValidClarityProjectId() {
	return (
		DUOCODE_CLARITY_PROJECT_ID &&
		DUOCODE_CLARITY_PROJECT_ID !== DUOCODE_CLARITY_PLACEHOLDER_ID &&
		DUOCODE_CLARITY_PROJECT_ID.trim() !== ""
	);
}

function loadClarityScript() {
	if (duocodeClarityLoaded || !hasValidClarityProjectId()) {
		return;
	}

	(function (c, l, a, r, i, t, y) {
		c[a] =
			c[a] ||
			function () {
				(c[a].q = c[a].q || []).push(arguments);
			};
		t = l.createElement(r);
		t.async = 1;
		t.src = "https://www.clarity.ms/tag/" + i;
		y = l.getElementsByTagName(r)[0];
		y.parentNode.insertBefore(t, y);
	})(window, document, "clarity", "script", DUOCODE_CLARITY_PROJECT_ID);

	duocodeClarityLoaded = true;
}

function grantClarityConsent() {
	loadClarityScript();

	if (typeof window.clarity === "function") {
		window.clarity("consentv2", {
			ad_Storage: "denied",
			analytics_Storage: "granted",
		});
	}
}

function denyClarityConsent() {
	if (typeof window.clarity === "function") {
		window.clarity("consentv2", {
			ad_Storage: "denied",
			analytics_Storage: "denied",
		});
		window.clarity("consent", false);
	}
}

function applyStoredClarityConsent() {
	try {
		const consentState = window.localStorage.getItem(DUOCODE_ANALYTICS_CONSENT_KEY);

		if (consentState === "accepted") {
			grantClarityConsent();
			return;
		}

		if (consentState === "rejected") {
			denyClarityConsent();
		}
	} catch (error) {
		console.warn("Unable to read consent state for Clarity.", error);
	}
}

function bindClarityConsentButtons() {
	const acceptButton = document.getElementById("cookie-accept");
	const rejectButton = document.getElementById("cookie-reject");

	if (acceptButton) {
		acceptButton.addEventListener("click", () => {
			window.setTimeout(applyStoredClarityConsent, 0);
		});
	}

	if (rejectButton) {
		rejectButton.addEventListener("click", () => {
			window.setTimeout(applyStoredClarityConsent, 0);
		});
	}
}

function initializeClarityConsent() {
	bindClarityConsentButtons();
	applyStoredClarityConsent();

	window.addEventListener("storage", (event) => {
		if (event.key === DUOCODE_ANALYTICS_CONSENT_KEY) {
			applyStoredClarityConsent();
		}
	});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeClarityConsent, { once: true });
} else {
	initializeClarityConsent();
}
