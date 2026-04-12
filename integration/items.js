function enterPressed(event) {
    if (event.key === 'Enter') {
        const searchText = document.getElementById('searchText').value;
        fetchProducts(searchText);
    }
}
//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function fetchProducts(){
    const url = "http://127.0.0.1:5000/search?name=" + searchText; // Replace with your actual API endpoint

    try {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('Response status: ${response.status}');
        }
    
        const result = await response.json();
        displayProducts(result);// Call a function to display the products on the page TODO: implement displayProducts function
    }   catch (error) {
        console.error(error.message);
    }
}












document.getElementById('searchInput').addEventListener('keypress', enterPressed);
