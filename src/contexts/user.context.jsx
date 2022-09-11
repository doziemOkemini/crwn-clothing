import { createContext, useState, useEffect } from "react";

import { onAuthStateChangedListener, createUserDocumentFromAuth } from "../utils/firebase/firebase.utils";

//creating the context as the actual value you want to access
export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
});

//a provider is the actual conponent
export const UserProvider = ({children}) => {
    //initialize methods and setters for state object
    const [currentUser, setCurrentUser] = useState(null);
    const value = { currentUser, setCurrentUser };

    useEffect( () => {
        //making sure the observer listener stops once its done unless we cuase a run on function causing a memory leak
        const unsubscribe = onAuthStateChangedListener((user) => {
            //this is the centralized code for authentication
            if(user){
              createUserDocumentFromAuth(user);
            }
            setCurrentUser(user);
        })

        return unsubscribe;
    }, []);

    //.provider is the component that will wrap around any other component that needs access to the values inside
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}