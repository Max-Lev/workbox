console.log('btn');

var subscriptionobj = {
    endpoint: 'http://localhost:4200',
    id: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
    title: 'max',
    body: 'max body'
}

var subscribebtn = document.querySelector('#subscribebtn');
subscribebtn.addEventListener('click', (event) => {
    sendSubscriptionToBackEnd(subscriptionobj);
});


function sendSubscriptionToBackEnd(subscription) {
    return fetch('http://localhost:4201/api/save-subscription/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(subscription)
    }).then(function (response) {
        if (!response.ok) {
            throw new Error('Bad status code from server.');
        }
        console.log(response.json());
        return response.json();
    }).then(function (responseData) {
        if (!(responseData.data && responseData.data.success)) {
            throw new Error('Bad response from server.');
        }
    });
};