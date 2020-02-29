const data = JSON.parse(localStorage.getItem('cloud_data'));
const person = data ? data.person : '';

const personData = {
    name: person.name ? person.name : '',
    email: person.email
}

export default personData;