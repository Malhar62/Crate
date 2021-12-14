import axios from 'axios'

const BASE_URL = 'http://boxing.anasource.com:90/api/category/'

const getApiCall = (endpoint, success, failed) => {
    axios.get('https://jsonplaceholder.typicode.com/todos')
        .then(res => console.log(res.status))
        .catch(err=>console.log(err))
}
export default getApiCall;