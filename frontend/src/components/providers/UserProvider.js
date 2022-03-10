import React, {useContext, useState} from 'react';

export const UserContext = React.createContext();

export const UserUpdateContext = React.createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const useUserUpdate = () =>{
  return useContext(UserUpdateContext);
};

const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const update = (newUser) =>{
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value= {update}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
};

export default UserProvider;
