/* eslint-disable react/button-has-type */
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/tabla">Tabla Gastos</Link>
        </li>
        <li>
          <Link to="/item-table">Tabla Items</Link>
        </li>
        <li>
          <Link to="/options">Opciones</Link>
        </li>
      </ul>
      <div className="nav_toggle">
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
};

export default Navbar;
