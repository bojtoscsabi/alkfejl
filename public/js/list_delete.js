$(function () {
    
    // $('.torles-gomb').on('click', function (e) {
    $(document).on('click', '.torles-gomb', function (e) {
        e.preventDefault();
        
        var $tr = $(this).closest('tr');
        
        $.getJSON(this.href)
            .done(function (data) {
                // console.log(data);
                if (data.success) {
                    $tr.hide('slow');            
                }
            })
    });
    
})