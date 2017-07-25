if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register(currentLocation + '/sw.js')
        .then(function(registration) {
            console.log('[sw] Registered. Scope: ', registration.scope);
        }).catch(function(err) {
            console.log('[sw] Registration failed: ', err);
        });
    });
}