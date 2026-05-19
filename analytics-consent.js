const DUOCODE_GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
const DUOCODE_GA_PLACEHOLDER_ID = "G-XXXXXXXXXX";
const DUOCODE_CONSENT_STORAGE_KEY = "duocode-analytics-consent";

const cookieBanner = document.getElementById("cookie-banner");
const acceptAnalyticsButton = document.getElementById("cookie-accept");
const rejectAnalyticsButton = document.getElementById("cookie-reject");
const cookieSettingsButton = document.getElementById("cookie-settings-button");

let analyticsWasInitialized = false;

function initializeGoogleQueue() {
	window.dataLayer = window.dataLayer || [];
	window.gtag =
		window.gtag ||
		function gtag() {
			window.dataLayer.push(arguments);
		};

	window.gtag("consent", "default", {
		analytics_storage: "denied",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied"
	});
}

function hasRealMeasurementId() {
	return DUOCODE_GA_MEASUREMENT_ID && DUOCODE_GA_MEASUREMENT_ID !== DUOCODE_GA_PLACEHOLDER_ID;
}

function loadGoogleAnalytics() {
	if (analyticsWasInitialized || !hasRealMeasurementId()) {
		if (!hasRealMeasurementId()) {
			console.info("Replace G-XXXXXXXXXX in analytics-consent.js with your real GA4 Measurement ID.");
		}

		return;
	}

	analyticsWasInitialized = true;

	window.gtag("consent", "update", {
		analytics_storage: "granted",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied"
	});

	window.gtag("js", new Date());
	window.gtag("config", DUOCODE_GA_MEASUREMENT_ID, {
		anonymize_ip: true
	});

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(DUOCODE_GA_MEASUREMENT_ID)}`;
	document.head.appendChild(script);
}

function setBannerVisibility(isVisible) {
	if (cookieBanner) {
		cookieBanner.classList.toggle("is-hidden", !isVisible);
	}
}

function setSettingsVisibility(isVisible) {
	if (cookieSettingsButton) {
		cookieSettingsButton.classList.toggle("is-hidden", !isVisible);
	}
}

function persistConsentChoice(choice) {
	window.localStorage.setItem(DUOCODE_CONSENT_STORAGE_KEY, choice);
}

function applyConsentChoice(choice) {
	if (choice === "accepted") {
		loadGoogleAnalytics();
	}

	const shouldShowSettings = choice === "accepted" || choice === "rejected";
	setBannerVisibility(false);
	setSettingsVisibility(shouldShowSettings);
}

function restoreConsentChoice() {
	const savedChoice = window.localStorage.getItem(DUOCODE_CONSENT_STORAGE_KEY);

	if (savedChoice === "accepted" || savedChoice === "rejected") {
		applyConsentChoice(savedChoice);
		return;
	}

	setBannerVisibility(true);
	setSettingsVisibility(false);
}

function setupConsentControls() {
	if (acceptAnalyticsButton) {
		acceptAnalyticsButton.addEventListener("click", () => {
			persistConsentChoice("accepted");
			applyConsentChoice("accepted");
		});
	}

	if (rejectAnalyticsButton) {
		rejectAnalyticsButton.addEventListener("click", () => {
			persistConsentChoice("rejected");
			applyConsentChoice("rejected");
		});
	}

	if (cookieSettingsButton) {
		cookieSettingsButton.addEventListener("click", () => {
			setBannerVisibility(true);
			setSettingsVisibility(false);
		});
	}
}

initializeGoogleQueue();
setupConsentControls();
restoreConsentChoice();
