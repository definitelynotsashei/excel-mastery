if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => registration.update())
      .catch(() => {
        // Keep launch resilient even if the service worker fails to register.
      });
  });
}
