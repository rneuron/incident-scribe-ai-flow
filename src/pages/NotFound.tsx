
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Error 404: El usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-slate-100 max-w-md mx-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-500 text-4xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-slate-800">Página No Encontrada</h1>
        <p className="text-lg text-slate-600 mb-8">¡Ups! La página que está buscando no existe o ha sido movida.</p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
