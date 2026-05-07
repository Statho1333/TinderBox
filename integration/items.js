const url = "http://127.0.0.1:5000/";

////////////////////////////////////first interaction//////////////////////////////////
const searchBar = document.getElementById('searchBar');
const tableBody = document.getElementById('tableBody');

if (searchBar) searchBar.addEventListener('keydown', async function(event) {
    if (event.code === 'Enter'){
        let searchText = searchBar.value;
        const results = await getSearchResults(searchText);
        serveSearchResults(results);
    }
})

//Fuction to get search results from backend
async function getSearchResults(searchText){
    try {
        const response = await fetch(url+"search/"+searchText);
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
async function serveSearchResults(results){
    if (results === null){
        results = await getSearchResults(".");
        if (results === null) return;
    }
    else{
        tableBody.innerHTML = "";
        results.forEach((result, index) => {
            const row = document.createElement('tr');
            const attNum = document.createElement('td');
            const attName = document.createElement('td');
            const attPic = document.createElement('td');
            const attSum = document.createElement('td');
            const attLike = document.createElement('td');
            const attBtn = document.createElement('td');

            attNum.textContent = index + 1;
            attName.textContent = result.title;
            attPic.innerHTML = `<img src="/resources/${result.image}"
                                     alt="${result.title}"
                                     data-id="${result._id}"
                                     class="tinder-img"
                                     width="100"
                                     height="100">`;
            attSum.textContent = result.description;
            attLike.textContent = result.likes;
            attBtn.innerHTML = `<button class="hot-btn" data-id="${result._id}">🔥 Hot</button>`;

            row.appendChild(attNum);
            row.appendChild(attName);
            row.appendChild(attPic);
            row.appendChild(attSum);
            row.appendChild(attLike);
            row.appendChild(attBtn);

            tableBody.appendChild(row);
        });
    }
}

////////////////////////////second interaction//////////////////////////////
if (tableBody) tableBody.addEventListener('click', async function(event){
    const imgClicked = event.target.closest('.tinder-img');
    const btnClicked = event.target.closest('.hot-btn');
    if (!imgClicked && !btnClicked) return;

    const tinderImgId = (imgClicked || btnClicked).getAttribute('data-id');
    const likes = await incrementLikes(tinderImgId);
    
    if (likes!== null){
        const row = (imgClicked || btnClicked).closest('tr');
        row.children[4].textContent = likes;

        await loadPopular(); // Refresh the popular carousel if needed
    }
});

async function incrementLikes(tinderImgId){
    try {
        const response = await fetch(url + "like/" + tinderImgId, {
            method: 'POST'
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
//https://www.w3schools.com/howto/howto_js_slideshow.asp
async function loadPopular(){
    const popularCarousel = document.getElementById('popularCarousel');
    if (!popularCarousel) return;

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
                <img src="/resources/${pop.image}" alt="${pop.title}" width="300" height="300">
                <div class="numbertext">${pos+1} / ${popular.length}</div>
                <div class="caption">${pop.title} - Likes: ${pop.likes}</div>
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


async function loadHomepageSlides() {
    const carousel = document.getElementById('popularCarousel');
    if (!carousel) return;

    const items = await getPopular();
    if (!items) return;

    carousel.innerHTML = "";
    items.forEach(item => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.innerHTML = `
            <img src="/resources/${item.image}" alt="${item.title}">
            <div class="slide-caption"><h3>${item.title}</h3><p>${item.description}</p></div>
        `;
        carousel.appendChild(slide);
    });
}

document.addEventListener('DOMContentLoaded', loadHomepageSlides);




