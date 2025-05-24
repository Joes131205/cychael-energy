import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, User } from "@firebase/auth";
import { auth, db } from "../utils/firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

interface IUserContext {
    user: User | null | undefined;
    userData: any | null;
    loading: boolean;
}

const UserContext = createContext<IUserContext>({
    user: undefined,
    userData: null,
    loading: true,
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>();
    const [userData, setUserData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(
            auth,
            async (currentUser) => {
                try {
                    console.log(currentUser);
                    setUser(currentUser);

                    if (!currentUser) {
                        setUserData(null);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUserData(null);
                } finally {
                    setLoading(false);
                }
            }
        );

        return () => {
            unsubscribeAuth();
        };
    }, []);

    useEffect(() => {
        let unsubscribeDB = () => {};

        if (user?.uid) {
            unsubscribeDB = onSnapshot(
                query(collection(db, "users"), where("uid", "==", user.uid)),
                (snapshot) => {
                    try {
                        if (!snapshot.empty) {
                            const userDoc = snapshot.docs[0];
                            setUserData({
                                id: userDoc.id,
                                ...userDoc.data(),
                            });
                        }
                    } catch (error) {
                        console.error("Error listening to user data:", error);
                    } finally {
                        setLoading(false);
                    }
                }
            );
        }

        return () => {
            unsubscribeDB();
        };
    }, [user?.uid]);

    return (
        <UserContext.Provider value={{ user, userData, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
