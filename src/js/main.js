window._animate = (draw, duration = 1000) => {
    animate({
        duration,
        timing: makeEaseInOut(quad),
        draw
    });
    
    function animate(options) {
        var start = performance.now();
        requestAnimationFrame(function animate(time) {

            var timeFraction = (time - start) / options.duration;
            if (timeFraction > 1) timeFraction = 1

            var progress = options.timing(timeFraction)
            options.draw(progress);
        
            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
    
        });
    }

    function makeEaseInOut(timing) {
        return function(timeFraction) {
            if (timeFraction < .5) {
                return timing(2 * timeFraction) / 2;
            } else {
                return (2 - timing(2 * (1 - timeFraction))) / 2;
            }
        }
    }
    
    function quad(progress) {
        return Math.pow(progress, 2)
    }
}