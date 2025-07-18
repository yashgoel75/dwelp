const Footer = () => {
  return (
    <footer className="bg-red-400 py-4 text-white font-bold bottom-0">
      <div className="container mx-auto text-center">
        <p className="text-md">
          &copy; {new Date().getFullYear()} Dwelp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
