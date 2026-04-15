const url = "http://127.0.0.1:5000/";

////////////////////////////////////first interaction//////////////////////////////////
const searchBar = document.getElementById('searchBar');
const tableBody = document.getElementById('tableBody');

searchBar.addEventListener('keydown', function(event) {
    if (event.code === 'Enter'){
        let searchText = searchBar.value;
        results = getSearchResults(searchText);
        serveSearchResults(results);
    }
})

//Fuction to get search results from backend
async function getSearchResults(searchText){
    try {
        const response = await fetch(url+"search?query="+searchText);
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const results = await response.json();
        return results;
    } catch (error){
        console.error(error.message);
        return null;
    }
}

//Function to serve search results to the frontend
function serveSearchResults(results){
    if (results === null){
        alert("No campfire found with that characteristics or name");
        return;
    }
    else{
        tableBody.innerHTML = "";
        results.forEach(result => {
            const row = document.createElement('tr');
            const attName = document.createElement('td');
            const attPic = document.createElement('td');
            const attSum = document.createElement('td');
            const attLike = document.createElement('td');

            attName.textContent = result.name;
            attPic.innerHTML = `<img src="${result.picture}"
                                     alt="${result.name}" 
                                     data-id="${result._id}"
                                     class="tinder-img"
                                     width="100" 
                                     height="100">`;
            attSum.textContent = result.summary;
            attLike.textContent = result.likes;

            row.appendChild(attName);
            row.appendChild(attPic);
            row.appendChild(attSum);
            row.appendChild(attLike);

            tableBody.appendChild(row);
        });
    }
}

////////////////////////////second interaction//////////////////////////////
tableBody.addEventListener('click', async function(event){
    const imgClicked = event.target.closest('.tinder-img');
    if (!imgClicked) return;

    const tinderImgId = imgClicked.getAttribute('data-id');
    const likes = await incrementLikes(tinderImgId);
    
    if (likes!== null){
        const row = imgClicked.closest('tr');
        row.children[3].textContent = likes;

        await loadPopular(); // Refresh the popular carousel if needed
    }
});

async function incrementLikes(tinderImgId){
    try {
        const response = await fetch(url + "like/" ,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: tinderImgId})
        });

        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result.likes;

    } catch (error) {
        console.error(error.message);
        return null;
    }
};

///////////////////////////third interaction//////////////////////////////
const popularCarousel = document.getElementById('popularCarousel');

//https://www.w3schools.com/howto/howto_js_slideshow.asp
async function loadPopular(){
    const popular = await getPopular();
    if (popular === null){
        console.log("Popular returned nothing");
        return;
    } else {
        
        popularCarousel.innerHTML = "";

        popular.forEach((pop, pos) => {
            const item = document.createElement('div');
            item.classList.add('carousel-item');

            item.innerHTML = `
                <img src="${pop.picture}" alt="${pop.name}" width="300" height="300">
                <div class="numbertext">${pos+1} / ${popular.length}</div>
                <div class="caption">${pop.name} - Likes: ${pop.likes}</div>
            `;
            popularCarousel.appendChild(item);
        })
    }
}


async function getPopular(){
    try {
        const response = await fetch(url+"popular");
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const popular = await response.json();
        return popular;

    } catch (error){
        console.error(error.message);
        return null;
    }
}


document.addEventListener('DOMContentLoaded', loadPopular);




