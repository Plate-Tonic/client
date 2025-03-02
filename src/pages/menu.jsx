import React from 'react';
import '../styles/menu.css';

const Menu = () => {
  return (
    <div className="menu-page">
      {/* Banner Section */}
      <div className="menu-banner">
        <h1>Meals</h1>
      </div>

      {/* Menu Content */}
      <div className="menu-content">
        {/* Filter Section */}
        <div className="menu-filter">
          <h3>Filter & Sort</h3>
          <div className="filter-option">
            <label>Sort By:</label>
            <select>
              <option value="featured">Featured</option>
              <option value="top-sellers">Top Sellers</option>
              <option value="new">New</option>
              <option value="price-low-to-high">Price (Low to High)</option>
              <option value="price-high-to-low">Price (High to Low)</option>
              <option value="calories-low-to-high">Calories (Low to High)</option>
            </select>
          </div>
          <div className="filter-option">
            <label>Category:</label>
            <select>
              <option value="all">All</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
        </div>

        {/* Calorie Tracker Summary */}
        <div className="calorie-tracker-summary">
          <h2>Calorie Tracker Summary</h2>
          <p>Total Calories: 1200 kcal</p>
        </div>

        {/* Menu Items Section */}
        <div className="menu-items">
          <div className="menu-item-grid">
            {/* Repeat for 12 more items */}
            {Array(16).fill().map((_, index) => (
              <div key={index} className="menu-item">
                <div className="item-image">
                  <img src="https://via.placeholder.com/300" alt="Dish" />
                  <div className="new-badge">New</div>
                </div>
                <h3>Dish Name</h3>
                <p className="item-price">$10.95</p>
                <p className="item-calories">472 CAL</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Footer</p>
      </footer>
    </div>
  );
};

export default Menu;
