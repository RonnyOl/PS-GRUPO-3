export default function Footer() {
    return (
        <footer className="bg-[#171a21] border-t border-white/5 mt-auto">

            <div className="max-w-7xl mx-auto px-4 py-8">

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    <div>
                        <h3 className="text-white font-black text-lg">
                            Steam
                        </h3>

                        <p className="text-slate-400 text-xs">
                            Plataforma de distribución digital de videojuegos.
                        </p>
                    </div>

                    <div className="flex gap-6 text-sm text-slate-400">

                        <a
                            href="/shopping"
                            className="hover:text-cyan-400 transition-colors"
                        >
                            Tienda
                        </a>

                        <a
                            href="/profile"
                            className="hover:text-cyan-400 transition-colors"
                        >
                            Biblioteca
                        </a>

                        <a
                            href="/profile"
                            className="hover:text-cyan-400 transition-colors"
                        >
                            Perfil
                        </a>

                    </div>

                </div>

                <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-500">

                    © {new Date().getFullYear()} Steam. Proyecto Demo desarrollado con Next.js + Spring Boot.

                </div>

            </div>

        </footer>
    );
}