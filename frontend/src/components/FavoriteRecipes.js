import React, {useEffect, useState} from 'react';
import {useUser} from './providers/UserProvider.js';
import ResultsPage from './ResultsPage.js';

const FavoriteRecipes = () => {
  const [favorites, setFavorites] = useState({});
  const user = useUser();
  useEffect(() => {
    fetch('http://localhost:3010/favoriterecipe', {
         method: 'GET',
         headers: new Headers({
           'Authorization': 'Bearer ' + user.accessToken,
           'Content-Type': 'application/json',
         }),
       })
         .then((res) => {
           if (!res.ok) {
             alert('Server error');
             throw res;
           }
           return res.json();
         })
         .then((json) => {
           setFavorites(json);
         })
         .catch((err) => {
           console.log(err);
         });
    return (() => {
      setFavorites(null);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
    {favorites.length > 0 ? <ResultsPage recipeResults={favorites} setSearched={true} favorites={true}/> : null}
    </div>
  );
};

export default FavoriteRecipes;
