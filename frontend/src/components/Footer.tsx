import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md text-left">
          <h3 className="font-display font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Boumerdès, Algérie
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> +213 555 123 456
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> contact@greenwheels.dz
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
