export function Footer() {
  return (
    <footer className="py-12 px-4 bg-chocolate text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="font-black text-xl uppercase text-easter-yellow mb-4">Ovos de Páscoa 2024</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Levando doçura e alegria para a sua Páscoa com ovos artesanais de qualidade e os personagens favoritos da garotada.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-black text-sm uppercase text-white/50 mb-4 tracking-widest">Informações</h4>
          <p className="text-sm font-bold">📍 Bairro Aventureiro, Joinville/SC</p>
          <p className="text-sm font-bold">📅 Pedidos até: 30/03</p>
          <p className="text-sm font-bold">📦 Retiradas até: 04/04</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-black text-sm uppercase text-white/50 mb-4 tracking-widest">Atendimento</h4>
          <p className="text-lg font-black text-easter-yellow">📱 (47) 92000-8427</p>
          <p className="text-xs text-white/50 font-bold uppercase mt-4">Desenvolvido por José Matheus Buchmann</p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-[10px] text-white/30 uppercase font-black tracking-widest">
        © 2024 • Todos os direitos reservados • Joinville, Brasil
      </div>
    </footer>
  );
}
