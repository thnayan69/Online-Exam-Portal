$(document).ready(()=>{

$('#searchbtn').click(()=>{  
    var id = $('#tsearch').val();

    $.ajax({
            url: '/student/teacherProfiles/' + id ,
            // data: "",
            // type: "GET",
            // contentType: "application/json; charset=utf-8",
            // dataType: "json",
            success: function(response) {

                // alert(response.T_ID +" "+ response.T_NAME+" "+response.T_EMAIL+" "
                // +response.T_MOBILE +" "+response.T_ADDRESS);

                var views = $('#getall');

                views.html(
                                '<h2>' +response.T_ID+'</h2>\
                                <h2>' +response.T_NAME+'</h2>\
                                <h2>' +response.T_EMAIL+'</h2>\
                                <h2>' +response.T_MOBILE+'</h2>\
                                <h2>' +response.T_ADDRESS+'</h2>'
                );   
        }
    });
});
});



