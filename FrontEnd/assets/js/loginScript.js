
function formSubmit (){

    const form = document.getElementById('loginForm');
form.addEventListener('submit', submitForm)

async function submitForm(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const body = {
        "email": email,
        "password": password
    };
    const login = await fetch('http://localhost:5678/api/users/login',{
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body: JSON.stringify(body)
    }).then(response =>{
    if(!response.ok){
        alert('Erreur dans l’identifiant ou le mot de passe');
    }
    else{
        return response.json();
    }
})

    if(login){
    console.log(login);
    }
}
}
formSubmit();