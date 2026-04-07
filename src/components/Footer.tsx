"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Image
            src="/logo.png"
            alt="Atelier Rusalka"
            width={140}
            height={32}
            className="footer-logo"
          />
          <p className="footer-tagline">
            Personalised skincare, formulated from your unique skin profile.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#">Cleanser</a></li>
              <li><a href="#">Serum</a></li>
              <li><a href="#">Moisturiser</a></li>
              <li><a href="#">Subscriptions</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <ul>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Ingredients</a></li>
              <li><a href="#">The Science</a></li>
              <li><a href="#">Reviews</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Atelier Rusalka. All rights
          reserved.
        </p>
        <p className="footer-copy">
          Privacy Policy &nbsp;&middot;&nbsp; Terms of Service
        </p>
      </div>
    </footer>
  );
}
