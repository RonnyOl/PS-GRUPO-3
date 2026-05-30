"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import Hero from "@/components/hero";
import Footer from "@/components/footer";

import { Flame, Gamepad2 } from "lucide-react";

export default function Home() {

  const [games, setGames] = useState([]);

  useEffect(() => {

    axios
      .get(
        "http://localhost:8080/v1/games/all",
        {
          withCredentials: true
        }
      )
      .then((response) => {
        setGames(response.data);
      })
      .catch(console.error);

  }, []);

  return (
    <main className="min-h-screen bg-[#1b2838] text-[#c7d5e0]">

      <Hero games={games} />

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-5 h-5 text-cyan-400" />
          <h2 className="text-2xl font-black text-white uppercase">
            Juegos Populares
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {games.slice(0, 4).map((game) => (

            <div
              key={game.id}
              className="bg-[#171a21] rounded-xl overflow-hidden border border-white/5 hover:border-cyan-500/40 transition-all"
            >

              <img
                src={game.imageUrl}
                alt={game.name}
                className="w-full aspect-video object-cover"
              />

              <div className="p-4">

                <h3 className="font-bold text-white">
                  {game.name}
                </h3>

                <p className="text-cyan-400 font-black mt-2">
                  {parseFloat(game.price || 0) === 0
                    ? "Gratis"
                    : `u$s ${game.price}`}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#171a21] to-[#1b2838] border border-white/5">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(102,192,244,0.15),transparent_40%)]" />

          <div className="relative p-8 md:p-12">

            <span className="text-cyan-400 text-xs font-bold uppercase tracking-[0.3em]">
              Bienvenido a Vapor
            </span>

            <h2 className="mt-3 text-3xl md:text-5xl font-black text-white uppercase leading-tight">
              Tu biblioteca digital
              <br />
              de videojuegos
            </h2>

            <p className="mt-4 max-w-2xl text-slate-400 text-sm md:text-base leading-relaxed">
              Compra videojuegos, administra tu biblioteca personal,
              guarda títulos en tu wishlist y descubre nuevas experiencias
              desde una única plataforma inspirada en Steam.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <div className="bg-[#0f141b] border border-white/5 rounded-xl px-5 py-4">
                <p className="text-2xl font-black text-cyan-400">
                  {games.length}
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Juegos disponibles
                </p>
              </div>

              <div className="bg-[#0f141b] border border-white/5 rounded-xl px-5 py-4">
                <p className="text-2xl font-black text-cyan-400">
                  Wishlist
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Guarda tus favoritos
                </p>
              </div>

              <div className="bg-[#0f141b] border border-white/5 rounded-xl px-5 py-4">
                <p className="text-2xl font-black text-cyan-400">
                  Biblioteca
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Acceso permanente
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}