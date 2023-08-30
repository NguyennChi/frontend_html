const btnSubmit = document.getElementById('btn-submit')
btnSubmit.addEventListener('click', ()=> {
let name = document.getElementById("name").value
let email = document.getElementById("email").value
let phone = document.getElementById("phone").value
let password = document.getElementById("password").value
let address = document.getElementById("address").value
console.log(name, phone, email, password,address);
    const data = {
        name,
        email,
        phone,
        password,
        address,
    
    };
    
    fetch(`${BASE_URL}users/register`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((res) => {
            console.log(res);
      })
    
 
})
