import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function CatalogSection() {
  return (
    <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-4 text-shadow-sm">
            Catálogo de <span className="text-easter-yellow">Ovos</span>
          </h2>
          <p className="text-white/90 text-lg font-medium max-w-2xl mx-auto">
            Veja abaixo os modelos, personagens e valores. Depois, preencha seu pedido no formulário abaixo e envie para o nosso WhatsApp.
          </p>
        </div>

        <div className="canva-container relative w-full overflow-hidden rounded-2xl border-8 border-chocolate shadow-2xl bg-white/10">
          <div style={{ position: "relative", width: "100%", height: 0, paddingTop: "83.8298%", paddingBottom: 0, overflow: "hidden", willChange: "transform" }}>
            <iframe 
              loading="lazy" 
              style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, border: "none", padding: 0, margin: 0 }}
              src="https://www.canva.com/design/DAHDej2geJ4/O9VCJezvbI8e7PCE2578Uw/view?embed" 
              allowFullScreen={true}
              allow="fullscreen"
            >
            </iframe>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="https://www.canva.com/design/DAHDej2geJ4/O9VCJezvbI8e7PCE2578Uw/view?utm_content=DAHDej2geJ4&utm_campaign=designshare&utm_medium=embeds&utm_source=link" 
            target="_blank" 
            rel="noopener"
            className="inline-flex items-center text-white/80 hover:text-white underline font-medium text-sm transition-colors"
          >
            Abrir catálogo em tela cheia <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
