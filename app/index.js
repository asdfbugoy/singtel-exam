ready(function() {
    var endPointUrl = "http://pb-api.herokuapp.com/bars";
    var viewModel = new kendo.observable({
        name: 'Francis Samande Declaro',
        title: 'Progress Bar Demo',
        data: {},
        previousTotal: 0,
        pageLoad: function() {
            var request = new XMLHttpRequest();
            request.open('GET', endPointUrl, true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    // Success!
                    var data = JSON.parse(request.responseText);
                    viewModel.set('data', data);
                    var bars = [];
                    for(var x = 0; x< data.bars.length; x++) {
                        bars[x] = '#progress ' + ( x + 1 );
                    }
                    viewModel.set('bars', bars);
                    viewModel.set('selectedBar', bars[0]);
                    viewModel.set('selectedBarIndex',0);
                    viewModel.set('previousTotal', data.bars[0]);
                    document.querySelectorAll('.progress-bar.active')[0].setAttribute('style','width:' + data.bars[0] + '%');
                } else {
                    // We reached our target server, but it returned an error

                }
            };

            request.onerror = function() {
                // There was a connection error of some sort
            };

            request.send();
        },
        onChangeBar: function(e) {
            var bars = this.get('bars');
            var selectedBar = this.get('selectedBar');
            this.set('selectedBarIndex',bars.indexOf(selectedBar));
        },
        onClick: function(e) {
            e.preventDefault();
            var bars = this.get('data.bars');
            var selectedBarIndex = parseInt(this.get('selectedBarIndex'));
            var tmpValue = parseInt(e.currentTarget.dataset.value);
            var tmpTotal = bars[selectedBarIndex] + tmpValue;

            if(tmpTotal < 0) bars[selectedBarIndex] = 0;
            else bars[selectedBarIndex] = tmpTotal;

            var el = document.querySelectorAll('.progress-bar.active')[0];
            var className = 'progress-bar-danger';

            el.setAttribute('style','width:' + bars[selectedBarIndex] + '%');
            document.querySelectorAll('.progress-percent.active')[0].innerHTML = bars[selectedBarIndex] + '%';
            if(bars[selectedBarIndex] > this.get('data.limit')) {
                if (el.classList)
                    el.classList.add(className);
                else
                    el.className += ' ' + className;
            }
            else {
                if (el.classList)
                    el.classList.remove(className);
                else
                    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        }
    });
    kendo.bind(document.querySelectorAll('#exam'), viewModel);
    viewModel.pageLoad();
});