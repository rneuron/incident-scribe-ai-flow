
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-800">404</h1>
        <p className="text-xl text-slate-600 mb-4">¡Ups! Página no encontrada</p>
        <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
          <Link to="/">Volver al Inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
