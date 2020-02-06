document.querySelector('#refreshData').addEventListener('click', () => {
    console.log('Request: Refresh Data...');
    
    fetch('/refresh-data', {method: 'POST'}).then((res) => {

        if(res.ok) {
            console.log('Request submitted');
            location.reload();
            return;
        }

        throw new Error('Request failed')

    }).catch((error) => {

        console.log(error);        

    });

});