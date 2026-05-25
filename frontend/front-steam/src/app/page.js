"use client"
import Navbar from "@/components/navbar";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import Hero from "@/components/hero";
import Search from "@/components/search";
export default function Home() {
  const [games, setGames] = useState([])
  useEffect(() => {
    axios
      .get("http://localhost:8080/v1/games/all", { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setGames(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <>

      <Hero games={games}></Hero>
    </>

  );
}
