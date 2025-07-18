const Footer = () => {
  return (
    <footer className="bg-red-300 py-4">
      <div className="container mx-auto text-center">
        <p className="text-md">
          &copy; {new Date().getFullYear()} Dwelp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
