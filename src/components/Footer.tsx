// src/components/Footer.tsx
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 py-6 text-center text-sm">
      <p>© {currentYear} Agnel CyberCell. All rights reserved.</p>
      <p className="mt-1">Fr. C. Rodrigues Institute of Technology</p>
    </footer>
  );
};

export default Footer;
