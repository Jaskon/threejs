if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        var promise = navigator.serviceWorker.register(currentLocation + '/sw.js');
        promise.then(function(registration) {
            console.log('[sw] Registered. Scope: ', registration.scope);
        }).catch(function(err) {
            console.log('[sw] Registration failed: ', err);
        });
    });
}