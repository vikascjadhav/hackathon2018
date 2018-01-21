
    function generateItems(count) {
        var items = [];
        for (var i = 0; i < count; i++) {
            items[i] = {
                url: 'url' + i,
                text: 'text' + i
            }
        }
        return items;
    }    
