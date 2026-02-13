import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "home", href: "/", isHome: true },
  { label: "about", href: "/about" },
  { label: "hire me", href: "/hire-me" },
  { label: "projects", href: "/projects" },
  { label: "blogs", href: "/blogs" },
  { label: "gallery", href: "/gallery" },
];

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-[60px]">
      <ul className="m-0 flex list-none items-center justify-between py-0" style={{ backgroundColor: '#ffffff', width: '689px', marginLeft: 'auto', marginRight: 'auto' }}>
        {links.map((item) => (
          <li key={item.label} className="m-0 p-0 py-[10px]">
            {item.isHome ? (
              <Link href={item.href} aria-label="Home" className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center p-0">
                <Image src="/home-icon-svg.svg" alt="Home" width={30} height={30} priority />
              </Link>
            ) : (
              <Link
                href={item.href}
                className="flex items-center text-[20px] font-semibold leading-none tracking-[-0.01em] [-webkit-text-stroke:0.6px_#000000] text-black"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;