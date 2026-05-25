"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Search from '@/components/search';

export default function Page() {
    const [games, setGames] = useState([])
    useEffect(() => {
        axios
            .get("http://localhost:8080/v1/games/all", { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                setGames(response.data);
            })
            .catch((error) => {
                console.error(error.message);
            });
    }, []);
    return (
        <>
            <Search games={games}>    </Search>
        </>
    )
}
