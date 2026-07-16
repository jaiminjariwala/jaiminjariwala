import Link from "next/link";

const links = [
    { label: "home", href: "/#home" },
    { label: "github", href: "/#github" },
    { label: "projects", href: "/#projects" },
    { label: "gallery", href: "/#gallery" },
    { label: "blogs", href: "/#blogs" },
    { label: "contact", href: "/#contact" },
];

const Navbar = () => (
    <div className="site-navbar-shell">
        <nav className="site-navbar" aria-label="Primary navigation">
            <ul className="site-navbar-list">
                {links.map((item) => (
                    <li key={item.href}>
                        <Link className="site-navbar-link" href={item.href}>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    </div>
);

export default Navbar;
