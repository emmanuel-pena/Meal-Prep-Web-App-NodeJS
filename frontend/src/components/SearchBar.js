import React, {useState} from 'react';
import './SearchBar.css';

function SearchBar({stateChanger, children}) {
    const [query, setQuery] = useState('');
    const [isSending, setIsSending] = useState(false);


    const handleSearch = (event) => {
      const searchWord = event.target.value;
      setQuery(searchWord);
      // console.log(query);
    };


    const fetchRequest = () => {
      setIsSending(true);
       // console.log(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=5ae3ccf967fb408688f979b5cf40ecec`);
      fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=2b14cdb3c6df4349be2a2bf80f70ae77`)
        .then((response) =>{
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) =>{
           stateChanger(data.results);
           setIsSending(false);
        })
        .catch((error) => {
          console.log(error);
          setIsSending(false);
        });
    };

    /* const callAPI = (event) => {
      setToAPI(query);
      // Fetch and handle API Promise from Spoonacular, state change recipe card data with query results


      console.log(toAPI);
    };*/

    return (
        <div className="search">
            <div >
              <input
              style={{height: 40}}
               text="search"
               value = {query}
               onChange={handleSearch}
               id = "usrqr"
              />
              </div>
              <div className='buttons'>
              <button className="searchButton button1 searchInputs" disabled={isSending} onClick={fetchRequest}> GET MEALS </button>
              {children}
            </div>
        </div>
 );
}
// onClick={() => console.log('data') }

export default SearchBar;
