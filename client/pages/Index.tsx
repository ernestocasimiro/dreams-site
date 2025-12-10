import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import supabase from "@/config/supabaseClient";

type Dream = {
  id: string;
  title?: string | null;
  description?: string | null;
  author?: string | null;
  country?: string | null;
  language?: string | null;
  likes?: number | null;
  views?: number | null;
  created_at?: string | null;
};

export default function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recentDreams, setRecentDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    async function fetchRecentDreams() {
      setLoading(true);
      const { data } = await supabase
        .from("dreams")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      setRecentDreams(data || []);
      setLoading(false);
    }
    fetchRecentDreams();
    const interval = setInterval(fetchRecentDreams, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle { x:number; y:number; vx:number; vy:number; radius:number; opacity:number }
    const particles:Particle[] = Array.from({ length:50 }).map(() => ({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      vx:(Math.random()-.5)*1,
      vy:(Math.random()-.5)*1,
      radius:Math.random()*2+.5,
      opacity:Math.random()*.5+.1
    }));

    const animate = () => {
      ctx.fillStyle="rgba(15,15,31,.1)";
      ctx.fillRect(0,0,canvas.width,canvas.height);

      particles.forEach(particle=>{
        particle.x+=particle.vx; particle.y+=particle.vy;
        if(particle.x<0||particle.x>canvas.width) particle.vx*=-1;
        if(particle.y<0||particle.y>canvas.height) particle.vy*=-1;
        ctx.fillStyle=`rgba(127,90,240,${particle.opacity})`;
        ctx.beginPath(); ctx.arc(particle.x,particle.y,particle.radius,0,Math.PI*2); ctx.fill();

        particles.forEach(other=>{
          const dx=other.x-particle.x, dy=other.y-particle.y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<150){
            ctx.strokeStyle=`rgba(127,90,240,${(particle.opacity*(1-dist/150))/2})`;
            ctx.lineWidth=.5; ctx.beginPath(); ctx.moveTo(particle.x,particle.y); ctx.lineTo(other.x,other.y); ctx.stroke();
          }
        });
      });
      requestAnimationFrame(animate);
    };
    animate();
    return ()=>window.removeEventListener("resize",resize);
  }, []);

  const FEATURES = [
    {title:"Digital Permanence",description:"Your wish becomes part of a collective monument of human aspirations"},
    {title:"Community Inspiration",description:"Inspire millions by sharing your dreams and aspirations"},
    {title:"Eternal Legacy",description:"Your dreams will be preserved for generations to come"}
  ];

  return (
    <div className="min-h-screen bg-gradient-dark overflow-x-hidden">
      <Header/>
      <canvas ref={canvasRef} className="fixed inset-0 opacity-20 sm:opacity-30 pointer-events-none"/>
      
      <main className="relative z-10 text-white">

        {/* HERO RESPONSIVE */}
        <section className="min-h-[80vh] md:min-h-screen flex flex-col justify-center items-center px-5 text-center gap-6 pt-28">
          <h1 className="font-orbitron font-bold leading-tight text-3xl sm:text-4xl md:text-6xl max-w-3xl">
            Turn your dreams into <span className="bg-gradient-to-r from-neon-primary to-neon-secondary text-transparent bg-clip-text">digital monuments</span>
          </h1>

          <p className="text-neon-secondary text-sm sm:text-lg max-w-xl font-light">
            Share your wish and inspire the future
          </p>

          <Link to="/submit" className="neon-button text-sm sm:text-lg px-6 py-3">
            Submit My Wish – 1 USD
          </Link>
        </section>

        {/* FEATURES RESPONSIVE */}
        <section className="py-16 px-5">
          <h2 className="font-orbitron text-2xl sm:text-4xl font-bold text-center mb-12">Why Share Your Dream?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {FEATURES.map((f,i)=>(
              <div key={i} className="card-dark p-6 rounded-xl text-center hover:shadow-glow-neon transition backdrop-blur-lg">
                <h3 className="text-neon-primary text-xl mb-2">{f.title}</h3>
                <p className="text-neon-secondary/80 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DREAMS RESPONSIVE */}
        <section className="py-16 px-5 max-w-6xl mx-auto">
          <h2 className="font-orbitron text-2xl sm:text-4xl font-bold mb-4">Recent Dreams</h2>
          <p className="text-neon-secondary/70 mb-8 text-sm sm:text-base">Latest wishes from around the world</p>

          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : recentDreams.length?(
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentDreams.map(d=>(
                  <Link key={d.id} to={`/dream/${d.id}`} className="card-dark p-5 rounded-xl hover:shadow-glow-neon transition block">
                    <p className="text-neon-secondary text-sm line-clamp-5 mb-3">"{d.description}"</p>
                    <div className="flex justify-between text-xs text-neon-secondary/70 pt-3 border-t border-neon-primary/20">
                      <span>{d.author||"Anonymous"}</span>
                      <span>{formatDate(d.created_at)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-neon-secondary/60 mt-2">
                      <span>Likes: {d.likes||0}</span>
                      <span>Views: {d.views||0}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link to="/gallery" className="neon-button px-6 py-3 text-sm sm:text-lg">
                  View All Dreams
                </Link>
              </div>
            </>
          ):<p>No dreams yet. Be the first!</p>}
        </section>
      </main>

      <Footer/>
    </div>
  );
}
