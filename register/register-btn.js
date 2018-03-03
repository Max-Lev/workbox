var triggerPushMsgbtn = document.querySelector('#triggerPushMsg');
triggerPushMsgbtn.addEventListener('click', function () {
    fetch('http://localhost:4201/api/trigger-push-msg/', { method: 'POST' })
        .then(function (response) {
            console.log('triggerPushMsg: ', response);
            return response.json();
        }).then(function (response) {
            console.log(response);
            return response;
        });
});
