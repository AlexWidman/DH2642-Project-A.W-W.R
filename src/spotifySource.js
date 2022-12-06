import {BASE_URL, API_KEY} from "../src/apiConfig.js";

const options = {
	method: 'GET',
	headers: {
		'X-Mashape-Key': API_KEY,
		'X-rapidapi-Host': 'spotify23.p.rapidapi.com'
	}
};

function treatHTTPResponseACB(response){ 
    if (!response.ok) throw new Error("API problem "+response.status); {
        return response.json()};
}

function transformSearchResultACB(data){
  return data.results;
}

function getSongDetails(id){
  return fetch(BASE_URL+'tracks/?ids='+id, options)
    .then(treatHTTPResponseACB);
}

function searchSpotify(params){
  return fetch(BASE_URL+'search/' + new URLSearchParams(params) /*+ '&type=multi&offset=0&limit=10&numberOfTopResults=5'*/, options)
    .then(treatHTTPResponseACB).then(transformSearchResultACB);
}

export {getSongDetails, searchSpotify};