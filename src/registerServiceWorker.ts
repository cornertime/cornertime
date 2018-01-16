export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
            console.log('Unregistered service worker');
        });
    }
}
