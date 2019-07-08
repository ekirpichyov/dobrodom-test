window.addEventListener("load", e => {
    ymaps.ready(init);
    function init() {
        // Создание экземпляра карты и его привязка к созданному контейнеру.
        const myMap = new ymaps.Map("footer_yandex-map", {
            center: [52.789066, 41.351899],
            zoom: 11,
            behaviors: ['default', 'scrollZoom'],
            controls: ['searchControl']
        });
        // Создание пользовательского балуна
        const MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="footer_map">' +
                '<div class="footer_map-title">' +
                    'ДоброДом | Строительство домов на УШП УФФ Тамбов' +
                '</div>' +
                '<div class="footer_map-contacts">' +
                    'Город Тамбов <br>' +
                    'Телефон: 64-00-45 <br>' +
                    'E-mail: <a href="mailto:dobrodom68@gmail.com">dobrodom68@gmail.com</a>' + 
                '</div>' +
            '</div>', {
            build: function () {
                this.constructor.superclass.build.call(this);
                this.element = this.getParentElement(document.querySelector('.footer_map'));
                this.applyElementOffset();
            },
            onSublayoutSizeChange: function () {
                MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);
                this.applyElementOffset();
                this.events.fire('shapechange');
            },
            applyElementOffset: function () {
                this.element.querySelector(".footer_map").style.top = -this.element.querySelector(".footer_map").offsetHeight - 20 + "px";
            },
            getShape: function () {
                var position = {left: this.element.offsetLeft, top: this.element.offsetTop};
                return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                    [position.left, position.top], [
                        position.left,
                        position.top - 500
                    ]
                ]));
            },
        });
        // Создание метки с пользовательским макетом балуна.
        const myPlacemark = window.myPlacemark = new ymaps.Placemark([52.779979, 41.378292], {
        }, {
            balloonShadow: false,
            balloonLayout: MyBalloonLayout,
            hideIconOnBalloonOpen: true
        });

        // Добавление placeholder в поисковую строку
        const searchControl = myMap.controls.get('searchControl');

        searchControl.options.set('placeholderContent', 'Тамбов, Мичуринская улица, 277');

        // Получение местоположения, автоматическое отображение его на карте и добавление маршрута.
        let location = ymaps.geolocation;

        location.get({
                mapStateAutoApply: false,
                provider: "browser"
            })
        .then(
            function(result) {
                var userAddress = result.geoObjects.get(0).properties.get('text');

                result.geoObjects.get(0).properties.set({
                    balloonContentBody: "",
                });
                myMap.geoObjects.add(result.geoObjects)

                myMap.controls.remove('searchControl');
                myMap.controls.add('routePanelControl')
                let control =  myMap.controls.get('routePanelControl')
                control.routePanel.state.set({
                    from: userAddress,
                    to: 'Тамбов, Мичуринская улица, 277'
                });

                //Задание пользовательского цвета маршрута
                const multiRoutePromise = control.routePanel.getRouteAsync();

                multiRoutePromise.then(function(multiRoute) {
                    multiRoute.options.set({
                        routeActiveStrokeColor: "2b2a29",
                        routeActiveStrokeWidth: 8,
                    }); 
                }, function (err) {
                    console.log(err); 
                });  

            },
            function(err) {
                console.log('Ошибка: ' + err)
            }
        );
        
        myMap.geoObjects.add(myPlacemark);

        myPlacemark.balloon.open();
    };
})